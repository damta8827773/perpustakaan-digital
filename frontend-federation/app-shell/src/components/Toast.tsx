import {
  createContext, useCallback, useContext, useState, type ReactNode,
} from "react";
import { CheckCircle2, Info, X } from "lucide-react";

type ToastTone = "success" | "info";
interface ToastItem { id: number; message: string; tone: ToastTone }

interface ToastApi {
  notify: (message: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const notify = useCallback((message: string, tone: ToastTone = "success") => {
    const id = Date.now() + Math.random();
    setItems((prev) => [...prev, { id, message, tone }]);
    window.setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const dismiss = (id: number) =>
    setItems((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
        {items.map((t) => (
          <div
            key={t.id}
            className="flex min-w-[280px] max-w-[380px] items-start gap-3 rounded-xl border border-line bg-card px-4 py-3.5 shadow-xl"
          >
            {t.tone === "success" ? (
              <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-success" />
            ) : (
              <Info size={20} className="mt-0.5 shrink-0 text-primary" />
            )}
            <span className="flex-1 text-[15px] leading-snug">{t.message}</span>
            <button
              onClick={() => dismiss(t.id)}
              className="cursor-pointer text-muted-fg hover:text-fg"
              aria-label="Tutup notifikasi"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast harus dipakai di dalam ToastProvider");
  return ctx;
}
