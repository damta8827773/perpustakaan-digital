// Umpan balik pengguna: komentar, suka (like), dan favorit buku - disimpan
// di Firestore (bukan localStorage) supaya SEMUA pengguna melihat data yang
// sama, lintas perangkat/peramban.
//
// Riwayat bug: versi sebelumnya memakai localStorage, yang bersifat
// per-peramban - artinya komentar yang ditulis seorang mahasiswa TIDAK
// PERNAH terlihat oleh mahasiswa lain (beda perangkat/peramban), sekalipun
// keduanya melihat buku yang sama. Modul ini menggantinya dengan Firestore,
// mengikuti pola real-time yang sama seperti live chat (lihat chatStore.ts).
import {
  collection, doc, addDoc, updateDoc, onSnapshot, runTransaction,
  serverTimestamp, query, where,
  type DocumentData, type QueryDocumentSnapshot,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "@/common/libs/firebase";

const DEMO = import.meta.env.VITE_DEMO === "1";

export function isFeedbackAvailable(): boolean {
  return !DEMO;
}

export interface AdminReply {
  text: string;
  date: string;
  time: string;
  ts: number;
}

export interface CommentLike {
  email: string;
  name: string;
}

export interface Comment {
  id: string;
  bookId: string;
  bookTitle: string;
  userName: string;
  userEmail: string;
  program: string;
  faculty: string;
  angkatan: string;
  text: string;
  date: string;
  time: string;
  ts: number;
  likes: CommentLike[];
  reply?: AdminReply;
}

export interface Reaction {
  bookId: string;
  bookTitle: string;
  userName: string;
  userEmail: string;
  ts: number;
}

export interface Author {
  name: string;
  email: string;
  program: string;
  faculty: string;
  angkatan: string;
}

function toMillis(value: unknown): number | null {
  const ts = value as { toMillis?: () => number } | null | undefined;
  return ts?.toMillis ? ts.toMillis() : null;
}

const fmtDate = (ms: number) =>
  new Date(ms).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
const fmtTime = (ms: number) =>
  new Date(ms).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

function mapComment(d: QueryDocumentSnapshot<DocumentData>): Comment {
  const data = d.data();
  const ts = toMillis(data.createdAt) ?? Date.now();
  const replyTs = toMillis(data.reply?.createdAt);
  const reply: AdminReply | undefined = data.reply
    ? { text: data.reply.text, ts: replyTs ?? Date.now(), date: fmtDate(replyTs ?? Date.now()), time: fmtTime(replyTs ?? Date.now()) }
    : undefined;
  return {
    id: d.id,
    bookId: data.bookId,
    bookTitle: data.bookTitle,
    userName: data.userName,
    userEmail: data.userEmail,
    program: data.program,
    faculty: data.faculty,
    angkatan: data.angkatan,
    text: data.text,
    date: fmtDate(ts),
    time: fmtTime(ts),
    ts,
    likes: Array.isArray(data.likes) ? data.likes : [],
    reply,
  };
}

// ---------- Komentar ----------

export async function addComment(
  bookId: string, bookTitle: string, author: Author, text: string,
): Promise<void> {
  const clean = text.trim();
  if (!clean || DEMO) return;
  await addDoc(collection(db, "comments"), {
    bookId, bookTitle,
    userName: author.name,
    userEmail: author.email,
    program: author.program,
    faculty: author.faculty,
    angkatan: author.angkatan,
    text: clean,
    likes: [],
    hasReply: false,
    createdAt: serverTimestamp(),
  });
}

export async function toggleCommentLike(commentId: string, email: string, name: string): Promise<void> {
  if (DEMO) return;
  const ref = doc(db, "comments", commentId);
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists()) return;
    const likes: CommentLike[] = Array.isArray(snap.data().likes) ? snap.data().likes : [];
    const liked = likes.some((l) => l.email === email);
    const next = liked ? likes.filter((l) => l.email !== email) : [...likes, { email, name }];
    tx.update(ref, { likes: next });
  });
}

// Balasan admin. Hanya dipanggil dari panel admin (akses sudah dibatasi
// email lewat routing + ditegakkan ulang di firestore.rules).
export async function replyToComment(commentId: string, text: string): Promise<void> {
  if (DEMO) return;
  await updateDoc(doc(db, "comments", commentId), {
    reply: { text: text.trim(), createdAt: serverTimestamp() },
    hasReply: true,
  });
}

/** Komentar untuk satu buku, real-time - dipakai di halaman detail buku. */
export function useBookComments(bookId: string): Comment[] {
  const [comments, setComments] = useState<Comment[]>([]);
  useEffect(() => {
    if (DEMO) { setComments([]); return; }
    const q = query(collection(db, "comments"), where("bookId", "==", bookId));
    const unsub = onSnapshot(q, (snap) => {
      setComments(snap.docs.map(mapComment).sort((a, b) => b.ts - a.ts));
    }, (err) => {
      console.error("useBookComments gagal:", err);
      setComments([]);
    });
    return unsub;
  }, [bookId]);
  return comments;
}

/** Seluruh komentar lintas buku, real-time - dipakai panel admin (Umpan Balik). */
export function useAllComments(): Comment[] {
  const [comments, setComments] = useState<Comment[]>([]);
  useEffect(() => {
    if (DEMO) { setComments([]); return; }
    const unsub = onSnapshot(collection(db, "comments"), (snap) => {
      setComments(snap.docs.map(mapComment).sort((a, b) => b.ts - a.ts));
    }, (err) => {
      console.error("useAllComments gagal:", err);
      setComments([]);
    });
    return unsub;
  }, []);
  return comments;
}

/**
 * Komentar milik satu pengguna (lintas semua buku), real-time - sumber
 * bersama untuk kotak masuk balasan admin (Profil.tsx) dan notifikasi
 * "komentar Anda disukai" (HeaderMenus.tsx), supaya cukup satu langganan
 * Firestore untuk keduanya.
 */
export function useMyComments(email: string | null): Comment[] {
  const [comments, setComments] = useState<Comment[]>([]);
  useEffect(() => {
    if (DEMO || !email) { setComments([]); return; }
    const q = query(collection(db, "comments"), where("userEmail", "==", email));
    const unsub = onSnapshot(q, (snap) => {
      setComments(snap.docs.map(mapComment).sort((a, b) => b.ts - a.ts));
    }, (err) => {
      console.error("useMyComments gagal:", err);
      setComments([]);
    });
    return unsub;
  }, [email]);
  return comments;
}

/** Dari useMyComments(): komentar yang sudah dibalas admin, terbaru dulu. */
export function inboxFromComments(comments: Comment[]): Comment[] {
  return comments.filter((c) => c.reply).sort((a, b) => b.reply!.ts - a.reply!.ts);
}

export interface CommentLikeNotification {
  id: string;
  bookId: string;
  bookTitle: string;
  commentText: string;
  likerName: string;
}

/** Dari useMyComments(): satu entri per (komentar, penyuka) - tidak termasuk suka dari diri sendiri. */
export function commentLikeNotificationsFromComments(comments: Comment[], email: string): CommentLikeNotification[] {
  const result: CommentLikeNotification[] = [];
  for (const c of comments) {
    for (const like of c.likes) {
      if (like.email === email) continue;
      result.push({
        id: `like-${c.id}-${like.email}`,
        bookId: c.bookId,
        bookTitle: c.bookTitle,
        commentText: c.text,
        likerName: like.name,
      });
    }
  }
  return result;
}

// ---------- Suka & favorit pada buku ----------

interface BookReactions {
  likes: Reaction[];
  favorites: Reaction[];
}

const EMPTY_REACTIONS: BookReactions = { likes: [], favorites: [] };

function mapBookReactions(data: DocumentData | undefined): BookReactions {
  return {
    likes: Array.isArray(data?.likes) ? data.likes : [],
    favorites: Array.isArray(data?.favorites) ? data.favorites : [],
  };
}

/** Suka & favorit satu buku, real-time - dipakai di halaman detail buku. */
export function useBookReactions(bookId: string): BookReactions {
  const [state, setState] = useState<BookReactions>(EMPTY_REACTIONS);
  useEffect(() => {
    if (DEMO) { setState(EMPTY_REACTIONS); return; }
    const unsub = onSnapshot(doc(db, "bookReactions", bookId), (snap) => {
      setState(mapBookReactions(snap.data()));
    }, (err) => {
      console.error("useBookReactions gagal:", err);
      setState(EMPTY_REACTIONS);
    });
    return unsub;
  }, [bookId]);
  return state;
}

/** Reaksi seluruh buku, real-time - dipakai admin untuk statistik agregat. */
export function useAllBookReactions(): BookReactions[] {
  const [list, setList] = useState<BookReactions[]>([]);
  useEffect(() => {
    if (DEMO) { setList([]); return; }
    const unsub = onSnapshot(collection(db, "bookReactions"), (snap) => {
      setList(snap.docs.map((d) => mapBookReactions(d.data())));
    }, (err) => {
      console.error("useAllBookReactions gagal:", err);
      setList([]);
    });
    return unsub;
  }, []);
  return list;
}

async function toggleReaction(
  bookId: string, bookTitle: string, author: Author, field: "likes" | "favorites",
): Promise<boolean> {
  if (DEMO) return false;
  const ref = doc(db, "bookReactions", bookId);
  let nowActive = false;
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    const data = mapBookReactions(snap.exists() ? snap.data() : undefined);
    const list = data[field];
    const already = list.some((r) => r.userEmail === author.email);
    nowActive = !already;
    const next = already
      ? list.filter((r) => r.userEmail !== author.email)
      : [...list, { bookId, bookTitle, userName: author.name, userEmail: author.email, ts: Date.now() }];
    // FieldValue.serverTimestamp() tidak didukung di dalam elemen array,
    // jadi ts memakai jam klien (Date.now()) - cukup untuk sekadar
    // mengurutkan riwayat, tidak dipakai untuk keputusan keamanan apa pun.
    tx.set(ref, { ...data, [field]: next }, { merge: true });
  });
  return nowActive;
}

export function toggleBookLike(bookId: string, bookTitle: string, author: Author): Promise<boolean> {
  return toggleReaction(bookId, bookTitle, author, "likes");
}

export function toggleFavorite(bookId: string, bookTitle: string, author: Author): Promise<boolean> {
  return toggleReaction(bookId, bookTitle, author, "favorites");
}
