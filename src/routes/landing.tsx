import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  BarChart3,
  Bell,
  Globe,
  Moon,
  PiggyBank,
  PlayCircle,
  RefreshCw,
  Shield,
  Sun,
  Users,
} from "lucide-react";

import mark from "@/assets/smartspend-mark.png.asset.json";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";

export const Route = createFileRoute("/landing")({
  head: () => ({
    meta: [
      { title: "Smart Spend — Manage your money smartly" },
      {
        name: "description",
        content:
          "Smart Spend brings accounts, budgets, savings goals and AI insights together in one bilingual financial workspace.",
      },
      { property: "og:title", content: "Smart Spend — Manage your money smartly" },
      {
        property: "og:description",
        content: "AI-powered budgets, goals and reports for individuals and families.",
      },
    ],
  }),
  component: LandingPage,
});

const features = [
  { icon: RefreshCw, title: "lp.f1", sub: "lp.f1s" },
  { icon: BarChart3, title: "lp.f2", sub: "lp.f2s" },
  { icon: PiggyBank, title: "lp.f3", sub: "lp.f3s" },
  { icon: Shield, title: "lp.f4", sub: "lp.f4s" },
  { icon: Bell, title: "lp.f5", sub: "lp.f5s" },
  { icon: Users, title: "lp.f6", sub: "lp.f6s" },
];

const steps = [
  { n: 1, title: "lp.s1", sub: "lp.s1s" },
  { n: 2, title: "lp.s2", sub: "lp.s2s" },
  { n: 3, title: "lp.s3", sub: "lp.s3s" },
];

const faqs = [
  { q: "lp.q1", a: "lp.a1" },
  { q: "lp.q2", a: "lp.a2" },
  { q: "lp.q3", a: "lp.a3" },
];

function LandingPage() {
  const { t, lang, toggleLang } = useI18n();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-2">
            <img src={mark.url} alt="Smart Spend" className="size-9 rounded-xl object-contain" />
            <span className="font-display text-lg font-bold text-foreground">{t("app.name")}</span>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground lg:flex">
            <a href="#features" className="hover:text-foreground">{t("lp.nav.features")}</a>
            <a href="#how" className="hover:text-foreground">{t("lp.nav.how")}</a>
            <a href="#faq" className="hover:text-foreground">{t("lp.faq.title")}</a>
            <Link to="/" className="hover:text-foreground">{t("lp.openApp")}</Link>
          </nav>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="theme">
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={toggleLang} className="gap-2">
              <Globe className="size-4" />
              {lang === "ar" ? "EN" : "AR"}
            </Button>
            <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
              <Link to="/login">{t("auth.login.title")}</Link>
            </Button>
            <Button size="sm" asChild className="gradient-brand">
              <Link to="/signup">{t("lp.cta.start")}</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="border-b border-border bg-surface-muted/50">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 lg:grid-cols-2 lg:py-24">
            <div className="space-y-6">
              <h1 className="font-display text-4xl font-bold leading-tight text-foreground md:text-5xl">
                {t("lp.hero.title1")}
                <br />
                <span className="text-gradient-brand">{t("lp.hero.title2")}</span>
              </h1>
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
                {t("lp.hero.sub")}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" asChild className="gradient-brand">
                  <Link to="/signup">{t("lp.hero.primary")}</Link>
                </Button>
                <Button size="lg" variant="outline" className="gap-2">
                  <PlayCircle className="size-4" />
                  {t("lp.hero.secondary")}
                </Button>
              </div>
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <Users className="size-4" /> {t("lp.hero.users")}
              </p>
            </div>

            <div className="relative">
              <div className="panel overflow-hidden p-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    Smart Spend Dashboard
                  </span>
                  <span className="flex gap-1.5">
                    <span className="size-2.5 rounded-full bg-destructive" />
                    <span className="size-2.5 rounded-full bg-warning" />
                    <span className="size-2.5 rounded-full bg-success" />
                  </span>
                </div>
                <div className="rounded-2xl gradient-brand p-5 text-primary-foreground">
                  <p className="text-xs opacity-80">{t("lp.hero.balance")}</p>
                  <p className="font-display text-2xl font-bold">45,280 SAR</p>
                </div>
                <div className="mt-4 flex h-32 items-end gap-2">
                  {[55, 80, 45, 95, 70, 60].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-lg bg-primary/80"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
              <div className="panel absolute -bottom-6 px-4 py-3 text-sm ltr:left-0 rtl:right-0">
                <p className="text-xs text-muted-foreground">{t("lp.hero.growth")}</p>
                <p className="font-semibold text-success">+12.5%</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-7xl px-4 py-16">
          <h2 className="mb-10 text-center font-display text-2xl font-bold text-foreground">
            {t("lp.features.title")}
          </h2>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="panel p-6">
                <span className="mb-4 grid size-11 place-items-center rounded-xl bg-accent text-accent-foreground">
                  <f.icon className="size-5" />
                </span>
                <h3 className="text-base font-semibold text-foreground">{t(f.title)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(f.sub)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Steps */}
        <section id="how" className="border-y border-border bg-surface-muted/50">
          <div className="mx-auto max-w-7xl px-4 py-16">
            <h2 className="mb-10 text-center font-display text-2xl font-bold text-foreground">
              {t("lp.how.title")}
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {steps.map((s) => (
                <div key={s.n} className="text-center">
                  <span className="mx-auto mb-4 grid size-12 place-items-center rounded-full gradient-brand font-display text-lg font-bold text-primary-foreground">
                    {s.n}
                  </span>
                  <h3 className="text-base font-semibold text-foreground">{t(s.title)}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{t(s.sub)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-3xl px-4 py-16">
          <h2 className="text-center font-display text-2xl font-bold text-foreground">
            {t("lp.faq.title")}
          </h2>
          <p className="mb-8 mt-2 text-center text-sm text-muted-foreground">{t("lp.faq.sub")}</p>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((f) => (
              <AccordionItem
                key={f.q}
                value={f.q}
                className="rounded-2xl border border-border bg-card px-4"
              >
                <AccordionTrigger className="text-sm font-semibold">{t(f.q)}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {t(f.a)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-7xl px-4 pb-16">
          <div className="rounded-3xl gradient-brand px-6 py-14 text-center text-primary-foreground">
            <h2 className="font-display text-3xl font-bold">{t("lp.final.title")}</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-primary-foreground/85">
              {t("lp.final.sub")}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/signup">{t("lp.final.primary")}</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
              >
                {t("lp.final.secondary")}
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <img src={mark.url} alt="" className="size-8 rounded-lg object-contain" />
              <span className="font-display font-bold text-foreground">{t("app.name")}</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{t("lp.foot.tagline")}</p>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold text-foreground">{t("lp.foot.product")}</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>{t("lp.nav.features")}</li>
              <li>{t("lp.nav.pricing")}</li>
              <li>{t("auth.aside.f1")}</li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold text-foreground">{t("lp.foot.company")}</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>{t("lp.nav.about")}</li>
              <li>{t("lp.foot.support")}</li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold text-foreground">{t("lp.foot.legal")}</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>{t("auth.termsLink")}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border px-4 py-5 text-center text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            {t("lp.foot.rights")}
            <Link to="/" className="inline-flex items-center gap-1 text-primary hover:underline">
              {t("lp.openApp")} <ArrowLeft className="size-3 rtl:rotate-180" />
            </Link>
          </span>
        </div>
      </footer>
    </div>
  );
}
