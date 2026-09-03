import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Konfigurasi dibaca dari environment variable (file .env.local yang tidak
// pernah masuk ke repository). Lihat .env.example untuk daftar variabel.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// getAuth() melempar error sinkron kalau apiKey/authDomain/projectId kosong
// (mis. lupa mengisi Environment Variables di Vercel/Netlify/dsb, karena
// .env.local memang sengaja tidak pernah ikut ter-commit) - tanpa pengecekan
// ini, kegagalannya hanya terlihat sebagai halaman putih kosong tanpa
// petunjuk apa pun. Tampilkan pesan yang jelas dulu sebelum error itu terjadi.
const REQUIRED_ENV: Record<string, string | undefined> = {
  VITE_FIREBASE_API_KEY: firebaseConfig.apiKey,
  VITE_FIREBASE_AUTH_DOMAIN: firebaseConfig.authDomain,
  VITE_FIREBASE_PROJECT_ID: firebaseConfig.projectId,
  VITE_FIREBASE_APP_ID: firebaseConfig.appId,
};
const missingEnv = Object.entries(REQUIRED_ENV)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingEnv.length > 0) {
  document.documentElement.innerHTML = `
    <head><meta charset="UTF-8" /><title>Konfigurasi belum lengkap</title></head>
    <body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f8fafc;font-family:system-ui,sans-serif;padding:24px;box-sizing:border-box;">
      <div style="max-width:560px;background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:32px;">
        <h1 style="margin:0 0 12px;font-size:20px;color:#0f172a;">Konfigurasi Firebase belum lengkap</h1>
        <p style="margin:0 0 16px;color:#475569;line-height:1.6;">
          Environment variable berikut belum diisi di tempat aplikasi ini di-deploy
          (bukan masalah kode) - biasanya karena <code>.env.local</code> memang
          sengaja tidak pernah ikut ter-upload ke GitHub:
        </p>
        <ul style="margin:0 0 16px;padding-left:20px;color:#dc2626;font-family:monospace;font-size:14px;">
          ${missingEnv.map((k) => `<li>${k}</li>`).join("")}
        </ul>
        <p style="margin:0;color:#475569;line-height:1.6;">
          Tambahkan variabel di atas pada pengaturan Environment Variables
          proyek (Vercel/Netlify/dsb.), lalu deploy ulang.
        </p>
      </div>
    </body>
  `;
  throw new Error(`Konfigurasi Firebase belum lengkap: ${missingEnv.join(", ")} belum diisi.`);
}

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// Dipakai mulai fitur foto profil, live chat, dan reset password oleh admin.
// Firestore Database harus diaktifkan di Firebase Console agar fitur-fitur
// itu berfungsi (lihat README bagian Konfigurasi Firebase).
export const db = getFirestore(app);

// Login memakai NIM (mahasiswa) atau username (admin); Firebase Auth butuh
// email, jadi identitas dipetakan ke domain internal berikut.
export const STUDENT_EMAIL_DOMAIN = "mahasiswa.perpusdigital.web.id";
export const ADMIN_EMAIL_DOMAIN = "admin.perpusdigital.web.id";

export const studentEmail = (nim: string) =>
  `${nim.trim().toLowerCase()}@${STUDENT_EMAIL_DOMAIN}`;
export const adminEmail = (username: string) =>
  `${username.trim().toLowerCase()}@${ADMIN_EMAIL_DOMAIN}`;
