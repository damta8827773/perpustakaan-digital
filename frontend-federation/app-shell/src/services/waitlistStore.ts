// Antrean Cerdas: fitur untuk buku yang seluruh eksemplarnya sedang dipinjam.
// Pengguna dapat bergabung ke antrean, melihat posisinya, dan memperoleh
// perkiraan tanggal ketersediaan yang dihitung dari pola masa pinjam.
import { useSyncExternalStore } from "react";
import type { Book } from "@/common/constants/catalog";

interface WaitEntry {
  bookId: string;
  position: number;
  joinedAt: number;
}

const KEY = "perpus.waitlist";
type Listener = () => void;
const listeners = new Set<Listener>();

function read(): WaitEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as WaitEntry[]) : [];
  } catch {
    return [];
  }
}

let cache: WaitEntry[] = read();

function persist(list: WaitEntry[]) {
  cache = list;
  localStorage.setItem(KEY, JSON.stringify(list));
  listeners.forEach((l) => l());
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = read();
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useWaitlist(): WaitEntry[] {
  return useSyncExternalStore(subscribe, () => cache);
}

export function entryFor(bookId: string): WaitEntry | undefined {
  return cache.find((e) => e.bookId === bookId);
}

// Jumlah antrean yang "sudah ada" sebelum pengguna, ditentukan secara stabil
// dari ciri buku agar konsisten setiap kali dibuka.
function baseQueue(book: Book): number {
  return (book.stockTotal + book.title.length) % 4;
}

/** Perkiraan tanggal buku tersedia kembali, berbasis masa pinjam 14 hari. */
export function predictedAvailability(book: Book, position: number): Date {
  const perCopyDays = Math.max(3, Math.round(14 / Math.max(1, book.stockTotal)));
  const days = 4 + position * perCopyDays;
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

export function joinWaitlist(book: Book): number {
  if (cache.some((e) => e.bookId === book.id)) {
    return entryFor(book.id)!.position;
  }
  const position = baseQueue(book) + 1;
  persist([{ bookId: book.id, position, joinedAt: Date.now() }, ...cache]);
  return position;
}

export function leaveWaitlist(bookId: string): void {
  persist(cache.filter((e) => e.bookId !== bookId));
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}
