import { Link } from "@tanstack/react-router";
import { Globe, Moon, ShieldCheck, Sparkles, Sun } from "lucide-react";
import type { ReactNode } from "react";

import mark from "@/assets/smartspend-mark.png.asset.json";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export function AuthSteps({ step }: { step: 1 | 2 | 3 | 4 }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {[1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={cn(
            "h-1.5 rounded-full transition-all duration-500 ease-out",
            i === step
              ? "w-10 gradient-brand shadow-[0_0_18px_-4px_var(--primary)]"
              : i < step
                ? "w-6 bg-primary/60"
                : "w-6 bg-border",
          )}
        />
      ))}
    </div>
  );
}

export function AuthShell({
  children,
  asideTitle,
  asideSub,
  asideExtra,
}: {
  children: ReactNode;
  asideTitle: string;
  asideSub: string;
  asideExtra?: ReactNode;
}) {
  const { t, lang, toggleLang } = useI18n();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="relative min-h-screen overflow-hidden bg-background p-4 md:p-6">
      {/* ambient animated background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 size-[520px] rounded-full bg-primary/20 blur-[120px] animate-aurora" />
        <div
          className="absolute -bottom-52 -right-32 size-[560px] rounded-full bg-accent/25 blur-[130px] animate-aurora"
          style={{ animationDelay: "-6s" }}
        />
        <div
          className="absolute left-1/2 top-1/3 size-[380px] -translate-x-1/2 rounded-full bg-repair/10 blur-[120px] animate-aurora"
          style={{ animationDelay: "-11s" }}
        />
      </div>

      <div className="relative mx-auto flex max-w-7xl items-center justify-between pb-4">
        <Link
          to="/landing"
          className="focus-ringed group flex items-center gap-2.5 rounded-2xl px-1 py-1"
        >
          <span className="relative grid size-10 place-items-center rounded-2xl bg-surface shadow-[var(--shadow-soft)] ring-1 ring-border transition-transform duration-500 group-hover:scale-105">
            <img src={mark.url} alt="Smart Spend" className="size-7 object-contain" />
          </span>
          <span className="font-display text-lg font-bold text-foreground">{t("app.name")}</span>
        </Link>
        <div className="flex items-center gap-1 rounded-2xl border border-border/70 bg-card/60 p-1 backdrop-blur-xl">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="theme">
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={toggleLang} className="gap-2">
            <Globe className="size-4" />
            {lang === "ar" ? "English" : "العربية"}
          </Button>
        </div>
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-6 overflow-hidden rounded-[2rem] border border-border/70 bg-card/70 p-4 shadow-[var(--shadow-soft)] backdrop-blur-2xl md:p-8 lg:grid-cols-2">
        <div className="flex items-center justify-center py-6">
          <div className="w-full max-w-sm space-y-6 auth-field animate-rise">{children}</div>
        </div>

        <div className="relative hidden overflow-hidden rounded-[1.75rem] gradient-brand p-10 text-primary-foreground lg:flex lg:flex-col lg:items-center lg:justify-center">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-1/2 size-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-primary-foreground/15 animate-spin-slow" />
            <div className="absolute left-1/2 top-1/2 size-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary-foreground/10" />
            <div className="absolute left-1/2 top-1/2 size-[240px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary-foreground/15 animate-pulse-ring" />
            <div className="absolute -right-10 top-10 size-40 rounded-full bg-primary-foreground/10 blur-2xl animate-float" />
            <div
              className="absolute -left-8 bottom-8 size-32 rounded-full bg-primary-foreground/10 blur-2xl animate-float"
              style={{ animationDelay: "-3s" }}
            />
          </div>

          <div className="relative z-10 w-full max-w-md text-center">
            <div className="mx-auto mb-8 grid size-28 place-items-center rounded-[1.75rem] border border-primary-foreground/20 bg-primary-foreground/95 shadow-2xl animate-float">
              <img src={mark.url} alt="" className="size-16 object-contain" />
            </div>
            <h2 className="font-display text-3xl font-bold leading-tight">{asideTitle}</h2>
            <p className="mt-3 text-sm leading-relaxed text-primary-foreground/85">{asideSub}</p>
            {asideExtra ? <div className="mt-8">{asideExtra}</div> : null}
            <div className="mt-10 flex items-center justify-center gap-4 text-[11px] font-medium text-primary-foreground/80">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1.5 backdrop-blur">
                <ShieldCheck className="size-3.5" /> 256-bit
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1.5 backdrop-blur">
                <Sparkles className="size-3.5" /> AI
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AuthHeading({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="space-y-2 text-center">
      <h1 className="font-display text-3xl font-bold tracking-tight text-gradient-brand">
        {title}
      </h1>
      <p className="text-sm text-muted-foreground">{sub}</p>
    </div>
  );
}

export function SocialButtons() {
  const { t } = useI18n();
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-border" />
        <span className="text-xs text-muted-foreground">{t("auth.or")}</span>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-border" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          type="button"
          className="shine-sweep gap-2 rounded-xl transition-transform duration-300 hover:-translate-y-0.5"
        >
          <span className="font-semibold">Google</span>
        </Button>
        <Button
          variant="outline"
          type="button"
          className="shine-sweep gap-2 rounded-xl transition-transform duration-300 hover:-translate-y-0.5"
        >
          <span className="font-semibold">Apple</span>
        </Button>
      </div>
    </div>
  );
}
