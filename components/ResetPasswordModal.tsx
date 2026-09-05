import { useState, type FormEvent } from "react";
import { Modal, Button, BusyLabel } from "@/components/ui";
import { adminTriggerPasswordReset } from "@/services/passwordReset";

const MIN_LEN = 20;

/** Dipakai dari Anggota.tsx (Data Anggota) maupun Pesan.tsx (verifikasi via live chat). */
export function ResetPasswordModal({
  target, onClose, onDone,
}: {
  target: { name: string; email: string };
  onClose: () => void;
  onDone: () => void;
}) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await adminTriggerPasswordReset({ name: target.name, email: target.email }, reason);
      onDone();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal title="Reset Password" onClose={onClose}>
      <form onSubmit={submit}>
        <p className="text-[15px] text-muted-fg">
          Tautan reset akan dikirim ke <strong className="text-fg">{target.email}</strong>.
          Ini hanya memicu tautan reset resmi Firebase - admin tidak pernah
          melihat atau menyentuh password asli anggota.
        </p>
        <label className="mt-4 block font-display text-[15px] font-semibold">
          Alasan (wajib, minimal {MIN_LEN} karakter) - jelaskan juga bagaimana
          identitas mahasiswa sudah diverifikasi
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          placeholder="Contoh: Melapor via live chat, NIM & prodi cocok dengan data di Info Akun, sudah dikonfirmasi lewat 3 buku terakhir yang dipinjam."
          className="mt-2 w-full resize-none rounded-xl border border-line px-4 py-3 text-[15px] outline-none focus:border-primary"
        />
        <div className="mt-1 text-right text-xs text-muted-fg">{reason.trim().length}/{MIN_LEN}</div>
        {error && (
          <p className="mt-2 rounded-lg bg-destructive-light px-4 py-3 text-sm text-destructive">{error}</p>
        )}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <Button variant="outline" className="py-3.5" onClick={onClose} type="button">Batal</Button>
          <Button type="submit" className="py-3.5" disabled={busy || reason.trim().length < MIN_LEN}>
            {busy ? <BusyLabel text="Mengirim..." /> : "Kirim Reset"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
