import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

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

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Login memakai NIM (mahasiswa) atau username (admin); Firebase Auth butuh
// email, jadi identitas dipetakan ke domain internal berikut.
export const STUDENT_EMAIL_DOMAIN = "mahasiswa.perpusdigital.web.id";
export const ADMIN_EMAIL_DOMAIN = "admin.perpusdigital.web.id";

export const studentEmail = (nim: string) =>
  `${nim.trim().toLowerCase()}@${STUDENT_EMAIL_DOMAIN}`;
export const adminEmail = (username: string) =>
  `${username.trim().toLowerCase()}@${ADMIN_EMAIL_DOMAIN}`;
