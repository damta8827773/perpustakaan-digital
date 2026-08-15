# Kebijakan Keamanan

## Lapisan yang sudah diterapkan

1. Autentikasi (app-shell)
   - Firebase Auth dengan persistensi sesi per-tab
     (`browserSessionPersistence`).
   - Validasi input ketat sebelum request: NIM 8-14 digit, username
     3-32 karakter alfanumerik, password minimal 8 karakter.
   - Anti brute-force: 5 kegagalan dalam 10 menit mengunci login 5 menit.
   - Logout otomatis setelah 15 menit idle.
   - Route guard berbasis role (student/admin) dari domain email.
   - Akses panel admin dibatasi allowlist email (`VITE_ADMIN_EMAILS`) dan
     hanya menerima login melalui akun Google terverifikasi, sehingga akses
     tidak dapat dipalsukan hanya dengan menebak alamat email.

2. Browser hardening
   - Content-Security-Policy (meta di `index.html`, header penuh di
     `firebase.json` untuk produksi, termasuk `frame-ancestors 'none'`).
   - `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`,
     `Strict-Transport-Security`, `Referrer-Policy`, `Permissions-Policy`.

3. Data
   - `firestore.rules`: default tolak semua; buku hanya bisa ditulis admin;
     data pinjaman hanya bisa dibaca pemiliknya atau admin.

4. Data pihak ketiga
   - Sampul dan metadata buku diambil dari Google Books API (`services/googleBooks.ts`)
     melalui permintaan `GET` publik tanpa mengirim kredensial apa pun.
   - Hasil pencarian disaring (hanya field teks/URL gambar yang dipakai) dan
     selalu punya jalur cadangan (sampul warna) bila permintaan gagal.

## Hal yang harus dijaga manual

- Jangan menyimpan token/secret di repo. Token API (Figma, dsb.) yang pernah
  tertulis di `CLAUDE.MD` harus dicabut dan dihapus.
- API key Firebase sisi klien memang publik; keamanan data bergantung pada
  Security Rules, bukan pada kerahasiaan key.
- Aktifkan App Check dan verifikasi email pada tahap produksi.

## Melaporkan celah

Laporkan temuan keamanan secara privat melalui **GitHub Security Advisory**
pada repository ini, atau buka **issue** dengan label `security`.
