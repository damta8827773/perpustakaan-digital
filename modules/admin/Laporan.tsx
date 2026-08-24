import { useState } from "react";
import { Calendar, ChevronDown, Download } from "lucide-react";
import { REPORT } from "@/common/constants/catalog";
import { Card } from "@/components/ui";
import { useToast } from "@/components/Toast";
import { downloadTextFile, rowsToCsv } from "@/common/libs/download";

function ExportButtons({
  name, headers, rows,
}: {
  name: string;
  headers: string[];
  rows: (string | number)[][];
}) {
  const { notify } = useToast();
  const slug = name.toLowerCase().replace(/\s+/g, "-");

  const exportCsv = (ext: string) => {
    downloadTextFile(`laporan-${slug}.${ext}`, rowsToCsv(headers, rows));
    notify(`Laporan "${name}" diunduh (${ext.toUpperCase()}).`);
  };

  return (
    <div className="flex items-center gap-2.5">
      <button
        onClick={() => exportCsv("pdf")}
        className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-primary-light px-4 py-2 text-sm font-semibold text-primary hover:bg-primary-light-hover"
      >
        <Download size={14} /> PDF
      </button>
      <button
        onClick={() => exportCsv("csv")}
        className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-line bg-card px-4 py-2 text-sm font-semibold hover:bg-muted"
      >
        <Download size={14} /> Excel
      </button>
    </div>
  );
}

function LineChart() {
  const data = REPORT.monthlyLoans;
  const W = 460, H = 200, PADX = 40, PADY = 24;
  const max = 178, min = 0;
  const x = (i: number) => PADX + (i * (W - PADX - 12)) / (data.length - 1);
  const y = (v: number) => H - PADY - ((v - min) / (max - min)) * (H - PADY * 2);
  const points = data.map((d, i) => `${x(i)},${y(d.value)}`).join(" ");
  const gridValues = [0, 45, 89, 134, 178];
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div className="relative mt-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {gridValues.map((v) => (
          <g key={v}>
            <line
              x1={PADX} x2={W - 8} y1={y(v)} y2={y(v)}
              stroke="#e2e8f0" strokeDasharray="4 4"
            />
            <text x={PADX - 8} y={y(v) + 4} textAnchor="end" fontSize="10" fill="#64748b">
              {v}
            </text>
          </g>
        ))}
        <g className="chart-grow">
          <polyline points={points} fill="none" stroke="#1a73c8" strokeWidth="2.5" />
          {data.map((d, i) => (
            <g key={d.month}>
              <circle
                cx={x(i)} cy={y(d.value)}
                r={hover === i ? 6 : 4}
                fill="#1a73c8"
                className="cursor-pointer transition-[r] duration-150"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover((h) => (h === i ? null : h))}
              />
              <text x={x(i)} y={H - 4} textAnchor="middle" fontSize="10" fill="#64748b">
                {d.month}
              </text>
            </g>
          ))}
        </g>
      </svg>
      {hover !== null && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-lg bg-fg px-2.5 py-1.5 text-xs font-semibold text-white shadow-lg"
          style={{ left: `${(x(hover) / W) * 100}%`, top: `${(y(data[hover].value) / H) * 100}%`, marginTop: -8 }}
        >
          {data[hover].month}: {data[hover].value}
        </div>
      )}
    </div>
  );
}

function Donut() {
  const R = 70, STROKE = 30, C = 2 * Math.PI * R;
  const [hover, setHover] = useState<string | null>(null);
  let offset = 0;
  return (
    <div className="mt-4 flex items-center gap-8">
      <svg width="190" height="190" viewBox="0 0 190 190">
        <g className="chart-fade-scale">
          {REPORT.punctuality.map((p) => {
            const len = (p.value / 100) * C;
            const el = (
              <circle
                key={p.label}
                cx="95" cy="95" r={R}
                fill="none"
                stroke={p.color}
                strokeWidth={hover === p.label ? STROKE + 4 : STROKE}
                strokeDasharray={`${len} ${C - len}`}
                strokeDashoffset={-offset}
                transform="rotate(-90 95 95)"
                className="cursor-pointer transition-[stroke-width] duration-150"
                onMouseEnter={() => setHover(p.label)}
                onMouseLeave={() => setHover((h) => (h === p.label ? null : h))}
              />
            );
            offset += len;
            return el;
          })}
        </g>
        <text x="95" y="90" textAnchor="middle" fontSize="22" fontWeight="700" fill="#0d1b2a">
          {hover ? `${REPORT.punctuality.find((p) => p.label === hover)?.value}%` : "75%"}
        </text>
        <text x="95" y="110" textAnchor="middle" fontSize="11" fill="#64748b">
          {hover ?? "Tepat Waktu"}
        </text>
      </svg>
      <div className="space-y-4">
        {REPORT.punctuality.map((p) => (
          <div
            key={p.label}
            onMouseEnter={() => setHover(p.label)}
            onMouseLeave={() => setHover((h) => (h === p.label ? null : h))}
            className={`flex cursor-pointer items-center gap-3 rounded-lg px-1.5 py-1 transition-colors ${
              hover === p.label ? "bg-muted" : ""
            }`}
          >
            <span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="w-32 text-[15px]">{p.label}</span>
            <span className="font-display text-[17px] font-bold">{p.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BarChart() {
  const data = REPORT.favoriteCategories;
  const W = 460, H = 210, PADX = 40, PADY = 26;
  const max = 320;
  const bw = 52;
  const gap = (W - PADX - 16 - bw * data.length) / (data.length - 1);
  const y = (v: number) => H - PADY - (v / max) * (H - PADY * 2);
  const [hover, setHover] = useState<number | null>(null);
  return (
    <div className="relative mt-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {[0, 100, 200, 300].map((v) => (
          <g key={v}>
            <line x1={PADX} x2={W - 8} y1={y(v)} y2={y(v)} stroke="#e2e8f0" strokeDasharray="4 4" />
            <text x={PADX - 8} y={y(v) + 4} textAnchor="end" fontSize="10" fill="#64748b">
              {v}
            </text>
          </g>
        ))}
        {data.map((d, i) => {
          const bx = PADX + i * (bw + gap);
          return (
            <g key={d.name}>
              <rect
                x={bx} y={y(d.value)} width={bw} height={H - PADY - y(d.value)}
                rx="6"
                fill={hover === i ? "#7c3aed" : "#8b5cf6"}
                className="chart-grow cursor-pointer transition-colors"
                style={{ animationDelay: `${i * 60}ms` }}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover((h) => (h === i ? null : h))}
              />
              <text x={bx + bw / 2} y={H - 6} textAnchor="middle" fontSize="10" fill="#64748b">
                {d.name}
              </text>
            </g>
          );
        })}
      </svg>
      {hover !== null && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-lg bg-fg px-2.5 py-1.5 text-xs font-semibold text-white shadow-lg"
          style={{
            left: `${((PADX + hover * (bw + gap) + bw / 2) / W) * 100}%`,
            top: `${(y(data[hover].value) / H) * 100}%`,
            marginTop: -8,
          }}
        >
          {data[hover].name}: {data[hover].value}
        </div>
      )}
    </div>
  );
}

const PERIODS = [
  "Januari s.d. Juni 2026",
  "Juli s.d. Desember 2025",
  "Januari s.d. Desember 2025",
];

export default function Laporan() {
  const maxTop = REPORT.topBooks[0].count;
  const [period, setPeriod] = useState(REPORT.period);
  const [periodOpen, setPeriodOpen] = useState(false);
  return (
    <div>
      <div className="relative inline-block">
        <button
          onClick={() => setPeriodOpen((o) => !o)}
          className="flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-card px-5 py-3.5 text-[15px] font-semibold hover:bg-muted"
        >
          <Calendar size={17} className="text-muted-fg" /> {period}
          <ChevronDown size={16} className="text-muted-fg" />
        </button>
        {periodOpen && (
          <div className="absolute left-0 top-14 z-20 w-full overflow-hidden rounded-xl border border-line bg-card py-1.5 shadow-xl">
            {PERIODS.map((p) => (
              <button
                key={p}
                onClick={() => {
                  setPeriod(p);
                  setPeriodOpen(false);
                }}
                className={`block w-full cursor-pointer px-5 py-2.5 text-left text-[15px] hover:bg-muted ${p === period ? "font-bold text-primary" : ""}`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card className="p-7">
          <div className="flex items-start justify-between">
            <h2 className="font-display text-xl font-bold">Peminjaman per Bulan</h2>
            <ExportButtons
              name="Peminjaman per Bulan"
              headers={["Bulan", "Jumlah"]}
              rows={REPORT.monthlyLoans.map((m) => [m.month, m.value])}
            />
          </div>
          <LineChart />
        </Card>

        <Card className="p-7">
          <div className="flex items-start justify-between">
            <h2 className="font-display text-xl font-bold">Buku Terpopuler</h2>
            <ExportButtons
              name="Buku Terpopuler"
              headers={["Peringkat", "Judul", "Dipinjam"]}
              rows={REPORT.topBooks.map((b) => [b.rank, b.title, b.count])}
            />
          </div>
          <div className="mt-6 space-y-5">
            {REPORT.topBooks.map((b) => (
              <div key={b.rank} className="flex items-center gap-4">
                <span className="w-8 shrink-0 font-display text-[15px] font-bold text-muted-fg">
                  #{b.rank}
                </span>
                <div className="flex-1">
                  <div className="text-[15px] font-semibold">{b.title}</div>
                  <div className="mt-1.5 h-6 overflow-hidden rounded-full bg-muted">
                    <div
                      className="flex h-full items-center justify-end rounded-full bg-primary pr-3 text-xs font-bold text-white"
                      style={{ width: `${(b.count / maxTop) * 100}%` }}
                    >
                      {b.count}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-7">
          <div className="flex items-start justify-between">
            <h2 className="font-display text-xl font-bold">Keterlambatan</h2>
            <ExportButtons
              name="Keterlambatan"
              headers={["Kategori", "Persentase"]}
              rows={REPORT.punctuality.map((p) => [p.label, `${p.value}%`])}
            />
          </div>
          <Donut />
        </Card>

        <Card className="p-7">
          <div className="flex items-start justify-between">
            <h2 className="font-display text-xl font-bold">Kategori Favorit</h2>
            <ExportButtons
              name="Kategori Favorit"
              headers={["Kategori", "Jumlah"]}
              rows={REPORT.favoriteCategories.map((c) => [c.name, c.value])}
            />
          </div>
          <BarChart />
        </Card>
      </div>
    </div>
  );
}
