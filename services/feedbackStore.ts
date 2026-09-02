// Umpan balik pengguna: komentar, suka (like), dan favorit. Seluruh data
// terkumpul di sini sehingga dapat ditampilkan di panel admin. Admin dapat
// membalas komentar, dan balasan itu masuk ke "kotak masuk" pengguna terkait
// (pengganti email pada versi tanpa backend).
//
// Catatan: penyimpanan memakai localStorage sehingga bersifat per-peramban.
// Pada produksi, lapisan ini digantikan basis data bersama (mis. Firestore)
// agar data komentar dan balasan tersinkron lintas pengguna, dan pengiriman
// email dilakukan oleh layanan surel di sisi server.
import { useSyncExternalStore } from "react";

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
  likes: CommentLike[];     // siapa saja yang menyukai komentar (email + nama)
  reply?: AdminReply;
}

export interface Reaction {
  bookId: string;
  bookTitle: string;
  userName: string;
  userEmail: string;
  ts: number;
}

interface FeedbackState {
  comments: Comment[];
  likes: Reaction[];        // suka pada buku
  favorites: Reaction[];    // favorit pada buku
}

const KEY = "perpus.feedback";
type Listener = () => void;
const listeners = new Set<Listener>();

// Migrasi data lama: sebelumnya comment.likes cuma array email (string[]),
// sekarang array {email, name} supaya notifikasi bisa menyebut nama penyuka.
function normalizeLikes(likes: unknown): CommentLike[] {
  if (!Array.isArray(likes)) return [];
  return likes.map((l) =>
    typeof l === "string" ? { email: l, name: "" } : (l as CommentLike),
  );
}

function read(): FeedbackState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = { comments: [], likes: [], favorites: [], ...JSON.parse(raw) } as FeedbackState;
      parsed.comments = parsed.comments.map((c) => ({ ...c, likes: normalizeLikes(c.likes) }));
      return parsed;
    }
  } catch {
    /* abaikan */
  }
  return { comments: [], likes: [], favorites: [] };
}

let cache: FeedbackState = read();

function persist(next: FeedbackState) {
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

export function useFeedback(): FeedbackState {
  return useSyncExternalStore(subscribe, () => cache);
}

const now = () => new Date();
const fmtDate = (d: Date) =>
  d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
const fmtTime = (d: Date) =>
  d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

export interface Author {
  name: string;
  email: string;
  program: string;
  faculty: string;
  angkatan: string;
}

// ---------- Komentar ----------

export function addComment(
  bookId: string, bookTitle: string, author: Author, text: string,
): void {
  const d = now();
  const comment: Comment = {
    id: `c-${d.getTime()}-${Math.random().toString(36).slice(2, 7)}`,
    bookId, bookTitle,
    userName: author.name,
    userEmail: author.email,
    program: author.program,
    faculty: author.faculty,
    angkatan: author.angkatan,
    text: text.trim(),
    date: fmtDate(d),
    time: fmtTime(d),
    ts: d.getTime(),
    likes: [],
  };
  persist({ ...cache, comments: [comment, ...cache.comments] });
}

export function toggleCommentLike(commentId: string, email: string, name: string): void {
  persist({
    ...cache,
    comments: cache.comments.map((c) => {
      if (c.id !== commentId) return c;
      const liked = c.likes.some((l) => l.email === email);
      return {
        ...c,
        likes: liked
          ? c.likes.filter((l) => l.email !== email)
          : [...c.likes, { email, name }],
      };
    }),
  });
}

// Balasan admin. Hanya dipanggil dari panel admin (akses sudah dibatasi email).
export function replyToComment(commentId: string, text: string): void {
  const d = now();
  persist({
    ...cache,
    comments: cache.comments.map((c) =>
      c.id === commentId
        ? { ...c, reply: { text: text.trim(), date: fmtDate(d), time: fmtTime(d), ts: d.getTime() } }
        : c,
    ),
  });
}

export function commentsFor(bookId: string): Comment[] {
  return cache.comments.filter((c) => c.bookId === bookId).sort((a, b) => b.ts - a.ts);
}

// Kotak masuk pengguna: komentar miliknya yang sudah dibalas admin.
export function inboxFor(email: string): Comment[] {
  return cache.comments
    .filter((c) => c.userEmail === email && c.reply)
    .sort((a, b) => (b.reply!.ts) - (a.reply!.ts));
}

// ---------- Suka (like) pada buku ----------

export function toggleBookLike(bookId: string, bookTitle: string, author: Author): boolean {
  const liked = cache.likes.some((l) => l.bookId === bookId && l.userEmail === author.email);
  persist({
    ...cache,
    likes: liked
      ? cache.likes.filter((l) => !(l.bookId === bookId && l.userEmail === author.email))
      : [{ bookId, bookTitle, userName: author.name, userEmail: author.email, ts: Date.now() }, ...cache.likes],
  });
  return !liked;
}

export function isBookLiked(bookId: string, email: string): boolean {
  return cache.likes.some((l) => l.bookId === bookId && l.userEmail === email);
}

export function bookLikeCount(bookId: string): number {
  return cache.likes.filter((l) => l.bookId === bookId).length;
}

// ---------- Favorit pada buku ----------

export function toggleFavorite(bookId: string, bookTitle: string, author: Author): boolean {
  const fav = cache.favorites.some((f) => f.bookId === bookId && f.userEmail === author.email);
  persist({
    ...cache,
    favorites: fav
      ? cache.favorites.filter((f) => !(f.bookId === bookId && f.userEmail === author.email))
      : [{ bookId, bookTitle, userName: author.name, userEmail: author.email, ts: Date.now() }, ...cache.favorites],
  });
  return !fav;
}

export function isFavorite(bookId: string, email: string): boolean {
  return cache.favorites.some((f) => f.bookId === bookId && f.userEmail === email);
}

export function favoriteCount(bookId: string): number {
  return cache.favorites.filter((f) => f.bookId === bookId).length;
}

// ---------- Notifikasi "komentar Anda disukai" ----------

export interface CommentLikeNotification {
  id: string;
  bookId: string;
  bookTitle: string;
  commentText: string;
  likerName: string;
}

/** Satu entri per (komentar, penyuka) - tidak termasuk suka dari diri sendiri. */
export function commentLikeNotificationsFor(email: string): CommentLikeNotification[] {
  const result: CommentLikeNotification[] = [];
  for (const c of cache.comments) {
    if (c.userEmail !== email) continue;
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
