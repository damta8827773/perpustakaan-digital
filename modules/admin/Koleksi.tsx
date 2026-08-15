import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, Plus, Pencil, Trash2, BookOpen, ChevronLeft, ChevronRight,
  Sparkles, Loader2, CheckCircle2,
} from "lucide-react";
import { BOOKS, type Book, type Kategori } from "@/common/constants/catalog";
import { Badge, Button, Card, Modal } from "@/components/ui";
import { searchGoogleBooks, type GoogleBookResult } from "@/services/googleBooks";

const FILTERS = ["Semua", "Tersedia", "Dipinjam", "Habis"] as const;
const KATEGORI_OPTIONS: Kategori[] = [
  "Agama", "Sains", "Hukum", "Teknik", "Ekonomi", "Bahasa", "Psikologi", "Pendidikan", "Metodologi",
];

interface FormState {
  isbn: string; title: string; author: string; publisher: string;
  year: string; category: Kategori; stock: string; description: string;
}

const EMPTY_FORM: FormState = {
  isbn: "", title: "", author: "", publisher: "", year: "2024", category: "Agama", stock: "1",
  description: "",
};

function GoogleBooksLookup({
  onPick,
}: {
  onPick: (r: GoogleBookResult) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GoogleBookResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function runSearch(e: FormEvent) {
    e.preventDefault();
    if (query.trim().length < 2) return;
    setLoading(true);
    setSearched(true);
    const found = await searchGoogleBooks(query, 5);
    setResults(found);
    setLoading(false);
  }

  return (
    <div className="rounded-xl border border-line bg-bg/60 p-4">
      <div className="flex items-center gap-2 font-display text-sm font-bold text-primary">
        <Sparkles size={15} /> Cari data buku dari Google Books
      </div>
      <p className="mt-1 text-sm text-muted-fg">
        Ketik judul buku untuk mengisi penulis, penerbit, tahun, dan sampul secara otomatis.
      </p>
      <form onSubmit={runSearch} className="mt-3 flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Contoh: Tafsir Al-Misbah"
          className="flex-1 rounded-lg border border-line bg-card px-3 py-2 text-sm outline-none focus:border-primary"
        />
        <button
          type="submit"
          disabled={loading}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
        >
          {loading ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
          Cari
        </button>
      </form>

      {searched && !loading && results.length === 0 && (
        <p className="mt-3 text-sm text-muted-fg">
          Tidak ada hasil, atau layanan sedang tidak dapat dihubungi. Isi manual di bawah.
        </p>
      )}

      {results.length > 0 && (
        <div className="mt-3 space-y-2">
          {results.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => onPick(r)}
              className="flex w-full cursor-pointer items-center gap-3 rounded-lg border border-line bg-card p-2.5 text-left hover:border-primary hover:bg-primary-light/40"
            >
              {r.thumbnail ? (
                <img src={r.thumbnail} alt="" className="h-14 w-10 shrink-0 rounded object-cover" />
              ) : (
                <div className="flex h-14 w-10 shrink-0 items-center justify-center rounded bg-muted text-muted-fg">
                  <BookOpen size={16} />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{r.title}</div>
                <div className="truncate text-xs text-muted-fg">
                  {r.authors.join(", ") || "Penulis tidak diketahui"}
                  {r.publishedYear ? ` · ${r.publishedYear}` : ""}
                </div>
              </div>
              <CheckCircle2 size={16} className="shrink-0 text-muted-fg" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function BookFormModal({
  mode, initial, onClose, onSave,
}: {
  mode: "tambah" | "edit";
  initial: FormState;
  onClose: () => void;
  onSave: (f: FormState) => void;
}) {
  const [form, setForm] = useState(initial);
  const [filledFromGoogle, setFilledFromGoogle] = useState(false);
  const set = (k: keyof FormState) => (e: { target: { value: string } }) => {
    setFilledFromGoogle(false);
    setForm((f) => ({ ...f, [k]: e.target.value }));
  };

  function submit(e: FormEvent) {
    e.preventDefault();
    onSave(form);
  }

  function fillFromGoogle(r: GoogleBookResult) {
    setForm((f) => ({
      ...f,
      title: r.title,
      author: r.authors.join(", ") || f.author,
      publisher: r.publisher ?? f.publisher,
      year: r.publishedYear ? String(r.publishedYear) : f.year,
      isbn: r.isbn ?? f.isbn,
      description: r.description ?? f.description,
    }));
    setFilledFromGoogle(true);
  }

  const input =
    "mt-2 w-full rounded-xl border border-line bg-card px-4 py-3 text-[15px] outline-none placeholder:text-muted-fg/70 focus:border-primary";

  return (
    <Modal
      title={mode === "tambah" ? "Tambah Buku Baru" : "Edit Buku"}
      onClose={onClose}
    >
      <div className="space-y-4">
        <GoogleBooksLookup onPick={fillFromGoogle} />

        {filledFromGoogle && (
          <div className="flex items-center gap-2 rounded-lg bg-success-light px-3 py-2 text-sm font-semibold text-success">
            <CheckCircle2 size={15} /> Data terisi dari Google Books. Periksa kembali sebelum menyimpan.
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="font-display text-[15px] font-semibold">ISBN</label>
            <input value={form.isbn} onChange={set("isbn")} placeholder="978-xxx-xxx-xxx" className={input} />
          </div>
          <div>
            <label className="font-display text-[15px] font-semibold">Judul Buku</label>
            <input value={form.title} onChange={set("title")} placeholder="Masukkan judul buku" className={input} required />
          </div>
          <div>
            <label className="font-display text-[15px] font-semibold">Penulis</label>
            <input value={form.author} onChange={set("author")} placeholder="Nama penulis" className={input} required />
          </div>
          <div>
            <label className="font-display text-[15px] font-semibold">Penerbit</label>
            <input value={form.publisher} onChange={set("publisher")} placeholder="Nama penerbit" className={input} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="font-display text-[15px] font-semibold">Tahun Terbit</label>
              <input value={form.year} onChange={set("year")} className={input} />
            </div>
            <div>
              <label className="font-display text-[15px] font-semibold">Kategori</label>
              <select value={form.category} onChange={set("category")} className={input}>
                {KATEGORI_OPTIONS.map((k) => (
                  <option key={k}>{k}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-display text-[15px] font-semibold">Stok</label>
              <input value={form.stock} onChange={set("stock")} type="number" min="0" className={input} />
            </div>
          </div>
          <div>
            <label className="font-display text-[15px] font-semibold">Deskripsi</label>
            <textarea
              value={form.description}
              onChange={set("description")}
              rows={3}
              placeholder="Ringkasan singkat isi buku"
              className={`${input} resize-none`}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 pt-3">
            <Button variant="outline" className="py-3.5" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" className="py-3.5">
              Simpan
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default function Koleksi() {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>(BOOKS);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Semua");
  const [modal, setModal] = useState<
    | { mode: "tambah" }
    | { mode: "edit"; book: Book }
    | null
  >(null);

  const q = query.trim().toLowerCase();
  const rows = books.filter((b) => {
    if (q && !`${b.title} ${b.author} ${b.isbn}`.toLowerCase().includes(q)) return false;
    if (filter === "Tersedia" && b.stockAvailable === 0) return false;
    if (filter === "Dipinjam" && (b.stockAvailable === b.stockTotal || b.stockAvailable === 0)) return false;
    if (filter === "Habis" && b.stockAvailable !== 0) return false;
    return true;
  });

  function statusBadge(b: Book) {
    if (b.stockAvailable === 0) return <Badge tone="destructive">Habis</Badge>;
    if (b.stockAvailable < b.stockTotal) return <Badge tone="primary">Dipinjam</Badge>;
    return <Badge tone="success">Tersedia</Badge>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-fg" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari judul atau ISBN..."
            className="w-[260px] rounded-xl border border-line bg-card py-3 pl-11 pr-4 text-[15px] outline-none placeholder:text-muted-fg/70 focus:border-primary"
          />
        </div>
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`cursor-pointer rounded-xl px-5 py-3 text-[15px] font-semibold transition-colors ${
              filter === f
                ? "bg-primary text-white"
                : "border border-line bg-card hover:bg-muted"
            }`}
          >
            {f}
          </button>
        ))}
        <button
          onClick={() => setModal({ mode: "tambah" })}
          className="ml-auto flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-6 py-3 font-display text-[15px] font-bold text-white hover:bg-primary-dark"
        >
          <Plus size={18} /> Tambah Buku
        </button>
      </div>

      <Card className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead>
            <tr className="border-b border-line bg-bg/60 text-sm uppercase tracking-wider text-muted-fg">
              <th className="px-5 py-4 font-semibold">ISBN</th>
              <th className="px-5 py-4 font-semibold">Judul</th>
              <th className="px-5 py-4 font-semibold">Penulis</th>
              <th className="px-5 py-4 font-semibold">Kategori</th>
              <th className="px-5 py-4 font-semibold">Tahun</th>
              <th className="px-5 py-4 font-semibold">Stok</th>
              <th className="px-5 py-4 font-semibold">Status</th>
              <th className="px-5 py-4 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((b) => (
              <tr key={b.id} className="hover:bg-bg/40">
                <td className="px-5 py-4 font-mono text-sm text-muted-fg">{b.isbn}</td>
                <td className="px-5 py-4 font-display text-[15px] font-bold">{b.title}</td>
                <td className="px-5 py-4 text-muted-fg">{b.author}</td>
                <td className="px-5 py-4 text-muted-fg">{b.category}</td>
                <td className="px-5 py-4 text-muted-fg">{b.year}</td>
                <td className="px-5 py-4 font-semibold">
                  {b.stockAvailable}/{b.stockTotal}
                </td>
                <td className="px-5 py-4">{statusBadge(b)}</td>
                <td className="px-5 py-4">
                  <div className="flex gap-1.5">
                    {b.ebookTotal > 0 && (
                      <button
                        onClick={() => navigate(`/admin/baca/${b.id}`)}
                        className="cursor-pointer rounded-lg p-2 text-accent hover:bg-accent-light"
                        aria-label={`Baca online ${b.title}`}
                        title="Baca e-book online"
                      >
                        <BookOpen size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => setModal({ mode: "edit", book: b })}
                      className="cursor-pointer rounded-lg p-2 text-primary hover:bg-primary-light"
                      aria-label={`Edit ${b.title}`}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => setBooks((prev) => prev.filter((x) => x.id !== b.id))}
                      className="cursor-pointer rounded-lg p-2 text-destructive hover:bg-destructive-light"
                      aria-label={`Hapus ${b.title}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between border-t border-line px-5 py-4">
          <span className="text-[15px] text-muted-fg">
            Menampilkan {rows.length} dari {books.length} buku
          </span>
          <div className="flex items-center gap-2">
            <button className="cursor-pointer rounded-lg border border-line p-2 text-muted-fg hover:bg-muted" aria-label="Sebelumnya">
              <ChevronLeft size={16} />
            </button>
            <span className="rounded-lg bg-primary-light px-3.5 py-1.5 text-sm font-bold text-primary">
              1
            </span>
            <button className="cursor-pointer rounded-lg border border-line p-2 text-muted-fg hover:bg-muted" aria-label="Berikutnya">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </Card>

      {modal?.mode === "tambah" && (
        <BookFormModal
          mode="tambah"
          initial={EMPTY_FORM}
          onClose={() => setModal(null)}
          onSave={(f) => {
            const initials = f.title
              .split(" ")
              .slice(0, 2)
              .map((w) => w[0]?.toUpperCase() ?? "")
              .join("");
            setBooks((prev) => [
              {
                id: `${f.title.toLowerCase().replace(/\s+/g, "-")}-${prev.length}`,
                initials: initials || "BK",
                title: f.title,
                author: f.author,
                category: f.category,
                year: Number(f.year) || 2024,
                isbn: f.isbn || "978-xxx-xxx-x",
                color: "#1a73c8",
                rating: 0,
                stockTotal: Number(f.stock) || 1,
                stockAvailable: Number(f.stock) || 1,
                ebookTotal: 0,
                ebookAvailable: 0,
                description: f.description,
              },
              ...prev,
            ]);
            setModal(null);
          }}
        />
      )}

      {modal?.mode === "edit" && (
        <BookFormModal
          mode="edit"
          initial={{
            isbn: modal.book.isbn,
            title: modal.book.title,
            author: modal.book.author,
            publisher: "",
            year: String(modal.book.year),
            category: modal.book.category,
            stock: String(modal.book.stockTotal),
            description: modal.book.description,
          }}
          onClose={() => setModal(null)}
          onSave={(f) => {
            setBooks((prev) =>
              prev.map((b) =>
                b.id === modal.book.id
                  ? {
                      ...b,
                      isbn: f.isbn,
                      title: f.title,
                      author: f.author,
                      year: Number(f.year) || b.year,
                      category: f.category,
                      stockTotal: Number(f.stock) || b.stockTotal,
                      description: f.description,
                    }
                  : b,
              ),
            );
            setModal(null);
          }}
        />
      )}
    </div>
  );
}
