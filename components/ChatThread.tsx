import { useEffect, useRef, useState } from "react";
import { Send, ShieldCheck, Check, CheckCheck, Bot } from "lucide-react";
import { Button, Avatar } from "@/components/ui";
import { useLocale, useTranslate } from "@/services/localeStore";
import {
  sendChatMessage, useChatMessages, useChatSummary, formatFullTimestamp, type ChatSenderRole,
} from "@/services/chatStore";

function SenderAvatar({ role, senderName }: { role: ChatSenderRole; senderName: string }) {
  if (role === "ai") {
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-white">
        <Bot size={16} />
      </div>
    );
  }
  if (role === "admin") {
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white">
        <ShieldCheck size={15} />
      </div>
    );
  }
  return <Avatar name={senderName || "Mahasiswa"} className="h-8 w-8 shrink-0" textClass="text-xs" />;
}

/** Bubble chat bersama, dipakai baik oleh widget mahasiswa maupun inbox admin. */
export function ChatThread({
  studentUid, studentName, viewerRole, viewerUid, viewerName,
}: {
  studentUid: string;
  studentName: string;
  viewerRole: ChatSenderRole;
  viewerUid: string;
  viewerName: string;
}) {
  const messages = useChatMessages(studentUid);
  const summary = useChatSummary(studentUid);
  const t = useTranslate();
  const locale = useLocale();
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function submit() {
    const clean = text.trim();
    if (!clean || busy) return;
    setBusy(true);
    try {
      await sendChatMessage(studentUid, studentName, viewerUid, viewerRole, viewerName, clean);
      setText("");
    } catch {
      // biarkan teks tetap di kotak supaya bisa dicoba kirim ulang
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <p className="py-6 text-center text-sm text-muted-fg">{t("chat.empty")}</p>
        )}
        {messages.map((m) => {
          const mine = m.senderRole === viewerRole;
          const counterpartReadAt = viewerRole === "student"
            ? summary?.lastReadByAdminAt
            : summary?.lastReadByStudentAt;
          const isRead = mine && m.createdAt != null && counterpartReadAt != null && m.createdAt <= counterpartReadAt;
          return (
            <div key={m.id} className={`flex items-end gap-2 ${mine ? "flex-row-reverse" : "flex-row"}`}>
              {!mine && <SenderAvatar role={m.senderRole} senderName={m.senderName} />}
              <div className={`flex max-w-[75%] flex-col ${mine ? "items-end" : "items-start"}`}>
                <div
                  className={`rounded-xl px-4 py-2.5 text-[14px] leading-relaxed ${
                    mine
                      ? "bg-primary text-white"
                      : m.senderRole === "ai"
                        ? "bg-accent-light"
                        : "bg-primary-light/60"
                  }`}
                >
                  {!mine && m.senderRole === "admin" && (
                    <div className="mb-1 flex items-center gap-1.5 text-xs font-bold text-primary">
                      <ShieldCheck size={13} /> {t("chat.adminLabel")}
                    </div>
                  )}
                  {m.senderRole === "ai" && (
                    <div className="mb-1 flex items-center gap-1.5 text-xs font-bold text-accent">
                      <Bot size={13} /> {t("chat.aiLabel")}
                    </div>
                  )}
                  <p className="whitespace-pre-wrap break-words">{m.text}</p>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 px-1 text-[11px] text-muted-fg">
                  <span>{formatFullTimestamp(m.createdAt, locale)}</span>
                  {mine && (
                    <span className="flex items-center gap-1">
                      {isRead ? <CheckCheck size={13} className="text-primary" /> : <Check size={13} />}
                      {isRead ? t("chat.read") : t("chat.sent")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <div className="flex shrink-0 items-center gap-2 border-t border-line px-3 py-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          placeholder={t("chat.placeholder")}
          className="flex-1 rounded-xl border border-line px-4 py-2.5 text-[14px] outline-none focus:border-primary"
        />
        <Button className="px-3.5 py-2.5" onClick={submit} disabled={busy || !text.trim()}>
          <Send size={16} />
        </Button>
      </div>
    </div>
  );
}
