import { createFileRoute } from "@tanstack/react-router";
import { Banknote, CreditCard, Landmark, Pencil, Plus, Trash2, Wallet } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppLayout, PageHeader } from "@/components/app-layout";
import { EmptyState, ProgressBar } from "@/components/shared";
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
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/lib/i18n";
import { useStore, type Account, type AccountType } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/accounts")({
  head: () => ({
    meta: [
      { title: "Accounts — Smart Spend" },
      {
        name: "description",
        content: "Manage cash, bank accounts, digital wallets and credit cards in one workspace.",
      },
      { property: "og:title", content: "Accounts — Smart Spend" },
      {
        property: "og:description",
        content: "Cash, bank, wallet and card balances with full add, edit and delete control.",
      },
    ],
  }),
  component: AccountsPage,
});

const typeIcon: Record<AccountType, typeof Wallet> = {
  cash: Banknote,
  bank: Landmark,
  wallet: Wallet,
  card: CreditCard,
};

type Draft = {
  name: string;
  type: AccountType;
  balance: string;
  currency: string;
  institution: string;
};

const emptyDraft: Draft = {
  name: "",
  type: "bank",
  balance: "",
  currency: "USD",
  institution: "",
};

function AccountsPage() {
  const { t, lang, money } = useI18n();
  const { accounts, addAccount, updateAccount, removeAccount } = useStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Account | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | AccountType>("all");

  const list = accounts.filter((a) => filter === "all" || a.type === filter);

  const openNew = () => {
    setEditing(null);
    setDraft(emptyDraft);
    setErrors({});
    setOpen(true);
  };

  const openEdit = (a: Account) => {
    setEditing(a);
    setDraft({
      name: a.name,
      type: a.type,
      balance: String(a.balance),
      currency: a.currency,
      institution: a.institution,
    });
    setErrors({});
    setOpen(true);
  };

  const submit = async () => {
    const next: Record<string, string> = {};
    if (!draft.name.trim()) next.name = t("common.required");
    if (draft.balance === "" || Number.isNaN(Number(draft.balance)))
      next.balance = t("common.invalidAmount");
    setErrors(next);
    if (Object.keys(next).length) return;

    setSaving(true);
    try {
      const payload = {
        name: draft.name.trim(),
        nameAr: draft.name.trim(),
        type: draft.type,
        balance: Number(draft.balance),
        currency: draft.currency,
        institution: draft.institution.trim() || "—",
      };
      if (editing) await updateAccount({ ...editing, ...payload });
      else await addAccount(payload);
      toast.success(t("common.saved"));
      setOpen(false);
    } catch {
      toast.error(t("common.networkError"));
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await removeAccount(deleteId);
      toast.success(t("common.deleted"));
    } catch {
      toast.error(t("common.networkError"));
    } finally {
      setDeleteId(null);
    }
  };

  const filters: Array<"all" | AccountType> = ["all", "bank", "card", "wallet", "cash"];

  return (
    <AppLayout>
      <PageHeader
        title={t("acc.title")}
        subtitle={t("acc.sub")}
        action={
          <Button onClick={openNew} className="gap-2 rounded-xl shadow-[var(--shadow-brand)]">
            <Plus className="size-4" />
            <span className="hidden sm:inline">{t("acc.add")}</span>
          </Button>
        }
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "focus-ringed rounded-full border px-4 py-1.5 text-sm font-medium transition-all",
              filter === f
                ? "gradient-brand border-transparent text-primary-foreground shadow-[var(--shadow-brand)]"
                : "bg-surface text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            {f === "all" ? t("common.all") : t(`acc.type.${f}`)}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <EmptyState
          title={t("common.empty")}
          hint={t("common.emptyHint")}
          action={
            <Button onClick={openNew} variant="outline" className="mt-2 rounded-xl">
              {t("acc.add")}
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((a) => {
            const Icon = typeIcon[a.type];
            const used = a.limit ? Math.round((Math.abs(a.balance) / a.limit) * 100) : 0;
            return (
              <article
                key={a.id}
                className="panel group p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-muted text-primary">
                      <Icon className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold">
                        {lang === "ar" ? a.nameAr : a.name}
                      </h3>
                      <p className="truncate text-xs text-muted-foreground">{a.institution}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="shrink-0 rounded-full">
                    {t(`acc.type.${a.type}`)}
                  </Badge>
                </div>

                <p
                  className={cn(
                    "mt-5 font-display text-2xl font-bold tabular-nums",
                    a.balance < 0 && "text-destructive",
                  )}
                >
                  {money(a.balance)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {a.currency} · {t("acc.updated")}
                </p>

                {a.limit && (
                  <div className="mt-4">
                    <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
                      <span>{t("acc.limit")}</span>
                      <span className="tabular-nums">{money(a.limit)}</span>
                    </div>
                    <ProgressBar value={used} tone={used > 80 ? "danger" : "brand"} />
                  </div>
                )}

                <div className="mt-5 flex gap-2 opacity-70 transition-opacity group-hover:opacity-100">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2 rounded-xl"
                    onClick={() => openEdit(a)}
                  >
                    <Pencil className="size-3.5" />
                    {t("common.edit")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => setDeleteId(a.id)}
                    aria-label={t("common.delete")}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? t("common.edit") : t("acc.add")}</DialogTitle>
            <DialogDescription>{t("acc.sub")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="acc-name">{t("common.name")}</Label>
              <Input
                id="acc-name"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                aria-invalid={!!errors.name}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>{t("common.type")}</Label>
                <Select
                  value={draft.type}
                  onValueChange={(v) => setDraft({ ...draft, type: v as AccountType })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(["bank", "card", "wallet", "cash"] as AccountType[]).map((ty) => (
                      <SelectItem key={ty} value={ty}>
                        {t(`acc.type.${ty}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="acc-bal">{t("common.balance")}</Label>
                <Input
                  id="acc-bal"
                  inputMode="decimal"
                  value={draft.balance}
                  onChange={(e) => setDraft({ ...draft, balance: e.target.value })}
                  aria-invalid={!!errors.balance}
                />
                {errors.balance && <p className="text-xs text-destructive">{errors.balance}</p>}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>{t("common.currency")}</Label>
                <Select
                  value={draft.currency}
                  onValueChange={(v) => setDraft({ ...draft, currency: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["USD", "EUR", "AED", "SAR", "JOD"].map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="acc-inst">{t("common.account")}</Label>
                <Input
                  id="acc-inst"
                  value={draft.institution}
                  onChange={(e) => setDraft({ ...draft, institution: e.target.value })}
                />
              </div>
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
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
