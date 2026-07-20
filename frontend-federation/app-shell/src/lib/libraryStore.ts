// Store interaktif sisi klien: menyimpan wishlist, pinjaman baru, dan rating
// yang dibuat pengguna selama sesi. Dipersist ke localStorage sehingga aksi
// pengguna benar-benar berpengaruh lintas halaman.
// (Di produksi, lapisan ini diganti Cloud Firestore.)
import { useSyncExternalStore } from "react";
import { PHYSICAL_LOANS, type PhysicalLoan } from "./data";

interface LibraryState {
  wishlist: string[];               // daftar id buku
  loans: PhysicalLoan[];            // pinjaman fisik hasil reservasi pengguna
  ratings: Record<string, number>;  // id buku -> nilai bintang
}

const KEY = "perpus.library.state";
type Listener = () => void;
const listeners = new Set<Listener>();

function read(): LibraryState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { wishlist: [], loans: [], ratings: {}, ...JSON.parse(raw) };
  } catch {
    /* abaikan */
  }
  return { wishlist: [], loans: [], ratings: {} };
}

let cache: LibraryState = read();

function persist(next: LibraryState) {
  cache = next;
  localStorage.setItem(KEY, JSON.stringify(next));
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

const getSnapshot = () => cache;

// ---------- Hook ----------

export function useLibrary(): LibraryState {
  return useSyncExternalStore(subscribe, getSnapshot);
}

// ---------- Wishlist ----------

export function isWishlisted(bookId: string): boolean {
  return cache.wishlist.includes(bookId);
}

/** Mengaktifkan/menonaktifkan wishlist; mengembalikan status baru. */
export function toggleWishlist(bookId: string): boolean {
  const active = cache.wishlist.includes(bookId);
  persist({
    ...cache,
    wishlist: active
      ? cache.wishlist.filter((id) => id !== bookId)
      : [bookId, ...cache.wishlist],
  });
  return !active;
}

// ---------- Pinjaman ----------

/** Menambahkan pinjaman fisik baru hasil reservasi. */
export function addLoan(bookId: string, dueDate: string): void {
  if (cache.loans.some((l) => l.bookId === bookId)) return;
  const loan: PhysicalLoan = {
    bookId,
    borrowDate: new Date().toLocaleDateString("id-ID", {
      day: "2-digit", month: "short", year: "numeric",
    }),
    dueDate,
    daysLeft: 14,
    status: "aktif",
    progress: 0,
  };
  persist({ ...cache, loans: [loan, ...cache.loans] });
}

/** Gabungan pinjaman bawaan (contoh desain) + pinjaman baru pengguna. */
export function getActiveLoans(): PhysicalLoan[] {
  const seededIds = new Set(PHYSICAL_LOANS.map((l) => l.bookId));
  const extra = cache.loans.filter((l) => !seededIds.has(l.bookId));
  return [...extra, ...PHYSICAL_LOANS];
}

// ---------- Rating ----------

export function getRating(bookId: string): number | undefined {
  return cache.ratings[bookId];
}

export function setRating(bookId: string, value: number): void {
  persist({ ...cache, ratings: { ...cache.ratings, [bookId]: value } });
}
