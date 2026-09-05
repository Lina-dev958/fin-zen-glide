import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";

import { AuthHeading, AuthShell, AuthSteps } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/reset-success")({
  head: () => ({
    meta: [
      { title: "Password changed — Smart Spend" },
      { name: "description", content: "Your Smart Spend password was updated successfully. Sign in to continue." },
      { property: "og:title", content: "Password changed — Smart Spend" },
      { property: "og:description", content: "Your account is now more secure." },
    ],
  }),
  component: SuccessPage,
});

function SuccessPage() {
  const { t } = useI18n();
  return (
    <AuthShell
      asideTitle={t("auth.aside.success.title")}
      asideSub={t("auth.aside.success.sub")}
    >
      <AuthSteps step={4} />
      <div className="grid place-items-center">
        <span className="grid size-16 place-items-center rounded-full bg-success text-success-foreground">
          <Check className="size-8" />
        </span>
      </div>
      <AuthHeading title={t("auth.success.title")} sub={t("auth.success.sub")} />
      <Button asChild className="shine-sweep h-11 w-full rounded-xl gradient-brand shadow-[0_10px_30px_-12px_var(--primary)] transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0">
        <Link to="/login">{t("auth.backToLogin")}</Link>
      </Button>
    </AuthShell>
  );
}
