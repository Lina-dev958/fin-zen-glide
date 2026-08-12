import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AuthHeading, AuthShell, SocialButtons } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Smart Spend" },
      { name: "description", content: "Sign in to your Smart Spend account to manage accounts, budgets and savings goals." },
      { property: "og:title", content: "Sign in — Smart Spend" },
      { property: "og:description", content: "Access your Smart Spend financial workspace." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<{ id?: boolean; pw?: boolean }>({});
  const [busy, setBusy] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = { id: !id.trim(), pw: pw.length < 6 };
    setErr(next);
    if (next.id || next.pw) return;
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      toast.success(t("auth.login.title"));
      navigate({ to: "/" });
    }, 700);
  };

  const chips = ["auth.aside.chip1", "auth.aside.chip2", "auth.aside.chip3"];

  return (
    <AuthShell
      asideTitle={t("auth.aside.login.title")}
      asideSub={t("auth.aside.login.sub")}
      asideExtra={
        <div className="flex flex-wrap justify-center gap-3">
          {chips.map((c) => (
            <span
              key={c}
              className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/10 px-4 py-3 text-xs font-medium"
            >
              {t(c)}
            </span>
          ))}
        </div>
      }
    >
      <AuthHeading title={t("auth.login.title")} sub={t("auth.login.sub")} />
      <form className="space-y-4" onSubmit={submit} noValidate>
        <div className="space-y-2">
          <Label htmlFor="id">{t("auth.identifier")}</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute inset-y-0 my-auto size-4 text-muted-foreground ltr:right-3 rtl:left-3" />
            <Input
              id="id"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="name@example.com"
              aria-invalid={!!err.id}
            />
          </div>
          {err.id ? <p className="text-xs text-destructive">{t("common.required")}</p> : null}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="pw">{t("auth.password")}</Label>
            <Link to="/forgot-password" className="text-xs font-semibold text-primary hover:underline">
              {t("auth.forgot")}
            </Link>
          </div>
          <Input
            id="pw"
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="••••••••"
            aria-invalid={!!err.pw}
          />
          {err.pw ? <p className="text-xs text-destructive">{t("auth.rule1")}</p> : null}
        </div>

        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <Checkbox defaultChecked /> {t("auth.remember")}
        </label>

        <Button type="submit" className="w-full gradient-brand" disabled={busy}>
          {busy ? t("common.saving") : t("auth.login.title")}
        </Button>
      </form>

      <SocialButtons />

      <p className="text-center text-sm text-muted-foreground">
        {t("auth.noAccount")}{" "}
        <Link to="/signup" className="font-semibold text-primary hover:underline">
          {t("auth.signup")}
        </Link>
      </p>
    </AuthShell>
  );
}
