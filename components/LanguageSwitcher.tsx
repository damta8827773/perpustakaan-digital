import { Check } from "lucide-react";
import { DropdownMenu } from "@/components/HeaderMenus";
import { useLocale, setLocale } from "@/services/localeStore";
import { LOCALES, LOCALE_META } from "@/i18n";

/** Ditaruh di header (bukan cuma di menu Profil) supaya langsung terlihat di semua halaman. */
export function LanguageSwitcher() {
  const locale = useLocale();
  return (
    <DropdownMenu
      trigger={() => (
        <span
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-lg hover:bg-muted"
          aria-label="Ganti bahasa"
          title="Ganti bahasa"
        >
          {LOCALE_META[locale].flag}
        </span>
      )}
    >
      {(close) => (
        <>
          {LOCALES.map((loc) => (
            <button
              key={loc}
              onClick={() => {
                setLocale(loc);
                close();
              }}
              className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-[15px] font-semibold hover:bg-muted"
            >
              <span className="text-lg">{LOCALE_META[loc].flag}</span>
              <span className="flex-1">{LOCALE_META[loc].label}</span>
              {locale === loc && <Check size={16} className="text-primary" />}
            </button>
          ))}
        </>
      )}
    </DropdownMenu>
  );
}
