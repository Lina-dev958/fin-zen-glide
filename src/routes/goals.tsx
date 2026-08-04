import { createFileRoute } from "@tanstack/react-router";
import { Plus, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppLayout, PageHeader } from "@/components/app-layout";
import { EmptyState, ProgressRing, SectionCard } from "@/components/shared";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";
import { useStore, type Goal } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/goals")({
  head: () => ({
    meta: [
      { title: "Savings Goals — Smart Spend" },
      {
        name: "description",
        content: "Track savings targets with progress rings and AI-generated saving plans.",
      },
      { property: "og:title", content: "Savings Goals — Smart Spend" },
      {
        property: "og:description",
        content: "Fast, balanced and comfortable AI saving plans for every goal.",
      },
    ],
  }),
  component: GoalsPage,
});

const planRate: Record<Goal["plan"], number> = { fast: 0.18, balanced: 0.11, comfortable: 0.07 };

function GoalsPage() {
  const { t, lang, money } = useI18n();
  const { goals, addGoal, removeGoal, depositGoal, setGoalPlan } = useStore();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [depositId, setDepositId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [errors, setErrors] = useState<{ name?: string; target?: string }>({});

  const submit = async () => {
    const next: { name?: string; target?: string } = {};
    if (!name.trim()) next.name = t("common.required");
    if (!target || Number(target) <= 0) next.target = t("common.invalidAmount");
    setErrors(next);
    if (Object.keys(next).length) return;
    setSaving(true);
    try {
      await addGoal({
        name: name.trim(),
        nameAr: name.trim(),
        target: Number(target),
        current: 0,
        deadline: "2027-12",
        plan: "balanced",
      });
      toast.success(t("common.saved"));
      setOpen(false);
      setName("");
      setTarget("");
    } catch {
      toast.error(t("common.networkError"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title={t("goal.title")}
        subtitle={t("goal.sub")}
        action={
          <Button
            onClick={() => setOpen(true)}
            className="gap-2 rounded-xl shadow-[var(--shadow-brand)]"
          >
            <Plus className="size-4" />
            <span className="hidden sm:inline">{t("goal.new")}</span>
          </Button>
        }
      />

      {goals.length === 0 ? (
        <EmptyState title={t("common.empty")} hint={t("common.emptyHint")} />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {goals.map((g) => {
            const pct = Math.round((g.current / g.target) * 100);
            const remaining = Math.max(0, g.target - g.current);
            return (
              <SectionCard key={g.id} className="h-full">
                <div className="flex flex-wrap items-center gap-5">
                  <div className="relative grid place-items-center">
                    <ProgressRing value={pct} />
                    <span className="absolute font-display text-lg font-bold tabular-nums">
                      {pct}%
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-semibold">
                      {lang === "ar" ? g.nameAr : g.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground tabular-nums">
                      {t("goal.current")} {money(g.current)} · {t("goal.target")} {money(g.target)}
                    </p>
                    <div className="mt-4 flex gap-2">
                      <Button
                        size="sm"
                        className="rounded-xl"
                        onClick={() => {
                          setDepositId(g.id);
                          setDepositAmount("");
                        }}
                      >
                        {t("goal.deposit")}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => setDeleteId(g.id)}
                        aria-label={t("common.delete")}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border bg-surface-muted p-4">
                  <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
                    <Sparkles className="size-4 text-primary" />
                    {t("goal.plans")}
                  </p>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {(["fast", "balanced", "comfortable"] as const).map((p) => {
                      const monthly = Math.round(remaining * planRate[p]) || 50;
                      const active = g.plan === p;
                      return (
                        <button
                          key={p}
                          onClick={() => {
                            setGoalPlan(g.id, p);
                            toast.success(t("goal.choose"));
                          }}
                          className={cn(
                            "focus-ringed rounded-xl border p-3 text-start transition-all hover:-translate-y-0.5",
                            active
                              ? "gradient-brand border-transparent text-primary-foreground shadow-[var(--shadow-brand)]"
                              : "bg-surface",
                          )}
                        >
                          <span className="block text-xs font-medium">{t(`goal.${p}`)}</span>
                          <span className="mt-1 block text-sm font-bold tabular-nums">
                            {money(monthly)}
                          </span>
                          <span
                            className={cn(
                              "text-[11px]",
                              active ? "text-primary-foreground/75" : "text-muted-foreground",
                            )}
                          >
                            {t("goal.perMonth")}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </SectionCard>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("goal.new")}</DialogTitle>
            <DialogDescription>{t("goal.sub")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="g-name">{t("common.name")}</Label>
              <Input
                id="g-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-invalid={!!errors.name}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="g-target">{t("goal.target")}</Label>
              <Input
                id="g-target"
                inputMode="decimal"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                aria-invalid={!!errors.target}
              />
              {errors.target && <p className="text-xs text-destructive">{errors.target}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)} disabled={saving}>
              {t("common.cancel")}
            </Button>
            <Button onClick={submit} disabled={saving} className="rounded-xl">
              {saving ? t("common.saving") : t("common.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!depositId} onOpenChange={(v) => !v && setDepositId(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("goal.deposit")}</DialogTitle>
            <DialogDescription>{t("goal.sub")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="g-dep">{t("common.amount")}</Label>
            <Input
              id="g-dep"
              inputMode="decimal"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDepositId(null)}>
              {t("common.cancel")}
            </Button>
            <Button
              className="rounded-xl"
              disabled={!depositAmount || Number(depositAmount) <= 0}
              onClick={async () => {
                if (!depositId) return;
                await depositGoal(depositId, Number(depositAmount));
                toast.success(t("common.saved"));
                setDepositId(null);
              }}
            >
              {t("common.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("common.deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("common.deleteBody")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={async () => {
                if (!deleteId) return;
                await removeGoal(deleteId);
                toast.success(t("common.deleted"));
                setDeleteId(null);
              }}
            >
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
