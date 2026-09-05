import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, BookText, Star, RotateCcw } from "lucide-react";
import {
  EBOOK_LOANS, HISTORY_PHYSICAL, HISTORY_EBOOK, bookById,
} from "@/common/constants/catalog";
import { Badge, RemoteCover, Button, Card, Modal, Progress } from "@/components/ui";
import { useToast } from "@/components/Toast";
import {
  useLibrary, getActiveLoans, submitReview, returnLoan, getReturnedHistory,
} from "@/services/libraryStore";
import { useCurrentStudent } from "@/services/sessionStore";
import { addComment } from "@/services/feedbackStore";
import { useTranslate, type Translate } from "@/services/localeStore";

type Tab = "fisik" | "ebook" | "riwayat";

const LOAN_COLOR = { aktif: "#1a73c8", hampir: "#ea580c", terlambat: "#dc2626" } as const;
const LOAN_BADGE = { aktif: "primary", hampir: "warning", terlambat: "destructive" } as const;
function loanStatusLabel(t: Translate, status: keyof typeof LOAN_COLOR): string {
  if (status === "aktif") return t("pinjaman.statusActive");
  if (status === "hampir") return t("pinjaman.statusAlmostDue");
  return t("pinjaman.statusLate7");
}

function RatingModal({
  title, onSubmit, onClose,
}: {
  title: string;
  onSubmit: (value: number, comment: string) => void;
  onClose: () => void;
}) {
  const t = useTranslate();
  const [stars, setStars] = useState(0);
  const [review, setReview] = useState("");
  return (
    <Modal title={t("pinjaman.rateTitle")} onClose={onClose}>
      <p className="text-lg text-muted-fg">{t("pinjaman.rateQuestion")}</p>
      <p className="mt-3 font-display text-2xl font-bold">"{title}"</p>
      <div className="mt-6 flex justify-center gap-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            onClick={() => setStars(i)}
            className="cursor-pointer transition-transform hover:scale-110"
            aria-label={`${i} ${t("pinjaman.starsAriaSuffix")}`}
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
      <label className="mt-8 block font-display font-semibold">{t("pinjaman.reviewLabel")}</label>
      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        rows={4}
        placeholder={t("pinjaman.reviewPlaceholder")}
        className="mt-2.5 w-full resize-none rounded-xl border border-line px-4 py-3.5 text-[15px] outline-none placeholder:text-muted-fg/70 focus:border-primary"
      />
      <div className="mt-6 grid grid-cols-2 gap-4">
        <Button variant="outline" className="py-3.5" onClick={onClose}>
          {t("action.cancel")}
        </Button>
        <Button
          className="py-3.5"
          disabled={stars === 0}
          onClick={() => onSubmit(stars, review)}
        >
          {t("pinjaman.sendRating")}
        </Button>
      </div>
    </Modal>
  );
}

export default function Pinjaman() {
  const t = useTranslate();
  const [tab, setTab] = useState<Tab>("fisik");
  const [ratingFor, setRatingFor] = useState<{ bookId: string; title: string } | null>(null);
  const [returnFor, setReturnFor] = useState<{ bookId: string; title: string } | null>(null);
  const [returnComment, setReturnComment] = useState("");
  const navigate = useNavigate();
  const { notify } = useToast();
  const lib = useLibrary();
  const student = useCurrentStudent();
  const physicalLoans = getActiveLoans();
  const returnedHistory = getReturnedHistory();

  const tabs: { key: Tab; label: string }[] = [
    { key: "fisik", label: `${t("pinjaman.tabPhysical")} (${physicalLoans.length})` },
    { key: "ebook", label: `${t("pinjaman.tabEbook")} (${EBOOK_LOANS.length})` },
    { key: "riwayat", label: `${t("pinjaman.tabHistory")} (${returnedHistory.length + HISTORY_PHYSICAL.length + HISTORY_EBOOK.length})` },
  ];

  return (
    <div>
      <h1 className="font-display text-[32px] font-bold">{t("nav.loans")}</h1>

      <div className="mt-7 flex gap-2.5">
        {tabs.map((tabItem) => (
          <button
            key={tabItem.key}
            onClick={() => setTab(tabItem.key)}
            className={`cursor-pointer rounded-xl px-6 py-3 font-display text-[15px] font-semibold transition-colors ${
              tab === tabItem.key
                ? "bg-card text-primary shadow-sm"
                : "text-muted-fg hover:bg-muted"
            }`}
          >
            {tabItem.label}
          </button>
        ))}
      </div>

      {tab === "fisik" && (
        <div className="mt-7 space-y-5">
          {physicalLoans.length === 0 && (
            <Card className="p-10 text-center text-muted-fg">
              {t("pinjaman.emptyPhysical")}
            </Card>
          )}
          {physicalLoans.map((loan) => {
            const book = bookById(loan.bookId)!;
            const color = LOAN_COLOR[loan.status];
            const badge = LOAN_BADGE[loan.status];
            return (
              <Card key={loan.bookId} className="p-6">
                <div className="flex items-start gap-5">
                  <RemoteCover title={book.title} author={book.author} initials={book.initials} color={book.color}
                    className="h-[104px] w-[84px] shrink-0 rounded-xl"
                    textClass="text-2xl"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-display text-xl font-bold">{book.title}</h3>
                        <p className="mt-0.5 text-muted-fg">{book.author}</p>
                        <span className="mt-1.5 flex items-center gap-1 text-sm font-semibold text-muted-fg">
                          <Star size={14} fill="#f59e0b" stroke="#f59e0b" /> {book.rating.toFixed(1)}
                        </span>
                      </div>
                      <Badge tone={badge}>{loanStatusLabel(t, loan.status)}</Badge>
                    </div>
                    <div className="mt-4 flex gap-14">
                      <div>
                        <div className="text-[15px] text-muted-fg">{t("pinjaman.borrowDate")}</div>
                        <div className="mt-0.5 font-display font-bold">{loan.borrowDate}</div>
                      </div>
                      <div>
                        <div className="text-[15px] text-muted-fg">{t("pinjaman.returnDate")}</div>
                        <div className="mt-0.5 font-display font-bold" style={{ color }}>
                          {loan.dueDate}
                        </div>
                      </div>
                    </div>
                    <Progress value={loan.progress} color={color} className="mt-4 h-2" />
                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="text-[15px] font-semibold" style={{ color }}>
                        {loan.daysLeft >= 0
                          ? `${loan.daysLeft} ${t("pinjaman.daysRemainingSuffix")}`
                          : `${t("home.latePrefix")} ${-loan.daysLeft} ${t("home.daysSuffix")}`}
                      </span>
                      <button
                        onClick={() => setReturnFor({ bookId: loan.bookId, title: book.title })}
                        className="flex cursor-pointer items-center gap-2 rounded-lg bg-success-light px-4 py-2 text-sm font-semibold text-success hover:bg-[#c6f0d4]"
                      >
                        <RotateCcw size={15} /> {t("action.return")}
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
                  <RemoteCover title={book.title} author={book.author} initials={book.initials} color={book.color}
                    className="h-[104px] w-[84px] shrink-0 rounded-xl"
                    textClass="text-2xl"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-display text-xl font-bold">{book.title}</h3>
                        <p className="mt-0.5 text-muted-fg">{book.author}</p>
                        <span className="mt-1.5 flex items-center gap-1 text-sm font-semibold text-muted-fg">
                          <Star size={14} fill="#f59e0b" stroke="#f59e0b" /> {book.rating.toFixed(1)}
                        </span>
                        <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-accent-light px-3 py-1 text-sm font-semibold text-accent">
                          <BookText size={13} /> {t("pinjaman.copyPrefix")}{loan.copyNumber} {t("pinjaman.ofSuffix")} {book.ebookTotal}
                        </span>
                      </div>
                      <Badge tone="accent">{t("pinjaman.currentlyReading")}</Badge>
                    </div>
                    <div className="mt-4 flex gap-14">
                      <div>
                        <div className="text-[15px] text-muted-fg">{t("pinjaman.borrowedSince")}</div>
                        <div className="mt-0.5 font-display font-bold">{loan.borrowDate}</div>
                      </div>
                      <div>
                        <div className="text-[15px] text-muted-fg">{t("pinjaman.autoReturn")}</div>
                        <div className="mt-0.5 font-display font-bold text-accent">{loan.dueDate}</div>
                      </div>
                      <div>
                        <div className="text-[15px] text-muted-fg">{t("pinjaman.timeLeft")}</div>
                        <div className="mt-0.5 font-display font-bold">{loan.daysLeft} {t("home.daysSuffix")}</div>
                      </div>
                    </div>
                    <Progress value={loan.progress} color="#7c3aed" className="mt-4 h-2" />
                    <button
                      onClick={() => navigate(`/app/baca/${book.id}`)}
                      className="mt-5 cursor-pointer rounded-xl bg-accent px-6 py-3 font-display text-[15px] font-bold text-white hover:bg-accent-dark"
                    >
                      {t("pinjaman.readEbookNow")}
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
                <h2 className="font-display text-xl font-bold">{t("pinjaman.returnedBooks")}</h2>
                <Badge tone="success">{returnedHistory.length} {t("pinjaman.recordsSuffix")}</Badge>
              </div>
              <Card className="mt-4 divide-y divide-line">
                {returnedHistory.map((h) => {
                  const book = bookById(h.bookId);
                  if (!book) return null;
                  return (
                    <div key={`${h.bookId}-${h.returnDate}`} className="flex items-center gap-4 px-6 py-4">
                      <RemoteCover title={book.title} author={book.author} initials={book.initials} color={book.color} className="h-14 w-12 rounded-lg" textClass="text-sm" />
                      <div className="flex-1">
                        <div className="font-display font-bold">{book.title}</div>
                        <div className="text-sm text-muted-fg">{book.author}</div>
                      </div>
                      <div className="text-right text-sm">
                        <div className="text-muted-fg">{t("pinjaman.borrowedPrefix")} {h.borrowDate}</div>
                        <div className="font-semibold text-success">{t("pinjaman.returnedPrefix")} {h.returnDate}</div>
                      </div>
                      <Badge tone="success">{t("pinjaman.done")}</Badge>
                    </div>
                  );
                })}
              </Card>
            </section>
          )}

          <section>
            <div className="flex items-center gap-3">
              <BookOpen size={20} className="text-primary" />
              <h2 className="font-display text-xl font-bold">{t("pinjaman.historyPhysical")}</h2>
              <Badge tone="primary">{HISTORY_PHYSICAL.length} {t("pinjaman.recordsSuffix")}</Badge>
            </div>
            <Card className="mt-4 overflow-hidden">
              {/* Di bawah lg (HP/tablet): kartu bertumpuk, tidak perlu geser
                  horizontal sama sekali. Dari lg ke atas (laptop/TV): tabel
                  biasa, karena lebarnya sudah cukup. */}
              <div className="divide-y divide-line lg:hidden">
                {HISTORY_PHYSICAL.map((h) => {
                  const book = bookById(h.bookId)!;
                  return (
                    <div key={h.bookId} className="flex items-start gap-4 px-5 py-4">
                      <RemoteCover title={book.title} author={book.author} initials={book.initials} color={book.color}
                        className="h-14 w-12 shrink-0 rounded-lg"
                        textClass="text-sm"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-display font-bold">{book.title}</div>
                        <div className="text-sm text-muted-fg">{book.author}</div>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-fg">
                          <span>{t("pinjaman.borrowDate")}: <span className="font-semibold text-fg">{h.borrowDate}</span></span>
                          <span>{t("pinjaman.returnDate")}: <span className="font-semibold text-fg">{h.returnDate}</span></span>
                        </div>
                        <div className="mt-2.5 flex flex-wrap items-center gap-2">
                          {h.status === "dikembalikan" ? (
                            <Badge tone="success">{t("pinjaman.returnedStatus")}</Badge>
                          ) : (
                            <Badge tone="destructive">{t("home.latePrefix")} +{h.lateDays} {t("pinjaman.lateBySuffix")}</Badge>
                          )}
                          {lib.ratings[book.id] ? (
                            <span className="flex items-center gap-1 text-sm font-semibold text-warning">
                              <Star size={15} fill="#f59e0b" stroke="#f59e0b" />
                              {lib.ratings[book.id]}.0
                            </span>
                          ) : (
                            <button
                              onClick={() => setRatingFor({ bookId: book.id, title: book.title })}
                              className="cursor-pointer rounded-lg bg-primary-light px-3 py-1.5 text-sm font-semibold text-primary hover:bg-primary-light-hover"
                            >
                              + {t("pinjaman.addRating")}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[760px] text-left">
                  <thead>
                    <tr className="border-b border-line text-sm uppercase tracking-wider text-muted-fg">
                      <th className="px-6 py-4 font-semibold">{t("pinjaman.colBook")}</th>
                      <th className="px-6 py-4 font-semibold">{t("pinjaman.borrowDate")}</th>
                      <th className="px-6 py-4 font-semibold">{t("pinjaman.returnDate")}</th>
                      <th className="px-6 py-4 font-semibold">{t("pinjaman.colStatus")}</th>
                      <th className="px-6 py-4 font-semibold">{t("pinjaman.colRating")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {HISTORY_PHYSICAL.map((h) => {
                      const book = bookById(h.bookId)!;
                      return (
                        <tr key={h.bookId}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <RemoteCover title={book.title} author={book.author} initials={book.initials} color={book.color}
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
                              <Badge tone="success">{t("pinjaman.returnedStatus")}</Badge>
                            ) : (
                              <Badge tone="destructive">{t("home.latePrefix")} +{h.lateDays} {t("pinjaman.lateBySuffix")}</Badge>
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
                                className="cursor-pointer rounded-lg bg-primary-light px-4 py-2 text-sm font-semibold text-primary hover:bg-primary-light-hover"
                              >
                                + {t("pinjaman.addRating")}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </section>

          <section>
            <div className="flex items-center gap-3">
              <BookText size={20} className="text-accent" />
              <h2 className="font-display text-xl font-bold">{t("pinjaman.historyEbook")}</h2>
              <Badge tone="accent">{HISTORY_EBOOK.length} {t("pinjaman.recordsSuffix")}</Badge>
            </div>
            <Card className="mt-4 overflow-hidden">
              <div className="divide-y divide-line lg:hidden">
                {HISTORY_EBOOK.map((h) => {
                  const book = bookById(h.bookId)!;
                  return (
                    <div key={h.bookId} className="flex items-start gap-4 px-5 py-4">
                      <RemoteCover title={book.title} author={book.author} initials={book.initials} color={book.color}
                        className="h-14 w-12 shrink-0 rounded-lg"
                        textClass="text-sm"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="font-display font-bold">{book.title}</div>
                            <div className="text-sm text-muted-fg">{book.author}</div>
                          </div>
                          <Badge tone="accent" className="shrink-0">
                            <BookText size={12} /> {t("pinjaman.copyPrefix")}{h.copyNumber} {t("pinjaman.ofSuffix")} {h.copyTotal}
                          </Badge>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-fg">
                          <span>{t("pinjaman.borrowDate")}: <span className="font-semibold text-fg">{h.borrowDate}</span></span>
                          <span>{t("pinjaman.colAccessEnds")}: <span className="font-semibold text-fg">{h.endDate}</span></span>
                        </div>
                        <div className="mt-2.5 flex flex-wrap items-center gap-2">
                          {h.status === "selesai" ? (
                            <Badge tone="success">{t("pinjaman.finishedReading")}</Badge>
                          ) : (
                            <Badge tone="muted">{t("pinjaman.expired")}</Badge>
                          )}
                          {lib.ratings[book.id] ? (
                            <span className="flex items-center gap-1 text-sm font-semibold text-warning">
                              <Star size={15} fill="#f59e0b" stroke="#f59e0b" />
                              {lib.ratings[book.id]}.0
                            </span>
                          ) : h.status === "selesai" ? (
                            <button
                              onClick={() => setRatingFor({ bookId: book.id, title: book.title })}
                              className="cursor-pointer rounded-lg bg-accent-light px-3 py-1.5 text-sm font-semibold text-accent hover:bg-[#ddd3fb]"
                            >
                              + {t("pinjaman.addRating")}
                            </button>
                          ) : (
                            <span className="text-muted-fg">-</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[900px] text-left">
                  <thead>
                    <tr className="border-b border-line text-sm uppercase tracking-wider text-muted-fg">
                      <th className="px-6 py-4 font-semibold">{t("pinjaman.colBook")}</th>
                      <th className="px-6 py-4 font-semibold">{t("pinjaman.colCopy")}</th>
                      <th className="px-6 py-4 font-semibold">{t("pinjaman.borrowDate")}</th>
                      <th className="px-6 py-4 font-semibold">{t("pinjaman.colAccessEnds")}</th>
                      <th className="px-6 py-4 font-semibold">{t("pinjaman.colStatus")}</th>
                      <th className="px-6 py-4 font-semibold">{t("pinjaman.colRating")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {HISTORY_EBOOK.map((h) => {
                      const book = bookById(h.bookId)!;
                      return (
                        <tr key={h.bookId}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <RemoteCover title={book.title} author={book.author} initials={book.initials} color={book.color}
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
                              <BookText size={12} /> {t("pinjaman.copyPrefix")}{h.copyNumber} {t("pinjaman.ofSuffix")} {h.copyTotal}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-muted-fg">{h.borrowDate}</td>
                          <td className="px-6 py-4 text-muted-fg">{h.endDate}</td>
                          <td className="px-6 py-4">
                            {h.status === "selesai" ? (
                              <Badge tone="success">{t("pinjaman.finishedReading")}</Badge>
                            ) : (
                              <Badge tone="muted">{t("pinjaman.expired")}</Badge>
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
                                + {t("pinjaman.addRating")}
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
              </div>
            </Card>
          </section>
        </div>
      )}

      {returnFor && (
        <Modal title={t("pinjaman.returnModalTitle")} onClose={() => { setReturnFor(null); setReturnComment(""); }}>
          <p className="text-lg text-muted-fg">{t("pinjaman.returnConfirm")}</p>
          <p className="mt-3 font-display text-2xl font-bold">"{returnFor.title}"</p>
          <p className="mt-3 text-[15px] text-muted-fg">{t("pinjaman.returnNote")}</p>

          <label className="mt-5 block font-display font-semibold">
            {t("pinjaman.returnCommentLabel")}
          </label>
          <textarea
            value={returnComment}
            onChange={(e) => setReturnComment(e.target.value)}
            rows={3}
            placeholder={t("pinjaman.returnCommentPlaceholder")}
            className="mt-2 w-full resize-none rounded-xl border border-line px-4 py-3 text-[15px] outline-none focus:border-primary"
          />

          <div className="mt-6 grid grid-cols-2 gap-4">
            <Button variant="outline" className="py-3.5" onClick={() => { setReturnFor(null); setReturnComment(""); }}>
              {t("action.cancel")}
            </Button>
            <Button
              className="py-3.5"
              onClick={() => {
                returnLoan(returnFor.bookId);
                if (returnComment.trim().length >= 2) {
                  addComment(returnFor.bookId, returnFor.title, {
                    name: student.name,
                    email: student.email || `${student.nim}@mahasiswa.uinjkt.ac.id`,
                    program: student.program,
                    faculty: student.faculty,
                    angkatan: student.angkatan,
                  }, returnComment);
                }
                notify(`"${returnFor.title}" ${t("pinjaman.returnedToastSuffix")}`);
                setReturnFor(null);
                setReturnComment("");
              }}
            >
              {t("pinjaman.confirmReturn")}
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
            notify(`${t("pinjaman.reviewToastPrefix")} ${value} ${t("pinjaman.reviewToastMiddle")} "${ratingFor.title}" ${t("pinjaman.reviewToastSuffix")}`);
            setRatingFor(null);
          }}
          onClose={() => setRatingFor(null)}
        />
      )}
    </div>
  );
}
