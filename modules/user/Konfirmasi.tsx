import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Info } from "lucide-react";
import { bookById, STUDENT } from "@/common/constants/catalog";
import { RemoteCover, Button, Card } from "@/components/ui";
import { useTranslate } from "@/services/localeStore";

export default function Konfirmasi() {
  const { id } = useParams();
  const navigate = useNavigate();
  const t = useTranslate();
  const { state } = useLocation() as {
    state?: { duration: number; start: string; end: string; note?: string };
  };
  const book = bookById(id ?? "");
  if (!book) return <p>{t("bookdetail.notFound")}</p>;

  const duration = state?.duration ?? 14;
  const start = state?.start ?? "1 Juli 2026";
  const end = state?.end ?? "15 Juli 2026";

  return (
    <div className="mx-auto max-w-[880px]">
      <Link
        to={`/app/buku/${book.id}/reservasi`}
        className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
      >
        <ArrowLeft size={18} /> {t("konfirmasi.backToForm")}
      </Link>

      <h1 className="mt-8 font-display text-[36px] font-bold">{t("konfirmasi.title")}</h1>
      <p className="mt-2 text-lg text-muted-fg">{t("konfirmasi.subtitle")}</p>

      <Card className="mt-8 p-7">
        <div className="text-sm font-bold uppercase tracking-wider text-muted-fg">
          {t("konfirmasi.bookDetail")}
        </div>
        <div className="mt-5 flex items-center gap-5">
          <RemoteCover title={book.title} author={book.author} initials={book.initials} color={book.color}
            className="h-[100px] w-[84px] rounded-xl"
            textClass="text-2xl"
          />
          <div>
            <h3 className="font-display text-2xl font-bold">{book.title}</h3>
            <p className="mt-1 text-lg text-muted-fg">{book.author}</p>
          </div>
        </div>
      </Card>

      <Card className="mt-6 p-7">
        <div className="text-sm font-bold uppercase tracking-wider text-muted-fg">
          {t("konfirmasi.loanDetail")}
        </div>
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            [t("konfirmasi.borrower"), STUDENT.name],
            [t("profile.nimLabel"), STUDENT.nim],
            [t("konfirmasi.duration"), `${duration} ${t("home.daysSuffix")}`],
            [t("konfirmasi.startDate"), start],
            [t("konfirmasi.returnDate"), end],
            [t("konfirmasi.stockAvailable"), `${book.stockAvailable} ${t("bookdetail.copiesSuffix")}`],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl bg-bg px-6 py-5">
              <div className="text-[15px] text-muted-fg">{label}</div>
              <div className="mt-1 font-display text-lg font-bold">{value}</div>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-6 flex items-start gap-3 rounded-xl border border-[#f2d99c] bg-[#fdf7e7] px-6 py-5">
        <Info size={20} className="mt-0.5 shrink-0 text-warning" />
        <p className="leading-relaxed text-[#92610c]">{t("konfirmasi.warningNote")}</p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Button
          variant="outline"
          className="py-4 text-[17px]"
          onClick={() => navigate(`/app/buku/${book.id}/reservasi`)}
        >
          {t("konfirmasi.editDetail")}
        </Button>
        <Button
          className="py-4 text-[17px]"
          onClick={() =>
            navigate(`/app/buku/${book.id}/berhasil`, { state: { duration, start, end } })
          }
        >
          {t("konfirmasi.confirmLoan")}
        </Button>
      </div>
    </div>
  );
}
