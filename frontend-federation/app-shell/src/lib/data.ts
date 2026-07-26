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

// Metadata dan isi e-book yang nyata, per judul buku (penerbit, jumlah
// halaman, bab pembuka, dan paragraf yang relevan dengan topik buku).
export interface EbookContent {
  publisher: string;
  pages: number;
  chapter: string;
  paragraphs: string[];
}

export const EBOOK_CONTENT: Record<string, EbookContent> = {
  "metode-penelitian": {
    publisher: "Alfabeta",
    pages: 380,
    chapter: "Bab 1 - Hakikat Penelitian Kualitatif",
    paragraphs: [
      `Penelitian kualitatif adalah metode penelitian yang berlandaskan pada filsafat postpositivisme, digunakan untuk meneliti kondisi objek yang alamiah, di mana peneliti adalah instrumen kunci. Teknik pengumpulan data dilakukan secara triangulasi (gabungan), analisis data bersifat induktif, dan hasil penelitian lebih menekankan makna daripada generalisasi.`,
      `Berbeda dengan pendekatan kuantitatif yang bertolak dari teori menuju data, penelitian kualitatif bertolak dari data lapangan untuk membangun teori. Peneliti terjun langsung ke lapangan, mengamati, mewawancarai, dan mencatat perilaku serta kejadian sebagaimana adanya. Karena itu, kualitas hasil sangat bergantung pada ketekunan, kepekaan, dan kredibilitas peneliti dalam menafsirkan fenomena sosial yang kompleks.`,
    ],
  },
  "algoritma-pemrograman": {
    publisher: "Informatika Bandung",
    pages: 452,
    chapter: "Bab 1 - Konsep Dasar Algoritma",
    paragraphs: [
      `Algoritma adalah urutan langkah-langkah logis penyelesaian masalah yang disusun secara sistematis dan runtut. Sebuah algoritma yang baik harus memiliki masukan (input), keluaran (output), bersifat pasti (definiteness), berhingga (finiteness), dan efektif. Notasi algoritma dapat ditulis dalam bentuk kalimat deskriptif, diagram alir (flowchart), maupun pseudocode.`,
      `Dalam pemrograman terstruktur dikenal tiga struktur dasar: runtunan (sequence), pemilihan (selection), dan pengulangan (repetition). Ketiga struktur inilah yang menjadi fondasi bagi seluruh program, sekompleks apa pun. Menguasai logika penyusunan algoritma jauh lebih penting daripada sekadar menghafal sintaks bahasa pemrograman tertentu, sebab algoritma bersifat universal dan dapat diterjemahkan ke bahasa apa pun.`,
    ],
  },
  "psikologi-perkembangan": {
    publisher: "Erlangga",
    pages: 424,
    chapter: "Bab 1 - Pola Perkembangan Manusia",
    paragraphs: [
      `Perkembangan adalah serangkaian perubahan progresif yang terjadi sebagai akibat dari proses kematangan dan pengalaman. Perkembangan bukan sekadar penambahan tinggi atau berat badan, melainkan proses yang teratur dan berkesinambungan menuju kedewasaan, mencakup aspek fisik, kognitif, emosi, dan sosial.`,
      `Setiap fase kehidupan, mulai dari masa prenatal, bayi, kanak-kanak, remaja, dewasa, hingga usia lanjut, memiliki tugas perkembangan tersendiri. Keberhasilan menuntaskan tugas pada satu fase akan memudahkan penyelesaian tugas pada fase berikutnya, sedangkan kegagalan dapat menimbulkan hambatan yang berpengaruh pada tahap selanjutnya.`,
    ],
  },
  "statistika-terapan": {
    publisher: "Tarsito",
    pages: 508,
    chapter: "Bab 1 - Statistika dan Peranannya",
    paragraphs: [
      `Statistika adalah ilmu yang mempelajari cara mengumpulkan, menyusun, menyajikan, menganalisis, dan menafsirkan data agar dapat diambil kesimpulan yang tepat. Statistika dibagi menjadi dua: statistika deskriptif yang menggambarkan data, dan statistika inferensial yang menarik kesimpulan tentang populasi berdasarkan sampel.`,
      `Data dapat dibedakan menurut skala pengukurannya menjadi nominal, ordinal, interval, dan rasio. Pemahaman terhadap jenis data sangat penting karena menentukan teknik analisis yang boleh digunakan. Penyajian data yang baik melalui tabel distribusi frekuensi maupun grafik akan sangat membantu pembaca memahami pola dan kecenderungan yang terkandung dalam data.`,
    ],
  },
  "jaringan-komputer": {
    publisher: "Salemba Teknika",
    pages: 396,
    chapter: "Bab 1 - Model Referensi OSI",
    paragraphs: [
      `Jaringan komputer adalah kumpulan komputer dan perangkat lain yang saling terhubung untuk berbagi sumber daya dan bertukar data. Agar komunikasi antarperangkat dari vendor berbeda dapat berjalan, dibuatlah model referensi OSI (Open Systems Interconnection) yang membagi proses komunikasi menjadi tujuh lapisan.`,
      `Ketujuh lapisan tersebut adalah Physical, Data Link, Network, Transport, Session, Presentation, dan Application. Masing-masing lapisan memiliki tugas spesifik dan hanya berkomunikasi dengan lapisan di atas dan di bawahnya. Pemodelan berlapis ini memudahkan pemecahan masalah, standarisasi, serta pengembangan teknologi jaringan secara modular.`,
    ],
  },
};

const FALLBACK_CONTENT: EbookContent = {
  publisher: "Penerbit UIN Press",
  pages: 220,
  chapter: "Bab 1 - Pendahuluan",
  paragraphs: [
    `Buku ini membahas pokok-pokok bahasan secara sistematis dan mudah dipahami, dilengkapi contoh dan ilustrasi yang relevan dengan kebutuhan akademik mahasiswa.`,
    `Pada bab pembuka ini diuraikan latar belakang, ruang lingkup, serta tujuan penulisan sehingga pembaca memperoleh gambaran menyeluruh sebelum masuk ke pembahasan yang lebih mendalam pada bab-bab berikutnya.`,
  ],
};

export function ebookContent(bookId: string): EbookContent {
  return EBOOK_CONTENT[bookId] ?? FALLBACK_CONTENT;
}
