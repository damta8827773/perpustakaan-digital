import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft, ChevronLeft, ChevronRight, Minus, Plus, Moon, Bookmark,
  Volume2, Pause, Square, Gauge,
} from "lucide-react";
import { bookById } from "@/common/constants/catalog";
import { ebookContent, ebookReferences } from "@/contents/ebooks";
import { useToast } from "@/components/Toast";
import { useSpeechReader } from "@/hooks/useSpeechReader";

const RATES = [0.75, 1, 1.25, 1.5];

export default function Reader() {
  const { id } = useParams();
  const book = bookById(id ?? "");
  const { notify } = useToast();
  const [fontSize, setFontSize] = useState(16);
  const [dark, setDark] = useState(false);
  const [chapterIdx, setChapterIdx] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);

  // Dihitung sebelum kemungkinan early-return di bawah, supaya useSpeechReader
  // (hook) selalu dipanggil di urutan yang sama setiap render.
  const bookId = book?.id ?? "";
  const content = book ? ebookContent(bookId) : null;
  const speechText = !content
    ? ""
    : chapterIdx === content.chapters.length
      ? ebookReferences(bookId).join(". ")
      : `${content.chapters[chapterIdx].title}. ${content.chapters[chapterIdx].paragraphs.join(" ")}`;
  const speech = useSpeechReader(speechText);

  if (!book || !content) return <p>Buku tidak ditemukan.</p>;
  const references = ebookReferences(book.id);
  const totalChapters = content.chapters.length + 1; // + Daftar Pustaka
  const isReferences = chapterIdx === content.chapters.length;
  const chapter = content.chapters[chapterIdx];

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
            {speech.supported && (
              <div
                className={`flex items-center gap-1 rounded-xl px-2 py-1.5 ${dark ? "bg-white/10" : "bg-muted"}`}
              >
                <button
                  onClick={() => {
                    if (speech.status === "speaking") speech.pause();
                    else if (speech.status === "paused") speech.resume();
                    else speech.play();
                  }}
                  className="cursor-pointer rounded-md p-1.5 hover:bg-black/10"
                  aria-label={speech.status === "speaking" ? "Jeda bacaan" : "Dengarkan bab ini"}
                  title="Dengarkan bab ini"
                >
                  {speech.status === "speaking" ? <Pause size={15} /> : <Volume2 size={15} />}
                </button>
                {speech.status !== "idle" && (
                  <button
                    onClick={speech.stop}
                    className="cursor-pointer rounded-md p-1.5 hover:bg-black/10"
                    aria-label="Hentikan bacaan"
                    title="Hentikan"
                  >
                    <Square size={13} />
                  </button>
                )}
                <button
                  onClick={() => {
                    const next = RATES[(RATES.indexOf(speech.rate) + 1) % RATES.length];
                    speech.setRate(next);
                    if (speech.status !== "idle") speech.play();
                  }}
                  className="flex cursor-pointer items-center gap-1 rounded-md px-1.5 py-1.5 text-sm font-semibold hover:bg-black/10"
                  aria-label="Kecepatan bacaan"
                  title="Kecepatan bacaan"
                >
                  <Gauge size={14} /> {speech.rate}x
                </button>
              </div>
            )}
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
                    ? "Penanda bab dihapus."
                    : `${isReferences ? "Daftar Pustaka" : chapter.title} ditandai.`,
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
          <p className={`text-sm font-semibold uppercase tracking-wider ${dark ? "text-white/50" : "text-primary"}`}>
            {book.author} &middot; {content.publisher} &middot; {book.year}
          </p>
          {isReferences ? (
            <>
              <h1 className="mt-3 font-display text-[32px] font-bold">Daftar Pustaka</h1>
              <ol
                className="mt-8 space-y-4 leading-[1.9]"
                style={{ fontSize, fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                {references.map((ref, i) => (
                  <li key={i} className="pl-6 -indent-6">{ref}</li>
                ))}
              </ol>
            </>
          ) : (
            <>
              <h1 className="mt-3 font-display text-[32px] font-bold">{chapter.title}</h1>
              <div
                className="mt-8 space-y-6 leading-[1.9]"
                style={{ fontSize, fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                {chapter.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </>
          )}
        </div>

        <div
          className={`border-t ${dark ? "border-white/10" : "border-line"}`}
        >
          <div className="mx-auto flex h-[76px] max-w-[1100px] items-center justify-between px-6">
            <button
              onClick={() => setChapterIdx((i) => Math.max(0, i - 1))}
              disabled={chapterIdx <= 0}
              className={`flex cursor-pointer items-center gap-2 font-semibold disabled:cursor-not-allowed disabled:opacity-40 ${dark ? "text-white/70 hover:text-white" : "text-muted-fg hover:text-fg"}`}
            >
              <ChevronLeft size={18} /> Bab Sebelumnya
            </button>
            <span className={dark ? "text-white/60" : "text-muted-fg"}>
              {isReferences ? "Daftar Pustaka" : `Bab ${chapterIdx + 1} dari ${totalChapters - 1}`}
            </span>
            <button
              onClick={() => setChapterIdx((i) => Math.min(totalChapters - 1, i + 1))}
              disabled={chapterIdx >= totalChapters - 1}
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
