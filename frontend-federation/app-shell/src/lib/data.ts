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

// Metadata dan isi e-book, per judul buku. Setiap buku memiliki beberapa bab
// dengan naskah yang ditulis ulang secara orisinal agar sesuai judul.
export interface EbookChapter {
  title: string;
  paragraphs: string[];
}

export interface EbookContent {
  publisher: string;
  pages: number;
  chapters: EbookChapter[];
}

export const EBOOK_CONTENT: Record<string, EbookContent> = {
  "metode-penelitian": {
    publisher: "Alfabeta",
    pages: 380,
    chapters: [
      {
        title: "Bab 1: Mengenal Penelitian Kualitatif",
        paragraphs: [
          `Penelitian kualitatif berangkat dari keinginan memahami suatu keadaan apa adanya, bukan mengukurnya dengan angka. Peneliti berusaha masuk ke dalam sudut pandang orang yang ditelitinya, menangkap alasan di balik tindakan, serta memahami makna yang tumbuh dari pengalaman sehari-hari. Karena itu, data yang dikumpulkan lebih banyak berupa kata, cerita, dan catatan pengamatan daripada tabel bilangan.`,
          `Peneliti sendiri menjadi alat utama dalam proses ini. Ia yang mengamati, bertanya, mendengarkan, lalu menimbang setiap keterangan dengan hati-hati. Kualitas hasilnya sangat bergantung pada kepekaan dan kejujuran peneliti ketika berada di lapangan, sebab satu peristiwa yang sama bisa dimaknai berbeda oleh orang yang berbeda.`,
        ],
      },
      {
        title: "Bab 2: Menyusun Fokus dan Pertanyaan",
        paragraphs: [
          `Sebelum turun ke lapangan, peneliti perlu memperjelas apa yang benar-benar ingin ia pahami. Fokus yang terlalu luas membuat pengamatan kehilangan arah, sedangkan fokus yang terlalu sempit dapat menutup kemungkinan menemukan hal baru. Pertanyaan yang baik biasanya diawali dengan kata bagaimana atau mengapa, karena keduanya mengajak peneliti menelusuri proses dan alasan, bukan sekadar jumlah.`,
          `Fokus dalam penelitian kualitatif bersifat lentur. Ketika data awal menunjukkan arah yang tidak terduga, peneliti boleh menyesuaikan pertanyaannya. Sikap terbuka semacam ini justru menjadi kekuatan, sebab kenyataan di lapangan sering kali lebih rumit daripada yang dibayangkan di meja kerja.`,
        ],
      },
      {
        title: "Bab 3: Mengumpulkan dan Menafsirkan Data",
        paragraphs: [
          `Data dikumpulkan melalui wawancara mendalam, pengamatan langsung, dan penelaahan dokumen. Ketiganya saling melengkapi sehingga peneliti dapat memeriksa satu keterangan dari beberapa sisi. Cara memeriksa silang seperti ini membantu mengurangi salah tafsir dan memperkuat keyakinan atas temuan.`,
          `Menafsirkan data berarti menyusun potongan keterangan menjadi gambaran yang utuh dan masuk akal. Peneliti mencari pola, mengelompokkan hal yang serupa, lalu menamai setiap kelompok dengan istilah yang mewakili isinya. Dari langkah inilah lahir pemahaman yang lebih dalam tentang persoalan yang diteliti.`,
        ],
      },
    ],
  },
  "algoritma-pemrograman": {
    publisher: "Informatika Bandung",
    pages: 452,
    chapters: [
      {
        title: "Bab 1: Berpikir Secara Algoritmik",
        paragraphs: [
          `Algoritma adalah cara menyelesaikan persoalan melalui langkah yang tersusun rapi dan jelas urutannya. Sebelum menulis satu baris kode pun, seorang pemrogram sebaiknya lebih dulu memikirkan langkah penyelesaian secara utuh. Kebiasaan berpikir runtut inilah yang membedakan pemrogram yang matang dari sekadar penghafal perintah.`,
          `Sebuah langkah dikatakan baik bila memiliki titik awal yang jelas, menghasilkan keluaran yang diharapkan, dan pasti berhenti setelah sejumlah langkah. Bila salah satu syarat itu tidak terpenuhi, program bisa berjalan tanpa akhir atau memberi hasil yang keliru.`,
        ],
      },
      {
        title: "Bab 2: Struktur Dasar Penyusun Program",
        paragraphs: [
          `Hampir semua program, sederhana maupun rumit, dibangun dari tiga bentuk dasar. Bentuk pertama adalah urutan, yaitu langkah yang dikerjakan satu per satu dari atas ke bawah. Bentuk kedua adalah pemilihan, yaitu keputusan untuk menjalankan langkah tertentu hanya ketika syaratnya terpenuhi.`,
          `Bentuk ketiga adalah pengulangan, yaitu langkah yang dikerjakan berkali-kali selama syarat masih berlaku. Dengan memadukan ketiga bentuk ini, pemrogram dapat menyusun penyelesaian untuk persoalan apa pun. Kuncinya bukan pada banyaknya perintah yang dihafal, melainkan pada ketepatan memilih bentuk yang sesuai.`,
        ],
      },
      {
        title: "Bab 3: Menguji dan Menyempurnakan Solusi",
        paragraphs: [
          `Program yang baru selesai ditulis belum tentu benar. Karena itu, pengujian dilakukan dengan mencoba berbagai masukan, termasuk masukan yang tidak biasa, untuk memastikan keluarannya tetap tepat. Kesalahan yang ditemukan sejak dini jauh lebih mudah diperbaiki daripada yang baru ketahuan setelah program dipakai banyak orang.`,
          `Menyempurnakan program berarti membuatnya lebih ringkas, lebih cepat, dan lebih mudah dibaca tanpa mengubah hasilnya. Kode yang rapi memudahkan orang lain, dan diri sendiri di kemudian hari, untuk memahami serta mengembangkannya.`,
        ],
      },
    ],
  },
  "psikologi-perkembangan": {
    publisher: "Erlangga",
    pages: 424,
    chapters: [
      {
        title: "Bab 1: Memahami Arti Perkembangan",
        paragraphs: [
          `Perkembangan menunjuk pada perubahan yang dialami manusia sepanjang hidupnya, dari saat dikandung hingga usia tua. Perubahan itu tidak hanya terlihat pada tubuh yang bertambah besar, tetapi juga pada cara berpikir, mengelola perasaan, dan menjalin hubungan dengan orang lain. Semuanya berlangsung bertahap dan saling berkaitan.`,
          `Perkembangan berbeda dengan sekadar pertumbuhan. Pertumbuhan menekankan perubahan ukuran yang bisa diukur, sedangkan perkembangan mencakup kematangan yang tidak selalu tampak dari luar. Seorang anak yang belajar menahan keinginannya, misalnya, sedang berkembang meski tinggi badannya tidak berubah.`,
        ],
      },
      {
        title: "Bab 2: Tahap demi Tahap Kehidupan",
        paragraphs: [
          `Para ahli membagi rentang hidup manusia menjadi beberapa tahap agar lebih mudah dipahami. Setiap tahap membawa tugas yang khas, seperti belajar berjalan pada masa bayi, mencari jati diri pada masa remaja, atau menata makna hidup pada usia lanjut. Tugas-tugas ini menjadi penanda kematangan pada masing-masing tahap.`,
          `Keberhasilan menuntaskan tugas di satu tahap biasanya memudahkan seseorang menghadapi tahap berikutnya. Sebaliknya, tugas yang terlewat dapat meninggalkan kesulitan yang terbawa hingga dewasa. Meski begitu, manusia selalu memiliki peluang untuk memperbaiki dan mengejar ketertinggalan.`,
        ],
      },
      {
        title: "Bab 3: Faktor yang Membentuk Perkembangan",
        paragraphs: [
          `Perkembangan seseorang dipengaruhi oleh dua kekuatan besar yang bekerja bersama, yaitu bawaan dan lingkungan. Bawaan diwariskan melalui keturunan, sedangkan lingkungan mencakup keluarga, sekolah, teman, serta budaya tempat seseorang tumbuh. Keduanya tidak berdiri sendiri, melainkan saling memengaruhi.`,
          `Karena lingkungan turut menentukan, perhatian dan kasih sayang di masa kecil memberi dampak yang panjang. Anak yang tumbuh dalam suasana aman cenderung lebih percaya diri, sementara pengalaman yang menekan dapat menghambat perkembangan bila tidak diimbangi dukungan yang cukup.`,
        ],
      },
    ],
  },
  "statistika-terapan": {
    publisher: "Tarsito",
    pages: 508,
    chapters: [
      {
        title: "Bab 1: Peran Statistika dalam Penelitian",
        paragraphs: [
          `Statistika membantu manusia mengambil keputusan ketika berhadapan dengan data yang banyak dan beragam. Dengan cara yang teratur, sekumpulan angka yang semula membingungkan dapat diringkas menjadi keterangan yang mudah dipahami. Kemampuan ini membuat statistika dipakai di hampir semua bidang, dari ilmu sosial hingga ilmu alam.`,
          `Secara umum statistika terbagi menjadi dua bagian. Bagian pertama berusaha menggambarkan keadaan data yang ada, sedangkan bagian kedua berusaha menarik kesimpulan tentang kelompok besar hanya dengan mengamati sebagian kecil darinya. Keduanya sama-sama berguna asalkan digunakan pada tempat yang tepat.`,
        ],
      },
      {
        title: "Bab 2: Mengenal Jenis dan Skala Data",
        paragraphs: [
          `Sebelum data diolah, peneliti perlu mengenali jenisnya terlebih dahulu. Ada data yang berupa keterangan, seperti jenis kelamin atau asal daerah, dan ada data yang berupa angka, seperti tinggi badan atau nilai ujian. Salah mengenali jenis data dapat membuat hasil analisis menjadi keliru.`,
          `Data juga dibedakan menurut tingkatannya, mulai dari yang hanya membedakan, membedakan sekaligus mengurutkan, hingga yang memiliki jarak dan titik nol yang bermakna. Semakin tinggi tingkatannya, semakin banyak cara pengolahan yang boleh diterapkan padanya.`,
        ],
      },
      {
        title: "Bab 3: Membaca Pola melalui Ukuran Pemusatan",
        paragraphs: [
          `Untuk memahami sekumpulan angka, peneliti sering mencari nilai yang mewakili keseluruhannya. Rata-rata menunjukkan titik tengah dari semua nilai, nilai tengah menunjukkan posisi yang membelah data menjadi dua bagian sama banyak, dan modus menunjukkan nilai yang paling sering muncul. Ketiganya memberi gambaran yang berbeda namun saling melengkapi.`,
          `Selain letak titik pusat, sebaran data juga perlu diperhatikan. Data yang mengelompok rapat menunjukkan keseragaman, sedangkan data yang menyebar jauh menunjukkan keragaman yang besar. Dengan membaca keduanya, peneliti memperoleh gambaran yang lebih jujur tentang keadaan sebenarnya.`,
        ],
      },
    ],
  },
  "jaringan-komputer": {
    publisher: "Salemba Teknika",
    pages: 396,
    chapters: [
      {
        title: "Bab 1: Dasar Komunikasi Antarperangkat",
        paragraphs: [
          `Jaringan komputer memungkinkan banyak perangkat saling berbicara dan berbagi berkas, mesin cetak, maupun sambungan internet. Agar percakapan itu berjalan tertib, setiap perangkat menaati sekumpulan aturan yang disepakati bersama. Aturan inilah yang membuat komputer buatan pabrik berbeda tetap dapat bekerja sama.`,
          `Percakapan antarperangkat sebenarnya berupa pertukaran pesan yang dipecah menjadi potongan kecil. Setiap potongan dikirim, diperiksa, lalu disusun kembali di tujuan. Cara ini membuat pengiriman lebih tahan gangguan, karena bila satu potongan rusak, cukup potongan itu saja yang dikirim ulang.`,
        ],
      },
      {
        title: "Bab 2: Model Berlapis dan Fungsinya",
        paragraphs: [
          `Untuk memudahkan pemahaman, proses komunikasi digambarkan sebagai beberapa lapisan yang bertumpuk. Lapisan paling bawah mengurus sinyal dan kabel, sedangkan lapisan paling atas mengurus tampilan yang dilihat pengguna. Setiap lapisan hanya berbicara dengan tetangga di atas dan di bawahnya.`,
          `Pembagian berlapis ini memberi banyak keuntungan. Bila terjadi masalah, teknisi dapat memeriksa satu lapisan tertentu tanpa mengganggu yang lain. Pengembang pun bisa memperbaiki satu bagian tanpa harus membongkar keseluruhan sistem.`,
        ],
      },
      {
        title: "Bab 3: Alamat, Rute, dan Keamanan Jaringan",
        paragraphs: [
          `Agar pesan sampai ke tujuan yang benar, setiap perangkat memiliki alamat yang unik. Ketika pesan melewati banyak persimpangan jaringan, perangkat pengarah memilih jalur terbaik menuju alamat tersebut, mirip petugas yang menunjukkan arah di persimpangan jalan.`,
          `Karena jalur yang dilewati bisa panjang dan terbuka, keamanan menjadi hal yang tidak boleh diabaikan. Pesan penting sebaiknya disandikan agar hanya dapat dibaca oleh pihak yang berhak, dan setiap perangkat perlu memastikan lawan bicaranya benar-benar tepercaya.`,
        ],
      },
    ],
  },
};

const FALLBACK_CONTENT: EbookContent = {
  publisher: "UIN Jakarta Press",
  pages: 220,
  chapters: [
    {
      title: "Bab 1: Pengantar",
      paragraphs: [
        `Buku ini disusun untuk membantu pembaca memahami pokok bahasan secara bertahap. Setiap bab dibuka dengan gambaran umum, dilanjutkan penjelasan yang lebih rinci, lalu ditutup dengan intisari agar mudah diingat.`,
        `Pembaca disarankan mengikuti urutan bab agar pemahaman terbangun secara utuh. Meski demikian, setiap bab juga dirancang cukup mandiri sehingga dapat dibaca sesuai kebutuhan.`,
      ],
    },
  ],
};

export function ebookContent(bookId: string): EbookContent {
  return EBOOK_CONTENT[bookId] ?? FALLBACK_CONTENT;
}
