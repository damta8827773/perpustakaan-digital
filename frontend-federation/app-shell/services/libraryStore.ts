// Store interaktif sisi klien: menyimpan wishlist, pinjaman baru, dan rating
// yang dibuat pengguna selama sesi. Dipersist ke localStorage sehingga aksi
// pengguna benar-benar berpengaruh lintas halaman.
// (Di produksi, lapisan ini diganti Cloud Firestore.)
import { useSyncExternalStore } from "react";
import { PHYSICAL_LOANS, type PhysicalLoan } from "@/common/constants/catalog";

export interface Review {
  bookId: string;
  rating: number;
  comment: string;
  name: string;
  program: string;
  faculty: string;
  angkatan: string;
  date: string;   // contoh: "20 Juli 2026"
  time: string;   // contoh: "14:30"
  ts: number;     // untuk pengurutan
}

export interface ReturnedLoan {
  bookId: string;
  borrowDate: string;
  returnDate: string;
}

interface LibraryState {
  wishlist: string[];               // daftar id buku
  loans: PhysicalLoan[];            // pinjaman fisik hasil reservasi pengguna
  returned: ReturnedLoan[];         // riwayat buku yang sudah dikembalikan
  ratings: Record<string, number>;  // id buku -> nilai bintang milik pengguna
  reviews: Review[];                // ulasan lengkap dengan data penulis
}

const KEY = "perpus.library.state";
type Listener = () => void;
const listeners = new Set<Listener>();

function read(): LibraryState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { wishlist: [], loans: [], returned: [], ratings: {}, reviews: [], ...JSON.parse(raw) };
  } catch {
    /* abaikan */
  }
  return { wishlist: [], loans: [], returned: [], ratings: {}, reviews: [] };
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

/** Mengembalikan buku fisik: dilepas dari pinjaman aktif dan dicatat ke riwayat. */
export function returnLoan(bookId: string): void {
  const loan = cache.loans.find((l) => l.bookId === bookId);
  if (!loan) return;
  const entry: ReturnedLoan = {
    bookId,
    borrowDate: loan.borrowDate,
    returnDate: new Date().toLocaleDateString("id-ID", {
      day: "2-digit", month: "short", year: "numeric",
    }),
  };
  persist({
    ...cache,
    loans: cache.loans.filter((l) => l.bookId !== bookId),
    returned: [entry, ...cache.returned],
  });
}

export function getReturnedHistory(): ReturnedLoan[] {
  return cache.returned;
}

/** Gabungan pinjaman bawaan (contoh desain) + pinjaman baru pengguna. */
export function getActiveLoans(): PhysicalLoan[] {
  const seededIds = new Set(PHYSICAL_LOANS.map((l) => l.bookId));
  const extra = cache.loans.filter((l) => !seededIds.has(l.bookId));
  return [...extra, ...PHYSICAL_LOANS];
}

// ---------- Rating & Ulasan ----------

export function getRating(bookId: string): number | undefined {
  return cache.ratings[bookId];
}

export interface ReviewerInfo {
  name: string;
  program: string;
  faculty: string;
  angkatan: string;
}

/** Menyimpan rating sekaligus ulasan lengkap dengan data penulis + waktu. */
export function submitReview(
  bookId: string,
  rating: number,
  comment: string,
  reviewer: ReviewerInfo,
): void {
  const now = new Date();
  const review: Review = {
    bookId,
    rating,
    comment: comment.trim(),
    name: reviewer.name,
    program: reviewer.program,
    faculty: reviewer.faculty,
    angkatan: reviewer.angkatan,
    date: now.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
    time: now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    ts: now.getTime(),
  };
  persist({
    ...cache,
    ratings: { ...cache.ratings, [bookId]: rating },
    reviews: [review, ...cache.reviews],
  });
}

export function reviewsFor(bookId: string): Review[] {
  return cache.reviews.filter((r) => r.bookId === bookId).sort((a, b) => b.ts - a.ts);
}
