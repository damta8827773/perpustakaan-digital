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

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notify } = useToast();
  const lib = useLibrary();
  const book = bookById(id ?? "");
  const [showEbookModal, setShowEbookModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showReview, setShowReview] = useState(false);

  if (!book) return <p>Buku tidak ditemukan.</p>;
  const wishlisted = lib.wishlist.includes(book.id);
  const reviews = reviewsFor(book.id);
  const related = book.relatedId ? bookById(book.relatedId) : undefined;

  return (
    <div>
      <Link
        to="/app"
        className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
      >
        <ArrowLeft size={18} /> Kembali
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
            Reservasi Buku Fisik
          </button>

          {book.ebookTotal > 0 ? (
            <button
              onClick={() => book.ebookAvailable > 0 && setShowEbookModal(true)}
              disabled={book.ebookAvailable === 0}
              className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-accent bg-accent-light/40 py-4 font-display text-[17px] font-bold text-accent hover:bg-accent-light disabled:cursor-not-allowed disabled:opacity-60"
            >
              <BookText size={19} />
              {book.ebookAvailable > 0
                ? `Pinjam E-book · ${book.ebookAvailable}/${book.ebookTotal} copy`
                : "E-book · Antrean"}
            </button>
          ) : (
            <div className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-line py-4 text-[15px] text-muted-fg">
              <BookText size={18} /> E-book tidak tersedia (hanya edisi cetak)
            </div>
          )}

          <button
            onClick={() => {
              const active = toggleWishlist(book.id);
              notify(
                active
                  ? `"${book.title}" disimpan ke wishlist.`
                  : `"${book.title}" dihapus dari wishlist.`,
              );
            }}
            className={`mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border py-4 font-display text-[16px] font-semibold ${
              wishlisted
                ? "border-primary bg-primary-light text-primary"
                : "border-line hover:bg-muted"
            }`}
          >
            <Bookmark size={18} fill={wishlisted ? "currentColor" : "none"} />
            {wishlisted ? "Tersimpan di Wishlist" : "Simpan ke Wishlist"}
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
            <span className="text-lg text-muted-fg">Tahun {book.year}</span>
            <span className="text-line">|</span>
            {book.stockAvailable > 0 ? (
              <span className="flex items-center gap-2 text-lg font-semibold text-success">
                <CheckCircle2 size={20} />
                {book.stockAvailable} dari {book.stockTotal} eksemplar tersedia
              </span>
            ) : (
              <span className="text-lg font-semibold text-destructive">
                Semua eksemplar sedang dipinjam
              </span>
            )}
          </div>

          {book.stockAvailable === 0 && (
            <SmartWaitlist book={book} />
          )}

          <Card className="mt-7 p-7">
            <h2 className="font-display text-xl font-bold">Deskripsi</h2>
            <p className="mt-3 text-lg leading-relaxed text-muted-fg">
              {book.description}
            </p>
          </Card>

          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              ["Kategori", book.category],
              ["Tahun Terbit", String(book.year)],
              ["Stok Fisik", `${book.stockTotal} eksemplar`],
              ["Copy E-book", book.ebookTotal > 0 ? `${book.ebookTotal} copy` : "Tidak tersedia"],
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
                  {book.ebookAvailable} dari {book.ebookTotal} copy e-book tersedia
                </div>
                <div className="mt-0.5 text-[15px] text-muted-fg">
                  Pinjam copy digital · otomatis kembali dalam 14 hari
                </div>
              </div>
            </div>
          )}

          <BookFeedback book={book} />

          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">
                Ulasan Pembaca
                <span className="ml-2 text-base font-normal text-muted-fg">
                  ({reviews.length})
                </span>
              </h2>
              <button
                onClick={() => setShowReview(true)}
                className="cursor-pointer rounded-lg bg-primary-light px-4 py-2 text-sm font-semibold text-primary hover:bg-[#d8e8f8]"
              >
                + Tulis Ulasan
              </button>
            </div>
            {reviews.length === 0 ? (
              <p className="mt-3 text-muted-fg">
                Belum ada ulasan. Jadilah yang pertama memberi ulasan setelah membaca.
              </p>
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
                            {rv.program} · {rv.faculty} · Angkatan {rv.angkatan}
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
              <h2 className="font-display text-xl font-bold">Buku Terkait</h2>
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
        <Modal title="Pinjam Copy E-book" onClose={() => setShowEbookModal(false)}>
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
                {book.ebookAvailable} dari {book.ebookTotal} copy tersedia
              </span>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-xl border border-line">
            {[
              ["Peminjam", "Ahmad Fauzi (11200000001)"],
              ["Durasi pinjam", "14 hari (otomatis dikembalikan)"],
              ["Akses berakhir", "14 Juli 2026"],
              ["Format akses", "Baca di browser, tanpa unduh"],
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
              Copy e-book otomatis dikembalikan setelah 14 hari. Baca kapan saja di
              browser tanpa perlu datang ke perpustakaan.
            </p>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-4">
            <Button variant="outline" className="py-3.5" onClick={() => setShowEbookModal(false)}>
              Batal
            </Button>
            <Button
              variant="accent"
              className="py-3.5"
              onClick={() => {
                setShowEbookModal(false);
                setShowSuccess(true);
              }}
            >
              Pinjam Copy E-book
            </Button>
          </div>
        </Modal>
      )}

      {showSuccess && (
        <Modal title="Peminjaman Berhasil!" onClose={() => setShowSuccess(false)}>
          <div className="flex flex-col items-center py-2 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-accent-light">
              <Check size={44} className="text-accent" strokeWidth={2.5} />
            </div>
            <h4 className="mt-7 font-display text-2xl font-bold">
              Copy E-book Berhasil Dipinjam!
            </h4>
            <p className="mt-3 text-lg text-muted-fg">
              Anda dapat membaca <strong className="text-fg">{book.title}</strong>
            </p>
            <p className="mt-1.5 text-[15px] text-muted-fg">
              Akses berakhir otomatis: <strong className="text-fg">14 Juli 2026</strong>
            </p>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <Button variant="outline" className="py-3.5" onClick={() => setShowSuccess(false)}>
              Nanti Saja
            </Button>
            <Button
              variant="accent"
              className="py-3.5"
              onClick={() => navigate(`/app/baca/${book.id}`)}
            >
              Baca Sekarang
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
            notify(`Ulasan ${stars} bintang untuk "${book.title}" terkirim.`);
          }}
        />
      )}
    </div>
  );
}

// Antrean Cerdas: muncul untuk buku yang seluruh eksemplarnya sedang dipinjam.
function SmartWaitlist({ book }: { book: Book }) {
  const { notify } = useToast();
  useWaitlist(); // berlangganan perubahan
  const entry = entryFor(book.id);
  const position = entry?.position ?? 0;
  const date = predictedAvailability(book, position || 1);

  return (
    <Card className="mt-7 overflow-hidden border-accent/30">
      <div className="flex items-center gap-2.5 bg-accent-light px-6 py-3.5">
        <Sparkles size={18} className="text-accent" />
        <span className="font-display font-bold text-accent">Antrean Cerdas</span>
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
                  Anda berada di antrean posisi {position}
                </div>
                <div className="mt-0.5 text-[15px] text-muted-fg">
                  Kami akan memberi tahu Anda saat buku tersedia.
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2.5 rounded-xl bg-bg px-5 py-4">
              <BellRing size={18} className="shrink-0 text-accent" />
              <span className="text-[15px]">
                Perkiraan tersedia sekitar{" "}
                <strong className="font-display">{formatDate(date)}</strong>
              </span>
            </div>
            <button
              onClick={() => {
                leaveWaitlist(book.id);
                notify("Anda keluar dari antrean.");
              }}
              className="mt-4 w-full cursor-pointer rounded-xl border border-line py-3 font-display text-[15px] font-semibold hover:bg-muted"
            >
              Keluar dari Antrean
            </button>
          </>
        ) : (
          <>
            <p className="text-[15px] leading-relaxed text-muted-fg">
              Semua eksemplar sedang dipinjam. Masuk antrean untuk diberi tahu
              secara otomatis begitu buku dikembalikan, tanpa perlu memeriksa
              berulang kali.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[15px]">
              <span className="flex items-center gap-2 text-muted-fg">
                <Users2 size={17} /> {(book.stockTotal + book.title.length) % 4} orang menunggu
              </span>
              <span className="flex items-center gap-2 text-muted-fg">
                <BellRing size={17} /> Perkiraan: {formatDate(date)}
              </span>
            </div>
            <button
              onClick={() => {
                const pos = joinWaitlist(book);
                notify(`Anda masuk antrean pada posisi ${pos}.`);
              }}
              className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-accent py-3.5 font-display text-[16px] font-bold text-white hover:bg-accent-dark"
            >
              <BellRing size={18} /> Masuk Antrean & Beri Tahu Saya
            </button>
          </>
        )}
      </div>
    </Card>
  );
}
