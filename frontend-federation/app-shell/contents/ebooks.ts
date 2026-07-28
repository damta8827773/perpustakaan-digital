// Konten e-book: naskah tiap bab dan daftar pustaka, dipisahkan dari
// katalog agar mudah dirawat (menyerupai folder contents pada portofolio).
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

// Daftar pustaka setiap e-book, ditampilkan sebagai bagian penutup buku.
export const EBOOK_REFERENCES: Record<string, string[]> = {
  "metode-penelitian": [
    "Sugiyono. (2022). Metode Penelitian Kualitatif. Bandung: Alfabeta.",
    "Creswell, J. W. (2016). Research Design: Pendekatan Kualitatif, Kuantitatif, dan Campuran. Yogyakarta: Pustaka Pelajar.",
    "Moleong, L. J. (2019). Metodologi Penelitian Kualitatif. Bandung: Remaja Rosdakarya.",
    "Miles, M. B., & Huberman, A. M. (2014). Analisis Data Kualitatif. Jakarta: UI Press.",
    "Bogdan, R., & Biklen, S. K. (2007). Qualitative Research for Education. Boston: Pearson.",
  ],
  "algoritma-pemrograman": [
    "Munir, R. (2022). Algoritma dan Pemrograman dalam Bahasa Pascal, C, dan C++. Bandung: Informatika.",
    "Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). Introduction to Algorithms. Cambridge: MIT Press.",
    "Knuth, D. E. (1997). The Art of Computer Programming. Boston: Addison-Wesley.",
    "Sedgewick, R., & Wayne, K. (2011). Algorithms. Boston: Addison-Wesley.",
    "Liem, I. (2007). Diktat Dasar Pemrograman. Bandung: Institut Teknologi Bandung.",
  ],
  "psikologi-perkembangan": [
    "Hurlock, E. B. (2021). Psikologi Perkembangan: Suatu Pendekatan Sepanjang Rentang Kehidupan. Jakarta: Erlangga.",
    "Santrock, J. W. (2011). Life-Span Development. Jakarta: Erlangga.",
    "Papalia, D. E., & Feldman, R. D. (2014). Menyelami Perkembangan Manusia. Jakarta: Salemba Humanika.",
    "Desmita. (2017). Psikologi Perkembangan Peserta Didik. Bandung: Remaja Rosdakarya.",
    "Monks, F. J., Knoers, A. M. P., & Haditono, S. R. (2006). Psikologi Perkembangan. Yogyakarta: Gadjah Mada University Press.",
  ],
  "statistika-terapan": [
    "Sudjana. (2021). Metode Statistika. Bandung: Tarsito.",
    "Walpole, R. E. (2012). Pengantar Statistika. Jakarta: Gramedia Pustaka Utama.",
    "Riduwan. (2015). Dasar-Dasar Statistika. Bandung: Alfabeta.",
    "Supranto, J. (2008). Statistik: Teori dan Aplikasi. Jakarta: Erlangga.",
    "Spiegel, M. R., & Stephens, L. J. (2007). Statistik. Jakarta: Erlangga.",
  ],
  "jaringan-komputer": [
    "Forouzan, B. A. (2021). Data Communications and Networking. New York: McGraw-Hill.",
    "Tanenbaum, A. S., & Wetherall, D. J. (2011). Computer Networks. Boston: Pearson.",
    "Stallings, W. (2017). Komunikasi Data dan Komputer. Jakarta: Salemba Teknika.",
    "Sofana, I. (2017). Jaringan Komputer Berbasis Mikrotik. Bandung: Informatika.",
    "Kurose, J. F., & Ross, K. W. (2017). Computer Networking: A Top-Down Approach. Boston: Pearson.",
  ],
};

const FALLBACK_REFERENCES: string[] = [
  "Tim Penyusun. (2024). Pengantar Ilmu Pengetahuan. Jakarta: UIN Jakarta Press.",
];

export function ebookReferences(bookId: string): string[] {
  return EBOOK_REFERENCES[bookId] ?? FALLBACK_REFERENCES;
}
