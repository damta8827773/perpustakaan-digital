import { useState } from "react";
import { ThumbsUp, Star, Send, ShieldCheck } from "lucide-react";
import type { Book } from "@/common/constants/catalog";
import { Button, Card } from "@/components/ui";
import { useToast } from "@/components/Toast";
import { useCurrentStudent } from "@/services/sessionStore";
import { useTranslate } from "@/services/localeStore";
import { auth } from "@/common/libs/firebase";
import {
  isFeedbackAvailable, useBookComments, useBookReactions,
  addComment, toggleCommentLike, toggleBookLike, toggleFavorite,
  type Author,
} from "@/services/feedbackStore";

export function BookFeedback({ book }: { book: Book }) {
  const { notify } = useToast();
  const student = useCurrentStudent();
  const t = useTranslate();
  const [text, setText] = useState("");

  const email = student.email || `${student.nim}@mahasiswa.uinjkt.ac.id`;
  const author: Author = {
    name: student.name,
    email,
    program: student.program,
    faculty: student.faculty,
    angkatan: student.angkatan,
  };

  // isFeedbackAvailable() = false hanya di mode demo (VITE_DEMO=1). Di luar
  // itu, komentar/suka BUTUH sesi Firebase Auth sungguhan (bukan cuma sesi
  // lokal NIM yang gagal diam-diam kalau provider Email/Password belum
  // diaktifkan di Firebase Console - lihat services/accounts.ts) supaya
  // Firestore Security Rules bisa memverifikasi identitas pengirim.
  const hasFirebaseSession = !!auth.currentUser;
  const available = isFeedbackAvailable() && hasFirebaseSession;
  const comments = useBookComments(book.id);
  const reactions = useBookReactions(book.id);
  const liked = reactions.likes.some((l) => l.userEmail === email);
  const fav = reactions.favorites.some((f) => f.userEmail === email);

  return (
    <div className="mt-8">
      {!available && (
        <p className="mb-4 rounded-xl bg-warning-light/60 px-4 py-3 text-sm text-warning">
          {isFeedbackAvailable() ? t("feedback.needLogin") : t("feedback.needFirebaseConfig")}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <button
          disabled={!available}
          onClick={async () => {
            const now = await toggleBookLike(book.id, book.title, author);
            notify(now ? t("feedback.likedToast") : t("feedback.unlikedToast"));
          }}
          className={`flex cursor-pointer items-center gap-2 rounded-xl border px-5 py-2.5 font-display text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60 ${
            liked ? "border-primary bg-primary-light text-primary" : "border-line hover:bg-muted"
          }`}
        >
          <ThumbsUp size={17} fill={liked ? "currentColor" : "none"} /> {t("feedback.like")}
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{reactions.likes.length}</span>
        </button>
        <button
          disabled={!available}
          onClick={async () => {
            const now = await toggleFavorite(book.id, book.title, author);
            notify(now ? t("feedback.favAddedToast") : t("feedback.favRemovedToast"));
          }}
          className={`flex cursor-pointer items-center gap-2 rounded-xl border px-5 py-2.5 font-display text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60 ${
            fav ? "border-warning bg-warning-light text-warning" : "border-line hover:bg-muted"
          }`}
        >
          <Star size={17} fill={fav ? "currentColor" : "none"} /> {t("feedback.favorite")}
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{reactions.favorites.length}</span>
        </button>
      </div>

      <h2 className="mt-8 font-display text-xl font-bold">
        {t("feedback.comments")}
        <span className="ml-2 text-base font-normal text-muted-fg">({comments.length})</span>
      </h2>

      <Card className="mt-4 p-5">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder={t("feedback.commentPlaceholder")}
          className="w-full resize-none rounded-xl border border-line px-4 py-3 text-[15px] outline-none focus:border-primary"
        />
        <div className="mt-3 flex justify-end">
          <Button
            className="flex items-center gap-2 py-2.5"
            disabled={!available || text.trim().length < 2}
            onClick={async () => {
              await addComment(book.id, book.title, author, text);
              setText("");
              notify(t("feedback.commentSentToast"));
            }}
          >
            <Send size={16} /> {t("feedback.sendComment")}
          </Button>
        </div>
      </Card>

      <div className="mt-5 space-y-4">
        {comments.length === 0 && (
          <p className="text-muted-fg">{t("feedback.noComments")}</p>
        )}
        {comments.map((c) => (
          <Card key={c.id} className="p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold uppercase text-white">
                {c.userName.slice(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2">
                  <span className="font-display font-bold uppercase">{c.userName}</span>
                  <span className="text-sm text-muted-fg">
                    {c.program} · {c.faculty} · {c.angkatan}
                  </span>
                </div>
                <div className="mt-0.5 text-xs text-muted-fg">{c.date} · {c.time}</div>
                <p className="mt-2 leading-relaxed">{c.text}</p>

                <button
                  disabled={!available}
                  onClick={() => void toggleCommentLike(c.id, email, student.name)}
                  className={`mt-3 flex cursor-pointer items-center gap-1.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60 ${
                    c.likes.some((l) => l.email === email) ? "text-primary" : "text-muted-fg hover:text-fg"
                  }`}
                >
                  <ThumbsUp size={14} fill={c.likes.some((l) => l.email === email) ? "currentColor" : "none"} />
                  {c.likes.length} {t("feedback.like")}
                </button>

                {c.reply && (
                  <div className="mt-4 rounded-xl bg-primary-light/60 p-4">
                    <div className="flex items-center gap-2 font-display text-sm font-bold text-primary">
                      <ShieldCheck size={15} /> {t("feedback.adminReplyLabel")}
                    </div>
                    <p className="mt-1.5 text-[15px] leading-relaxed">{c.reply.text}</p>
                    <div className="mt-1 text-xs text-muted-fg">{c.reply.date} · {c.reply.time}</div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
