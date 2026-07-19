import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, Minus, Plus, Moon, Bookmark } from "lucide-react";
import { bookById, READER_CONTENT } from "../../lib/data";
import { useToast } from "../../components/Toast";

const TOTAL_PAGES = 180;

export default function Reader() {
  const { id } = useParams();
  const book = bookById(id ?? "");
  const { notify } = useToast();
  const [fontSize, setFontSize] = useState(16);
  const [dark, setDark] = useState(false);
  const [page, setPage] = useState(42);
  const [bookmarked, setBookmarked] = useState(false);

  if (!book) return <p>Buku tidak ditemukan.</p>;

  return (
    <div className="-mx-5 -my-8">
      <div
        className={`sticky top-[72px] z-30 border-b border-line ${dark ? "bg-[#101826] text-white" : "bg-card"}`}
      >
        <div className="mx-auto flex h-[68px] max-w-[1200px] items-center justify-between px-5">
          <Link
            to="/app/baca"
            className={`flex items-center gap-2 font-semibold ${dark ? "text-white/70 hover:text-white" : "text-muted-fg hover:text-fg"}`}
          >
            <ArrowLeft size={18} /> Kembali ke Daftar Baca
          </Link>
          <span className="font-display text-lg font-bold">{book.title}</span>
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-1 rounded-xl px-2 py-1.5 ${dark ? "bg-white/10" : "bg-muted"}`}
            >
              <button
                onClick={() => setFontSize((s) => Math.max(12, s - 1))}
                className="cursor-pointer rounded-md p-1.5 hover:bg-black/10"
                aria-label="Perkecil huruf"
              >
                <Minus size={15} />
              </button>
              <span className="w-11 text-center text-sm font-semibold">{fontSize}px</span>
              <button
                onClick={() => setFontSize((s) => Math.min(24, s + 1))}
                className="cursor-pointer rounded-md p-1.5 hover:bg-black/10"
                aria-label="Perbesar huruf"
              >
                <Plus size={15} />
              </button>
            </div>
            <button
              onClick={() => setDark((d) => !d)}
              className={`cursor-pointer rounded-xl p-2.5 ${dark ? "bg-white/10" : "bg-muted"}`}
              aria-label="Mode gelap"
            >
              <Moon size={17} />
            </button>
            <button
              onClick={() => {
                setBookmarked((b) => !b);
                notify(
                  bookmarked
                    ? "Penanda halaman dihapus."
                    : `Halaman ${page} ditandai.`,
                );
              }}
              className={`cursor-pointer rounded-xl p-2.5 ${bookmarked ? "bg-primary text-white" : dark ? "bg-white/10" : "bg-muted"}`}
              aria-label="Tandai halaman"
            >
              <Bookmark size={17} fill={bookmarked ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
      </div>

      <div
        className={`min-h-[calc(100vh-140px)] ${dark ? "bg-[#0b1220] text-[#dbe4f0]" : "bg-card"}`}
      >
        <div className="mx-auto max-w-[820px] px-6 py-12">
          <h1 className="font-display text-[32px] font-bold">
            {book.title}: {READER_CONTENT.chapter}
          </h1>
          <div
            className="mt-8 space-y-6 leading-[1.9]"
            style={{ fontSize, fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            {READER_CONTENT.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>

        <div
          className={`border-t ${dark ? "border-white/10" : "border-line"}`}
        >
          <div className="mx-auto flex h-[76px] max-w-[1100px] items-center justify-between px-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className={`flex cursor-pointer items-center gap-2 font-semibold disabled:cursor-not-allowed disabled:opacity-40 ${dark ? "text-white/70 hover:text-white" : "text-muted-fg hover:text-fg"}`}
            >
              <ChevronLeft size={18} /> Bab Sebelumnya
            </button>
            <span className={dark ? "text-white/60" : "text-muted-fg"}>
              Halaman {page} dari {TOTAL_PAGES}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(TOTAL_PAGES, p + 1))}
              disabled={page >= TOTAL_PAGES}
              className={`flex cursor-pointer items-center gap-2 font-semibold disabled:cursor-not-allowed disabled:opacity-40 ${dark ? "text-white/70 hover:text-white" : "text-muted-fg hover:text-fg"}`}
            >
              Bab Berikutnya <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
