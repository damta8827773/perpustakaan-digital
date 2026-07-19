import { Link } from "react-router-dom";
import { BookText, ChevronRight } from "lucide-react";
import { EBOOK_LOANS, bookById } from "../../lib/data";
import { Badge, BookCover, Card, Progress } from "../../components/ui";

export default function BacaList() {
  return (
    <div>
      <h1 className="font-display text-[32px] font-bold">Baca E-book</h1>
      <p className="mt-2 text-lg text-muted-fg">
        Daftar copy e-book yang sedang Anda pinjam. Klik untuk mulai membaca.
      </p>

      <div className="mt-8 space-y-5">
        {EBOOK_LOANS.map((loan) => {
          const book = bookById(loan.bookId)!;
          return (
            <Card key={loan.bookId} className="p-6">
              <div className="flex items-start gap-5">
                <BookCover
                  initials={book.initials}
                  color={book.color}
                  className="h-[120px] w-[96px] shrink-0 rounded-xl"
                  textClass="text-3xl"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-xl font-bold">{book.title}</h3>
                      <p className="mt-0.5 text-muted-fg">{book.author}</p>
                      <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-accent-light px-3 py-1 text-sm font-semibold text-accent">
                        <BookText size={13} /> Copy #{loan.copyNumber} dari {book.ebookTotal}
                      </span>
                    </div>
                    <Badge tone="accent">Aktif</Badge>
                  </div>
                  <div className="mt-4 flex gap-14">
                    <div>
                      <div className="text-[15px] text-muted-fg">Dipinjam sejak</div>
                      <div className="mt-0.5 font-display font-bold">{loan.borrowDate}</div>
                    </div>
                    <div>
                      <div className="text-[15px] text-muted-fg">Akses berakhir</div>
                      <div className="mt-0.5 font-display font-bold text-accent">{loan.dueDate}</div>
                    </div>
                    <div>
                      <div className="text-[15px] text-muted-fg">Sisa waktu</div>
                      <div className="mt-0.5 font-display font-bold">{loan.daysLeft} hari</div>
                    </div>
                  </div>
                  <Progress value={loan.progress} color="#7c3aed" className="mt-4 h-2" />
                  <Link
                    to={`/app/baca/${book.id}`}
                    className="mt-5 inline-flex items-center gap-2 font-display text-[17px] font-bold text-accent hover:underline"
                  >
                    <BookText size={19} /> Baca Sekarang <ChevronRight size={18} />
                  </Link>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
