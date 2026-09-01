import { useEffect, useRef } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { PartyPopper, CheckCircle2 } from "lucide-react";
import { bookById, STUDENT } from "@/common/constants/catalog";
import { RemoteCover, Card } from "@/components/ui";
import { addLoan } from "@/services/libraryStore";
import { useTranslate } from "@/services/localeStore";

export default function Berhasil() {
  const { id } = useParams();
  const t = useTranslate();
  const { state } = useLocation() as {
    state?: { duration: number; start: string; end: string };
  };
  const book = bookById(id ?? "");
  const recorded = useRef(false);

  const duration = state?.duration ?? 14;
  const start = state?.start ?? "1 Juli 2026";
  const end = state?.end ?? "15 Juli 2026";

  // Catat pinjaman baru ke store agar muncul di "Pinjaman Saya" dan beranda.
  useEffect(() => {
    if (book && !recorded.current) {
      recorded.current = true;
      addLoan(book.id, end);
    }
  }, [book, end]);

  if (!book) return <p>{t("bookdetail.notFound")}</p>;

  return (
    <div className="mx-auto max-w-[820px] pt-6 text-center">
      <div className="mx-auto flex h-[120px] w-[120px] items-center justify-center rounded-full bg-success-light">
        <PartyPopper size={48} className="text-success" />
      </div>

      <h1 className="mt-9 font-display text-[36px] font-bold">{t("berhasil.title")}</h1>
      <p className="mt-4 text-lg text-muted-fg">
        {t("berhasil.loanRecordedPrefix")} <strong className="text-fg">{book.title}</strong> {t("berhasil.loanRecordedSuffix")}
      </p>
      <p className="mx-auto mt-2 max-w-[560px] text-lg leading-relaxed text-muted-fg">
        {t("berhasil.pickupNote")}
      </p>

      <Card className="mt-10 p-7 text-left">
        <div className="flex items-center justify-between border-b border-line pb-5">
          <span className="flex items-center gap-2.5 font-display text-lg font-bold text-success">
            <CheckCircle2 size={22} /> {t("berhasil.confirmationLabel")}
          </span>
          <span className="rounded-full bg-primary-light px-4 py-1.5 font-mono text-sm font-semibold text-primary">
            #64649
          </span>
        </div>

        <div className="mt-6 flex items-center gap-5">
          <RemoteCover title={book.title} author={book.author} initials={book.initials} color={book.color}
            className="h-[110px] w-[88px] rounded-xl"
            textClass="text-2xl"
          />
          <div>
            <h3 className="font-display text-2xl font-bold">{book.title}</h3>
            <p className="mt-1 text-lg text-muted-fg">{book.author}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            [t("konfirmasi.borrower"), `${STUDENT.name} (${STUDENT.nim})`],
            [t("konfirmasi.duration"), `${duration} ${t("home.daysSuffix")}`],
            [t("berhasil.startLabel"), start],
            [t("berhasil.returnLabel"), end],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl bg-bg px-6 py-5">
              <div className="text-[15px] text-muted-fg">{label}</div>
              <div className="mt-1 font-display text-lg font-bold">{value}</div>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-9 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Link
          to={`/app/buku/${book.id}`}
          className="rounded-xl border border-line bg-card py-4 font-display text-[17px] font-bold hover:bg-muted"
        >
          {t("berhasil.backToDetail")}
        </Link>
        <Link
          to="/app/pinjaman"
          className="rounded-xl bg-primary py-4 font-display text-[17px] font-bold text-white hover:bg-primary-dark"
        >
          {t("berhasil.viewMyLoans")}
        </Link>
      </div>
    </div>
  );
}
