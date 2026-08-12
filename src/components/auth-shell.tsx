import { Link } from "@tanstack/react-router";
import { Globe, Moon, Sun } from "lucide-react";
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
            "h-1.5 w-8 rounded-full transition-colors",
            i <= step ? "bg-primary" : "bg-border",
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
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between pb-4">
        <Link to="/landing" className="focus-ringed flex items-center gap-2 rounded-xl">
          <img src={mark.url} alt="Smart Spend" className="size-9 rounded-xl object-contain" />
          <span className="font-display text-lg font-bold text-foreground">
            {t("app.name")}
          </span>
        </Link>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="theme">
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={toggleLang} className="gap-2">
            <Globe className="size-4" />
            {lang === "ar" ? "English" : "العربية"}
          </Button>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 rounded-3xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] md:p-8 lg:grid-cols-2">
        <div className="flex items-center justify-center py-6">
          <div className="w-full max-w-sm space-y-6">{children}</div>
        </div>

        <div className="relative hidden overflow-hidden rounded-3xl gradient-brand p-10 text-primary-foreground lg:flex lg:flex-col lg:items-center lg:justify-center">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-1/2 size-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary-foreground/10" />
            <div className="absolute left-1/2 top-1/2 size-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary-foreground/10" />
            <div className="absolute left-1/2 top-1/2 size-[240px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary-foreground/10" />
          </div>
          <div className="relative z-10 w-full max-w-md text-center">
            <div className="mx-auto mb-8 grid size-24 place-items-center rounded-3xl bg-primary-foreground/10 backdrop-blur">
              <img src={mark.url} alt="" className="size-16 rounded-2xl object-contain" />
            </div>
            <h2 className="font-display text-3xl font-bold">{asideTitle}</h2>
            <p className="mt-3 text-sm leading-relaxed text-primary-foreground/80">{asideSub}</p>
            {asideExtra ? <div className="mt-8">{asideExtra}</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AuthHeading({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="space-y-2 text-center">
      <h1 className="font-display text-3xl font-bold text-foreground">{title}</h1>
      <p className="text-sm text-muted-foreground">{sub}</p>
    </div>
  );
}

export function SocialButtons() {
  const { t } = useI18n();
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">{t("auth.or")}</span>
        <span className="h-px flex-1 bg-border" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" type="button" className="gap-2">
          <span className="font-semibold">Google</span>
        </Button>
        <Button variant="outline" type="button" className="gap-2">
          <span className="font-semibold">Apple</span>
        </Button>
      </div>
    </div>
  );
}
