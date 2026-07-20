<h1 align="center">📚 Perpustakaan Digital - UIN Syarif Hidayatullah Jakarta</h1>

<p align="center">
  <b>Sistem perpustakaan digital modern dengan antarmuka Mahasiswa dan Admin yang terpisah.</b><br/>
  Pinjam buku fisik, baca e-book langsung di peramban, dan kelola koleksi dalam satu platform.
</p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" />
  <img alt="Firebase" src="https://img.shields.io/badge/Firebase-Auth-FFCA28?logo=firebase&logoColor=black" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-green" />
</p>

---

## 📑 Daftar Isi

- [Tentang Proyek](#-tentang-proyek)
- [Fitur Utama](#-fitur-utama)
- [Tangkapan Layar](#-tangkapan-layar)
- [Teknologi](#-teknologi)
- [Arsitektur Repository](#-arsitektur-repository)
- [Prasyarat](#-prasyarat)
- [Memulai](#-memulai)
- [Konfigurasi Firebase](#-konfigurasi-firebase)
- [Integrasi SSO UIN](#-integrasi-sso-uin)
- [Keamanan](#-keamanan)
- [Skrip yang Tersedia](#-skrip-yang-tersedia)
- [Peta Jalan](#-peta-jalan)
- [Lisensi](#-lisensi)
- [Penulis](#-penulis)

---

## 🎯 Tentang Proyek

**Perpustakaan Digital** adalah aplikasi web yang dirancang untuk perpustakaan
kampus UIN Syarif Hidayatullah Jakarta. Aplikasi ini memisahkan pengalaman
**Mahasiswa** dan **Admin** ke dalam dua antarmuka berbeda dengan alamat (URL)
yang terpisah, sehingga masing-masing peran mendapatkan tampilan dan alur kerja
yang sesuai dengan kebutuhannya.

Mahasiswa dapat menelusuri koleksi, mereservasi buku fisik, meminjam salinan
e-book, membaca langsung di peramban, serta memantau tenggat pengembalian.
Admin memperoleh panel kendali penuh untuk mengelola koleksi buku, memproses
peminjaman, memantau anggota, dan menyusun laporan operasional.

> **Catatan akademik:** Antarmuka aplikasi ini mereplikasi rancangan Figma
> "Perpustakaan Digital" dengan tingkat kesesuaian visual yang tinggi.

---

## ✨ Fitur Utama

### 👨‍🎓 Portal Mahasiswa
- **Beranda** dengan koleksi buku, filter kategori, dan ringkasan pinjaman aktif.
- **Pencarian** buku berdasarkan judul, penulis, atau ISBN dengan filter ketersediaan.
- **Detail buku** lengkap dengan rating, stok fisik, dan ketersediaan e-book.
- **Alur reservasi** buku fisik: pemilihan durasi, konfirmasi, hingga bukti peminjaman.
- **Peminjaman e-book** dengan pengembalian otomatis setelah masa pinjam berakhir.
- **Pembaca e-book** bawaan: pengatur ukuran huruf, mode gelap, dan penanda halaman.
- **Pinjaman Saya** dengan tab Buku Fisik, E-book, dan Riwayat.
- **Beri rating** dan ulasan untuk buku yang telah selesai dibaca.
- **Profil** mahasiswa beserta statistik peminjaman.

### 🛠️ Panel Admin
- **Dashboard** dengan statistik ringkas dan aktivitas peminjaman terkini.
- **Koleksi Buku**: tambah, ubah, hapus, cari, dan filter status buku.
- **Peminjaman**: pemantauan transaksi dengan penyaringan status.
- **Data Anggota**: daftar mahasiswa lengkap dengan detail dan penyaringan fakultas.
- **Laporan**: grafik peminjaman bulanan, buku terpopuler, keterlambatan, dan
  kategori favorit, dengan opsi ekspor data.

### 🔐 Autentikasi
- Login mahasiswa menggunakan NIM dan login admin menggunakan username.
- Opsi **Masuk dengan SSO UIN** yang mengarahkan ke portal resmi kampus.
- Pemisahan akses berbasis peran (role) di sisi aplikasi.

---

## 🖼️ Tangkapan Layar

Berkas referensi rancangan tersedia pada direktori [`referensi-desain/`](referensi-desain/).

| Portal Mahasiswa | Panel Admin |
| :---: | :---: |
| Beranda, Pencarian, Detail Buku | Dashboard, Koleksi, Laporan |
| Reservasi, Pembaca E-book, Profil | Peminjaman, Data Anggota |

---

## 🧰 Teknologi

| Kategori | Teknologi |
| --- | --- |
| **Framework** | React 19 |
| **Bahasa** | TypeScript |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS v4 |
| **Routing** | React Router |
| **Autentikasi** | Firebase Authentication |
| **Ikon** | lucide-react |
| **Tipografi** | Plus Jakarta Sans, Inter, JetBrains Mono |

---

## 🗂️ Arsitektur Repository

Repository ini disusun sebagai **monorepo** yang meniru topologi layanan
berskala besar. Aplikasi yang berjalan berada pada `frontend-federation/app-shell`,
sedangkan direktori lain memuat kerangka layanan (service stub) dalam beragam
bahasa sebagai gambaran arsitektur target.

```text
perpustakaan-digital/
├── frontend-federation/
│   ├── app-shell/                 # ⭐ Aplikasi utama (React + Vite) - DIJALANKAN
│   ├── mfe-public-portal/         # Modul micro-frontend mahasiswa
│   ├── mfe-admin-command-center/  # Modul micro-frontend admin
│   └── wasm-drm-renderer/         # Kerangka pembaca e-book (C/C++ ke WebAssembly)
├── hyper-edge/                    # Fungsi edge: WAF, validator JWT, optimizer gambar
├── supergraph-gateway/            # Kerangka GraphQL Federation gateway
├── autonomous-microservices/      # Layanan polyglot (Go, PHP, Python, Rust, dll.)
├── event-nervous-system/          # Kontrak Kafka dan gRPC/Protobuf
├── data-mesh/                     # Skema SQL, vector DB, penyimpanan IPFS
├── platform-engineering/          # Infrastructure as Code: Terraform, Kubernetes, eBPF
└── referensi-desain/              # Berkas referensi rancangan antarmuka
```

### Struktur aplikasi utama

```text
frontend-federation/app-shell/src/
├── components/     # Komponen bersama (UI, Toast, header, hitung angka)
├── lib/            # Firebase, autentikasi, keamanan, data, SSO, penyimpanan
├── pages/
│   ├── user/       # Halaman portal mahasiswa
│   └── admin/      # Halaman panel admin
├── App.tsx         # Definisi rute dan penjaga akses (route guard)
└── main.tsx        # Titik masuk aplikasi
```

---

## ✅ Prasyarat

- **Node.js** versi 20 atau lebih baru
- **npm** versi 10 atau lebih baru
- Sebuah proyek **Firebase** (untuk mengaktifkan autentikasi sungguhan)

---

## 🚀 Memulai

**1. Klon repository**

```bash
git clone https://github.com/damta8827773/perpustakaan-digital.git
cd perpustakaan-digital/frontend-federation/app-shell
```

**2. Pasang dependensi**

```bash
npm install
```

**3. Siapkan variabel lingkungan**

```bash
cp .env.example .env.local
```

Buka `.env.local` lalu isi kredensial Firebase Anda. Untuk sekadar melihat
tampilan tanpa autentikasi, cukup biarkan `VITE_DEMO=1`.

**4. Jalankan server pengembangan**

```bash
npm run dev
```

Buka alamat yang ditampilkan (biasanya `http://localhost:5173`).

**5. Bangun untuk produksi**

```bash
npm run build
npm run preview
```

### Peta Rute

| Rute | Deskripsi |
| --- | --- |
| `/` | Halaman utama pemilihan peran |
| `/login` | Login mahasiswa |
| `/admin/login` | Login admin |
| `/app` | Beranda mahasiswa |
| `/admin` | Dashboard admin |

---

## 🔥 Konfigurasi Firebase

1. Buat proyek pada [Firebase Console](https://console.firebase.google.com/).
2. Aktifkan **Authentication → Sign-in method → Email/Password**.
3. Salin kredensial Web App ke berkas `.env.local`:

   ```env
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```

4. Buat akun uji pada tab **Users**:
   - Mahasiswa: `<nim>@mahasiswa.perpusdigital.web.id`
   - Admin: `<username>@admin.perpusdigital.web.id`
5. Hapus baris `VITE_DEMO=1` untuk mengaktifkan login sungguhan.

> ⚠️ Berkas `.env.local` sudah tercantum dalam `.gitignore` dan **tidak akan
> pernah** terunggah ke repository.

---

## 🎓 Integrasi SSO UIN

Tombol **Masuk dengan SSO UIN** mengarahkan pengguna ke portal resmi
`e-semesta.uinjkt.ac.id`. Konfigurasi mode berada pada
`src/lib/sso.ts` melalui `SSO_MODE`:

| Mode | Perilaku |
| --- | --- |
| `portal-uin` | Membuka portal SSO UIN yang asli (mode saat ini) |
| `oidc` | Alur OIDC/CAS resmi (aktif setelah aplikasi terdaftar) |
| `simulasi` | Alur simulasi untuk pengembangan |

> Integrasi login otomatis penuh membutuhkan pendaftaran aplikasi secara resmi
> ke pengelola SSO kampus (PTIPD UIN) untuk memperoleh `client_id` dan endpoint.
> Penukaran token wajib dilakukan di sisi server, bukan di peramban.

---

## 🛡️ Keamanan

Praktik keamanan yang diterapkan pada aplikasi:

- **Rahasia berbasis lingkungan** - seluruh kredensial dibaca dari `.env.local`
  yang tidak pernah di-commit.
- **Validasi input** - pemeriksaan format NIM, username, dan panjang kata sandi.
- **Pembatasan percobaan login** - penguncian sementara setelah beberapa kali gagal.
- **Logout otomatis** - sesi berakhir ketika pengguna tidak aktif.
- **Persistensi sesi terbatas** - sesi hanya bertahan selama tab peramban terbuka.
- **Pemisahan peran** - penjaga rute memisahkan area mahasiswa dan admin.

Rincian selengkapnya tersedia pada berkas [`SECURITY.md`](SECURITY.md).

---

## 📜 Skrip yang Tersedia

Dijalankan dari `frontend-federation/app-shell`:

| Perintah | Keterangan |
| --- | --- |
| `npm run dev` | Menjalankan server pengembangan |
| `npm run build` | Membangun berkas produksi ke `dist/` |
| `npm run preview` | Meninjau hasil build produksi secara lokal |

---

## 🗺️ Peta Jalan

- [ ] Menghubungkan koleksi dan peminjaman ke Cloud Firestore.
- [ ] Penyimpanan berkas e-book pada Firebase Storage.
- [ ] Integrasi SSO OIDC/CAS resmi dengan penukaran token di sisi server.
- [ ] Notifikasi tenggat pengembalian secara otomatis.
- [ ] Ekspor laporan ke format PDF dan Excel yang sesungguhnya.

---

## 📄 Lisensi

Proyek ini dirilis di bawah **Lisensi MIT**. Lihat berkas [`LICENSE`](LICENSE)
untuk keterangan selengkapnya.

---

## 👤 Penulis

**damta8827773**

- GitHub: [@damta8827773](https://github.com/damta8827773)

---

<p align="center">
  Dibuat untuk UIN Syarif Hidayatullah Jakarta.<br/>
  Jika proyek ini bermanfaat, berikan ⭐ pada repository ini.
</p>
