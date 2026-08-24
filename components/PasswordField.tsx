import { useEffect, useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  scorePassword, STRENGTH_COLOR_VAR, STRENGTH_LABEL, type StrengthTier,
} from "@/common/libs/passwordStrength";
import { playStrengthTone } from "@/common/libs/tone";

interface PasswordFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className: string;
  showStrength?: boolean;
  autoComplete?: string;
}

/** Input password dengan tombol intip (show/hide) + indikator kekuatan opsional. */
export function PasswordField({
  value, onChange, placeholder, className, showStrength = false, autoComplete,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const tier = showStrength ? scorePassword(value) : null;
  const prevTier = useRef<StrengthTier | null>(null);

  useEffect(() => {
    if (tier !== null && tier !== prevTier.current) {
      playStrengthTone(tier);
    }
    prevTier.current = tier;
  }, [tier]);

  return (
    <div>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`${className} pr-11`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          tabIndex={-1}
          aria-label={visible ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-muted-fg hover:text-fg"
        >
          {visible ? <EyeOff size={19} /> : <Eye size={19} />}
        </button>
      </div>

      {showStrength && tier !== null && (
        <div className="mt-2">
          <div className="flex gap-1.5">
            {([0, 1, 2] as const).map((seg) => (
              <div
                key={seg}
                className="h-1.5 flex-1 rounded-full bg-muted transition-colors duration-300"
                style={{ backgroundColor: seg <= tier ? STRENGTH_COLOR_VAR[tier] : undefined }}
              />
            ))}
          </div>
          <div
            className="mt-1.5 text-xs font-semibold transition-colors duration-300"
            style={{ color: STRENGTH_COLOR_VAR[tier] }}
          >
            {STRENGTH_LABEL[tier]}
          </div>
        </div>
      )}
    </div>
  );
}
