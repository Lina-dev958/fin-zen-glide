import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, Lock, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AuthHeading, AuthShell, AuthSteps } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset password — Smart Spend" },
      { name: "description", content: "Create a new, strong password for your Smart Spend account." },
      { property: "og:title", content: "Reset password — Smart Spend" },
      { property: "og:description", content: "Set a new password and secure your financial data." },
    ],
  }),
  component: ResetPage,
});

function ResetPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const rules = [
    { key: "auth.rule1", ok: pw.length >= 8 },
    { key: "auth.rule2", ok: /[a-z]/.test(pw) && /[A-Z]/.test(pw) },
    { key: "auth.rule3", ok: /\d/.test(pw) },
  ];
  const score = rules.filter((r) => r.ok).length;
  const label = score <= 1 ? "auth.weak" : score === 2 ? "auth.medium" : "auth.strong";
  const barColor =
    score <= 1 ? "bg-destructive" : score === 2 ? "bg-warning" : "bg-success";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (score < 3) return setErr(t("auth.strength"));
    if (pw !== confirm) return setErr(t("auth.confirm"));
    setErr(null);
    toast.success(t("auth.success.title"));
    navigate({ to: "/reset-success" });
  };

  return (
    <AuthShell
      asideTitle={t("auth.aside.reset.title")}
      asideSub={t("auth.aside.reset.sub")}
      asideExtra={
        <div className="flex justify-center gap-6 text-xs font-medium">
          <span className="inline-flex items-center gap-2">
            <Shield className="size-4" /> {t("auth.aside.sec1")}
          </span>
          <span className="inline-flex items-center gap-2">
            <Lock className="size-4" /> {t("auth.aside.sec2")}
          </span>
        </div>
      }
    >
      <AuthSteps step={3} />
      <AuthHeading title={t("auth.reset.title")} sub={t("auth.reset.sub")} />
      <form className="space-y-4" onSubmit={submit} noValidate>
        <div className="space-y-2">
          <Label htmlFor="np">{t("auth.newPassword")}</Label>
          <Input
            id="np"
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="••••••••"
          />
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
            <div
              className={cn("h-full rounded-full transition-all", barColor)}
              style={{ width: `${(score / 3) * 100}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{t("auth.strength")}</span>
            <span className="font-semibold text-foreground">{pw ? t(label) : "—"}</span>
          </div>
          <ul className="space-y-1 pt-1">
            {rules.map((r) => (
              <li key={r.key} className="flex items-center gap-2 text-xs">
                <span
                  className={cn(
                    "grid size-4 place-items-center rounded-full border",
                    r.ok ? "border-success bg-success text-success-foreground" : "border-border",
                  )}
                >
                  {r.ok ? <Check className="size-3" /> : null}
                </span>
                <span className={r.ok ? "text-foreground" : "text-muted-foreground"}>
                  {t(r.key)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cp">{t("auth.confirm")}</Label>
          <Input
            id="cp"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="••••••••"
          />
        </div>
        {err ? <p className="text-xs text-destructive">{err}</p> : null}

        <Button type="submit" className="w-full gradient-brand">
          {t("auth.savePassword")}
        </Button>
      </form>
      <Link
        to="/login"
        className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4 rtl:rotate-180" />
        {t("auth.backToLogin")}
      </Link>
    </AuthShell>
  );
}
