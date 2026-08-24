import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookText } from "lucide-react";
import { BOOKS, bookById } from "@/common/constants/catalog";
import { RemoteCover, Card, Progress } from "@/components/ui";
import { useToast } from "@/components/Toast";
import { useLibrary, getActiveLoans } from "@/services/libraryStore";
import { useCurrentStudent } from "@/services/sessionStore";

const CATEGORIES = ["Semua", "Agama", "Sains", "Hukum", "Teknik", "Ekonomi", "Bahasa", "Psikologi", "Pendidikan"];

const LOAN_COLORS = { aktif: "#1a73c8", hampir: "#ea580c", terlambat: "#dc2626" } as const;

export function BookCard({ book }: { book: (typeof BOOKS)[number] }) {
  const soldOut = book.stockAvailable === 0;
  return (
    <Link to={`/app/buku/${book.id}`} className="group">
      <Card className="overflow-hidden transition-shadow hover:shadow-md">
        <RemoteCover title={book.title} author={book.author} initials={book.initials} color={book.color}
          className="h-[170px] w-full rounded-b-none"
          textClass="text-[44px]"
        />
        <div className="p-4">
          <div className="font-display text-[15px] font-bold leading-snug group-hover:text-primary">
            {book.title}
          </div>
          <div className="mt-1 text-sm text-muted-fg">{book.author}</div>
          <div className="mt-3 flex items-center justify-between">
            {soldOut ? (
              <span className="rounded-full bg-destructive-light px-2.5 py-1 text-xs font-semibold text-destructive">
                Dipinjam Semua
              </span>
            ) : (
              <span className="rounded-full bg-success-light px-2.5 py-1 text-xs font-semibold text-success">
                {book.stockAvailable}/{book.stockTotal} Tersedia
              </span>
            )}
            <span className="flex items-center gap-1 text-sm font-semibold">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#f59e0b">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {book.rating.toFixed(1)}
            </span>
          </div>
          {book.ebookTotal > 0 && (
            <div className="mt-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-light px-2.5 py-1 text-xs font-semibold text-accent">
                <BookText size={12} />
                {book.ebookAvailable > 0
                  ? `E-book · ${book.ebookAvailable}/${book.ebookTotal} copy`
                  : "E-book · Antrean"}
              </span>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}

export default function Home() {
  const [category, setCategory] = useState("Semua");
  const { notify } = useToast();
  const student = useCurrentStudent();
  useLibrary(); // berlangganan perubahan agar pinjaman baru langsung tampil
  const loans = getActiveLoans();
  const books =
    category === "Semua" ? BOOKS : BOOKS.filter((b) => b.category === category);

  return (
    <div>
      <h1 className="font-display text-[32px] font-bold">
        Halo, <span className="uppercase">{student.name}</span>! 👋
      </h1>
      <p className="mt-1.5 text-muted-fg">
        {BOOKS.filter((b) => b.stockAvailable > 0).length} buku tersedia untuk
        dipinjam hari ini.
      </p>

      <div className="mt-7 rounded-xl bg-primary-light/60 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-primary">
            Pinjaman Aktif ({loans.length})
          </h2>
          <Link
            to="/app/pinjaman"
            className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            Lihat Semua <ArrowRight size={15} />
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          {loans.map((loan) => {
            const book = bookById(loan.bookId)!;
            const color = LOAN_COLORS[loan.status];
            return (
              <Card key={loan.bookId} className="p-4">
                <div className="flex items-center gap-3">
                  <RemoteCover title={book.title} author={book.author} initials={book.initials} color={book.color}
                    className="h-12 w-12 rounded-lg"
                    textClass="text-sm"
                  />
                  <div className="min-w-0">
                    <div className="truncate font-display text-[15px] font-bold">
                      {book.title}
                    </div>
                    <div className="truncate text-sm text-muted-fg">{book.author}</div>
                  </div>
                </div>
                <Progress value={loan.progress} color={color} className="mt-4" />
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-semibold" style={{ color }}>
                    {loan.daysLeft >= 0
                      ? `${loan.daysLeft} hari lagi`
                      : `Terlambat ${-loan.daysLeft} hari`}
                  </span>
                  <button
                    onClick={() =>
                      notify(`Peminjaman "${book.title}" diperpanjang 7 hari.`)
                    }
                    className="cursor-pointer rounded-lg bg-primary-light px-3.5 py-1.5 text-sm font-semibold text-primary hover:bg-primary-light-hover"
                  >
                    Perpanjang
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-2.5">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`cursor-pointer rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
              category === c
                ? "bg-primary text-white"
                : "border border-line bg-card text-fg hover:bg-muted"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-7">
        <h2 className="font-display text-xl font-bold">
          Semua Koleksi
          <span className="ml-1 text-base font-normal text-muted-fg">
            ({books.length} buku)
          </span>
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {books.map((b) => (
            <BookCard key={b.id} book={b} />
          ))}
        </div>
      </div>
    </div>
  );
}
