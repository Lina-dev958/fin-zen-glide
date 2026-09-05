import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AuthHeading, AuthShell, AuthSteps } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot password — Smart Spend" },
      { name: "description", content: "Reset your Smart Spend password with a secure verification code." },
      { property: "og:title", content: "Forgot password — Smart Spend" },
      { property: "og:description", content: "Recover access to your Smart Spend account safely." },
    ],
  }),
  component: ForgotPage,
});

function ForgotPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [err, setErr] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return setErr(true);
    setErr(false);
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      toast.success(t("auth.sendCode"));
      navigate({ to: "/verify-code" });
    }, 700);
  };

  return (
    <AuthShell
      asideTitle={t("auth.aside.forgot.title")}
      asideSub={t("auth.aside.forgot.sub")}
    >
      <AuthSteps step={1} />
      <AuthHeading title={t("auth.forgot.title")} sub={t("auth.forgot.sub")} />
      <form className="space-y-4" onSubmit={submit} noValidate>
        <div className="space-y-2">
          <Label htmlFor="fid">{t("auth.identifier")}</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute inset-y-0 my-auto size-4 text-muted-foreground ltr:right-3 rtl:left-3" />
            <Input
              id="fid"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="example@gmail.com"
              aria-invalid={err}
            />
          </div>
          {err ? <p className="text-xs text-destructive">{t("common.required")}</p> : null}
        </div>
        <Button type="submit" className="shine-sweep h-11 w-full rounded-xl gradient-brand shadow-[0_10px_30px_-12px_var(--primary)] transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0" disabled={busy}>
          {busy ? t("common.saving") : t("auth.sendCode")}
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
