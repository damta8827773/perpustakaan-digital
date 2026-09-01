import { Link } from "react-router-dom";
import { BookText, ChevronRight, Star } from "lucide-react";
import { EBOOK_LOANS, bookById } from "@/common/constants/catalog";
import { Badge, RemoteCover, Card, Progress } from "@/components/ui";
import { useTranslate } from "@/services/localeStore";

export default function BacaList() {
  const t = useTranslate();
  return (
    <div>
      <h1 className="font-display text-[32px] font-bold">{t("bacalist.title")}</h1>
      <p className="mt-2 text-lg text-muted-fg">{t("bacalist.subtitle")}</p>

      <div className="mt-8 space-y-5">
        {EBOOK_LOANS.map((loan) => {
          const book = bookById(loan.bookId)!;
          return (
            <Card key={loan.bookId} className="p-6">
              <div className="flex items-start gap-5">
                <RemoteCover title={book.title} author={book.author} initials={book.initials} color={book.color}
                  className="h-[120px] w-[96px] shrink-0 rounded-xl"
                  textClass="text-3xl"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-xl font-bold">{book.title}</h3>
                      <p className="mt-0.5 text-muted-fg">{book.author}</p>
                      <span className="mt-1.5 flex items-center gap-1 text-sm font-semibold text-muted-fg">
                        <Star size={14} fill="#f59e0b" stroke="#f59e0b" /> {book.rating.toFixed(1)}
                      </span>
                      <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-accent-light px-3 py-1 text-sm font-semibold text-accent">
                        <BookText size={13} /> {t("pinjaman.copyPrefix")}{loan.copyNumber} {t("pinjaman.ofSuffix")} {book.ebookTotal}
                      </span>
                    </div>
                    <Badge tone="accent">{t("pinjaman.statusActive")}</Badge>
                  </div>
                  <div className="mt-4 flex gap-14">
                    <div>
                      <div className="text-[15px] text-muted-fg">{t("pinjaman.borrowedSince")}</div>
                      <div className="mt-0.5 font-display font-bold">{loan.borrowDate}</div>
                    </div>
                    <div>
                      <div className="text-[15px] text-muted-fg">{t("bookdetail.labelAccessEnds")}</div>
                      <div className="mt-0.5 font-display font-bold text-accent">{loan.dueDate}</div>
                    </div>
                    <div>
                      <div className="text-[15px] text-muted-fg">{t("pinjaman.timeLeft")}</div>
                      <div className="mt-0.5 font-display font-bold">{loan.daysLeft} {t("home.daysSuffix")}</div>
                    </div>
                  </div>
                  <Progress value={loan.progress} color="#7c3aed" className="mt-4 h-2" />
                  <Link
                    to={`/app/baca/${book.id}`}
                    className="mt-5 inline-flex items-center gap-2 font-display text-[17px] font-bold text-accent hover:underline"
                  >
                    <BookText size={19} /> {t("bookdetail.readNow")} <ChevronRight size={18} />
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
