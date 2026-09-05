import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { AuthHeading, AuthShell, AuthSteps } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/verify-code")({
  head: () => ({
    meta: [
      { title: "Verify code — Smart Spend" },
      { name: "description", content: "Enter the verification code sent to your phone to continue resetting your Smart Spend password." },
      { property: "og:title", content: "Verify code — Smart Spend" },
      { property: "og:description", content: "Confirm your identity with a one-time code." },
    ],
  }),
  component: VerifyPage,
});

function VerifyPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [code, setCode] = useState(["", "", "", ""]);
  const [err, setErr] = useState(false);
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const setDigit = (i: number, v: string) => {
    const d = v.replace(/\D/g, "").slice(-1);
    setCode((c) => c.map((x, idx) => (idx === i ? d : x)));
    if (d && i < 3) refs.current[i + 1]?.focus();
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.some((c) => !c)) return setErr(true);
    setErr(false);
    toast.success(t("common.confirm"));
    navigate({ to: "/reset-password" });
  };

  return (
    <AuthShell
      asideTitle={t("auth.aside.verify.title")}
      asideSub={t("auth.aside.verify.sub")}
      asideExtra={
        <span className="inline-flex items-center gap-3 rounded-2xl border border-primary-foreground/15 bg-primary-foreground/10 px-4 py-3 text-xs font-medium">
          <span className="flex -space-x-2 rtl:space-x-reverse">
            {["S", "M", "A"].map((c) => (
              <span
                key={c}
                className="grid size-7 place-items-center rounded-full border border-primary-foreground/20 bg-primary-foreground/20 text-[11px]"
              >
                {c}
              </span>
            ))}
          </span>
          {t("auth.aside.users")}
        </span>
      }
    >
      <AuthSteps step={2} />
      <AuthHeading title={t("auth.verify.title")} sub={t("auth.verify.sub")} />
      <form className="space-y-4" onSubmit={submit} noValidate>
        <div className="flex justify-center gap-3" dir="ltr">
          {code.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              value={d}
              onChange={(e) => setDigit(i, e.target.value)}
              inputMode="numeric"
              aria-label={`digit ${i + 1}`}
              className="focus-ringed size-14 rounded-2xl border border-input bg-surface-muted text-center text-xl font-semibold text-foreground"
            />
          ))}
        </div>
        <p className="text-center text-xs text-muted-foreground">
          {t("auth.codeSentTo")} <span className="font-semibold text-foreground">05•••••21</span>
        </p>
        {err ? (
          <p className="text-center text-xs text-destructive">{t("common.required")}</p>
        ) : null}
        <p className="text-center text-xs text-muted-foreground">
          {t("auth.noCode")}{" "}
          <button
            type="button"
            onClick={() => toast.success(t("auth.resend"))}
            className="font-semibold text-primary hover:underline"
          >
            {t("auth.resend")}
          </button>
        </p>
        <Button type="submit" className="shine-sweep h-11 w-full rounded-xl gradient-brand shadow-[0_10px_30px_-12px_var(--primary)] transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0">
          {t("common.confirm")}
        </Button>
      </form>
      <Link
        to="/forgot-password"
        className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4 rtl:rotate-180" />
        {t("auth.editPhone")}
      </Link>
    </AuthShell>
  );
}
