// Balasan otomatis berbasis kata kunci (BUKAN LLM sungguhan - dipilih agar
// gratis dan tidak butuh server/API key yang bisa bocor ke browser). Kalau
// topiknya dikenali di sini, AI menjawab spesifik; kalau tidak, chatStore.ts
// tetap mengirim pengakuan umum (bukan diam) supaya mahasiswa tahu pesannya
// diterima, sambil menunggu admin manusia menindaklanjuti.
//
// Kata kunci pencocokan sengaja tetap Bahasa Indonesia (mahasiswa realistis
// mengetik dalam bahasanya sendiri apa pun bahasa antarmuka yang dipilih),
// tapi ISI JAWABAN mengikuti bahasa aktif supaya tidak tercampur dengan sisa
// UI yang sudah diterjemahkan.
import type { Locale } from "@/i18n";

interface FaqEntry {
  keywords: string[];
  answer: Record<Locale, string>;
}

const FAQ: FaqEntry[] = [
  {
    keywords: ["jam", "buka", "operasional", "jam berapa", "kapan buka", "tutup"],
    answer: {
      id: "Perpustakaan fisik buka Senin–Jumat 08.00–20.00 dan Sabtu 09.00–15.00 WIB. Untuk akses e-book & sistem online, bisa 24 jam kapan saja.",
      en: "The physical library is open Mon–Fri 8:00 AM–8:00 PM and Sat 9:00 AM–3:00 PM (Jakarta time). E-book access and the online system are available 24/7.",
      ar: "المكتبة الفعلية مفتوحة من الإثنين إلى الجمعة من 08:00 إلى 20:00 والسبت من 09:00 إلى 15:00 (بتوقيت جاكرتا). الوصول إلى الكتب الإلكترونية والنظام عبر الإنترنت متاح على مدار الساعة.",
    },
  },
  {
    keywords: ["pinjam", "cara pinjam", "reservasi", "booking"],
    answer: {
      id: "Cara pinjam buku fisik: buka menu Cari Buku → pilih buku → klik Reservasi → pilih durasi pinjam → konfirmasi. Buku akan menunggu diambil sesuai jadwal yang kamu pilih.",
      en: "To borrow a physical book: open Search Books → pick a book → click Reserve → choose a borrowing duration → confirm. The book will be held for pickup on your chosen schedule.",
      ar: "لاستعارة كتاب ورقي: افتح البحث عن الكتب ← اختر كتابًا ← اضغط على حجز ← اختر مدة الاستعارة ← أكّد. سيُحتفظ بالكتاب لاستلامه في الموعد الذي اخترته.",
    },
  },
  {
    keywords: ["e-book", "ebook", "baca online", "baca di hp", "download buku"],
    answer: {
      id: "Buku dengan label E-book bisa langsung dibaca dari menu Baca tanpa perlu ke perpustakaan. Pengembalian e-book otomatis setelah masa pinjam berakhir, tidak perlu tindakan manual.",
      en: "Books labeled E-book can be read directly from the Read menu without visiting the library. E-books are returned automatically once the loan period ends - no manual action needed.",
      ar: "يمكن قراءة الكتب المصنّفة ككتب إلكترونية مباشرة من قائمة القراءة دون زيارة المكتبة. تُعاد الكتب الإلكترونية تلقائيًا بعد انتهاء مدة الاستعارة، دون الحاجة إلى أي إجراء يدوي.",
    },
  },
  {
    keywords: ["lupa password", "lupa sandi", "reset password", "reset sandi", "tidak bisa masuk", "gagal masuk"],
    answer: {
      id: "Untuk lupa sandi: klik \"Lupa sandi?\" di halaman masuk untuk kirim tautan reset ke email terdaftar. Kalau email itu tidak bisa diakses, gunakan opsi \"Hubungi Admin\" di modal yang sama.",
      en: "Forgot your password? Click \"Forgot password?\" on the sign-in page to send a reset link to your registered email. If you can't access that email, use the \"Contact Admin\" option in the same dialog.",
      ar: "نسيت كلمة المرور؟ اضغط على \"نسيت كلمة المرور؟\" في صفحة تسجيل الدخول لإرسال رابط إعادة التعيين إلى بريدك المسجّل. إذا تعذّر الوصول إلى ذلك البريد، استخدم خيار \"تواصل مع الإدارة\" في نفس النافذة.",
    },
  },
  {
    keywords: ["kembalikan", "pengembalian", "denda", "telat", "terlambat"],
    answer: {
      id: "Buku fisik dikembalikan langsung ke perpustakaan sebelum tanggal jatuh tempo. Keterlambatan bisa dikenakan denda sesuai kebijakan kampus - cek detail di menu Pinjaman Saya untuk tanggal jatuh tempo tiap buku.",
      en: "Physical books are returned directly to the library before the due date. Late returns may incur a fine per campus policy - check My Loans for each book's due date.",
      ar: "تُعاد الكتب الورقية مباشرة إلى المكتبة قبل تاريخ الاستحقاق. قد يترتب على التأخير غرامة وفقًا لسياسة الجامعة - راجع استعاراتي لمعرفة تاريخ استحقاق كل كتاب.",
    },
  },
  {
    keywords: ["daftar", "cara daftar", "buat akun", "registrasi"],
    answer: {
      id: "Untuk daftar akun baru: klik \"Daftar di sini\" di halaman masuk, isi data lengkap (nama, NIM, fakultas, program studi, email, kata sandi), lalu klik Daftar & Masuk.",
      en: "To create a new account: click \"Register here\" on the sign-in page, fill in your details (name, NIM, faculty, study program, email, password), then click Register & Sign In.",
      ar: "لإنشاء حساب جديد: اضغط على \"سجّل هنا\" في صفحة تسجيل الدخول، واملأ بياناتك (الاسم، الرقم الجامعي، الكلية، البرنامج الدراسي، البريد الإلكتروني، كلمة المرور)، ثم اضغط على تسجيل ودخول.",
    },
  },
  {
    keywords: ["halo", "hai", "hallo", "permisi", "tanya"],
    answer: {
      id: "Halo! Saya asisten otomatis perpustakaan. Saya bisa bantu jawab pertanyaan umum seputar jam operasional, cara pinjam buku, e-book, atau lupa sandi. Kalau butuh bantuan lebih lanjut, admin manusia akan segera membalas.",
      en: "Hello! I'm the library's automatic assistant. I can help answer common questions about opening hours, how to borrow books, e-books, or password resets. For anything more specific, a human admin will reply shortly.",
      ar: "مرحبًا! أنا المساعد الآلي للمكتبة. يمكنني الإجابة عن الأسئلة الشائعة حول أوقات الدوام، وطريقة استعارة الكتب، والكتب الإلكترونية، أو إعادة تعيين كلمة المرور. لأي أمر أكثر تحديدًا، سيردّ عليك إداري حقيقي قريبًا.",
    },
  },
  {
    keywords: ["perpanjang", "extend", "tambah waktu pinjam"],
    answer: {
      id: "Perpanjangan pinjaman bisa dilakukan dari menu Pinjaman Saya (atau kartu Pinjaman Aktif di Beranda) selama buku belum dipesan mahasiswa lain, biasanya menambah masa pinjam 7 hari.",
      en: "You can extend a loan from My Loans (or the Active Loan card on Home) as long as no other student has reserved the book - it usually adds 7 more days.",
      ar: "يمكنك تمديد الاستعارة من قائمة استعاراتي (أو بطاقة الاستعارة النشطة في الرئيسية) طالما لم يحجز طالب آخر الكتاب - وعادة ما يضيف 7 أيام إضافية.",
    },
  },
  {
    keywords: ["error", "eror", "bug", "gangguan", "rusak", "tidak berfungsi", "gagal terus", "loading terus"],
    answer: {
      id: "Mohon maaf atas kendalanya. Bisa dijelaskan lebih detail halaman mana dan apa yang terjadi saat error muncul? Admin perpustakaan akan segera memeriksa laporan ini.",
      en: "Sorry for the trouble. Could you describe in more detail which page and what happens when the error occurs? The library admin will look into this report shortly.",
      ar: "نعتذر عن الإزعاج. هل يمكنك توضيح الصفحة وما الذي يحدث بالتحديد عند ظهور الخطأ؟ سيراجع إداري المكتبة هذا البلاغ قريبًا.",
    },
  },
  {
    keywords: ["biaya", "gratis", "bayar", "berbayar", "harga"],
    answer: {
      id: "Layanan Perpustakaan Digital ini gratis untuk seluruh mahasiswa terdaftar. Denda hanya berlaku untuk keterlambatan pengembalian buku fisik sesuai kebijakan kampus.",
      en: "This Digital Library service is free for all registered students. Fines only apply to late returns of physical books, per campus policy.",
      ar: "خدمة المكتبة الرقمية هذه مجانية لجميع الطلاب المسجّلين. تُطبَّق الغرامات فقط على تأخير إرجاع الكتب الورقية وفقًا لسياسة الجامعة.",
    },
  },
  {
    keywords: ["wishlist", "favorit", "simpan buku"],
    answer: {
      id: "Klik ikon hati/favorit pada halaman detail buku untuk menyimpannya ke Wishlist - bisa dilihat lagi lewat menu Profil → Wishlist Saya.",
      en: "Click the heart/favorite icon on a book's detail page to save it to your Wishlist - you can view it again from Profile → My Wishlist.",
      ar: "اضغط على أيقونة القلب/المفضلة في صفحة تفاصيل الكتاب لحفظه في قائمة الأمنيات - يمكنك مشاهدته لاحقًا من الملف الشخصي ← قائمة أمنياتي.",
    },
  },
  {
    keywords: ["rating", "ulasan", "review", "beri nilai"],
    answer: {
      id: "Setelah buku selesai dipinjam/dibaca, kamu bisa memberi rating dan ulasan lewat menu Pinjaman Saya → tab Riwayat, pada buku yang bersangkutan.",
      en: "After you've finished borrowing/reading a book, you can rate and review it from My Loans → History tab, on that specific book.",
      ar: "بعد الانتهاء من استعارة/قراءة كتاب، يمكنك تقييمه وكتابة مراجعة له من استعاراتي ← تبويب السجل، عند ذلك الكتاب.",
    },
  },
  {
    keywords: ["terima kasih", "makasih", "thanks", "oke", "baik"],
    answer: {
      id: "Sama-sama! Kalau ada pertanyaan lain seputar perpustakaan, silakan tanyakan lagi ya.",
      en: "You're welcome! If you have any other questions about the library, feel free to ask again.",
      ar: "على الرحب والسعة! إذا كان لديك أي سؤال آخر عن المكتبة، لا تتردد في السؤال مرة أخرى.",
    },
  },
];

/** null = tidak ada yang cocok -> biarkan menunggu admin manusia, jangan asal jawab. */
export function matchFaqAnswer(message: string, locale: Locale): string | null {
  const clean = message.toLowerCase();
  for (const entry of FAQ) {
    if (entry.keywords.some((k) => clean.includes(k))) {
      return entry.answer[locale];
    }
  }
  return null;
}
