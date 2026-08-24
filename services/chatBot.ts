// Balasan otomatis berbasis kata kunci (BUKAN LLM sungguhan — dipilih agar
// gratis dan tidak butuh server/API key yang bisa bocor ke browser). Cukup
// untuk menjawab pertanyaan umum; kalau tidak ada yang cocok, sistem diam
// dan menunggu admin manusia membalas — supaya tidak terkesan "sok tahu".
interface FaqEntry {
  keywords: string[];
  answer: string;
}

const FAQ: FaqEntry[] = [
  {
    keywords: ["jam", "buka", "operasional", "jam berapa", "kapan buka", "tutup"],
    answer:
      "Perpustakaan fisik buka Senin–Jumat 08.00–20.00 dan Sabtu 09.00–15.00 WIB. Untuk akses e-book & sistem online, bisa 24 jam kapan saja.",
  },
  {
    keywords: ["pinjam", "cara pinjam", "reservasi", "booking"],
    answer:
      "Cara pinjam buku fisik: buka menu Cari Buku → pilih buku → klik Reservasi → pilih durasi pinjam → konfirmasi. Buku akan menunggu diambil sesuai jadwal yang kamu pilih.",
  },
  {
    keywords: ["e-book", "ebook", "baca online", "baca di hp", "download buku"],
    answer:
      "Buku dengan label E-book bisa langsung dibaca dari menu Baca tanpa perlu ke perpustakaan. Pengembalian e-book otomatis setelah masa pinjam berakhir, tidak perlu tindakan manual.",
  },
  {
    keywords: ["lupa password", "lupa sandi", "reset password", "reset sandi", "tidak bisa masuk", "gagal masuk"],
    answer:
      "Untuk lupa sandi: klik \"Lupa sandi?\" di halaman masuk untuk kirim tautan reset ke email terdaftar. Kalau email itu tidak bisa diakses, gunakan opsi \"Hubungi Admin\" di modal yang sama.",
  },
  {
    keywords: ["kembalikan", "pengembalian", "denda", "telat", "terlambat"],
    answer:
      "Buku fisik dikembalikan langsung ke perpustakaan sebelum tanggal jatuh tempo. Keterlambatan bisa dikenakan denda sesuai kebijakan kampus — cek detail di menu Pinjaman Saya untuk tanggal jatuh tempo tiap buku.",
  },
  {
    keywords: ["daftar", "cara daftar", "buat akun", "registrasi"],
    answer:
      "Untuk daftar akun baru: klik \"Daftar di sini\" di halaman masuk, isi data lengkap (nama, NIM, fakultas, program studi, email, kata sandi), lalu klik Daftar & Masuk.",
  },
  {
    keywords: ["halo", "hai", "hallo", "permisi", "tanya"],
    answer:
      "Halo! Saya asisten otomatis perpustakaan. Saya bisa bantu jawab pertanyaan umum seputar jam operasional, cara pinjam buku, e-book, atau lupa sandi. Kalau butuh bantuan lebih lanjut, admin manusia akan segera membalas.",
  },
];

/** null = tidak ada yang cocok -> biarkan menunggu admin manusia, jangan asal jawab. */
export function matchFaqAnswer(message: string): string | null {
  const clean = message.toLowerCase();
  for (const entry of FAQ) {
    if (entry.keywords.some((k) => clean.includes(k))) {
      return entry.answer;
    }
  }
  return null;
}
