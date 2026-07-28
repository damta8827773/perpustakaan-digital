import { useState } from "react";
import { Star } from "lucide-react";
import { Button, Modal } from "@/components/ui";
import { submitReview } from "@/services/libraryStore";
import { useCurrentStudent } from "@/services/sessionStore";

// Modal beri rating + ulasan yang menyimpan data lengkap penulis dan waktu.
export function ReviewModal({
  bookId, title, onClose, onDone,
}: {
  bookId: string;
  title: string;
  onClose: () => void;
  onDone: (stars: number) => void;
}) {
  const student = useCurrentStudent();
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");

  return (
    <Modal title="Beri Rating & Ulasan" onClose={onClose}>
      <p className="text-lg text-muted-fg">Bagaimana penilaian Anda untuk buku:</p>
      <p className="mt-3 font-display text-2xl font-bold">"{title}"</p>

      <div className="mt-6 flex justify-center gap-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            onClick={() => setStars(i)}
            className="cursor-pointer transition-transform hover:scale-110"
            aria-label={`${i} bintang`}
          >
            <Star size={44} fill={i <= stars ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth={1.6} />
          </button>
        ))}
      </div>

      <label className="mt-8 block font-display font-semibold">Ulasan Anda</label>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={4}
        placeholder="Ceritakan pengalaman membaca Anda..."
        className="mt-2.5 w-full resize-none rounded-xl border border-line px-4 py-3.5 text-[15px] outline-none focus:border-primary"
      />

      <div className="mt-6 grid grid-cols-2 gap-4">
        <Button variant="outline" className="py-3.5" onClick={onClose}>Batal</Button>
        <Button
          className="py-3.5"
          disabled={stars === 0}
          onClick={() => {
            submitReview(bookId, stars, comment, {
              name: student.name,
              program: student.program,
              faculty: student.faculty,
              angkatan: student.angkatan,
            });
            onDone(stars);
          }}
        >
          Kirim Ulasan
        </Button>
      </div>
    </Modal>
  );
}
