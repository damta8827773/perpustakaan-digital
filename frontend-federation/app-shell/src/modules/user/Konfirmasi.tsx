import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Info } from "lucide-react";
import { bookById, STUDENT } from "@/common/constants/catalog";
import { BookCover, Button, Card } from "@/components/ui";

export default function Konfirmasi() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation() as {
    state?: { duration: number; start: string; end: string; note?: string };
  };
  const book = bookById(id ?? "");
  if (!book) return <p>Buku tidak ditemukan.</p>;

  const duration = state?.duration ?? 14;
  const start = state?.start ?? "1 Juli 2026";
  const end = state?.end ?? "15 Juli 2026";

  return (
    <div className="mx-auto max-w-[880px]">
      <Link
        to={`/app/buku/${book.id}/reservasi`}
        className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
      >
        <ArrowLeft size={18} /> Kembali ke Form
      </Link>

      <h1 className="mt-8 font-display text-[36px] font-bold">Konfirmasi Peminjaman</h1>
      <p className="mt-2 text-lg text-muted-fg">
        Periksa kembali detail peminjaman sebelum mengkonfirmasi.
      </p>

      <Card className="mt-8 p-7">
        <div className="text-sm font-bold uppercase tracking-wider text-muted-fg">
          Detail Buku
        </div>
        <div className="mt-5 flex items-center gap-5">
          <BookCover
            initials={book.initials}
            color={book.color}
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
          Detail Peminjaman
        </div>
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            ["Peminjam", STUDENT.name],
            ["NIM", STUDENT.nim],
            ["Durasi", `${duration} hari`],
            ["Tgl Mulai", start],
            ["Tgl Kembali", end],
            ["Stok Tersedia", `${book.stockAvailable} eksemplar`],
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
        <p className="leading-relaxed text-[#92610c]">
          Dengan mengkonfirmasi, Anda setuju mengembalikan buku tepat waktu.
          Keterlambatan dikenakan denda.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Button
          variant="outline"
          className="py-4 text-[17px]"
          onClick={() => navigate(`/app/buku/${book.id}/reservasi`)}
        >
          Ubah Detail
        </Button>
        <Button
          className="py-4 text-[17px]"
          onClick={() =>
            navigate(`/app/buku/${book.id}/berhasil`, { state: { duration, start, end } })
          }
        >
          Konfirmasi Peminjaman
        </Button>
      </div>
    </div>
  );
}
