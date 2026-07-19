import { useEffect, useRef, useState, type ReactNode } from "react";
import { Bell, BookMarked, AlertCircle, Star } from "lucide-react";

function useClickOutside(onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);
  return ref;
}

const NOTIFICATIONS = [
  { icon: AlertCircle, tone: "text-destructive", title: "Metode Penelitian Kualitatif terlambat 7 hari", time: "Hari ini" },
  { icon: BookMarked, tone: "text-warning", title: "Algoritma dan Pemrograman jatuh tempo 2 hari lagi", time: "Kemarin" },
  { icon: Star, tone: "text-primary", title: "Beri rating untuk Psikologi Perkembangan", time: "3 hari lalu" },
];

export function NotificationBell({ dark = false }: { dark?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => setOpen(false));

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`relative cursor-pointer rounded-lg p-2 ${dark ? "text-white/80 hover:bg-white/10" : "text-muted-fg hover:bg-muted"}`}
        aria-label="Notifikasi"
      >
        <Bell size={20} />
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-[340px] overflow-hidden rounded-xl border border-line bg-card shadow-xl">
          <div className="border-b border-line px-5 py-3.5 font-display font-bold">
            Notifikasi
          </div>
          <div className="divide-y divide-line">
            {NOTIFICATIONS.map((n) => (
              <div key={n.title} className="flex items-start gap-3 px-5 py-3.5 hover:bg-muted/50">
                <n.icon size={18} className={`mt-0.5 shrink-0 ${n.tone}`} />
                <div>
                  <div className="text-sm leading-snug">{n.title}</div>
                  <div className="mt-1 text-xs text-muted-fg">{n.time}</div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full cursor-pointer bg-muted/40 py-3 text-center text-sm font-semibold text-primary hover:bg-muted">
            Tandai semua dibaca
          </button>
        </div>
      )}
    </div>
  );
}

export function DropdownMenu({
  trigger, children, align = "right",
}: {
  trigger: (open: boolean) => ReactNode;
  children: (close: () => void) => ReactNode;
  align?: "right" | "left";
}) {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => setOpen(false));
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((o) => !o)} className="cursor-pointer">
        {trigger(open)}
      </button>
      {open && (
        <div
          className={`absolute top-12 z-50 w-[220px] overflow-hidden rounded-xl border border-line bg-card py-1.5 shadow-xl ${align === "right" ? "right-0" : "left-0"}`}
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}
