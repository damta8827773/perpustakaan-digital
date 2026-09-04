# Proses Update & Deploy

Dokumen ini mencatat **tahap-tahap yang selalu dijalankan** setiap kali ada
perubahan pada sistem ini - besar maupun kecil - supaya prosesnya bisa
diulang sendiri kapan pun tanpa harus mengingat-ingat, dan supaya jelas
kenapa pengguna **tidak pernah melihat sistem dalam kondisi rusak/setengah
jadi** selama proses update berlangsung.

## Kenapa aman - pengguna tetap bisa buka situs saat update besar

Vercel (tempat aplikasi ini di-hosting) bekerja dengan model **deploy
atomik**: setiap kali kode baru di-deploy, Vercel membangun versi baru itu
**di tempat terpisah** dari yang sedang live. Selama proses build berjalan
(beberapa detik sampai menit), pengguna yang membuka situs **masih dilayani
oleh versi LAMA yang lama**, bukan versi yang sedang dibangun. Alamat situs
baru dialihkan ke versi baru **hanya setelah build selesai dan berhasil
penuh** - kalau build gagal, versi lama tetap yang tampil, tidak ada
kondisi "setengah update" yang terlihat pengguna. Ini bukan sesuatu yang
perlu dikonfigurasi manual, itu memang cara kerja Vercel dari awal.

Yang tetap jadi tanggung jawab kita: memastikan **kode yang di-deploy sudah
benar-benar teruji sebelum dikirim**, supaya versi baru yang menggantikan
versi lama itu memang lebih baik, bukan malah rusak. Itulah gunanya
tahap-tahap di bawah.

## Tahap-tahap Setiap Update

### 1. Kerjakan di branch terpisah, bukan langsung ke `main`
```bash
git checkout -b <nama-branch-singkat>
```
`main` selalu dalam kondisi yang sudah teruji - perubahan baru tidak pernah
langsung menimpanya.

### 2. Uji lokal SEBELUM commit apa pun
Tiga pemeriksaan wajib, harus bersih ketiganya:
```bash
npx tsc -b --noEmit     # tidak ada error tipe TypeScript
npx oxlint               # tidak ada pelanggaran aturan kode
npm run build             # build produksi harus sukses tanpa error
```
Untuk perubahan yang menyentuh tampilan atau alur pengguna, dijalankan juga
secara manual di server demo terisolasi (`VITE_DEMO=1`, port berbeda dari
dev server biasa) memakai Puppeteer untuk mengambil screenshot & memeriksa
console error - supaya "lolos compile" tidak disamakan dengan "benar-benar
berfungsi".

### 3. Commit dengan pesan yang jelas, lalu push branch
```bash
git add <file-yang-relevan>
git commit -m "Pesan singkat, alasan perubahan"
git push -u origin <nama-branch>
```

### 4. Buka Pull Request, lalu merge ke `main`
```bash
gh pr create --title "..." --body "..."
gh pr merge <nomor> --squash --delete-branch
git checkout main && git pull --ff-only
```
Pola PR ini dipertahankan supaya ada jejak per-perubahan yang bisa ditinjau
ulang, bukan sekadar riwayat commit yang menumpuk tanpa konteks.

### 5. Deploy ke Vercel lewat CLI (bukan tombol redeploy di web)
```bash
npx vercel --prod --yes
```
CLI ini sudah tersambung ke akun & project Vercel kamu (`perpustakaan-digital-pfv4`)
lewat `vercel link` yang sudah dilakukan sekali. Perintah ini **selalu
mengambil kode TERBARU dari folder lokal** dan membangun versi baru - beda
dengan tombol "Redeploy" di dashboard web yang kadang membangun ulang commit
LAMA (ini yang sempat bikin bingung sebelumnya).

### 6. Verifikasi live - bukan asumsi "harusnya jalan"
```bash
curl -sI https://perpustakaan-digital-pfv4.vercel.app
```
Ditambah pemeriksaan otomatis via Puppeteer ke URL production yang
sesungguhnya: cek tidak ada error konsol, cek konten benar-benar tampil
(bukan halaman kosong), dan untuk perubahan tampilan - screenshot di
beberapa ukuran layar.

## Kalau situs tiba-tiba blank/error setelah deploy manual dari dashboard Vercel

Penyebab yang sudah pernah ditemukan di proyek ini:
1. **Environment Variable kosong/salah nama** - Vite membaca variabel
   `VITE_FIREBASE_*` saat BUILD, bukan saat situs dibuka. Kalau salah satu
   kosong, `firebase.ts` sekarang akan menampilkan pesan jelas ("Konfigurasi
   Firebase belum lengkap") alih-alih halaman putih kosong tanpa petunjuk.
2. **Key dan Value tertukar** saat mengisi form Environment Variables di web
   Vercel - cek dengan `npx vercel env ls production` dari terminal, lebih
   jelas daripada form web.
3. **Redeploy dari dashboard web membangun commit lama** - kalau ragu,
   selalu deploy lewat `npx vercel --prod --yes` dari folder proyek lokal
   yang sudah `git pull` versi terbaru.

## Riwayat Update Besar

| Tanggal | Perubahan | Alasan |
|---|---|---|
| 2026-09-04 | Ekspor laporan PDF/Excel sungguhan (jsPDF + write-excel-file, dynamic import) | Tombol lama menghasilkan file CSV berlabel ekstensi `.pdf`/`.xlsx` yang salah - gagal dibuka di pembaca PDF/Excel asli |
| 2026-09-03 | Perbaikan tampilan responsif (bilah navigasi bawah untuk HP/tablet) | Header portal mahasiswa terpotong di layar sempit |
| 2026-09-03 | Perbaikan konfigurasi Firebase di Vercel + pesan error yang jelas | Variabel lingkungan salah isi menyebabkan halaman putih kosong |
