import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppLayout, PageHeader } from "@/components/app-layout";
import { EmptyState, ProgressBar, SectionCard, StatCard } from "@/components/shared";
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
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/budgets")({
  head: () => ({
    meta: [
      { title: "Budgets — Smart Spend" },
      {
        name: "description",
        content: "Set monthly category limits and watch spending progress update live.",
      },
      { property: "og:title", content: "Budgets — Smart Spend" },
      {
        property: "og:description",
        content: "Monthly budget overview with per-category limits and remaining balance.",
      },
    ],
  }),
  component: BudgetsPage,
});

function BudgetsPage() {
  const { t, lang, money } = useI18n();
  const { budgets, addBudget, removeBudget } = useStore();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");
  const [errors, setErrors] = useState<{ category?: string; limit?: string }>({});

  const totalLimit = budgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);

  const submit = async () => {
    const next: { category?: string; limit?: string } = {};
    if (!category.trim()) next.category = t("common.required");
    if (!limit || Number(limit) <= 0) next.limit = t("common.invalidAmount");
    setErrors(next);
    if (Object.keys(next).length) return;
    setSaving(true);
    try {
      await addBudget({
        category: category.trim(),
        categoryAr: category.trim(),
        limit: Number(limit),
        spent: 0,
      });
      toast.success(t("common.saved"));
      setOpen(false);
      setCategory("");
      setLimit("");
    } catch {
      toast.error(t("common.networkError"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title={t("bud.title")}
        subtitle={t("bud.sub")}
        action={
          <Button
            onClick={() => setOpen(true)}
            className="gap-2 rounded-xl shadow-[var(--shadow-brand)]"
          >
            <Plus className="size-4" />
            <span className="hidden sm:inline">{t("bud.create")}</span>
          </Button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          label={t("bud.monthly")}
          value={money(totalLimit)}
          icon={<span className="text-xs font-bold">Σ</span>}
          highlight
        />
        <StatCard
          label={t("bud.spent")}
          value={money(totalSpent)}
          icon={<span className="text-xs font-bold">−</span>}
        />
        <StatCard
          label={t("bud.remaining")}
          value={money(totalLimit - totalSpent)}
          icon={<span className="text-xs font-bold">+</span>}
        />
      </div>

      <SectionCard title={t("bud.title")} subtitle={t("bud.sub")}>
        {budgets.length === 0 ? (
          <EmptyState title={t("common.empty")} hint={t("common.emptyHint")} />
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2">
            {budgets.map((b) => {
              const pct = Math.round((b.spent / b.limit) * 100);
              const over = pct > 100;
              return (
                <li key={b.id} className="rounded-2xl border p-4 transition-shadow hover:shadow-[var(--shadow-soft)]">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                    <p className="truncate font-medium">
                      {lang === "ar" ? b.categoryAr : b.category}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={t("common.delete")}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => setDeleteId(b.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                  <div className="mb-2 mt-3 flex justify-between text-xs text-muted-foreground">
                    <span className="tabular-nums">
                      {money(b.spent)} / {money(b.limit)}
                    </span>
                    <span className={cn("font-medium", over ? "text-destructive" : "text-success")}>
                      {over ? t("bud.over") : `${t("bud.remaining")} ${money(b.limit - b.spent)}`}
                    </span>
                  </div>
                  <ProgressBar value={pct} tone={over ? "danger" : "brand"} />
                </li>
              );
            })}
          </ul>
        )}
      </SectionCard>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("bud.create")}</DialogTitle>
            <DialogDescription>{t("bud.sub")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bud-cat">{t("common.category")}</Label>
              <Input
                id="bud-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                aria-invalid={!!errors.category}
              />
              {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="bud-limit">{t("bud.limit")}</Label>
              <Input
                id="bud-limit"
                inputMode="decimal"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                aria-invalid={!!errors.limit}
              />
              {errors.limit && <p className="text-xs text-destructive">{errors.limit}</p>}
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
                await removeBudget(deleteId);
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
