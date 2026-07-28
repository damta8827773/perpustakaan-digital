// Penyimpanan anggota hasil login SSO, dibagikan antara alur login mahasiswa
// dan panel Data Anggota admin. Dipersist ke localStorage agar bertahan
// antar-halaman. (Di produksi, ini diganti koleksi `members` di Firestore.)
import { MEMBERS, type Member } from "@/common/constants/catalog";

const KEY = "perpus.sso.members";
type Listener = () => void;
const listeners = new Set<Listener>();

function readStorage(): Member[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as Member[]) : [];
  } catch {
    return [];
  }
}

let cache: Member[] = readStorage();

function notify() {
  listeners.forEach((l) => l());
}

function persist(list: Member[]) {
  cache = list;
  localStorage.setItem(KEY, JSON.stringify(list));
  notify();
}

// Mendaftarkan mahasiswa hasil SSO ke daftar anggota. Idempoten: NIM yang
// sudah ada (baik bawaan maupun hasil SSO) tidak diduplikasi.
export function registerSsoMember(member: Member): void {
  const exists =
    cache.some((m) => m.nim === member.nim) ||
    MEMBERS.some((m) => m.nim === member.nim);
  if (exists) return;
  persist([{ ...member, source: "sso" }, ...cache]);
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = readStorage();
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

// Snapshot stabil (referensi hanya berubah saat data berubah) untuk
// useSyncExternalStore.
export function getSsoMembers(): Member[] {
  return cache;
}

// Gabungan anggota bawaan + hasil SSO, dengan SSO tampil paling atas.
export function getAllMembers(): Member[] {
  return [...cache, ...MEMBERS];
}
