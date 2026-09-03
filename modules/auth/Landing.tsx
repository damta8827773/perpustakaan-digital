import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen, GraduationCap, ArrowRight, Copy, Users, Star, Shield,
  BookMarked, Tablet, History, BellRing, MessageCircle,
} from "lucide-react";
import { Card } from "@/components/ui";
import { CountUp } from "@/components/CountUp";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTranslate, type Translate } from "@/services/localeStore";

interface FeatureDetail {
  icon: typeof BookMarked;
  title: string;
  summary: string;
  detail: string;
  steps: string[];
}

function buildFeatureDetails(t: Translate): FeatureDetail[] {
  return [
    {
      icon: BookMarked,
      title: t("landing.f.borrow.title"),
      summary: t("landing.f.borrow.summary"),
      detail: t("landing.f.borrow.detail"),
      steps: [
        t("landing.f.borrow.step1"),
        t("landing.f.borrow.step2"),
        t("landing.f.borrow.step3"),
        t("landing.f.borrow.step4"),
      ],
    },
    {
      icon: Tablet,
      title: t("landing.f.ebook.title"),
      summary: t("landing.f.ebook.summary"),
      detail: t("landing.f.ebook.detail"),
      steps: [
        t("landing.f.ebook.step1"),
        t("landing.f.ebook.step2"),
        t("landing.f.ebook.step3"),
        t("landing.f.ebook.step4"),
      ],
    },
    {
      icon: History,
      title: t("landing.f.history.title"),
      summary: t("landing.f.history.summary"),
      detail: t("landing.f.history.detail"),
      steps: [
        t("landing.f.history.step1"),
        t("landing.f.history.step2"),
        t("landing.f.history.step3"),
      ],
    },
    {
      icon: BellRing,
      title: t("landing.f.notif.title"),
      summary: t("landing.f.notif.summary"),
      detail: t("landing.f.notif.detail"),
      steps: [
        t("landing.f.notif.step1"),
        t("landing.f.notif.step2"),
        t("landing.f.notif.step3"),
      ],
    },
    {
      icon: MessageCircle,
      title: t("landing.f.chat.title"),
      summary: t("landing.f.chat.summary"),
      detail: t("landing.f.chat.detail"),
      steps: [
        t("landing.f.chat.step1"),
        t("landing.f.chat.step2"),
        t("landing.f.chat.step3"),
        t("landing.f.chat.step4"),
      ],
    },
  ];
}

export default function Landing() {
  const t = useTranslate();
  const [activeFeature, setActiveFeature] = useState(0);
  const FEATURES = [
    t("landing.feature1"), t("landing.feature2"), t("landing.feature3"), t("landing.feature4"),
  ];
  const FEATURE_DETAILS = useMemo(() => buildFeatureDetails(t), [t]);
  const STATS = [
    { icon: Copy, value: 12000, suffix: "+", label: t("landing.stat.collection.label"), desc: t("landing.stat.collection.desc") },
    { icon: Users, value: 5800, suffix: "+", label: t("landing.stat.students.label"), desc: t("landing.stat.students.desc") },
    { icon: Star, value: 4.8, decimals: 1, suffix: "", label: t("landing.stat.rating.label"), desc: t("landing.stat.rating.desc") },
    { icon: Shield, value: 0, suffix: "", label: t("landing.stat.sso.label"), desc: t("landing.stat.sso.desc") },
  ];
  const active = FEATURE_DETAILS[activeFeature];

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-line bg-card">
        <div className="mx-auto flex min-h-[72px] max-w-[1140px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:h-[88px] sm:flex-nowrap sm:py-0 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
              <BookOpen size={22} />
            </div>
            <div>
              <div className="font-display text-lg font-bold leading-tight">{t("app.name")}</div>
              <div className="hidden text-sm text-muted-fg sm:block">{t("app.institution")}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <span className="hidden text-[15px] text-muted-fg sm:inline">© 2026 UIN Jakarta</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1140px] px-6 pb-16">
        <div className="pt-20 text-center">
          <h1 className="font-display text-[44px] font-bold leading-[1.25]">
            {t("landing.heroTitle1")}
            <br />
            <span className="text-primary">{t("landing.heroHighlight")}</span> {t("landing.heroTitle2")}
          </h1>
          <p className="mx-auto mt-6 max-w-[640px] text-lg leading-relaxed text-muted-fg">
            {t("landing.heroSubtitle")}
          </p>
        </div>

        <Card className="mx-auto mt-14 max-w-[680px] p-9">
          <div className="flex items-start gap-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
              <GraduationCap size={26} />
            </div>
            <div className="flex-1">
              <h2 className="font-display text-2xl font-bold">{t("landing.portalTitle")}</h2>
              <p className="mt-3 leading-relaxed text-muted-fg">{t("landing.portalDesc")}</p>
              <ul className="mt-5 space-y-3 text-[15px] text-muted-fg">
                {FEATURES.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                to="/login"
                className="mt-8 inline-flex items-center gap-2.5 rounded-xl bg-primary px-8 py-4 font-display text-[17px] font-bold text-white hover:bg-primary-dark"
              >
                {t("landing.portalCta")} <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </Card>

        <div className="mt-14">
          <h2 className="text-center font-display text-[28px] font-bold">
            {t("landing.sectionTitle")}
          </h2>
          <p className="mx-auto mt-2 max-w-[560px] text-center text-muted-fg">
            {t("landing.sectionSubtitle")}
          </p>

          <div className="mt-8 grid grid-cols-1 gap-0 overflow-hidden rounded-2xl border border-line bg-card md:grid-cols-[280px_1fr]">
            <div className="divide-y divide-line border-b border-line md:border-b-0 md:border-r">
              {FEATURE_DETAILS.map((f, i) => (
                <button
                  key={f.title}
                  onClick={() => setActiveFeature(i)}
                  className={`flex w-full cursor-pointer items-start gap-3 px-5 py-4 text-left transition-colors ${
                    i === activeFeature ? "bg-primary-light/60" : "hover:bg-muted/60"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      i === activeFeature ? "bg-primary text-white" : "bg-muted text-muted-fg"
                    }`}
                  >
                    <f.icon size={18} />
                  </div>
                  <div>
                    <div className={`font-display text-[15px] font-bold ${i === activeFeature ? "text-primary" : ""}`}>
                      {f.title}
                    </div>
                    <div className="mt-0.5 text-sm text-muted-fg">{f.summary}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Penjelasan lengkap fitur yang dipilih, tampil di sebelah kanan daftar. */}
            <div className="p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-primary">
                <active.icon size={26} />
              </div>
              <h3 className="mt-5 font-display text-2xl font-bold">{active.title}</h3>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-fg">{active.detail}</p>

              <div className="mt-6 space-y-3.5 border-t border-line pt-6">
                {active.steps.map((step, i) => (
                  <div key={step} className="flex items-start gap-3.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-light font-display text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    <span className="text-[15px] leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {STATS.map(({ icon: Icon, value, suffix, decimals, label, desc }) => (
            <Card key={label} className="flex items-start gap-3 p-4 sm:gap-4 sm:p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
                <Icon size={22} />
              </div>
              <div className="min-w-0">
                <div className="font-display text-[17px] font-bold leading-snug">
                  {value > 0 ? (
                    <>
                      <CountUp value={value} decimals={decimals ?? 0} suffix={suffix} />{" "}
                      {label}
                    </>
                  ) : (
                    label
                  )}
                </div>
                <div className="mt-1 text-sm leading-snug text-muted-fg">{desc}</div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
