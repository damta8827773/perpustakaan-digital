// Formulir "hubungi admin" untuk lupa password, dipakai KHUSUS ketika email
// terdaftar tidak bisa menerima tautan reset (mis. akun NIM dengan email
// sintetis @mahasiswa.perpusdigital.web.id yang bukan kotak masuk sungguhan).
// Bisa diisi sebelum login; hanya admin yang bisa membaca kembali isinya.
import {
  addDoc, collection, doc, onSnapshot, query, serverTimestamp, updateDoc, where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "@/common/libs/firebase";

const DEMO = import.meta.env.VITE_DEMO === "1";

export interface HelpTicket {
  id: string;
  nimOrEmail: string;
  message: string;
  status: "open" | "resolved";
  createdAt: number | null;
}

export function isHelpTicketAvailable(): boolean {
  return !DEMO;
}

export async function submitHelpTicket(nimOrEmail: string, message: string): Promise<void> {
  const clean = nimOrEmail.trim();
  if (!clean) throw new Error("Isi NIM atau email Anda.");
  if (DEMO) {
    throw new Error("Fitur ini memerlukan konfigurasi Firebase (nonaktif di mode demo).");
  }
  await addDoc(collection(db, "passwordResetHelpTickets"), {
    nimOrEmail: clean,
    message: message.trim().slice(0, 500),
    status: "open",
    createdAt: serverTimestamp(),
  });
}

export async function resolveHelpTicket(id: string): Promise<void> {
  await updateDoc(doc(db, "passwordResetHelpTickets", id), { status: "resolved" });
}

export function useOpenHelpTickets(enabled: boolean): HelpTicket[] {
  const [tickets, setTickets] = useState<HelpTicket[]>([]);
  useEffect(() => {
    if (DEMO || !enabled) {
      setTickets([]);
      return;
    }
    // Hanya satu filter (where status) tanpa orderBy field lain, supaya
    // tidak butuh composite index tambahan di Firebase Console -> diurutkan
    // di sisi klien setelah data diterima.
    const q = query(collection(db, "passwordResetHelpTickets"), where("status", "==", "open"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const mapped = snap.docs.map((d) => {
          const data = d.data();
          const ts = data.createdAt as { toMillis?: () => number } | null;
          return {
            id: d.id,
            nimOrEmail: data.nimOrEmail ?? "",
            message: data.message ?? "",
            status: data.status ?? "open",
            createdAt: ts?.toMillis ? ts.toMillis() : null,
          };
        });
        mapped.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
        setTickets(mapped);
      },
      () => setTickets([]),
    );
    return unsub;
  }, [enabled]);
  return tickets;
}
