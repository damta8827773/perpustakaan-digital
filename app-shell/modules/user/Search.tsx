import { useState } from "react";
import { Search as SearchIcon, Clock, X } from "lucide-react";
import { BOOKS } from "@/common/constants/catalog";
import { BookCard } from "@/modules/user/Home";

const CATEGORIES = ["Semua", "Agama", "Sains", "Hukum", "Teknik", "Ekonomi", "Bahasa", "Psikologi", "Pendidikan"];
const AVAILABILITY = ["Semua", "Tersedia", "Dipinjam"];

export default function Search() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");
  const [availability, setAvailability] = useState("Semua");
  const [recent, setRecent] = useState([
    "Tafsir Al-Misbah",
    "Algoritma Pemrograman",
    "Hukum Islam",
  ]);

  const q = query.trim().toLowerCase();
  const results = BOOKS.filter((b) => {
    if (q && !`${b.title} ${b.author} ${b.isbn}`.toLowerCase().includes(q)) return false;
    if (category !== "Semua" && b.category !== category) return false;
    if (availability === "Tersedia" && b.stockAvailable === 0) return false;
    if (availability === "Dipinjam" && b.stockAvailable > 0) return false;
    return true;
  });
  const showResults = q !== "" || category !== "Semua" || availability !== "Semua";

  const chip = (active: boolean) =>
    `cursor-pointer rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
      active ? "bg-primary text-white" : "border border-line bg-card text-fg hover:bg-muted"
    }`;

  return (
    <div>
      <h1 className="font-display text-[32px] font-bold">Cari Buku</h1>

      <div className="relative mt-7">
        <SearchIcon
          size={20}
          className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-muted-fg"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari judul, penulis, atau ISBN..."
          className="w-full rounded-xl border border-line bg-card py-4.5 pl-14 pr-5 text-lg outline-none placeholder:text-muted-fg/70 focus:border-primary"
        />
      </div>

      <div className="mt-8 flex flex-wrap items-start justify-between gap-8">
        <div>
          <div className="text-sm font-bold uppercase tracking-wider text-muted-fg">
            Kategori
          </div>
          <div className="mt-3.5 flex max-w-[760px] flex-wrap gap-2.5">
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setCategory(c)} className={chip(category === c)}>
                {c}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-sm font-bold uppercase tracking-wider text-muted-fg">
            Ketersediaan
          </div>
          <div className="mt-3.5 flex flex-wrap gap-2.5">
            {AVAILABILITY.map((a) => (
              <button
                key={a}
                onClick={() => setAvailability(a)}
                className={chip(availability === a)}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      </div>

      {showResults ? (
        <div className="mt-9">
          <h2 className="font-display text-xl font-bold">
            Hasil Pencarian
            <span className="ml-1 text-base font-normal text-muted-fg">
              ({results.length} buku)
            </span>
          </h2>
          {results.length === 0 ? (
            <p className="mt-4 text-muted-fg">
              Tidak ada buku yang cocok dengan pencarian Anda.
            </p>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
              {results.map((b) => (
                <BookCard key={b.id} book={b} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="mt-10 max-w-[620px]">
          <h2 className="font-display text-lg font-bold text-muted-fg">
            Pencarian Terkini
          </h2>
          <div className="mt-4 space-y-3.5">
            {recent.map((r) => (
              <div
                key={r}
                className="flex items-center justify-between rounded-xl border border-line bg-card px-5 py-4"
              >
                <button
                  onClick={() => setQuery(r)}
                  className="flex cursor-pointer items-center gap-4 font-semibold hover:text-primary"
                >
                  <Clock size={18} className="text-muted-fg" /> {r}
                </button>
                <button
                  onClick={() => setRecent((prev) => prev.filter((x) => x !== r))}
                  className="cursor-pointer text-muted-fg hover:text-fg"
                  aria-label={`Hapus ${r}`}
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
