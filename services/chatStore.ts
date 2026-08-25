// Live chat mahasiswa <-> admin lewat Firestore (real-time, lintas
// perangkat). Satu thread bersama per mahasiswa (chats/{studentUid}) yang
// bisa dijawab admin mana pun — konsisten dengan pola "Admin Perpustakaan"
// generik yang sudah dipakai di komentar/balasan (lihat feedbackStore.ts).
//
// "AI" di sini adalah balasan otomatis berbasis kata kunci (lihat
// chatBot.ts), ditulis dari sesi mahasiswa sendiri (senderUid == uid
// mahasiswa) supaya tidak butuh server/API key — hanya senderRole yang
// berbeda ("ai") untuk membedakan tampilannya dari pesan mahasiswa asli.
import {
  collection, doc, getDocs, limit, onSnapshot, orderBy, query,
  runTransaction, serverTimestamp, setDoc, addDoc,
  type DocumentData, type QueryDocumentSnapshot,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "@/common/libs/firebase";
import { matchFaqAnswer } from "@/services/chatBot";

const DEMO = import.meta.env.VITE_DEMO === "1";
const AI_SENDER_NAME = "AI Asisten Perpustakaan";

export type ChatSenderRole = "student" | "admin" | "ai";

export interface ChatMessage {
  id: string;
  senderUid: string;
  senderRole: ChatSenderRole;
  senderName: string;
  text: string;
  createdAt: number | null; // ms epoch; null selagi serverTimestamp belum sinkron
}

export interface ChatSummary {
  studentUid: string;
  studentName: string;
  lastMessageText: string;
  lastMessageAt: number | null;
  lastSenderRole: ChatSenderRole;
  unreadByAdmin: boolean;
  unreadByStudent: boolean;
  lastReadByAdminAt: number | null;
  lastReadByStudentAt: number | null;
  waitingSinceAt: number | null;
}

function chatDocRef(studentUid: string) {
  return doc(db, "chats", studentUid);
}

const queueDocRef = () => doc(db, "chatQueue", "summary");

function toMillis(value: unknown): number | null {
  const ts = value as { toMillis?: () => number } | null | undefined;
  return ts?.toMillis ? ts.toMillis() : null;
}

function mapChatSummary(id: string, data: DocumentData): ChatSummary {
  return {
    studentUid: id,
    studentName: data.studentName ?? "",
    lastMessageText: data.lastMessageText ?? "",
    lastMessageAt: toMillis(data.lastMessageAt),
    lastSenderRole: data.lastSenderRole ?? "student",
    unreadByAdmin: !!data.unreadByAdmin,
    unreadByStudent: !!data.unreadByStudent,
    lastReadByAdminAt: toMillis(data.lastReadByAdminAt),
    lastReadByStudentAt: toMillis(data.lastReadByStudentAt),
    waitingSinceAt: toMillis(data.waitingSinceAt),
  };
}

function mapChatMessage(d: QueryDocumentSnapshot<DocumentData>): ChatMessage {
  const data = d.data();
  return {
    id: d.id,
    senderUid: data.senderUid,
    senderRole: data.senderRole,
    senderName: data.senderName,
    text: data.text,
    createdAt: toMillis(data.createdAt),
  };
}

export function isChatAvailable(): boolean {
  return !DEMO;
}

/** "24 Agustus 2026 19:27:45" — tanggal, bulan, tahun, jam, menit, detik lengkap. */
export function formatFullTimestamp(ms: number | null): string {
  if (ms == null) return "Mengirim...";
  return new Date(ms).toLocaleString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

/** Naikkan/turunkan hitungan antrean bersama isi ulang ringkasan chat, dalam satu transaksi. */
async function updateChatSummaryAndQueue(
  studentUid: string,
  patch: Record<string, unknown>,
  queueDelta: 0 | 1 | -1,
): Promise<void> {
  await runTransaction(db, async (tx) => {
    const chatRef = chatDocRef(studentUid);
    tx.set(chatRef, patch, { merge: true });
    if (queueDelta !== 0) {
      const qRef = queueDocRef();
      const qSnap = await tx.get(qRef);
      const current = qSnap.exists() ? Number(qSnap.data().waitingCount) || 0 : 0;
      tx.set(qRef, { waitingCount: Math.max(0, current + queueDelta) }, { merge: true });
    }
  });
}

async function sendAiAutoReply(studentUid: string, answer: string): Promise<void> {
  try {
    await addDoc(collection(db, "chats", studentUid, "messages"), {
      senderUid: studentUid,
      senderRole: "ai",
      senderName: AI_SENDER_NAME,
      text: answer,
      createdAt: serverTimestamp(),
    });
    // Sengaja TIDAK mengubah unreadByAdmin -> admin manusia tetap harus
    // menindaklanjuti; ini cuma memperbarui pratinjau pesan terakhir.
    await setDoc(
      chatDocRef(studentUid),
      { lastMessageText: answer, lastMessageAt: serverTimestamp(), lastSenderRole: "ai" },
      { merge: true },
    );
  } catch (err) {
    console.error("sendAiAutoReply gagal:", err);
  }
}

export async function sendChatMessage(
  studentUid: string,
  studentName: string,
  senderUid: string,
  senderRole: ChatSenderRole,
  senderName: string,
  text: string,
): Promise<void> {
  const clean = text.trim();
  if (!clean) return;
  if (DEMO) throw new Error("Live chat memerlukan konfigurasi Firebase (nonaktif di mode demo).");

  let lastRole: ChatSenderRole | null = null;
  if (senderRole === "student") {
    const lastSnap = await getDocs(
      query(collection(db, "chats", studentUid, "messages"), orderBy("createdAt", "desc"), limit(1)),
    ).catch(() => null);
    lastRole = lastSnap && !lastSnap.empty ? (lastSnap.docs[0].data().senderRole ?? null) : null;
  }

  await addDoc(collection(db, "chats", studentUid, "messages"), {
    senderUid, senderRole, senderName, text: clean, createdAt: serverTimestamp(),
  });

  const startsNewWait = senderRole === "student" && lastRole !== "student";
  await updateChatSummaryAndQueue(
    studentUid,
    {
      studentUid,
      studentName,
      lastMessageText: clean,
      lastMessageAt: serverTimestamp(),
      lastSenderRole: senderRole,
      unreadByAdmin: senderRole === "student",
      unreadByStudent: senderRole === "admin",
      // waitingSinceAt HANYA diset saat penantian baru dimulai, supaya balasan
      // AI berikutnya (yang juga menulis lastMessageAt) tidak mereset acuan
      // "sudah menunggu berapa lama" yang ditampilkan ke mahasiswa.
      ...(startsNewWait ? { waitingSinceAt: serverTimestamp() } : {}),
    },
    // Antrean bertambah hanya saat mahasiswa MEMULAI penantian baru (pesan
    // sebelumnya bukan dari mahasiswa yang masih menunggu) -> mencegah
    // dobel hitung tiap kali mahasiswa mengirim beberapa pesan beruntun.
    startsNewWait ? 1 : 0,
  );

  if (senderRole === "student" && lastRole !== "admin") {
    const answer = matchFaqAnswer(clean);
    if (answer) {
      window.setTimeout(() => void sendAiAutoReply(studentUid, answer), 700);
    }
  }
}

export async function markChatRead(studentUid: string, role: ChatSenderRole): Promise<void> {
  if (DEMO) return;
  try {
    if (role === "admin") {
      await runTransaction(db, async (tx) => {
        const chatRef = chatDocRef(studentUid);
        const chatSnap = await tx.get(chatRef);
        const wasWaiting = chatSnap.exists() && chatSnap.data().unreadByAdmin === true;
        tx.set(chatRef, { unreadByAdmin: false, lastReadByAdminAt: serverTimestamp() }, { merge: true });
        if (wasWaiting) {
          const qRef = queueDocRef();
          const qSnap = await tx.get(qRef);
          const current = qSnap.exists() ? Number(qSnap.data().waitingCount) || 0 : 0;
          tx.set(qRef, { waitingCount: Math.max(0, current - 1) }, { merge: true });
        }
      });
    } else {
      await setDoc(
        chatDocRef(studentUid),
        { unreadByStudent: false, lastReadByStudentAt: serverTimestamp() },
        { merge: true },
      );
    }
  } catch (err) {
    console.error("markChatRead gagal:", err);
  }
}

export function useChatMessages(studentUid: string | null): ChatMessage[] {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  useEffect(() => {
    if (DEMO || !studentUid) {
      setMessages([]);
      return;
    }
    const q = query(collection(db, "chats", studentUid, "messages"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snap) => setMessages(snap.docs.map(mapChatMessage)), (err) => {
      console.error("useChatMessages gagal:", err);
      setMessages([]);
    });
    return unsub;
  }, [studentUid]);
  return messages;
}

export function useChatSummary(studentUid: string | null): ChatSummary | null {
  const [summary, setSummary] = useState<ChatSummary | null>(null);
  useEffect(() => {
    if (DEMO || !studentUid) {
      setSummary(null);
      return;
    }
    const unsub = onSnapshot(
      chatDocRef(studentUid),
      (snap) => setSummary(snap.exists() ? mapChatSummary(snap.id, snap.data()) : null),
      (err) => {
        console.error("useChatSummary gagal:", err);
        setSummary(null);
      },
    );
    return unsub;
  }, [studentUid]);
  return summary;
}

/** Perkiraan jumlah percakapan lain yang masih menunggu balasan admin. */
export function useWaitingQueueCount(enabled: boolean): number {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (DEMO || !enabled) {
      setCount(0);
      return;
    }
    const unsub = onSnapshot(
      queueDocRef(),
      (snap) => setCount(snap.exists() ? Math.max(0, Number(snap.data().waitingCount) || 0) : 0),
      () => setCount(0),
    );
    return unsub;
  }, [enabled]);
  return count;
}

/**
 * `enabled=false` (mis. dipanggil dari NotificationBell peran "user") tidak
 * membuat query Firestore sama sekali — hook tetap dipanggil tanpa syarat
 * untuk mematuhi Rules of Hooks, hanya langganannya yang dilewati.
 */
export function useAdminChatInbox(enabled = true): ChatSummary[] {
  const [chats, setChats] = useState<ChatSummary[]>([]);
  useEffect(() => {
    if (DEMO || !enabled) {
      setChats([]);
      return;
    }
    const q = query(collection(db, "chats"), orderBy("lastMessageAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => setChats(snap.docs.map((d) => mapChatSummary(d.id, d.data()))),
      (err) => {
        console.error("useAdminChatInbox gagal (cek: users/{uid}.role admin sudah ada di Firestore?):", err);
        setChats([]);
      },
    );
    return unsub;
  }, [enabled]);
  return chats;
}
