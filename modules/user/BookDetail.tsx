import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Bookmark, BookText, CheckCircle2, Check } from "lucide-react";
import { bookById } from "@/common/constants/catalog";
import { RemoteCover, Button, Card, Modal, Stars } from "@/components/ui";
import { useToast } from "@/components/Toast";
import { useLibrary, toggleWishlist, reviewsFor } from "@/services/libraryStore";
import { ReviewModal } from "@/components/ReviewModal";
import { BookFeedback } from "@/components/BookFeedback";
import {
  useWaitlist, entryFor, joinWaitlist, leaveWaitlist,
  predictedAvailability, formatDate,
} from "@/services/waitlistStore";
import type { Book } from "@/common/constants/catalog";
import { Sparkles, BellRing, Users2 } from "lucide-react";
import { useTranslate } from "@/services/localeStore";

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notify } = useToast();
  const lib = useLibrary();
  const book = bookById(id ?? "");
  const t = useTranslate();
  const [showEbookModal, setShowEbookModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showReview, setShowReview] = useState(false);

  if (!book) return <p>{t("bookdetail.notFound")}</p>;
  const wishlisted = lib.wishlist.includes(book.id);
  const reviews = reviewsFor(book.id);
  const related = book.relatedId ? bookById(book.relatedId) : undefined;

  return (
    <div>
      <Link
        to="/app"
        className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
      >
        <ArrowLeft size={18} /> {t("bookdetail.back")}
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[340px_1fr]">
        <div>
          <RemoteCover title={book.title} author={book.author} initials={book.initials} color={book.color}
            className="h-[440px] w-full rounded-2xl"
            textClass="text-7xl"
          />
          <button
            onClick={() => navigate(`/app/buku/${book.id}/reservasi`)}
            disabled={book.stockAvailable === 0}
            className="mt-5 w-full cursor-pointer rounded-xl bg-primary py-4 font-display text-[17px] font-bold text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {t("action.borrow")}
          </button>

          {book.ebookTotal > 0 ? (
            <button
              onClick={() => book.ebookAvailable > 0 && setShowEbookModal(true)}
              disabled={book.ebookAvailable === 0}
              className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-accent bg-accent-light/40 py-4 font-display text-[17px] font-bold text-accent hover:bg-accent-light disabled:cursor-not-allowed disabled:opacity-60"
            >
              <BookText size={19} />
              {book.ebookAvailable > 0
                ? `${t("bookdetail.borrowEbookPrefix")} · ${book.ebookAvailable}/${book.ebookTotal} ${t("home.ebookCopiesSuffix")}`
                : t("home.ebookQueue")}
            </button>
          ) : (
            <div className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-line py-4 text-[15px] text-muted-fg">
              <BookText size={18} /> {t("bookdetail.ebookUnavailable")}
            </div>
          )}

          <button
            onClick={() => {
              const active = toggleWishlist(book.id);
              notify(
                active
                  ? `"${book.title}" ${t("bookdetail.wishlistAddedSuffix")}`
                  : `"${book.title}" ${t("bookdetail.wishlistRemovedSuffix")}`,
              );
            }}
            className={`mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border py-4 font-display text-[16px] font-semibold ${
              wishlisted
                ? "border-primary bg-primary-light text-primary"
                : "border-line hover:bg-muted"
            }`}
          >
            <Bookmark size={18} fill={wishlisted ? "currentColor" : "none"} />
            {wishlisted ? t("bookdetail.inWishlist") : t("bookdetail.addToWishlist")}
          </button>
        </div>

        <div>
          <span className="rounded-full bg-primary-light px-4 py-1.5 text-sm font-semibold text-primary">
            {book.category}
          </span>
          <h1 className="mt-4 font-display text-[40px] font-bold leading-tight">
            {book.title}
          </h1>
          <p className="mt-2 text-xl text-muted-fg">{book.author}</p>

          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="flex items-center gap-2">
              <Stars value={book.rating} />
              <span className="font-display text-lg font-bold">{book.rating.toFixed(1)}</span>
            </span>
            <span className="text-line">|</span>
            <span className="text-lg text-muted-fg">{t("bookdetail.yearPrefix")} {book.year}</span>
            <span className="text-line">|</span>
            {book.stockAvailable > 0 ? (
              <span className="flex items-center gap-2 text-lg font-semibold text-success">
                <CheckCircle2 size={20} />
                {book.stockAvailable} {t("pinjaman.ofSuffix")} {book.stockTotal} {t("bookdetail.copiesAvailableSuffix")}
              </span>
            ) : (
              <span className="text-lg font-semibold text-destructive">
                {t("bookdetail.allBorrowed")}
              </span>
            )}
          </div>

          {book.stockAvailable === 0 && (
            <SmartWaitlist book={book} />
          )}

          <Card className="mt-7 p-7">
            <h2 className="font-display text-xl font-bold">{t("bookdetail.description")}</h2>
            <p className="mt-3 text-lg leading-relaxed text-muted-fg">
              {book.description}
            </p>
          </Card>

          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              [t("bookdetail.labelCategory"), book.category],
              [t("bookdetail.labelYearPublished"), String(book.year)],
              [t("bookdetail.labelPhysicalStock"), `${book.stockTotal} ${t("bookdetail.copiesSuffix")}`],
              [t("bookdetail.labelEbookCopy"), book.ebookTotal > 0 ? `${book.ebookTotal} ${t("home.ebookCopiesSuffix")}` : t("bookdetail.notAvailable")],
            ].map(([label, value]) => (
              <Card key={label} className="p-5">
                <div className="text-[15px] text-muted-fg">{label}</div>
                <div className="mt-1.5 font-display text-[17px] font-bold">{value}</div>
              </Card>
            ))}
          </div>

          {book.ebookTotal > 0 && book.ebookAvailable > 0 && (
            <div className="mt-6 flex items-center gap-4 rounded-xl bg-accent-light/60 px-6 py-5">
              <BookText size={22} className="shrink-0 text-accent" />
              <div>
                <div className="font-display text-[17px] font-bold text-accent">
                  {book.ebookAvailable} {t("pinjaman.ofSuffix")} {book.ebookTotal} {t("bookdetail.ebookCopiesAvailableSuffix")}
                </div>
                <div className="mt-0.5 text-[15px] text-muted-fg">
                  {t("bookdetail.digitalCopyNote")}
                </div>
              </div>
            </div>
          )}

          <BookFeedback book={book} />

          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">
                {t("bookdetail.readerReviews")}
                <span className="ml-2 text-base font-normal text-muted-fg">
                  ({reviews.length})
                </span>
              </h2>
              <button
                onClick={() => setShowReview(true)}
                className="cursor-pointer rounded-lg bg-primary-light px-4 py-2 text-sm font-semibold text-primary hover:bg-primary-light-hover"
              >
                + {t("bookdetail.writeReview")}
              </button>
            </div>
            {reviews.length === 0 ? (
              <p className="mt-3 text-muted-fg">{t("bookdetail.noReviews")}</p>
            ) : (
              <div className="mt-4 space-y-4">
                {reviews.map((rv) => (
                  <Card key={rv.ts} className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold uppercase text-white">
                          {rv.name.slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-display font-bold uppercase">{rv.name}</div>
                          <div className="text-sm text-muted-fg">
                            {rv.program} · {rv.faculty} · {t("profile.batch")} {rv.angkatan}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Stars value={rv.rating} size={15} />
                        <div className="mt-1 text-xs text-muted-fg">
                          {rv.date} · {rv.time}
                        </div>
                      </div>
                    </div>
                    {rv.comment && (
                      <p className="mt-3 leading-relaxed text-fg">{rv.comment}</p>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>

          {related && (
            <div className="mt-8">
              <h2 className="font-display text-xl font-bold">{t("bookdetail.relatedBook")}</h2>
              <Link to={`/app/buku/${related.id}`} className="mt-4 inline-block w-[132px]">
                <Card className="overflow-hidden transition-shadow hover:shadow-md">
                  <RemoteCover title={related.title} author={related.author} initials={related.initials} color={related.color}
                    className="h-[120px] w-full rounded-b-none"
                    textClass="text-3xl"
                  />
                  <div className="p-3 font-display text-sm font-bold leading-snug">
                    {related.title}
                  </div>
                </Card>
              </Link>
            </div>
          )}
        </div>
      </div>

      {showEbookModal && (
        <Modal title={t("bookdetail.borrowEbookCopy")} onClose={() => setShowEbookModal(false)}>
          <div className="flex items-center gap-4 rounded-xl bg-bg p-5">
            <RemoteCover title={book.title} author={book.author} initials={book.initials} color={book.color}
              className="h-[72px] w-[60px] rounded-lg"
              textClass="text-lg"
            />
            <div>
              <div className="font-display text-lg font-bold">{book.title}</div>
              <div className="text-[15px] text-muted-fg">{book.author}</div>
              <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-accent-light px-3 py-1 text-sm font-semibold text-accent">
                <BookText size={13} />
                {book.ebookAvailable} {t("pinjaman.ofSuffix")} {book.ebookTotal} {t("bookdetail.ebookCopiesAvailableSuffix")}
              </span>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-xl border border-line">
            {[
              [t("bookdetail.labelBorrower"), "Ahmad Fauzi (11200000001)"],
              [t("bookdetail.labelDuration"), t("bookdetail.durationValue")],
              [t("bookdetail.labelAccessEnds"), t("bookdetail.accessEndDate")],
              [t("bookdetail.labelAccessFormat"), t("bookdetail.accessFormatValue")],
            ].map(([label, value], i) => (
              <div
                key={label}
                className={`flex items-center justify-between px-5 py-4 ${i % 2 === 1 ? "bg-bg/60" : ""} ${i > 0 ? "border-t border-line" : ""}`}
              >
                <span className="text-[15px] text-muted-fg">{label}</span>
                <span className="font-display text-[15px] font-bold">{value}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-start gap-3 rounded-xl bg-accent-light/60 px-5 py-4">
            <BookText size={19} className="mt-0.5 shrink-0 text-accent" />
            <p className="text-[15px] leading-relaxed text-accent">
              {t("bookdetail.ebookAutoReturnNote")}
            </p>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-4">
            <Button variant="outline" className="py-3.5" onClick={() => setShowEbookModal(false)}>
              {t("action.cancel")}
            </Button>
            <Button
              variant="accent"
              className="py-3.5"
              onClick={() => {
                setShowEbookModal(false);
                setShowSuccess(true);
              }}
            >
              {t("bookdetail.borrowEbookCopy")}
            </Button>
          </div>
        </Modal>
      )}

      {showSuccess && (
        <Modal title={t("bookdetail.loanSuccessTitle")} onClose={() => setShowSuccess(false)}>
          <div className="flex flex-col items-center py-2 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-accent-light">
              <Check size={44} className="text-accent" strokeWidth={2.5} />
            </div>
            <h4 className="mt-7 font-display text-2xl font-bold">
              {t("bookdetail.ebookBorrowedHeading")}
            </h4>
            <p className="mt-3 text-lg text-muted-fg">
              {t("bookdetail.youCanReadPrefix")} <strong className="text-fg">{book.title}</strong>
            </p>
            <p className="mt-1.5 text-[15px] text-muted-fg">
              {t("bookdetail.autoAccessEndsPrefix")} <strong className="text-fg">{t("bookdetail.accessEndDate")}</strong>
            </p>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <Button variant="outline" className="py-3.5" onClick={() => setShowSuccess(false)}>
              {t("bookdetail.later")}
            </Button>
            <Button
              variant="accent"
              className="py-3.5"
              onClick={() => navigate(`/app/baca/${book.id}`)}
            >
              {t("bookdetail.readNow")}
            </Button>
          </div>
        </Modal>
      )}

      {showReview && (
        <ReviewModal
          bookId={book.id}
          title={book.title}
          onClose={() => setShowReview(false)}
          onDone={(stars) => {
            setShowReview(false);
            notify(`${t("pinjaman.reviewToastPrefix")} ${stars} ${t("pinjaman.reviewToastMiddle")} "${book.title}" ${t("pinjaman.reviewToastSuffix")}`);
          }}
        />
      )}
    </div>
  );
}

// Antrean Cerdas: muncul untuk buku yang seluruh eksemplarnya sedang dipinjam.
function SmartWaitlist({ book }: { book: Book }) {
  const { notify } = useToast();
  const t = useTranslate();
  useWaitlist(); // berlangganan perubahan
  const entry = entryFor(book.id);
  const position = entry?.position ?? 0;
  const date = predictedAvailability(book, position || 1);

  return (
    <Card className="mt-7 overflow-hidden border-accent/30">
      <div className="flex items-center gap-2.5 bg-accent-light px-6 py-3.5">
        <Sparkles size={18} className="text-accent" />
        <span className="font-display font-bold text-accent">{t("bookdetail.smartWaitlist")}</span>
      </div>
      <div className="p-6">
        {entry ? (
          <>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent text-lg font-bold text-white">
                #{position}
              </div>
              <div>
                <div className="font-display text-lg font-bold">
                  {t("bookdetail.waitlistPositionPrefix")} {position}
                </div>
                <div className="mt-0.5 text-[15px] text-muted-fg">
                  {t("bookdetail.waitlistNotifyNote")}
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2.5 rounded-xl bg-bg px-5 py-4">
              <BellRing size={18} className="shrink-0 text-accent" />
              <span className="text-[15px]">
                {t("bookdetail.estimatedAvailablePrefix")}{" "}
                <strong className="font-display">{formatDate(date)}</strong>
              </span>
            </div>
            <button
              onClick={() => {
                leaveWaitlist(book.id);
                notify(t("bookdetail.leftWaitlistToast"));
              }}
              className="mt-4 w-full cursor-pointer rounded-xl border border-line py-3 font-display text-[15px] font-semibold hover:bg-muted"
            >
              {t("bookdetail.leaveWaitlist")}
            </button>
          </>
        ) : (
          <>
            <p className="text-[15px] leading-relaxed text-muted-fg">
              {t("bookdetail.waitlistJoinNote")}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[15px]">
              <span className="flex items-center gap-2 text-muted-fg">
                <Users2 size={17} /> {(book.stockTotal + book.title.length) % 4} {t("bookdetail.peopleWaitingSuffix")}
              </span>
              <span className="flex items-center gap-2 text-muted-fg">
                <BellRing size={17} /> {t("bookdetail.estimatePrefix")} {formatDate(date)}
              </span>
            </div>
            <button
              onClick={() => {
                const pos = joinWaitlist(book);
                notify(`${t("bookdetail.joinedWaitlistPrefix")} ${pos}.`);
              }}
              className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-accent py-3.5 font-display text-[16px] font-bold text-white hover:bg-accent-dark"
            >
              <BellRing size={18} /> {t("bookdetail.joinWaitlistBtn")}
            </button>
          </>
        )}
      </div>
    </Card>
  );
}
