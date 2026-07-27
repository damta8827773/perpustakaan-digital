import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, BookText, Star, RotateCcw } from "lucide-react";
import {
  EBOOK_LOANS, HISTORY_PHYSICAL, HISTORY_EBOOK, bookById,
} from "../../lib/data";
import { Badge, BookCover, Button, Card, Modal, Progress } from "../../components/ui";
import { useToast } from "../../components/Toast";
import {
  useLibrary, getActiveLoans, submitReview, returnLoan, getReturnedHistory,
} from "../../lib/libraryStore";
import { useCurrentStudent } from "../../lib/sessionStore";

type Tab = "fisik" | "ebook" | "riwayat";

const LOAN_META = {
  aktif: { color: "#1a73c8", badge: "primary" as const, label: "Aktif" },
  hampir: { color: "#ea580c", badge: "warning" as const, label: "Hampir Jatuh Tempo" },
  terlambat: { color: "#dc2626", badge: "destructive" as const, label: "Terlambat +7 hari" },
};

function RatingModal({
  title, onSubmit, onClose,
}: {
  title: string;
  onSubmit: (value: number, comment: string) => void;
  onClose: () => void;
}) {
  const [stars, setStars] = useState(0);
  const [review, setReview] = useState("");
  return (
    <Modal title="Beri Rating" onClose={onClose}>
      <p className="text-lg text-muted-fg">Bagaimana penilaian Anda untuk buku:</p>
      <p className="mt-3 font-display text-2xl font-bold">"{title}"</p>
      <div className="mt-6 flex justify-center gap-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            onClick={() => setStars(i)}
            className="cursor-pointer transition-transform hover:scale-110"
            aria-label={`${i} bintang`}
          >
            <Star
              size={44}
              fill={i <= stars ? "#f59e0b" : "none"}
              stroke="#f59e0b"
              strokeWidth={1.6}
            />
          </button>
        ))}
      </div>
      <label className="mt-8 block font-display font-semibold">Ulasan (opsional)</label>
      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        rows={4}
        placeholder="Ceritakan pengalaman membaca Anda..."
        className="mt-2.5 w-full resize-none rounded-xl border border-line px-4 py-3.5 text-[15px] outline-none placeholder:text-muted-fg/70 focus:border-primary"
      />
      <div className="mt-6 grid grid-cols-2 gap-4">
        <Button variant="outline" className="py-3.5" onClick={onClose}>
          Batal
        </Button>
        <Button
          className="py-3.5"
          disabled={stars === 0}
          onClick={() => onSubmit(stars, review)}
        >
          Kirim Rating
        </Button>
      </div>
    </Modal>
  );
}

export default function Pinjaman() {
  const [tab, setTab] = useState<Tab>("fisik");
  const [ratingFor, setRatingFor] = useState<{ bookId: string; title: string } | null>(null);
  const [returnFor, setReturnFor] = useState<{ bookId: string; title: string } | null>(null);
  const navigate = useNavigate();
  const { notify } = useToast();
  const lib = useLibrary();
  const student = useCurrentStudent();
  const physicalLoans = getActiveLoans();
  const returnedHistory = getReturnedHistory();

  const tabs: { key: Tab; label: string }[] = [
    { key: "fisik", label: `Buku Fisik (${physicalLoans.length})` },
    { key: "ebook", label: `E-book (${EBOOK_LOANS.length})` },
    { key: "riwayat", label: `Riwayat (${returnedHistory.length + HISTORY_PHYSICAL.length + HISTORY_EBOOK.length})` },
  ];

  return (
    <div>
      <h1 className="font-display text-[32px] font-bold">Pinjaman Saya</h1>

      <div className="mt-7 flex gap-2.5">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`cursor-pointer rounded-xl px-6 py-3 font-display text-[15px] font-semibold transition-colors ${
              tab === t.key
                ? "bg-card text-primary shadow-sm"
                : "text-muted-fg hover:bg-muted"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "fisik" && (
        <div className="mt-7 space-y-5">
          {physicalLoans.length === 0 && (
            <Card className="p-10 text-center text-muted-fg">
              Belum ada buku fisik yang dipinjam. Pinjam buku dari halaman detail
              untuk melihatnya di sini.
            </Card>
          )}
          {physicalLoans.map((loan) => {
            const book = bookById(loan.bookId)!;
            const meta = LOAN_META[loan.status];
            return (
              <Card key={loan.bookId} className="p-6">
                <div className="flex items-start gap-5">
                  <BookCover
                    initials={book.initials}
                    color={book.color}
                    className="h-[104px] w-[84px] shrink-0 rounded-xl"
                    textClass="text-2xl"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-display text-xl font-bold">{book.title}</h3>
                        <p className="mt-0.5 text-muted-fg">{book.author}</p>
                      </div>
                      <Badge tone={meta.badge}>{meta.label}</Badge>
                    </div>
                    <div className="mt-4 flex gap-14">
                      <div>
                        <div className="text-[15px] text-muted-fg">Tanggal Pinjam</div>
                        <div className="mt-0.5 font-display font-bold">{loan.borrowDate}</div>
                      </div>
                      <div>
                        <div className="text-[15px] text-muted-fg">Tanggal Kembali</div>
                        <div className="mt-0.5 font-display font-bold" style={{ color: meta.color }}>
                          {loan.dueDate}
                        </div>
                      </div>
                    </div>
                    <Progress value={loan.progress} color={meta.color} className="mt-4 h-2" />
                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="text-[15px] font-semibold" style={{ color: meta.color }}>
                        {loan.daysLeft >= 0
                          ? `${loan.daysLeft} hari tersisa`
                          : `Terlambat ${-loan.daysLeft} hari`}
                      </span>
                      <button
                        onClick={() => setReturnFor({ bookId: loan.bookId, title: book.title })}
                        className="flex cursor-pointer items-center gap-2 rounded-lg bg-success-light px-4 py-2 text-sm font-semibold text-success hover:bg-[#c6f0d4]"
                      >
                        <RotateCcw size={15} /> Kembalikan
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {tab === "ebook" && (
        <div className="mt-7 space-y-5">
          {EBOOK_LOANS.map((loan) => {
            const book = bookById(loan.bookId)!;
            return (
              <Card key={loan.bookId} className="p-6">
                <div className="flex items-start gap-5">
                  <BookCover
                    initials={book.initials}
                    color={book.color}
                    className="h-[104px] w-[84px] shrink-0 rounded-xl"
                    textClass="text-2xl"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-display text-xl font-bold">{book.title}</h3>
                        <p className="mt-0.5 text-muted-fg">{book.author}</p>
                        <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-accent-light px-3 py-1 text-sm font-semibold text-accent">
                          <BookText size={13} /> Copy #{loan.copyNumber} dari {book.ebookTotal}
                        </span>
                      </div>
                      <Badge tone="accent">Aktif Dibaca</Badge>
                    </div>
                    <div className="mt-4 flex gap-14">
                      <div>
                        <div className="text-[15px] text-muted-fg">Dipinjam sejak</div>
                        <div className="mt-0.5 font-display font-bold">{loan.borrowDate}</div>
                      </div>
                      <div>
                        <div className="text-[15px] text-muted-fg">Otomatis kembali</div>
                        <div className="mt-0.5 font-display font-bold text-accent">{loan.dueDate}</div>
                      </div>
                      <div>
                        <div className="text-[15px] text-muted-fg">Sisa waktu</div>
                        <div className="mt-0.5 font-display font-bold">{loan.daysLeft} hari</div>
                      </div>
                    </div>
                    <Progress value={loan.progress} color="#7c3aed" className="mt-4 h-2" />
                    <button
                      onClick={() => navigate(`/app/baca/${book.id}`)}
                      className="mt-5 cursor-pointer rounded-xl bg-accent px-6 py-3 font-display text-[15px] font-bold text-white hover:bg-accent-dark"
                    >
                      Baca E-book Sekarang
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {tab === "riwayat" && (
        <div className="mt-7 space-y-9">
          {returnedHistory.length > 0 && (
            <section>
              <div className="flex items-center gap-3">
                <RotateCcw size={20} className="text-success" />
                <h2 className="font-display text-xl font-bold">Buku Dikembalikan</h2>
                <Badge tone="success">{returnedHistory.length} catatan</Badge>
              </div>
              <Card className="mt-4 divide-y divide-line">
                {returnedHistory.map((h) => {
                  const book = bookById(h.bookId);
                  if (!book) return null;
                  return (
                    <div key={`${h.bookId}-${h.returnDate}`} className="flex items-center gap-4 px-6 py-4">
                      <BookCover initials={book.initials} color={book.color} className="h-14 w-12 rounded-lg" textClass="text-sm" />
                      <div className="flex-1">
                        <div className="font-display font-bold">{book.title}</div>
                        <div className="text-sm text-muted-fg">{book.author}</div>
                      </div>
                      <div className="text-right text-sm">
                        <div className="text-muted-fg">Dipinjam {h.borrowDate}</div>
                        <div className="font-semibold text-success">Dikembalikan {h.returnDate}</div>
                      </div>
                      <Badge tone="success">Selesai</Badge>
                    </div>
                  );
                })}
              </Card>
            </section>
          )}

          <section>
            <div className="flex items-center gap-3">
              <BookOpen size={20} className="text-primary" />
              <h2 className="font-display text-xl font-bold">Riwayat Buku Fisik</h2>
              <Badge tone="primary">{HISTORY_PHYSICAL.length} catatan</Badge>
            </div>
            <Card className="mt-4 overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-line text-sm uppercase tracking-wider text-muted-fg">
                    <th className="px-6 py-4 font-semibold">Buku</th>
                    <th className="px-6 py-4 font-semibold">Tanggal Pinjam</th>
                    <th className="px-6 py-4 font-semibold">Tanggal Kembali</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {HISTORY_PHYSICAL.map((h) => {
                    const book = bookById(h.bookId)!;
                    return (
                      <tr key={h.bookId}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <BookCover
                              initials={book.initials}
                              color={book.color}
                              className="h-14 w-12 rounded-lg"
                              textClass="text-sm"
                            />
                            <div>
                              <div className="font-display font-bold">{book.title}</div>
                              <div className="text-sm text-muted-fg">{book.author}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-muted-fg">{h.borrowDate}</td>
                        <td className="px-6 py-4 text-muted-fg">{h.returnDate}</td>
                        <td className="px-6 py-4">
                          {h.status === "dikembalikan" ? (
                            <Badge tone="success">Dikembalikan</Badge>
                          ) : (
                            <Badge tone="destructive">Terlambat +{h.lateDays} hari</Badge>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {lib.ratings[book.id] ? (
                            <span className="flex items-center gap-1 text-sm font-semibold text-warning">
                              <Star size={15} fill="#f59e0b" stroke="#f59e0b" />
                              {lib.ratings[book.id]}.0
                            </span>
                          ) : (
                            <button
                              onClick={() => setRatingFor({ bookId: book.id, title: book.title })}
                              className="cursor-pointer rounded-lg bg-primary-light px-4 py-2 text-sm font-semibold text-primary hover:bg-[#d8e8f8]"
                            >
                              + Beri Rating
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
          </section>

          <section>
            <div className="flex items-center gap-3">
              <BookText size={20} className="text-accent" />
              <h2 className="font-display text-xl font-bold">Riwayat E-book</h2>
              <Badge tone="accent">{HISTORY_EBOOK.length} catatan</Badge>
            </div>
            <Card className="mt-4 overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-line text-sm uppercase tracking-wider text-muted-fg">
                    <th className="px-6 py-4 font-semibold">Buku</th>
                    <th className="px-6 py-4 font-semibold">Copy</th>
                    <th className="px-6 py-4 font-semibold">Tanggal Pinjam</th>
                    <th className="px-6 py-4 font-semibold">Akses Berakhir</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {HISTORY_EBOOK.map((h) => {
                    const book = bookById(h.bookId)!;
                    return (
                      <tr key={h.bookId}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <BookCover
                              initials={book.initials}
                              color={book.color}
                              className="h-14 w-12 rounded-lg"
                              textClass="text-sm"
                            />
                            <div>
                              <div className="font-display font-bold">{book.title}</div>
                              <div className="text-sm text-muted-fg">{book.author}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge tone="accent">
                            <BookText size={12} /> Copy #{h.copyNumber} dari {h.copyTotal}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-muted-fg">{h.borrowDate}</td>
                        <td className="px-6 py-4 text-muted-fg">{h.endDate}</td>
                        <td className="px-6 py-4">
                          {h.status === "selesai" ? (
                            <Badge tone="success">Selesai Dibaca</Badge>
                          ) : (
                            <Badge tone="muted">Kadaluarsa</Badge>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {lib.ratings[book.id] ? (
                            <span className="flex items-center gap-1 text-sm font-semibold text-warning">
                              <Star size={15} fill="#f59e0b" stroke="#f59e0b" />
                              {lib.ratings[book.id]}.0
                            </span>
                          ) : h.status === "selesai" ? (
                            <button
                              onClick={() => setRatingFor({ bookId: book.id, title: book.title })}
                              className="cursor-pointer rounded-lg bg-accent-light px-4 py-2 text-sm font-semibold text-accent hover:bg-[#ddd3fb]"
                            >
                              + Beri Rating
                            </button>
                          ) : (
                            <span className="text-muted-fg">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
          </section>
        </div>
      )}

      {returnFor && (
        <Modal title="Kembalikan Buku" onClose={() => setReturnFor(null)}>
          <p className="text-lg text-muted-fg">
            Kembalikan buku berikut ke perpustakaan?
          </p>
          <p className="mt-3 font-display text-2xl font-bold">"{returnFor.title}"</p>
          <p className="mt-3 text-[15px] text-muted-fg">
            Setelah dikembalikan, buku ini pindah ke tab Riwayat dan stoknya
            tersedia kembali untuk peminjam lain.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <Button variant="outline" className="py-3.5" onClick={() => setReturnFor(null)}>
              Batal
            </Button>
            <Button
              className="py-3.5"
              onClick={() => {
                returnLoan(returnFor.bookId);
                notify(`"${returnFor.title}" berhasil dikembalikan.`);
                setReturnFor(null);
              }}
            >
              Ya, Kembalikan
            </Button>
          </div>
        </Modal>
      )}

      {ratingFor && (
        <RatingModal
          title={ratingFor.title}
          onSubmit={(value, comment) => {
            submitReview(ratingFor.bookId, value, comment, {
              name: student.name,
              program: student.program,
              faculty: student.faculty,
              angkatan: student.angkatan,
            });
            notify(`Ulasan ${value} bintang untuk "${ratingFor.title}" terkirim.`);
            setRatingFor(null);
          }}
          onClose={() => setRatingFor(null)}
        />
      )}
    </div>
  );
}
