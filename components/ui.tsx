import { useEffect, useState, type ReactNode, type MouseEventHandler } from "react";
import { X } from "lucide-react";
import { findGoogleBookCover } from "@/services/googleBooks";

export function BookCover({
  initials, color, className = "", textClass = "text-2xl",
}: {
  initials: string; color: string; className?: string; textClass?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center font-display font-bold text-white ${textClass} ${className}`}
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
}

// Sampul buku sungguhan diambil dari Google Books saat tersedia. Selama
// memuat atau bila tidak ditemukan, tampilkan blok warna berinisial sebagai
// cadangan agar tata letak tidak pernah kosong.
const coverCache = new Map<string, string | null>();

export function RemoteCover({
  title, author, initials, color, className = "", textClass = "text-2xl",
}: {
  title: string; author: string; initials: string; color: string;
  className?: string; textClass?: string;
}) {
  const key = `${title}::${author}`;
  const [src, setSrc] = useState<string | null>(coverCache.get(key) ?? null);
  const [loaded, setLoaded] = useState(coverCache.has(key));

  useEffect(() => {
    let active = true;
    if (coverCache.has(key)) return;
    findGoogleBookCover(title, author).then((url) => {
      if (!active) return;
      coverCache.set(key, url ?? null);
      setSrc(url ?? null);
      setLoaded(true);
    });
    return () => {
      active = false;
    };
  }, [key, title, author]);

  if (loaded && src) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <img
          src={src}
          alt={`Sampul buku ${title}`}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => setSrc(null)}
        />
      </div>
    );
  }

  return (
    <BookCover initials={initials} color={color} className={className} textClass={textClass} />
  );
}

export function Badge({
  tone, children, className = "",
}: {
  tone: "primary" | "accent" | "success" | "warning" | "destructive" | "muted";
  children: ReactNode;
  className?: string;
}) {
  const tones: Record<string, string> = {
    primary: "bg-primary-light text-primary",
    accent: "bg-accent-light text-accent",
    success: "bg-success-light text-success",
    warning: "bg-warning-light text-warning",
    destructive: "bg-destructive-light text-destructive",
    muted: "bg-muted text-muted-fg",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function Stars({ value, size = 18 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i} width={size} height={size} viewBox="0 0 24 24"
          fill={value >= i - 0.25 ? "#f59e0b" : "none"}
          stroke="#f59e0b" strokeWidth="1.6"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}

export function Progress({
  value, color, className = "",
}: { value: number; color: string; className?: string }) {
  return (
    <div className={`h-1.5 w-full overflow-hidden rounded-full bg-[#e2e8f0] ${className}`}>
      <div
        className="h-full rounded-full"
        style={{ width: `${Math.min(100, Math.max(0, value * 100))}%`, backgroundColor: color }}
      />
    </div>
  );
}

export function Modal({
  title, onClose, children, footer, headerAccessory,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  headerAccessory?: ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-fg/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[560px] rounded-xl bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line px-7 py-5">
          <h3 className="font-display text-xl font-bold">{title}</h3>
          <div className="flex items-center gap-3">
            {headerAccessory}
            <button
              onClick={onClose}
              className="cursor-pointer rounded-md p-1 text-muted-fg hover:bg-muted"
              aria-label="Tutup"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="px-7 py-6">{children}</div>
        {footer && <div className="flex justify-end gap-3 px-7 pb-7">{footer}</div>}
      </div>
    </div>
  );
}

type BtnVariant = "primary" | "secondary" | "accent" | "outline" | "ghost" | "destructive" | "outline-primary";

export function Button({
  variant = "primary", className = "", children, onClick, type = "button", disabled,
}: {
  variant?: BtnVariant;
  className?: string;
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const variants: Record<BtnVariant, string> = {
    primary: "bg-primary text-white hover:bg-primary-dark",
    secondary: "bg-primary-light text-primary hover:bg-[#d8e8f8]",
    accent: "bg-accent text-white hover:bg-accent-dark",
    outline: "border border-line bg-card text-fg hover:bg-muted",
    "outline-primary": "border border-primary bg-card text-primary hover:bg-primary-light",
    ghost: "text-muted-fg hover:bg-muted",
    destructive: "bg-destructive text-white hover:bg-[#b91c1c]",
  };
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`cursor-pointer rounded-lg px-5 py-2.5 font-display text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Card({
  className = "", children,
}: { className?: string; children: ReactNode }) {
  return (
    <div className={`rounded-xl border border-line bg-card ${className}`}>
      {children}
    </div>
  );
}
