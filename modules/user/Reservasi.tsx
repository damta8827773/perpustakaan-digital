import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Calendar, FileText, CheckCircle2 } from "lucide-react";
import { bookById } from "@/common/constants/catalog";
import { RemoteCover, Card } from "@/components/ui";
import { useLocale, useTranslate } from "@/services/localeStore";

const INTL_LOCALE = { id: "id-ID", en: "en-US", ar: "ar" } as const;

export default function Reservasi() {
  const { id } = useParams();
  const navigate = useNavigate();
  const book = bookById(id ?? "");
  const t = useTranslate();
  const locale = useLocale();
  const [duration, setDuration] = useState(14);
  const [startDate, setStartDate] = useState("2026-07-01");
  const [note, setNote] = useState("");

  const DURATIONS = [
    { days: 7, label: t("reservasi.days7"), sub: t("reservasi.days7Sub") },
    { days: 14, label: t("reservasi.days14"), sub: t("reservasi.days14Sub") },
    { days: 21, label: t("reservasi.days21"), sub: t("reservasi.days21Sub") },
  ];

  if (!book) return <p>{t("bookdetail.notFound")}</p>;

  const start = new Date(startDate + "T00:00:00");
  const end = new Date(start);
  end.setDate(end.getDate() + duration);
  const fmt = (d: Date) =>
    d.toLocaleDateString(INTL_LOCALE[locale], { day: "numeric", month: "long", year: "numeric" });

  return (
    <div>
      <Link
        to={`/app/buku/${book.id}`}
        className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
      >
        <ArrowLeft size={18} /> {t("reservasi.backToDetail")}
      </Link>

      <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_400px]">
        <div>
          <h1 className="font-display text-[36px] font-bold">{t("reservasi.title")}</h1>
          <p className="mt-2 text-lg text-muted-fg">{t("reservasi.subtitle")}</p>

          <h3 className="mt-9 font-display text-lg font-bold">
            {t("reservasi.durationLabel")} <span className="text-destructive">*</span>
          </h3>
          <div className="mt-4 grid grid-cols-3 gap-4">
            {DURATIONS.map((d) => (
              <button
                key={d.days}
                onClick={() => setDuration(d.days)}
                className={`cursor-pointer rounded-xl border px-5 py-4 text-left transition-colors ${
                  duration === d.days
                    ? "border-primary bg-primary-light/60"
                    : "border-line bg-card hover:bg-muted"
                }`}
              >
                <div
                  className={`font-display text-lg font-bold ${duration === d.days ? "text-primary" : ""}`}
                >
                  {d.label}
                </div>
                <div className="mt-0.5 text-[15px] text-muted-fg">{d.sub}</div>
              </button>
            ))}
          </div>

          <h3 className="mt-9 font-display text-lg font-bold">
            {t("reservasi.startDateLabel")} <span className="text-destructive">*</span>
          </h3>
          <p className="mt-1.5 text-muted-fg">{t("reservasi.startDateHint")}</p>
          <div className="relative mt-4 max-w-[420px]">
            <Calendar
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-fg"
            />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-xl border border-line bg-card py-3.5 pl-12 pr-4 text-[15px] outline-none focus:border-primary"
            />
          </div>

          <div className="mt-5 flex items-center gap-4 rounded-xl bg-primary-light/60 px-5 py-4">
            <Calendar size={20} className="shrink-0 text-primary" />
            <div>
              <div className="font-display font-bold text-primary">
                {t("reservasi.estimatedReturnLabel")}
              </div>
              <div className="mt-0.5 text-[15px] text-muted-fg">{fmt(end)}</div>
            </div>
          </div>

          <h3 className="mt-9 font-display text-lg font-bold">{t("reservasi.noteLabel")}</h3>
          <div className="relative mt-4">
            <FileText size={18} className="absolute left-4 top-4 text-muted-fg" />
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              placeholder={t("reservasi.notePlaceholder")}
              className="w-full resize-none rounded-xl border border-line bg-card py-3.5 pl-12 pr-4 text-[15px] outline-none placeholder:text-muted-fg/70 focus:border-primary"
            />
          </div>

          <button
            onClick={() =>
              navigate(`/app/buku/${book.id}/konfirmasi`, {
                state: { duration, start: fmt(start), end: fmt(end), note },
              })
            }
            className="mt-8 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary py-4 font-display text-[17px] font-bold text-white hover:bg-primary-dark"
          >
            {t("reservasi.continueToConfirm")} <ArrowRight size={19} />
          </button>
        </div>

        <div>
          <Card className="overflow-hidden">
            <RemoteCover title={book.title} author={book.author} initials={book.initials} color={book.color}
              className="h-[330px] w-full rounded-b-none"
              textClass="text-6xl"
            />
            <div className="p-6">
              <h3 className="font-display text-xl font-bold">{book.title}</h3>
              <p className="mt-1 text-muted-fg">{book.author}</p>
              <div className="mt-5 divide-y divide-line border-t border-line">
                {[
                  [t("reservasi.stockAvailable"), `${book.stockAvailable} ${t("pinjaman.ofSuffix")} ${book.stockTotal}`],
                  [t("bookdetail.labelDuration"), `${duration} ${t("home.daysSuffix")}`],
                  [t("reservasi.startDateValueLabel"), fmt(start)],
                  [t("reservasi.returnDateValueLabel"), fmt(end)],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between py-3.5">
                    <span className="text-[15px] text-muted-fg">{label}</span>
                    <span className="font-display text-[15px] font-bold">{value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2.5 rounded-xl bg-success-light px-4 py-3.5 text-sm font-semibold text-success">
                <CheckCircle2 size={17} className="shrink-0" />
                {t("reservasi.physicalAvailableNote")}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
