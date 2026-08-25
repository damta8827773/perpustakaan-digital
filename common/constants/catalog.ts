export type Kategori =
  | "Agama" | "Sains" | "Hukum" | "Teknik" | "Ekonomi"
  | "Bahasa" | "Psikologi" | "Pendidikan" | "Metodologi";

export interface Book {
  id: string;
  initials: string;
  title: string;
  author: string;
  category: Kategori;
  year: number;
  isbn: string;
  color: string;
  rating: number;
  stockTotal: number;
  stockAvailable: number;
  ebookTotal: number;      // 0 = tidak ada e-book
  ebookAvailable: number;
  description: string;
  relatedId?: string;
}

// 12 buku kurasi tangan (dipakai di referensi desain, komentar, dsb).
const CURATED_BOOKS: Book[] = [
  {
    id: "tafsir-al-misbah", initials: "TA", title: "Tafsir Al-Misbah Vol. 1",
    author: "M. Quraish Shihab", category: "Agama", year: 2020, isbn: "978-602-291-4",
    color: "#1a73c8", rating: 4.8, stockTotal: 8, stockAvailable: 5,
    ebookTotal: 0, ebookAvailable: 0,
    description:
      "Karya tafsir monumental yang membahas makna mendalam setiap ayat Al-Qur'an dengan pendekatan kontemporer yang relevan bagi umat Islam masa kini.",
    relatedId: "fiqh-muamalah",
  },
  {
    id: "metode-penelitian", initials: "MP", title: "Metode Penelitian Kualitatif",
    author: "Prof. Dr. Sugiyono", category: "Metodologi", year: 2022, isbn: "978-602-291-1",
    color: "#8b5cf6", rating: 4.6, stockTotal: 5, stockAvailable: 3,
    ebookTotal: 3, ebookAvailable: 2,
    description:
      "Panduan lengkap metodologi penelitian kualitatif untuk mahasiswa dan peneliti, mencakup desain penelitian, pengumpulan data, dan analisis.",
    relatedId: "statistika-terapan",
  },
  {
    id: "hukum-islam", initials: "HI", title: "Hukum Islam di Indonesia",
    author: "Dr. Ahmad Rofiq", category: "Hukum", year: 2021, isbn: "978-602-291-2",
    color: "#dc2626", rating: 4.5, stockTotal: 3, stockAvailable: 0,
    ebookTotal: 0, ebookAvailable: 0,
    description:
      "Kajian komprehensif perkembangan hukum Islam di Indonesia, dari sejarah hingga penerapannya dalam sistem hukum nasional.",
    relatedId: "hukum-tata-negara",
  },
  {
    id: "algoritma-pemrograman", initials: "AP", title: "Algoritma dan Pemrograman",
    author: "Dr. Rinaldi Munir", category: "Teknik", year: 2022, isbn: "978-602-291-5",
    color: "#d97706", rating: 4.4, stockTotal: 6, stockAvailable: 2,
    ebookTotal: 5, ebookAvailable: 0,
    description:
      "Dasar-dasar algoritma dan pemrograman terstruktur dengan contoh implementasi yang mudah dipahami untuk mahasiswa informatika.",
    relatedId: "jaringan-komputer",
  },
  {
    id: "ekonomi-mikro", initials: "EM", title: "Ekonomi Mikro Islam",
    author: "Dr. M. Nur Rianto", category: "Ekonomi", year: 2023, isbn: "978-602-291-3",
    color: "#16a34a", rating: 4.3, stockTotal: 4, stockAvailable: 4,
    ebookTotal: 0, ebookAvailable: 0,
    description:
      "Pengantar teori ekonomi mikro dalam perspektif Islam, membahas perilaku konsumen, produsen, dan mekanisme pasar syariah.",
    relatedId: "fiqh-muamalah",
  },
  {
    id: "bahasa-arab", initials: "BA", title: "Bahasa Arab Tingkat Dasar",
    author: "Dr. Zulhannan", category: "Bahasa", year: 2023, isbn: "978-602-291-7",
    color: "#f59e0b", rating: 4.2, stockTotal: 10, stockAvailable: 7,
    ebookTotal: 0, ebookAvailable: 0,
    description:
      "Materi pembelajaran bahasa Arab untuk pemula dengan metode praktis, dilengkapi latihan percakapan dan tata bahasa dasar.",
    relatedId: "tafsir-al-misbah",
  },
  {
    id: "psikologi-perkembangan", initials: "PP", title: "Psikologi Perkembangan",
    author: "Dr. Elizabeth Hurlock", category: "Psikologi", year: 2021, isbn: "978-602-291-6",
    color: "#ec4899", rating: 4.7, stockTotal: 3, stockAvailable: 1,
    ebookTotal: 2, ebookAvailable: 1,
    description:
      "Teori perkembangan manusia sepanjang rentang kehidupan, dari masa prenatal hingga usia lanjut, dengan pendekatan psikologi modern.",
    relatedId: "sosiologi-pendidikan",
  },
  {
    id: "sosiologi-pendidikan", initials: "SP", title: "Sosiologi Pendidikan",
    author: "Prof. Nasution", category: "Pendidikan", year: 2020, isbn: "978-602-291-8",
    color: "#64748b", rating: 4.1, stockTotal: 2, stockAvailable: 0,
    ebookTotal: 0, ebookAvailable: 0,
    description:
      "Analisis hubungan antara pendidikan dan masyarakat, membahas peran sekolah, keluarga, dan lingkungan dalam proses pendidikan.",
    relatedId: "psikologi-perkembangan",
  },
  {
    id: "fiqh-muamalah", initials: "FM", title: "Fiqh Muamalah Kontemporer",
    author: "Dr. Oni Sahroni", category: "Agama", year: 2022, isbn: "978-602-291-9",
    color: "#0e7490", rating: 4.5, stockTotal: 5, stockAvailable: 3,
    ebookTotal: 0, ebookAvailable: 0,
    description:
      "Pembahasan fiqh muamalah dalam konteks ekonomi dan keuangan modern, termasuk transaksi digital dan perbankan syariah.",
    relatedId: "ekonomi-mikro",
  },
  {
    id: "statistika-terapan", initials: "ST", title: "Statistika Terapan",
    author: "Prof. Sudjana", category: "Sains", year: 2021, isbn: "978-602-292-0",
    color: "#7c3aed", rating: 4.3, stockTotal: 8, stockAvailable: 6,
    ebookTotal: 4, ebookAvailable: 3,
    description:
      "Penerapan metode statistika dalam penelitian ilmu sosial, pendidikan, dan ilmu alam secara praktis.",
    relatedId: "metode-penelitian",
  },
  {
    id: "hukum-tata-negara", initials: "HT", title: "Hukum Tata Negara",
    author: "Prof. Jimly Asshiddiqie", category: "Hukum", year: 2022, isbn: "978-602-292-1",
    color: "#be123c", rating: 4.6, stockTotal: 4, stockAvailable: 2,
    ebookTotal: 0, ebookAvailable: 0,
    description:
      "Konsep dasar hukum tata negara Indonesia, lembaga negara, dan dinamika ketatanegaraan pasca reformasi.",
    relatedId: "hukum-islam",
  },
  {
    id: "jaringan-komputer", initials: "JK", title: "Jaringan Komputer",
    author: "Dr. Forouzan", category: "Teknik", year: 2021, isbn: "978-602-292-2",
    color: "#b45309", rating: 4.4, stockTotal: 6, stockAvailable: 4,
    ebookTotal: 3, ebookAvailable: 0,
    description:
      "Fondasi jaringan komputer modern: model OSI, TCP/IP, routing, hingga keamanan jaringan dengan studi kasus praktis.",
    relatedId: "algoritma-pemrograman",
  },
];

// ---------------------------------------------------------------------------
// Koleksi tambahan (dibangkitkan otomatis, bukan data sungguhan) supaya
// katalog terasa seperti perpustakaan kampus asli dengan ribuan judul —
// bukan direktori 12 buku. Dibuat sekali saat modul dimuat (PRNG dengan
// seed tetap, bukan Math.random) supaya hasilnya stabil di setiap reload,
// bukan berubah-ubah acak.
const TOPIC_WORDS: Record<Kategori, string[]> = {
  Agama: ["Tafsir Al-Qur'an", "Fiqih Ibadah", "Akidah Islam", "Sirah Nabawiyah", "Tasawuf", "Ilmu Hadits", "Ushul Fiqih", "Perbandingan Agama", "Fiqih Muamalah", "Akhlak Tasawuf"],
  Sains: ["Fisika Dasar", "Kimia Organik", "Biologi Sel", "Astronomi", "Matematika Diskrit", "Genetika", "Ekologi", "Biokimia", "Fisika Kuantum", "Ilmu Lingkungan"],
  Hukum: ["Hukum Perdata", "Hukum Pidana", "Hukum Tata Negara", "Hukum Internasional", "Hukum Adat", "Hukum Bisnis", "Hukum Islam", "Hukum Acara", "Hak Asasi Manusia", "Hukum Agraria"],
  Teknik: ["Algoritma Pemrograman", "Jaringan Komputer", "Basis Data", "Kecerdasan Buatan", "Rekayasa Perangkat Lunak", "Elektronika Dasar", "Sistem Operasi", "Keamanan Siber", "Struktur Data", "Pemrograman Web"],
  Ekonomi: ["Ekonomi Makro", "Manajemen Keuangan", "Akuntansi Syariah", "Perbankan Syariah", "Ekonomi Pembangunan", "Manajemen Pemasaran", "Ekonomi Mikro", "Kewirausahaan", "Investasi", "Manajemen SDM"],
  Bahasa: ["Bahasa Arab Lanjutan", "Bahasa Inggris Akademik", "Linguistik Umum", "Sastra Indonesia", "Penerjemahan", "Kajian Wacana", "Semantik", "Bahasa Arab Dasar", "Fonologi", "Sosiolinguistik"],
  Psikologi: ["Psikologi Klinis", "Psikologi Sosial", "Psikologi Pendidikan", "Psikologi Kepribadian", "Psikologi Perkembangan", "Psikologi Industri", "Psikometri", "Psikologi Kognitif"],
  Pendidikan: ["Kurikulum Pendidikan", "Media Pembelajaran", "Evaluasi Pendidikan", "Manajemen Sekolah", "Pendidikan Karakter", "Bimbingan Konseling", "Teknologi Pendidikan", "Sosiologi Pendidikan"],
  Metodologi: ["Metode Penelitian Kualitatif", "Metode Penelitian Kuantitatif", "Statistika Terapan", "Analisis Data", "Penulisan Karya Ilmiah", "Metodologi Studi Islam"],
};
const AUTHOR_TITLES = ["Dr.", "Prof. Dr.", "Dra.", "Ir.", "Dr. Hj.", "Dr. H."];
const FIRST_NAMES = [
  "Ahmad", "Siti", "Muhammad", "Rina", "Budi", "Dewi", "Agus", "Fitri", "Hendra", "Yuni",
  "Rizky", "Nadia", "Bambang", "Sri", "Andi", "Wulan", "Fauzan", "Indah", "Taufik", "Ratna",
];
const LAST_NAMES = [
  "Santoso", "Wijaya", "Pratama", "Rahayu", "Kusuma", "Setiawan", "Nugroho", "Hidayat",
  "Purnomo", "Wibowo", "Suryani", "Gunawan", "Lestari", "Firmansyah", "Handayani", "Saputra",
];
const COLORS = ["#1a73c8", "#8b5cf6", "#dc2626", "#d97706", "#16a34a", "#f59e0b", "#ec4899", "#64748b", "#0891b2", "#7c3aed", "#b45309", "#0d9488"];
const CATEGORY_LIST = Object.keys(TOPIC_WORDS) as Kategori[];

function seededRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateBooks(count: number): Book[] {
  const rand = seededRandom(20260824);
  const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];
  const books: Book[] = [];
  for (let i = 0; i < count; i++) {
    const category = pick(CATEGORY_LIST);
    const topic = pick(TOPIC_WORDS[category]);
    const volume = Math.floor(rand() * 4) + 1;
    const title = volume > 1 ? `${topic} Jilid ${volume}` : topic;
    const author = `${pick(AUTHOR_TITLES)} ${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
    const year = 2014 + Math.floor(rand() * 12);
    const rating = Math.round((3.4 + rand() * 1.6) * 10) / 10;
    const stockTotal = 1 + Math.floor(rand() * 12);
    const stockAvailable = Math.floor(rand() * (stockTotal + 1));
    const hasEbook = rand() > 0.45;
    const ebookTotal = hasEbook ? 1 + Math.floor(rand() * 4) : 0;
    const ebookAvailable = hasEbook ? Math.floor(rand() * (ebookTotal + 1)) : 0;
    const idx = i + 1;
    books.push({
      id: `koleksi-${idx}`,
      initials: title.split(" ").filter((w) => /^[A-Za-z]/.test(w)).slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "BK",
      title: `${title} (Vol. ${idx})`,
      author,
      category,
      year,
      isbn: `978-602-${String(400000 + idx * 7).slice(0, 6)}-${idx % 10}`,
      color: pick(COLORS),
      rating,
      stockTotal,
      stockAvailable,
      ebookTotal,
      ebookAvailable,
      description:
        `Buku referensi ${category.toLowerCase()} yang membahas ${topic.toLowerCase()} secara mendalam, disusun sebagai bahan bacaan pendukung perkuliahan dan penelitian mahasiswa.`,
    });
  }
  return books;
}

export const BOOKS: Book[] = [...CURATED_BOOKS, ...generateBooks(988)];

export const bookById = (id: string) => BOOKS.find((b) => b.id === id);

export type PhysicalLoanStatus = "aktif" | "hampir" | "terlambat";
export interface PhysicalLoan {
  bookId: string;
  borrowDate: string;
  dueDate: string;
  daysLeft: number;      // negatif = terlambat
  status: PhysicalLoanStatus;
  progress: number;      // 0..1 progress masa pinjam
}

export interface EbookLoan {
  bookId: string;
  copyNumber: number;
  borrowDate: string;
  dueDate: string;
  daysLeft: number;
  progress: number;
}

export interface HistoryPhysical {
  bookId: string;
  borrowDate: string;
  returnDate: string;
  status: "dikembalikan" | "terlambat";
  lateDays?: number;
  rated?: boolean;
}

export interface HistoryEbook {
  bookId: string;
  copyNumber: number;
  copyTotal: number;
  borrowDate: string;
  endDate: string;
  status: "selesai" | "kadaluarsa";
}

// Identitas default (dipakai bila belum ada sesi login). Statistik dimulai
// dari 0 dan dihitung dari aktivitas nyata pengguna, bukan angka contoh.
export const STUDENT = {
  name: "Mahasiswa UIN",
  nim: "0000000000",
  faculty: "UIN Jakarta",
  program: "Umum",
  angkatan: "2024",
  email: "",
};

// Data pinjaman & riwayat sengaja KOSONG. Isinya hanya bertambah ketika
// pengguna benar-benar meminjam buku di dalam sistem (lihat libraryStore).
export const PHYSICAL_LOANS: PhysicalLoan[] = [];

export const EBOOK_LOANS: EbookLoan[] = [];

export const HISTORY_PHYSICAL: HistoryPhysical[] = [];

export const HISTORY_EBOOK: HistoryEbook[] = [];

// ---------- Data admin ----------

// Statistik dasar. Jumlah koleksi mengikuti data buku nyata; anggota &
// peminjaman dihitung dari aktivitas nyata di panel admin (lihat Dashboard).
export const ADMIN_STATS = {
  totalCollection: BOOKS.length,
  borrowedToday: 0,
  lateReturns: 0,
  activeMembers: 0,
};

export interface AdminActivity {
  no: number;
  bookTitle: string;
  borrower: string;
  date: string;
  status: "aktif" | "terlambat";
  lateHours?: number;
}

// Tanpa data contoh: aktivitas admin hanya terisi dari peminjaman nyata.
export const ADMIN_ACTIVITIES: AdminActivity[] = [];

export const POPULAR_CATEGORIES = [
  { name: "Agama", count: 340 },
  { name: "Hukum", count: 280 },
  { name: "Ekonomi", count: 220 },
  { name: "Teknik", count: 190 },
  { name: "Bahasa", count: 160 },
];

export interface Member {
  nim: string;
  name: string;
  faculty: string;
  status: "aktif" | "nonaktif";
  activeLoans: number;
  source?: "manual" | "sso";
  program?: string;
  email?: string;
}

// Tanpa anggota contoh: daftar anggota hanya berisi mahasiswa yang benar-benar
// mendaftar lewat SSO, Google, atau formulir pendaftaran.
export const MEMBERS: Member[] = [];

export interface AdminLoan {
  no: number;
  nim: string;
  name: string;
  bookTitle: string;
  borrowDate: string;
  dueDate: string;
  late: boolean;
  status: "aktif" | "terlambat" | "dikembalikan";
}

// Tanpa data contoh: peminjaman admin hanya berisi transaksi nyata.
export const ADMIN_LOANS: AdminLoan[] = [];

export const REPORT = {
  period: "Januari s.d. Juni 2026",
  monthlyLoans: [
    { month: "Jan", value: 128 }, { month: "Feb", value: 148 }, { month: "Mar", value: 138 },
    { month: "Apr", value: 168 }, { month: "Mei", value: 158 }, { month: "Jun", value: 178 },
  ],
  topBooks: [
    { rank: 1, title: "Tafsir Al-Misbah", count: 48 },
    { rank: 2, title: "Metode Penelitian", count: 42 },
    { rank: 3, title: "Hukum Islam", count: 38 },
    { rank: 4, title: "Algoritma & Program", count: 35 },
    { rank: 5, title: "Ekonomi Mikro", count: 30 },
  ],
  punctuality: [
    { label: "Tepat Waktu", value: 75, color: "#16a34a" },
    { label: "Terlambat", value: 20, color: "#dc2626" },
    { label: "Diperpanjang", value: 5, color: "#ea580c" },
  ],
  favoriteCategories: [
    { name: "Agama", value: 320 }, { name: "Hukum", value: 280 }, { name: "Ekonomi", value: 225 },
    { name: "Teknik", value: 190 }, { name: "Bahasa", value: 160 },
  ],
};

