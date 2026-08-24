// Foto profil disimpan LANGSUNG sebagai gambar terkompresi di dokumen
// users/{uid} (Firestore) — bukan Firebase Storage. Ini sengaja dipilih
// supaya fitur ini tidak butuh paket Blaze (Storage mewajibkan upgrade
// billing project sejak kebijakan terbaru Firebase, meski pemakaian ringan
// biasanya tetap gratis). Firestore Spark/gratis sudah cukup untuk gambar
// kecil (di-resize ke maksimal 256px), jauh di bawah batas 1MB per dokumen.
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/common/libs/firebase";

const DEMO = import.meta.env.VITE_DEMO === "1";
const MAX_SOURCE_SIZE = 8 * 1024 * 1024; // batas file asli sebelum dikompres
const MAX_DATA_URL_LENGTH = 500_000; // ~500KB, jauh di bawah batas dokumen Firestore
const TARGET_DIMENSION = 256;
const JPEG_QUALITY = 0.75;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export class AvatarUploadDisabledError extends Error {}

export function isAvatarUploadAvailable(): boolean {
  return !DEMO;
}

async function resizeToDataUrl(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, TARGET_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Browser tidak mendukung pemrosesan gambar.");
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
}

export async function uploadAvatar(
  uid: string,
  file: File,
  onProgress?: (pct: number) => void,
): Promise<string> {
  if (DEMO) {
    throw new AvatarUploadDisabledError("Fitur ganti foto memerlukan konfigurasi Firebase (nonaktif di mode demo).");
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Format file harus JPG, PNG, atau WebP.");
  }
  if (file.size > MAX_SOURCE_SIZE) {
    throw new Error("Ukuran file sumber maksimal 8MB.");
  }

  onProgress?.(20);
  const photoURL = await resizeToDataUrl(file);
  onProgress?.(70);

  if (photoURL.length > MAX_DATA_URL_LENGTH) {
    throw new Error("Foto terlalu kompleks untuk disimpan, coba foto lain yang lebih sederhana.");
  }

  await setDoc(doc(db, "users", uid), { photoURL }, { merge: true });
  onProgress?.(100);

  return photoURL;
}
