# app-shell: Perpustakaan Digital UIN Syarif Hidayatullah Jakarta

Aplikasi web utama (React + Vite + Tailwind CSS v4 + Firebase Auth) yang
mereplikasi desain Figma "Perpustakaan Digital". Portal Mahasiswa dan panel
Admin memakai URL yang terpisah penuh.

## Menjalankan

```bash
cd frontend-federation/app-shell
npm install
npm run dev
```

## Peta URL

- `/` : landing Portal Mahasiswa (tidak ada tautan admin)
- `/login` : login mahasiswa (NIM + password)
- `/app/*` : seluruh halaman mahasiswa (butuh role student)
- `/admin/login` : pintu masuk Admin (URL terpisah, akses langsung)
- `/admin/*` : panel admin (butuh role admin)

## Mode Demo vs Login Firebase

`.env.local` berisi `VITE_DEMO=1` sehingga login dilewati untuk pratinjau UI.

Mengaktifkan login sungguhan:

1. Firebase Console, proyek projectdamta: Authentication, Sign-in method,
   aktifkan Email/Password. (Saat ini masih nonaktif; API mengembalikan
   OPERATION_NOT_ALLOWED.)
2. Tab Users, buat dua akun:
   - `11200000001@mahasiswa.perpusdigital.web.id` (login dengan NIM
     `11200000001`)
   - `admin@admin.perpusdigital.web.id` (login dengan username `admin`)
   Gunakan password minimal 8 karakter.
3. Hapus `VITE_DEMO=1` dari `.env.local`, lalu restart dev server.

## Fitur keamanan

- Validasi input login (NIM 8-14 digit; username 3-32 karakter aman;
  password minimal 8 karakter).
- Pembatasan percobaan login: 5 kegagalan dalam 10 menit mengunci login
  selama 5 menit (`src/lib/security.ts`).
- Sesi memakai `browserSessionPersistence` (habis saat tab ditutup).
- Logout otomatis setelah 15 menit tidak ada aktivitas.
- Content-Security-Policy di `index.html`; header keamanan produksi dan
  aturan Firestore default-deny di `firebase.json` + `firestore.rules`.
- Route guard berbasis role; role diturunkan dari domain email akun.

## Catatan

- Data buku/peminjaman masih contoh (in-memory), siap diganti Firestore.
- Font: Plus Jakarta Sans (judul), Inter (teks), JetBrains Mono (kode).
- Referensi desain: folder `referensi-desain/` di akar proyek.
