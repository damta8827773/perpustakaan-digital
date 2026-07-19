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

export const BOOKS: Book[] = [
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

export const STUDENT = {
  name: "Ahmad Fauzi",
  nim: "11200000001",
  faculty: "SAINTEK",
  program: "Sistem Informasi",
  totalLoans: 24,
  activeLoans: 3,
  favorites: 12,
  wishlist: 12,
  readHistory: 24,
};

export const PHYSICAL_LOANS: PhysicalLoan[] = [
  { bookId: "tafsir-al-misbah", borrowDate: "10 Jun 2026", dueDate: "24 Jun 2026", daysLeft: 7, status: "aktif", progress: 0.5 },
  { bookId: "algoritma-pemrograman", borrowDate: "05 Jun 2026", dueDate: "19 Jun 2026", daysLeft: 2, status: "hampir", progress: 0.86 },
  { bookId: "metode-penelitian", borrowDate: "01 Jun 2026", dueDate: "10 Jun 2026", daysLeft: -7, status: "terlambat", progress: 1 },
];

export const EBOOK_LOANS: EbookLoan[] = [
  { bookId: "statistika-terapan", copyNumber: 3, borrowDate: "15 Jun 2026", dueDate: "29 Jun 2026", daysLeft: 12, progress: 0.14 },
];

export const HISTORY_PHYSICAL: HistoryPhysical[] = [
  { bookId: "psikologi-perkembangan", borrowDate: "15 Mei 2026", returnDate: "01 Jun 2026", status: "dikembalikan" },
  { bookId: "ekonomi-mikro", borrowDate: "01 Mei 2026", returnDate: "20 Mei 2026", status: "terlambat", lateDays: 3 },
  { bookId: "bahasa-arab", borrowDate: "10 Apr 2026", returnDate: "25 Apr 2026", status: "dikembalikan" },
];

export const HISTORY_EBOOK: HistoryEbook[] = [
  { bookId: "metode-penelitian", copyNumber: 2, copyTotal: 3, borrowDate: "01 Jun 2026", endDate: "15 Jun 2026", status: "selesai" },
  { bookId: "algoritma-pemrograman", copyNumber: 1, copyTotal: 5, borrowDate: "10 Mei 2026", endDate: "24 Mei 2026", status: "selesai" },
  { bookId: "jaringan-komputer", copyNumber: 3, copyTotal: 3, borrowDate: "15 Apr 2026", endDate: "29 Apr 2026", status: "kadaluarsa" },
];

// ---------- Data admin ----------

export const ADMIN_STATS = {
  totalCollection: 2847,
  borrowedToday: 34,
  lateReturns: 8,
  activeMembers: 1204,
};

export interface AdminActivity {
  no: number;
  bookTitle: string;
  borrower: string;
  date: string;
  status: "aktif" | "terlambat";
  lateHours?: number;
}

export const ADMIN_ACTIVITIES: AdminActivity[] = [
  { no: 1, bookTitle: "Metode Penelitian Kualitatif", borrower: "Ahmad Fauzi", date: "10 Jun 2025", status: "aktif" },
  { no: 2, bookTitle: "Tafsir Al-Misbah Vol. 1", borrower: "Siti Aminah", date: "05 Jun 2025", status: "terlambat", lateHours: 2 },
  { no: 3, bookTitle: "Algoritma dan Pemrograman", borrower: "Budi Santoso", date: "12 Jun 2025", status: "aktif" },
  { no: 4, bookTitle: "Hukum Islam di Indonesia", borrower: "Fatimah Zahra", date: "01 Jun 2025", status: "terlambat", lateHours: 5 },
  { no: 5, bookTitle: "Ekonomi Mikro Islam", borrower: "Rizky Maulana", date: "14 Jun 2025", status: "aktif" },
];

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
}

export const MEMBERS: Member[] = [
  { nim: "11200000001", name: "Ahmad Fauzi", faculty: "SAINTEK", status: "aktif", activeLoans: 2 },
  { nim: "11200000002", name: "Siti Aminah", faculty: "SYARIAH", status: "aktif", activeLoans: 1 },
  { nim: "11200000003", name: "Budi Santoso", faculty: "FST", status: "aktif", activeLoans: 1 },
  { nim: "11200000004", name: "Fatimah Zahra", faculty: "SYARIAH", status: "aktif", activeLoans: 0 },
  { nim: "11200000005", name: "Rizky Maulana", faculty: "FEBI", status: "aktif", activeLoans: 1 },
  { nim: "11200000006", name: "Nur Halimah", faculty: "ADAB", status: "nonaktif", activeLoans: 0 },
  { nim: "11200000007", name: "Dimas Prayoga", faculty: "SAINTEK", status: "aktif", activeLoans: 3 },
  { nim: "11200000008", name: "Layla Nurfitri", faculty: "FISIP", status: "aktif", activeLoans: 0 },
];

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

export const ADMIN_LOANS: AdminLoan[] = [
  { no: 1, nim: "11200000001", name: "Ahmad Fauzi", bookTitle: "Metode Penelitian Kualitatif", borrowDate: "10 Jun 2025", dueDate: "24 Jun 2025", late: false, status: "aktif" },
  { no: 2, nim: "11200000002", name: "Siti Aminah", bookTitle: "Tafsir Al-Misbah Vol. 1", borrowDate: "05 Jun 2025", dueDate: "19 Jun 2025", late: true, status: "terlambat" },
  { no: 3, nim: "11200000003", name: "Budi Santoso", bookTitle: "Algoritma dan Pemrograman", borrowDate: "12 Jun 2025", dueDate: "26 Jun 2025", late: false, status: "aktif" },
  { no: 4, nim: "11200000004", name: "Fatimah Zahra", bookTitle: "Hukum Islam di Indonesia", borrowDate: "01 Jun 2025", dueDate: "15 Jun 2025", late: true, status: "terlambat" },
  { no: 5, nim: "11200000005", name: "Rizky Maulana", bookTitle: "Ekonomi Mikro Islam", borrowDate: "14 Jun 2025", dueDate: "28 Jun 2025", late: false, status: "aktif" },
  { no: 6, nim: "11200000006", name: "Nur Halimah", bookTitle: "Bahasa Arab Tingkat Dasar", borrowDate: "08 Jun 2025", dueDate: "22 Jun 2025", late: false, status: "dikembalikan" },
];

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

export const READER_CONTENT = {
  chapter: "Bab Pembuka",
  page: "Halaman 42 dari 180",
  paragraphs: [
    `Bismillahirrahmanirrahim.  Al-Fātiḥah, surat pertama dalam Al-Qur'an, merupakan surat yang sangat istimewa dan sering disebut sebagai "induknya Al-Qur'an" (Umm Al-Qur'an). Surat ini terdiri dari tujuh ayat yang menjadi inti dari seluruh ajaran Islam.  Dalam tafsir ini, kita akan membahas makna mendalam dari setiap ayat Al-Fātiḥah. Setiap kata dipilih dengan sangat cermat untuk menyampaikan pesan ilahi yang sempurna.  Kata "Al-Ḥamdu" yang diterjemahkan sebagai "segala puji" memiliki makna yang sangat luas, mencakup pujian yang sempurna, menyeluruh, dan abadi, hanya milik Allah semata, Tuhan semesta alam.  Sifat "Ar-Raḥmān" dan "Ar-Raḥīm" keduanya berasal dari akar kata "raḥmah" yang berarti kasih sayang. Ar-Raḥmān menunjukkan kasih sayang yang luas mencakup seluruh makhluk, sedangkan Ar-Raḥīm adalah kasih sayang khusus bagi orang-orang beriman.  "Mālik yawm al-dīn" menegaskan bahwa Allah adalah satu-satunya pemilik dan penguasa pada hari pembalasan. Tidak ada kekuasaan lain yang dapat menandingi-Nya.  "Iyyāka na'budu wa iyyāka nasta'īn", hanya kepada-Mu kami menyembah dan hanya kepada-Mu kami meminta pertolongan. Ayat ini menjadi poros seluruh kehidupan seorang Muslim.`,
  ],
};
