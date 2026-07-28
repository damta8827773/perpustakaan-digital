import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft, ChevronLeft, ChevronRight, Minus, Plus, Moon, Sun,
} from "lucide-react";
import { bookById } from "@/common/constants/catalog";
import { ebookContent, ebookReferences } from "@/contents/ebooks";
import { BookCover } from "@/components/ui";

// Pratinjau baca e-book online untuk admin, diakses dari Koleksi Buku.
export default function AdminReader() {
  const { id } = useParams();
  const book = bookById(id ?? "");
  const [fontSize, setFontSize] = useState(17);
  const [dark, setDark] = useState(false);
  const [chapterIdx, setChapterIdx] = useState(0);

  if (!book) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Buku tidak ditemukan.</p>
      </div>
    );
  }
  const content = ebookContent(book.id);
  const references = ebookReferences(book.id);
  const totalChapters = content.chapters.length + 1;
  const isReferences = chapterIdx === content.chapters.length;
  const chapter = content.chapters[chapterIdx];

  return (
    <div className={`min-h-screen ${dark ? "bg-[#0b1220] text-[#dbe4f0]" : "bg-card"}`}>
      <header
        className={`sticky top-0 z-30 border-b ${dark ? "border-white/10 bg-[#101826]" : "border-line bg-card"}`}
      >
        <div className="mx-auto flex h-16 max-w-[1100px] items-center justify-between gap-4 px-5">
          <Link
            to="/admin/koleksi"
            className={`flex items-center gap-2 font-semibold ${dark ? "text-white/70 hover:text-white" : "text-muted-fg hover:text-fg"}`}
          >
            <ArrowLeft size={18} /> Kembali ke Koleksi
          </Link>
          <div className="flex items-center gap-2.5">
            <BookCover
              initials={book.initials}
              color={book.color}
              className="h-8 w-7 rounded-md"
              textClass="text-[10px]"
            />
            <span className="font-display font-bold">{book.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 rounded-xl px-2 py-1.5 ${dark ? "bg-white/10" : "bg-muted"}`}>
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
              aria-label="Ganti mode terang/gelap"
            >
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[820px] px-6 py-12">
        <span className="rounded-full bg-accent-light px-3 py-1 text-sm font-semibold text-accent">
          Pratinjau Admin
        </span>
        <h1 className="mt-4 font-display text-[32px] font-bold">
          {isReferences ? "Daftar Pustaka" : chapter.title}
        </h1>
        <p className={`mt-2 text-[15px] ${dark ? "text-white/60" : "text-muted-fg"}`}>
          {book.author} &middot; {content.publisher} &middot; {book.year}
        </p>
        {isReferences ? (
          <ol
            className="mt-8 space-y-4 leading-[1.9]"
            style={{ fontSize, fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            {references.map((ref, i) => (
              <li key={i} className="pl-6 -indent-6">{ref}</li>
            ))}
          </ol>
        ) : (
          <div
            className="mt-8 space-y-6 leading-[1.9]"
            style={{ fontSize, fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            {chapter.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        )}
      </div>

      <div className={`border-t ${dark ? "border-white/10" : "border-line"}`}>
        <div className="mx-auto flex h-[76px] max-w-[1100px] items-center justify-between px-6">
          <button
            onClick={() => setChapterIdx((i) => Math.max(0, i - 1))}
            disabled={chapterIdx <= 0}
            className={`flex items-center gap-2 font-semibold enabled:cursor-pointer disabled:opacity-40 ${dark ? "text-white/70" : "text-muted-fg hover:text-fg"}`}
          >
            <ChevronLeft size={18} /> Bab Sebelumnya
          </button>
          <span className={dark ? "text-white/60" : "text-muted-fg"}>
            {isReferences ? "Daftar Pustaka" : `Bab ${chapterIdx + 1} dari ${totalChapters - 1}`}
          </span>
          <button
            onClick={() => setChapterIdx((i) => Math.min(totalChapters - 1, i + 1))}
            disabled={chapterIdx >= totalChapters - 1}
            className={`flex items-center gap-2 font-semibold enabled:cursor-pointer disabled:opacity-40 ${dark ? "text-white/70" : "text-muted-fg hover:text-fg"}`}
          >
            Bab Berikutnya <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
