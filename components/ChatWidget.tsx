import { useEffect, useState } from "react";
import { MessageCircle, X, Clock } from "lucide-react";
import { auth } from "@/common/libs/firebase";
import { ChatThread } from "@/components/ChatThread";
import { useCurrentStudent } from "@/services/sessionStore";
import {
  isChatAvailable, markChatRead, useChatSummary, useWaitingQueueCount,
} from "@/services/chatStore";

function useElapsedMinutes(sinceMs: number | null): number | null {
  const [, tick] = useState(0);
  useEffect(() => {
    if (sinceMs == null) return;
    const id = window.setInterval(() => tick((n) => n + 1), 15_000);
    return () => window.clearInterval(id);
  }, [sinceMs]);
  if (sinceMs == null) return null;
  return Math.max(0, Math.floor((Date.now() - sinceMs) / 60000));
}

/** Tombol chat mengambang untuk portal mahasiswa, dipasang sekali di UserShell. */
export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const student = useCurrentStudent();
  const uid = auth.currentUser?.uid ?? null;
  const summary = useChatSummary(uid);
  const available = isChatAvailable() && !!uid;
  const isWaiting = !!summary?.unreadByAdmin;
  const queueCount = useWaitingQueueCount(isWaiting);
  const waitedMinutes = useElapsedMinutes(isWaiting ? summary?.waitingSinceAt ?? null : null);

  function toggle() {
    setOpen((o) => {
      const next = !o;
      if (next && uid) void markChatRead(uid, "student");
      return next;
    });
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-6 z-40 flex h-[520px] w-[340px] flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-2xl">
          <div className="flex shrink-0 items-center justify-between border-b border-line px-4 py-3">
            <span className="flex items-center gap-2 font-display font-bold">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-light text-primary">
                <MessageCircle size={15} />
              </span>
              Live Chat Admin
            </span>
            <button
              onClick={() => setOpen(false)}
              className="cursor-pointer rounded-md p-1 text-muted-fg hover:bg-muted"
              aria-label="Tutup"
            >
              <X size={18} />
            </button>
          </div>
          {isWaiting && (
            <div className="flex shrink-0 items-center gap-2 border-b border-line bg-warning-light/60 px-4 py-2 text-xs font-semibold text-warning">
              <Clock size={13} />
              {waitedMinutes !== null && waitedMinutes > 0
                ? `Sudah menunggu ${waitedMinutes} menit`
                : "Menunggu balasan admin"}
              {queueCount > 1 && ` · ${queueCount - 1} mahasiswa lain juga menunggu`}
            </div>
          )}
          {available && uid ? (
            <ChatThread
              studentUid={uid}
              studentName={student.name}
              viewerRole="student"
              viewerUid={uid}
              viewerName={student.name}
            />
          ) : (
            <div className="flex flex-1 items-center justify-center px-6 text-center text-sm text-muted-fg">
              {isChatAvailable()
                ? "Masuk dengan akun (Google atau kata sandi) untuk memakai live chat."
                : "Fitur chat memerlukan konfigurasi Firebase (nonaktif di mode demo)."}
            </div>
          )}
        </div>
      )}
      <button
        onClick={toggle}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-lg transition-colors hover:bg-primary-dark"
        aria-label="Live chat admin"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
        {!open && summary?.unreadByStudent && (
          <span className="absolute right-0 top-0 h-3.5 w-3.5 rounded-full border-2 border-card bg-destructive" />
        )}
      </button>
    </>
  );
}
