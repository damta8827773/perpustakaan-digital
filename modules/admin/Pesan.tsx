import { useEffect, useMemo, useState } from "react";
import { MessageCircle, Clock } from "lucide-react";
import { Card } from "@/components/ui";
import { ChatThread } from "@/components/ChatThread";
import { useAuth } from "@/services/auth";
import {
  isChatAvailable, markChatRead, useAdminChatInbox, formatFullTimestamp, type ChatSummary,
} from "@/services/chatStore";

function timeAgo(ms: number | null): string {
  if (!ms) return "";
  const min = Math.floor((Date.now() - ms) / 60000);
  if (min < 1) return "Baru saja";
  if (min < 60) return `${min} menit lalu`;
  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour} jam lalu`;
  return `${Math.floor(hour / 24)} hari lalu`;
}

/** Antrean: yang belum dibalas admin didahulukan (FIFO, paling lama duluan),
 * baru sisanya diurut dari yang paling baru aktif. */
function toQueue(chats: ChatSummary[]): { chat: ChatSummary; queueNo: number | null }[] {
  const waiting = chats
    .filter((c) => c.unreadByAdmin)
    .sort((a, b) => (a.lastMessageAt ?? 0) - (b.lastMessageAt ?? 0));
  const answered = chats
    .filter((c) => !c.unreadByAdmin)
    .sort((a, b) => (b.lastMessageAt ?? 0) - (a.lastMessageAt ?? 0));
  return [
    ...waiting.map((chat, i) => ({ chat, queueNo: i + 1 })),
    ...answered.map((chat) => ({ chat, queueNo: null })),
  ];
}

export default function Pesan() {
  const { user } = useAuth();
  const chats = useAdminChatInbox();
  const queue = useMemo(() => toQueue(chats), [chats]);
  const [selected, setSelected] = useState<string | null>(null);
  const active = chats.find((c) => c.studentUid === selected) ?? queue[0]?.chat ?? null;

  useEffect(() => {
    if (active?.unreadByAdmin) void markChatRead(active.studentUid, "admin");
  }, [active?.studentUid, active?.unreadByAdmin]);

  if (!isChatAvailable()) {
    return (
      <Card className="p-10 text-center text-muted-fg">
        Fitur live chat memerlukan konfigurasi Firebase (nonaktif di mode demo).
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[340px_1fr]">
      <Card className="divide-y divide-line overflow-hidden">
        {queue.length === 0 ? (
          <div className="p-8 text-center text-muted-fg">Belum ada percakapan.</div>
        ) : (
          queue.map(({ chat: c, queueNo }) => (
            <button
              key={c.studentUid}
              onClick={() => setSelected(c.studentUid)}
              title={formatFullTimestamp(c.lastMessageAt)}
              className={`flex w-full items-start gap-3 px-5 py-4 text-left transition-colors hover:bg-muted/50 ${
                active?.studentUid === c.studentUid ? "bg-primary-light/50" : ""
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                <MessageCircle size={17} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-display font-bold">{c.studentName || "Mahasiswa"}</span>
                  {queueNo !== null && (
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-destructive-light px-2 py-0.5 text-[11px] font-bold text-destructive">
                      <Clock size={11} /> Antrean #{queueNo}
                    </span>
                  )}
                </div>
                <div className="mt-0.5 truncate text-sm text-muted-fg">
                  {c.lastSenderRole === "admin" ? "Anda: " : ""}
                  {c.lastMessageText}
                </div>
                <div className="mt-0.5 text-xs text-muted-fg">{timeAgo(c.lastMessageAt)}</div>
              </div>
            </button>
          ))
        )}
      </Card>

      <Card className="flex h-[600px] flex-col overflow-hidden">
        {!active ? (
          <div className="flex flex-1 items-center justify-center text-muted-fg">
            Pilih percakapan di sebelah kiri.
          </div>
        ) : !user ? (
          <div className="flex flex-1 items-center justify-center px-6 text-center text-sm text-muted-fg">
            Sesi admin tidak terdeteksi di Firebase Auth — coba masuk ulang.
          </div>
        ) : (
          <>
            <div className="shrink-0 border-b border-line px-5 py-4">
              <div className="font-display font-bold">{active.studentName || "Mahasiswa"}</div>
              <div className="text-xs text-muted-fg">
                Aktivitas terakhir: {formatFullTimestamp(active.lastMessageAt)}
              </div>
            </div>
            <ChatThread
              key={active.studentUid}
              studentUid={active.studentUid}
              studentName={active.studentName}
              viewerRole="admin"
              viewerUid={user.uid}
              viewerName="Admin Perpustakaan"
            />
          </>
        )}
      </Card>
    </div>
  );
}
