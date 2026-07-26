// Identitas mahasiswa yang sedang aktif (login). Diisi oleh alur SSO dan
// dipakai di seluruh UI mahasiswa (header, beranda, profil) sehingga sistem
// benar-benar "masuk dengan nama tersebut".
import { useSyncExternalStore } from "react";
import { STUDENT } from "./data";

export interface SessionStudent {
  name: string;
  nim: string;
  faculty: string;
  program: string;
  angkatan: string;
  email: string;
}

const DEFAULT: SessionStudent = {
  name: STUDENT.name,
  nim: STUDENT.nim,
  faculty: STUDENT.faculty,
  program: STUDENT.program,
  angkatan: STUDENT.angkatan,
  email: STUDENT.email,
};

const KEY = "perpus.session.student";
type Listener = () => void;
const listeners = new Set<Listener>();

function read(): SessionStudent {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {
    /* abaikan */
  }
  return DEFAULT;
}

let cache: SessionStudent = read();

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

/** Menyetel identitas mahasiswa aktif (dipanggil setelah login SSO). */
export function setCurrentStudent(student: SessionStudent): void {
  cache = student;
  localStorage.setItem(KEY, JSON.stringify(student));
  listeners.forEach((l) => l());
}

/** Menghapus identitas aktif (saat logout). */
export function clearCurrentStudent(): void {
  cache = DEFAULT;
  localStorage.removeItem(KEY);
  listeners.forEach((l) => l());
}

export function getCurrentStudent(): SessionStudent {
  return cache;
}

export function useCurrentStudent(): SessionStudent {
  return useSyncExternalStore(subscribe, getCurrentStudent);
}

/** Inisial dari nama, mis. "Damta Noviyan Muhamad Faiz" -> "DN". */
export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
