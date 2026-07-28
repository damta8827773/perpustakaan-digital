// Notifikasi terpisah untuk peran user dan admin, lengkap dengan status baca.
// Notifikasi yang sudah dibaca hilang dari daftar (isi maupun tanda merahnya).
import { useSyncExternalStore } from "react";

export type NotifRole = "user" | "admin";
export type NotifTone = "primary" | "warning" | "destructive" | "success" | "accent";

export interface AppNotification {
  id: string;
  tone: NotifTone;
  title: string;
  detail: string;
  time: string;
  to: string; // rute tujuan saat diklik
}

const BUILTIN: Record<NotifRole, AppNotification[]> = {
  user: [
    {
      id: "u-welcome",
      tone: "primary",
      title: "Selamat datang di Perpustakaan Digital",
      detail: "Mulai jelajahi koleksi dan pinjam buku pertama Anda.",
      time: "Baru saja",
      to: "/app",
    },
    {
      id: "u-ebook",
      tone: "accent",
      title: "Koleksi e-book siap dibaca",
      detail: "Beberapa judul tersedia dalam format e-book tanpa perlu ke perpustakaan.",
      time: "Hari ini",
      to: "/app/cari",
    },
  ],
  admin: [
    {
      id: "a-late",
      tone: "destructive",
      title: "8 buku terlambat dikembalikan",
      detail: "Periksa daftar peminjaman untuk menindaklanjuti keterlambatan.",
      time: "Hari ini",
      to: "/admin/peminjaman",
    },
    {
      id: "a-member",
      tone: "primary",
      title: "Anggota baru menunggu verifikasi",
      detail: "Lihat data anggota terbaru yang mendaftar ke sistem.",
      time: "Kemarin",
      to: "/admin/anggota",
    },
  ],
};

const READ_KEY = "perpus.notif.read";       // { user: string[], admin: string[] }
const HELP_KEY = "perpus.notif.help";        // AppNotification[] untuk admin

type Listener = () => void;
const listeners = new Set<Listener>();
const notify = () => listeners.forEach((l) => l());

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

let readIds = readJson<Record<NotifRole, string[]>>(READ_KEY, { user: [], admin: [] });
let helpNotifs = readJson<AppNotification[]>(HELP_KEY, []);

function persistRead() {
  localStorage.setItem(READ_KEY, JSON.stringify(readIds));
  notify();
}
function persistHelp() {
  localStorage.setItem(HELP_KEY, JSON.stringify(helpNotifs));
  notify();
}

function allFor(role: NotifRole): AppNotification[] {
  return role === "admin" ? [...helpNotifs, ...BUILTIN.admin] : BUILTIN.user;
}

/** Notifikasi yang BELUM dibaca (yang masih tampil). */
export function visibleNotifications(role: NotifRole): AppNotification[] {
  const read = readIds[role] ?? [];
  return allFor(role).filter((n) => !read.includes(n.id));
}

export function markRead(role: NotifRole, id: string): void {
  const read = readIds[role] ?? [];
  if (read.includes(id)) return;
  readIds = { ...readIds, [role]: [...read, id] };
  persistRead();
}

export function markAllRead(role: NotifRole): void {
  readIds = { ...readIds, [role]: allFor(role).map((n) => n.id) };
  persistRead();
}

/** Pesan bantuan dari user menjadi notifikasi baru untuk admin. */
export function sendHelpToAdmin(fromName: string, message: string): void {
  const id = `help-${Date.now()}`;
  helpNotifs = [
    {
      id,
      tone: "warning",
      title: `Bantuan dari ${fromName}`,
      detail: message,
      time: "Baru saja",
      to: "/admin/anggota",
    },
    ...helpNotifs,
  ];
  persistHelp();
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === READ_KEY) readIds = readJson(READ_KEY, { user: [], admin: [] });
    if (e.key === HELP_KEY) helpNotifs = readJson(HELP_KEY, []);
    if (e.key === READ_KEY || e.key === HELP_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useNotifications(role: NotifRole): AppNotification[] {
  return useSyncExternalStore(
    subscribe,
    () => (role === "admin" ? adminSnapshot() : userSnapshot()),
  );
}

// Snapshot stabil per peran (referensi berubah hanya saat data berubah).
let userCache: AppNotification[] = visibleNotifications("user");
let adminCache: AppNotification[] = visibleNotifications("admin");
let cacheKey = "";
function refreshCaches() {
  const key = JSON.stringify(readIds) + "|" + JSON.stringify(helpNotifs.map((h) => h.id));
  if (key !== cacheKey) {
    cacheKey = key;
    userCache = visibleNotifications("user");
    adminCache = visibleNotifications("admin");
  }
}
function userSnapshot() {
  refreshCaches();
  return userCache;
}
function adminSnapshot() {
  refreshCaches();
  return adminCache;
}
