import { useEffect, useRef, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, BellOff } from "lucide-react";
import {
  useNotifications, markRead, markAllRead, isRead,
  type NotifRole, type NotifTone, type AppNotification,
} from "@/services/notificationsStore";
import { markChatRead, useAdminChatInbox } from "@/services/chatStore";
import { useFeedback, commentLikeNotificationsFor } from "@/services/feedbackStore";
import { useCurrentStudent } from "@/services/sessionStore";
import { useTranslate } from "@/services/localeStore";

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

const TONE_DOT: Record<NotifTone, string> = {
  primary: "bg-primary",
  warning: "bg-warning",
  destructive: "bg-destructive",
  success: "bg-success",
  accent: "bg-accent",
};

export function NotificationBell({
  role, dark = false,
}: { role: NotifRole; dark?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => setOpen(false));
  const navigate = useNavigate();
  const t = useTranslate();
  const items = useNotifications(role);

  // Live chat masuk (Firestore, real-time) digabung ke daftar notifikasi
  // admin yang sudah ada (localStorage) - bentuk datanya sama persis supaya
  // tidak perlu pola tampilan baru.
  const chatInbox = useAdminChatInbox(role === "admin");
  const unreadChats = role === "admin" ? chatInbox.filter((c) => c.unreadByAdmin) : [];
  const chatItems: AppNotification[] = unreadChats.map((c) => ({
    id: `chat-${c.studentUid}`,
    tone: "accent",
    title: `${t("notif.newMessageFromPrefix")} ${c.studentName || t("notif.studentFallback")}`,
    detail: c.lastMessageText,
    time: t("notif.liveChat"),
    to: "/admin/pesan",
  }));

  // Komentar mahasiswa yang disukai orang lain - dihitung dari feedbackStore
  // (localStorage), bukan Firestore, jadi perlu berlangganan lewat
  // useFeedback() supaya bel notifikasi langsung update saat ada suka baru.
  useFeedback();
  const student = useCurrentStudent();
  const likeItems: AppNotification[] =
    role === "user"
      ? commentLikeNotificationsFor(student.email || `${student.nim}@mahasiswa.uinjkt.ac.id`)
          .filter((n) => !isRead("user", n.id))
          .map((n) => ({
            id: n.id,
            tone: "primary",
            title: `${n.likerName || t("notif.someone")} ${t("notif.likedYourCommentSuffix")}`,
            detail: `"${n.commentText}" ${t("notif.onBookPrefix")} ${n.bookTitle}`,
            time: t("notif.newLabel"),
            to: `/app/buku/${n.bookId}`,
          }))
      : [];

  const allItems = [...chatItems, ...likeItems, ...items];
  const unread = allItems.length;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`relative cursor-pointer rounded-lg p-2 ${dark ? "text-white/80 hover:bg-white/10" : "text-muted-fg hover:bg-muted"}`}
        aria-label={t("notif.title")}
      >
        <Bell size={20} />
        {unread > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-[360px] overflow-hidden rounded-xl border border-line bg-card shadow-xl">
          <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
            <span className="font-display font-bold">{t("notif.title")}</span>
            <span className="text-xs text-muted-fg">
              {role === "admin" ? t("notif.adminPanel") : t("notif.studentFallback")}
            </span>
          </div>

          {unread === 0 ? (
            <div className="flex flex-col items-center gap-2 px-5 py-10 text-center text-muted-fg">
              <BellOff size={26} />
              <span className="text-sm">{t("notif.empty")}</span>
            </div>
          ) : (
            <>
              <div className="max-h-[320px] divide-y divide-line overflow-y-auto">
                {allItems.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => {
                      if (n.id.startsWith("chat-")) void markChatRead(n.id.slice("chat-".length), "admin");
                      else markRead(role, n.id);
                      setOpen(false);
                      navigate(n.to);
                    }}
                    className="flex w-full items-start gap-3 px-5 py-3.5 text-left hover:bg-muted/50"
                  >
                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${TONE_DOT[n.tone]}`} />
                    <div>
                      <div className="text-sm font-semibold leading-snug">{n.title}</div>
                      <div className="mt-0.5 text-sm leading-snug text-muted-fg">{n.detail}</div>
                      <div className="mt-1 text-xs text-muted-fg">{n.time}</div>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  markAllRead(role);
                  unreadChats.forEach((c) => void markChatRead(c.studentUid, "admin"));
                  likeItems.forEach((n) => markRead("user", n.id));
                }}
                className="w-full cursor-pointer bg-muted/40 py-3 text-center text-sm font-semibold text-primary hover:bg-muted"
              >
                {t("notif.markAllRead")}
              </button>
            </>
          )}
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
