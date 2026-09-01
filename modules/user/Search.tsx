import { useState } from "react";
import { Search as SearchIcon, Clock, X } from "lucide-react";
import { BOOKS } from "@/common/constants/catalog";
import { BookCard, categoryLabel } from "@/modules/user/Home";
import { useTranslate } from "@/services/localeStore";

const CATEGORIES = ["Semua", "Agama", "Sains", "Hukum", "Teknik", "Ekonomi", "Bahasa", "Psikologi", "Pendidikan"];
const AVAILABILITY = ["Semua", "Tersedia", "Dipinjam"];

export default function Search() {
  const t = useTranslate();
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
  const availabilityLabel = (a: string) =>
    a === "Tersedia" ? t("book.available") : a === "Dipinjam" ? t("search.availabilityBorrowed") : categoryLabel(t, a);

  return (
    <div>
      <h1 className="font-display text-[32px] font-bold">{t("nav.search")}</h1>

      <div className="relative mt-7">
        <SearchIcon
          size={20}
          className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-muted-fg"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("search.placeholder")}
          className="w-full rounded-xl border border-line bg-card py-4.5 pl-14 pr-5 text-lg outline-none placeholder:text-muted-fg/70 focus:border-primary"
        />
      </div>

      <div className="mt-8 flex flex-wrap items-start justify-between gap-8">
        <div>
          <div className="text-sm font-bold uppercase tracking-wider text-muted-fg">
            {t("search.categoryLabel")}
          </div>
          <div className="mt-3.5 flex max-w-[760px] flex-wrap gap-2.5">
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setCategory(c)} className={chip(category === c)}>
                {categoryLabel(t, c)}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-sm font-bold uppercase tracking-wider text-muted-fg">
            {t("search.availabilityLabel")}
          </div>
          <div className="mt-3.5 flex flex-wrap gap-2.5">
            {AVAILABILITY.map((a) => (
              <button
                key={a}
                onClick={() => setAvailability(a)}
                className={chip(availability === a)}
              >
                {availabilityLabel(a)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {showResults ? (
        <div className="mt-9">
          <h2 className="font-display text-xl font-bold">
            {t("search.results")}
            <span className="ml-1 text-base font-normal text-muted-fg">
              ({results.length} {t("home.booksCountSuffix")})
            </span>
          </h2>
          {results.length === 0 ? (
            <p className="mt-4 text-muted-fg">{t("search.noResults")}</p>
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
            {t("search.recentSearches")}
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
                  aria-label={`${t("search.removePrefix")} ${r}`}
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
