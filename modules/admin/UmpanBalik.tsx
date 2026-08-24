import { useState } from "react";
import { MessageSquare, ThumbsUp, Star, Send, ShieldCheck, Mail } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import { useToast } from "@/components/Toast";
import { useFeedback, replyToComment, type Comment } from "@/services/feedbackStore";

function StatCard({
  icon: Icon, value, label, bg, fg,
}: {
  icon: typeof ThumbsUp; value: number; label: string; bg: string; fg: string;
}) {
  return (
    <Card className="p-6">
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${bg} ${fg}`}>
        <Icon size={22} />
      </div>
      <div className="mt-4 font-display text-[28px] font-bold">{value}</div>
      <div className="mt-1 text-[15px] text-muted-fg">{label}</div>
    </Card>
  );
}

function CommentRow({ comment }: { comment: Comment }) {
  const { notify } = useToast();
  const [reply, setReply] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-display font-bold uppercase">{comment.userName}</span>
            <Badge tone="muted">{comment.faculty}</Badge>
          </div>
          <div className="mt-0.5 text-sm text-muted-fg">
            {comment.program} · Angkatan {comment.angkatan} · {comment.userEmail}
          </div>
        </div>
        <div className="text-right text-sm text-muted-fg">
          <div className="font-semibold text-fg">{comment.bookTitle}</div>
          <div>{comment.date} · {comment.time}</div>
        </div>
      </div>

      <p className="mt-3 leading-relaxed">{comment.text}</p>
      <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-fg">
        <ThumbsUp size={14} /> {comment.likes.length} suka
      </div>

      {comment.reply ? (
        <div className="mt-4 rounded-xl bg-success-light/60 p-4">
          <div className="flex items-center gap-2 font-display text-sm font-bold text-success">
            <ShieldCheck size={15} /> Balasan Anda terkirim
          </div>
          <p className="mt-1.5 text-[15px]">{comment.reply.text}</p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-fg">
            <Mail size={13} /> Diteruskan ke kotak masuk {comment.userEmail} · {comment.reply.date} {comment.reply.time}
          </div>
        </div>
      ) : open ? (
        <div className="mt-4">
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            rows={3}
            placeholder={`Balas komentar ${comment.userName}...`}
            className="w-full resize-none rounded-xl border border-line px-4 py-3 text-[15px] outline-none focus:border-primary"
          />
          <div className="mt-3 flex justify-end gap-3">
            <Button variant="outline" className="py-2.5" onClick={() => setOpen(false)}>Batal</Button>
            <Button
              className="flex items-center gap-2 py-2.5"
              disabled={reply.trim().length < 2}
              onClick={() => {
                replyToComment(comment.id, reply);
                notify(`Balasan terkirim ke ${comment.userEmail}.`);
                setReply("");
                setOpen(false);
              }}
            >
              <Send size={15} /> Kirim Balasan
            </Button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="mt-4 flex cursor-pointer items-center gap-2 rounded-lg bg-primary-light px-4 py-2 text-sm font-semibold text-primary hover:bg-primary-light-hover"
        >
          <MessageSquare size={15} /> Balas Komentar
        </button>
      )}
    </Card>
  );
}

export default function UmpanBalik() {
  const fb = useFeedback();
  const comments = [...fb.comments].sort((a, b) => b.ts - a.ts);

  return (
    <div>
      <div className="grid grid-cols-2 gap-6 xl:grid-cols-4">
        <StatCard icon={MessageSquare} value={comments.length} label="Total Komentar" bg="bg-primary-light" fg="text-primary" />
        <StatCard icon={ThumbsUp} value={fb.likes.length} label="Total Suka" bg="bg-success-light" fg="text-success" />
        <StatCard icon={Star} value={fb.favorites.length} label="Total Favorit" bg="bg-[#fdf3d8]" fg="text-warning" />
        <StatCard icon={ShieldCheck} value={comments.filter((c) => c.reply).length} label="Sudah Dibalas" bg="bg-accent-light" fg="text-accent" />
      </div>

      <h2 className="mt-8 font-display text-xl font-bold">Komentar Pengguna</h2>
      <p className="mt-1 text-[15px] text-muted-fg">
        Balasan Anda diteruskan ke kotak masuk pengguna sebagai pemberitahuan.
      </p>

      <div className="mt-5 space-y-4">
        {comments.length === 0 ? (
          <Card className="p-10 text-center text-muted-fg">
            Belum ada komentar dari pengguna.
          </Card>
        ) : (
          comments.map((c) => <CommentRow key={c.id} comment={c} />)
        )}
      </div>
    </div>
  );
}
