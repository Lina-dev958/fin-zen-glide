import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CreditCard, Mail, Shield, Sparkles, User, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AuthHeading, AuthShell, PasswordInput, SocialButtons } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create account — Smart Spend" },
      { name: "description", content: "Create your Smart Spend account and start managing money with AI-powered budgets and goals." },
      { property: "og:title", content: "Create account — Smart Spend" },
      { property: "og:description", content: "Join Smart Spend and manage your money smartly." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", id: "", pw: "", confirm: "", agree: false });
  type Errs = { name?: string; id?: string; pw?: string; confirm?: string; agree?: string };
  const [err, setErr] = useState<Errs>({});
  const [busy, setBusy] = useState(false);

  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Errs = {};
    if (!form.name.trim()) next.name = t("common.required");
    if (!form.id.trim()) next.id = t("common.required");
    if (form.pw.length < 8) next.pw = t("auth.rule1");
    if (form.confirm !== form.pw) next.confirm = t("auth.confirm");
    if (!form.agree) next.agree = t("common.required");
    setErr(next);
    if (Object.keys(next).length) return;
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      toast.success(t("auth.signup"));
      navigate({ to: "/" });
    }, 800);
  };

  const features = [
    { icon: Shield, title: "auth.aside.f1", sub: "auth.aside.f1s" },
    { icon: Sparkles, title: "auth.aside.f2", sub: "auth.aside.f2s" },
    { icon: CreditCard, title: "auth.aside.f3", sub: "auth.aside.f3s" },
  ];

  return (
    <AuthShell
      asideTitle={t("auth.aside.signup.title")}
      asideSub={t("auth.aside.signup.sub")}
      asideExtra={
        <div className="space-y-3 text-start">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex items-center gap-3 rounded-2xl border border-primary-foreground/15 bg-primary-foreground/10 p-4"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-foreground/15">
                <f.icon className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold">{t(f.title)}</p>
                <p className="text-xs text-primary-foreground/75">{t(f.sub)}</p>
              </div>
            </div>
          ))}
        </div>
      }
    >
      <AuthHeading icon={UserPlus} title={t("auth.signup.title")} sub={t("auth.signup.sub")} />
      <form className="space-y-4" onSubmit={submit} noValidate>
        <div className="space-y-2">
          <Label htmlFor="name">{t("auth.fullName")}</Label>
          <div className="relative">
            <User className="pointer-events-none absolute inset-y-0 my-auto size-4 text-muted-foreground ltr:right-3 rtl:left-3" />
            <Input
              id="name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder={t("auth.fullNamePh")}
              aria-invalid={!!err.name}
            />
          </div>
          {err.name ? <p className="text-xs text-destructive">{err.name}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="sid">{t("auth.identifier")}</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute inset-y-0 my-auto size-4 text-muted-foreground ltr:right-3 rtl:left-3" />
            <Input
              id="sid"
              value={form.id}
              onChange={(e) => set("id", e.target.value)}
              placeholder="user@example.com"
              aria-invalid={!!err.id}
            />
          </div>
          {err.id ? <p className="text-xs text-destructive">{err.id}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="spw">{t("auth.password")}</Label>
          <PasswordInput
            id="spw"
            value={form.pw}
            onChange={(e) => set("pw", e.target.value)}
            placeholder={t("auth.passwordPh")}
            aria-invalid={!!err.pw}
          />
          {err.pw ? <p className="text-xs text-destructive">{err.pw}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="sconf">{t("auth.confirm")}</Label>
          <PasswordInput
            id="sconf"
            value={form.confirm}
            onChange={(e) => set("confirm", e.target.value)}
            placeholder={t("auth.confirmPh")}
            aria-invalid={!!err.confirm}
          />
          {err.confirm ? <p className="text-xs text-destructive">{err.confirm}</p> : null}
        </div>

        <label className="flex items-start gap-2 text-sm text-muted-foreground">
          <Checkbox
            checked={form.agree}
            onCheckedChange={(v) => set("agree", v === true)}
            className="mt-0.5"
          />
          <span>
            {t("auth.terms")}{" "}
            <span className="font-semibold text-primary">{t("auth.termsLink")}</span>
          </span>
        </label>
        {err.agree ? <p className="text-xs text-destructive">{err.agree}</p> : null}

        <Button type="submit" className="shine-sweep h-11 w-full rounded-xl gradient-brand shadow-[0_10px_30px_-12px_var(--primary)] transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0" disabled={busy}>
          {busy ? t("common.saving") : t("auth.signup")}
        </Button>
      </form>

      <SocialButtons />

      <p className="text-center text-sm text-muted-foreground">
        {t("auth.haveAccount")}{" "}
        <Link to="/login" className="font-semibold text-primary hover:underline">
          {t("auth.login.title")}
        </Link>
      </p>
    </AuthShell>
  );
}
