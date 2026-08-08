import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalendarClock, Loader2, Pencil, Plus, Trash2, TrendingDown, TrendingUp } from "lucide-react";
import { toast } from "sonner";

import { AppLayout, PageHeader } from "@/components/app-layout";
import { EmptyState, SectionCard } from "@/components/shared";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/lib/i18n";
import { addPeriod, useStore, type Recurrence, type Recurring } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/recurring")({
  head: () => ({
    meta: [
      { title: "Recurring operations — Smart Spend" },
      {
        name: "description",
        content:
          "Manage recurring income and expenses: salaries, rent, bills and subscriptions, each reviewed before it is deducted.",
      },
      { property: "og:title", content: "Recurring operations — Smart Spend" },
      {
        property: "og:description",
        content: "Schedule salaries, rent, bills and subscriptions and confirm every deduction.",
      },
    ],
  }),
  component: RecurringPage,
});

const RECURRENCES: { key: Recurrence; label: string }[] = [
  { key: "weekly", label: "rec.weekly" },
  { key: "biweekly", label: "rec.biweekly" },
  { key: "monthly", label: "rec.monthly" },
  { key: "quarterly", label: "rec.quarterly" },
  { key: "yearly", label: "rec.yearly" },
];

const CATEGORIES = [
  { key: "Salary", en: "Salary", ar: "راتب" },
  { key: "Freelance", en: "Freelance", ar: "عمل حر" },
  { key: "Rental", en: "Rental income", ar: "دخل إيجاري" },
  { key: "Housing", en: "Housing & rent", ar: "سكن وإيجار" },
  { key: "Utilities", en: "Utilities", ar: "فواتير" },
  { key: "Software", en: "Subscriptions", ar: "اشتراكات" },
  { key: "Transport", en: "Transport", ar: "مواصلات" },
  { key: "Health", en: "Health", ar: "صحة" },
];

const todayStr = () => new Date().toISOString().slice(0, 10);
const daysUntil = (d: string) =>
  Math.round((new Date(d).getTime() - new Date(todayStr()).getTime()) / 86400000);

type FormState = {
  name: string;
  amount: string;
  accountId: string;
  category: string;
  nextDate: string;
  recurrence: Recurrence;
  note: string;
};

function RecurringForm({
  kind,
  initial,
  open,
  onOpenChange,
}: {
  kind: "income" | "expense";
  initial?: Recurring;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { t, lang, money } = useI18n();
  const { accounts, addRecurring, updateRecurring } = useStore();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState>(() => ({
    name: initial ? (lang === "ar" ? initial.nameAr : initial.name) : "",
    amount: initial ? String(initial.amount) : "",
    accountId: initial?.accountId ?? accounts[0]?.id ?? "",
    category: initial?.category ?? (kind === "income" ? "Salary" : "Utilities"),
    nextDate: initial?.nextDate ?? todayStr(),
    recurrence: initial?.recurrence ?? "monthly",
    note: initial?.note ?? "",
  }));

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const amountValue = Number(form.amount);
  const validAmount = Number.isFinite(amountValue) && amountValue > 0;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error(t("err.name"));
    if (!validAmount) return toast.error(t("err.amount"));
    if (!form.accountId) return toast.error(t("err.account"));
    if (!form.nextDate) return toast.error(t("err.date"));

    const cat = CATEGORIES.find((c) => c.key === form.category);
    setSaving(true);
    const payload = {
      kind,
      name: form.name.trim(),
      nameAr: form.name.trim(),
      accountId: form.accountId,
      category: cat?.key ?? form.category,
      categoryAr: cat?.ar ?? form.category,
      amount: amountValue,
      currency: accounts.find((a) => a.id === form.accountId)?.currency ?? "USD",
      nextDate: form.nextDate,
      recurrence: form.recurrence,
      note: form.note.trim(),
      active: true,
    };
    if (initial) {
      await updateRecurring({ ...initial, ...payload });
      toast.success(t("rec.updated"));
    } else {
      await addRecurring(payload);
      toast.success(kind === "income" ? t("rec.savedIncome") : t("rec.savedExpense"));
    }
    setSaving(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto scrollbar-slim sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">
            {initial
              ? t("rec.editTitle")
              : kind === "income"
                ? t("rec.addIncome")
                : t("rec.addExpense")}
          </DialogTitle>
          <DialogDescription>{t("rec.sub")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rname">{t("rec.name")}</Label>
            <Input
              id="rname"
              value={form.name}
              placeholder={kind === "income" ? t("rec.namePhIncome") : t("rec.namePhExpense")}
              onChange={(e) => set("name", e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ramount">{t("ops.amount")}</Label>
              <Input
                id="ramount"
                inputMode="decimal"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => set("amount", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rdate">{t("rec.firstDue")}</Label>
              <Input
                id="rdate"
                type="date"
                value={form.nextDate}
                onChange={(e) => set("nextDate", e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{t("ops.account")}</Label>
              <Select value={form.accountId} onValueChange={(v) => set("accountId", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {lang === "ar" ? a.nameAr : a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("ops.category")}</Label>
              <Select value={form.category} onValueChange={(v) => set("category", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.key} value={c.key}>
                      {lang === "ar" ? c.ar : c.en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t("rec.recurrence")}</Label>
            <Select
              value={form.recurrence}
              onValueChange={(v) => set("recurrence", v as Recurrence)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RECURRENCES.map((r) => (
                  <SelectItem key={r.key} value={r.key}>
                    {t(r.label)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rnote">{t("rec.notes")}</Label>
            <Input
              id="rnote"
              value={form.note}
              placeholder={t("ops.notePh")}
              onChange={(e) => set("note", e.target.value)}
            />
          </div>

          <div className="rounded-xl border bg-muted/50 p-4 text-sm">
            <p className="font-semibold">{t("rec.previewTitle")}</p>
            <p className="mt-1 text-muted-foreground">
              {form.name.trim() || "—"} · {validAmount ? money(amountValue) : "—"} ·{" "}
              {t(RECURRENCES.find((r) => r.key === form.recurrence)?.label ?? "rec.monthly")}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {t("rec.next")}: {form.nextDate || "—"} →{" "}
              {form.nextDate ? addPeriod(form.nextDate, form.recurrence) : "—"}
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="size-4 animate-spin" />}
              {kind === "income" ? t("rec.saveIncome") : t("rec.saveExpense")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function PostponeDialog({
  item,
  onClose,
}: {
  item: Recurring | null;
  onClose: () => void;
}) {
  const { t } = useI18n();
  const { postponeRecurring } = useStore();
  const [date, setDate] = useState("");
  const [busy, setBusy] = useState(false);

  const apply = async (target: string) => {
    if (!item || !target) return;
    setBusy(true);
    await postponeRecurring(item.id, target);
    setBusy(false);
    setDate("");
    toast.success(t("rec.postponed"));
    onClose();
  };

  const shiftFrom = (days: number) => {
    const d = new Date(item?.nextDate ?? todayStr());
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  };

  return (
    <Dialog open={!!item} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">{t("rec.postponeTitle")}</DialogTitle>
          <DialogDescription>{item?.name}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" disabled={busy} onClick={() => apply(shiftFrom(7))}>
            {t("rec.week")}
          </Button>
          <Button variant="outline" disabled={busy} onClick={() => apply(shiftFrom(30))}>
            {t("rec.month")}
          </Button>
        </div>
        <div className="space-y-2">
          <Label htmlFor="pdate">{t("rec.custom")}</Label>
          <Input id="pdate" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button disabled={!date || busy} onClick={() => apply(date)}>
            {busy && <Loader2 className="size-4 animate-spin" />}
            {t("rec.postpone")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RecurringRow({
  item,
  onEdit,
  onPostpone,
}: {
  item: Recurring;
  onEdit: (r: Recurring) => void;
  onPostpone: (r: Recurring) => void;
}) {
  const { t, lang, money } = useI18n();
  const { accounts, removeRecurring, confirmRecurring } = useStore();
  const [busy, setBusy] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);

  const account = accounts.find((a) => a.id === item.accountId);
  const left = daysUntil(item.nextDate);
  const due = left <= 0;

  return (
    <li className="flex flex-wrap items-center gap-3 py-3.5">
      <span
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-xl",
          item.kind === "income" ? "bg-success/12 text-success" : "bg-destructive/10 text-destructive",
        )}
      >
        {item.kind === "income" ? (
          <TrendingUp className="size-5" />
        ) : (
          <TrendingDown className="size-5" />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{lang === "ar" ? item.nameAr : item.name}</p>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {lang === "ar" ? item.categoryAr : item.category} ·{" "}
          {account ? (lang === "ar" ? account.nameAr : account.name) : "—"} ·{" "}
          {t(RECURRENCES.find((r) => r.key === item.recurrence)?.label ?? "rec.monthly")}
        </p>
        <p
          className={cn(
            "mt-0.5 text-xs",
            due ? "font-medium text-destructive" : "text-muted-foreground",
          )}
        >
          {t("rec.next")}: {item.nextDate}
          {" · "}
          {due ? t("rec.overdue") : t("rec.inDays").replace("{n}", String(left))}
        </p>
        {item.lastAmount != null && item.lastAmount !== item.amount && (
          <p className="mt-0.5 text-xs text-muted-foreground">
            {t("rec.previousAmount")}: {money(item.lastAmount)}
          </p>
        )}
      </div>
      <span className="shrink-0 text-sm font-semibold tabular-nums">
        {item.kind === "income" ? "+" : "-"}
        {money(item.amount)}
      </span>
      <div className="flex shrink-0 items-center gap-1">
        <Button size="sm" variant="outline" onClick={() => setConfirmOpen(true)} disabled={busy}>
          {busy && <Loader2 className="size-4 animate-spin" />}
          {item.kind === "income" ? t("rec.confirmIncome") : t("rec.confirm")}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onPostpone(item)}>
          <CalendarClock className="size-4" />
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onEdit(item)} aria-label={t("common.edit")}>
          <Pencil className="size-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setDelOpen(true)}
          aria-label={t("common.delete")}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              {item.kind === "income" ? t("rec.confirmIncome") : t("rec.confirm")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {lang === "ar" ? item.nameAr : item.name} · {money(item.amount)} · {item.nextDate}
              <br />
              {t("rec.confirmBody")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                setBusy(true);
                await confirmRecurring(item.id);
                setBusy(false);
                toast.success(t("rec.confirmed"));
              }}
            >
              {t("common.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={delOpen} onOpenChange={setDelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">{t("common.delete")}</AlertDialogTitle>
            <AlertDialogDescription>{lang === "ar" ? item.nameAr : item.name}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await removeRecurring(item.id);
                toast.success(t("rec.removed"));
              }}
            >
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </li>
  );
}

function RecurringPage() {
  const { t } = useI18n();
  const { recurring } = useStore();
  const [formKind, setFormKind] = useState<"income" | "expense" | null>(null);
  const [editing, setEditing] = useState<Recurring | null>(null);
  const [postponing, setPostponing] = useState<Recurring | null>(null);

  const income = useMemo(() => recurring.filter((r) => r.kind === "income"), [recurring]);
  const expenses = useMemo(() => recurring.filter((r) => r.kind === "expense"), [recurring]);
  const due = useMemo(
    () => [...recurring].filter((r) => daysUntil(r.nextDate) <= 3).sort((a, b) => (a.nextDate < b.nextDate ? -1 : 1)),
    [recurring],
  );

  return (
    <AppLayout>
      <PageHeader
        title={t("rec.title")}
        subtitle={t("rec.sub")}
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => setFormKind("income")}>
              <Plus className="size-4" />
              {t("rec.addIncome")}
            </Button>
            <Button className="rounded-xl" onClick={() => setFormKind("expense")}>
              <Plus className="size-4" />
              {t("rec.addExpense")}
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
        <SectionCard title={`${t("rec.due")} (${due.length})`} subtitle={t("rec.dueSub")}>
          {due.length === 0 ? (
            <EmptyState title={t("rec.emptyDue")} />
          ) : (
            <ul className="divide-y">
              {due.map((r) => (
                <RecurringRow key={r.id} item={r} onEdit={setEditing} onPostpone={setPostponing} />
              ))}
            </ul>
          )}
        </SectionCard>

        <div className="grid gap-6 xl:grid-cols-2">
          <SectionCard title={`${t("rec.incomeList")} (${income.length})`}>
            {income.length === 0 ? (
              <EmptyState title={t("rec.emptyIncome")} />
            ) : (
              <ul className="divide-y">
                {income.map((r) => (
                  <RecurringRow key={r.id} item={r} onEdit={setEditing} onPostpone={setPostponing} />
                ))}
              </ul>
            )}
          </SectionCard>

          <SectionCard title={`${t("rec.expenseList")} (${expenses.length})`}>
            {expenses.length === 0 ? (
              <EmptyState title={t("rec.emptyExpense")} />
            ) : (
              <ul className="divide-y">
                {expenses.map((r) => (
                  <RecurringRow key={r.id} item={r} onEdit={setEditing} onPostpone={setPostponing} />
                ))}
              </ul>
            )}
          </SectionCard>
        </div>
      </div>

      {formKind && (
        <RecurringForm
          key={formKind}
          kind={formKind}
          open
          onOpenChange={(v) => !v && setFormKind(null)}
        />
      )}
      {editing && (
        <RecurringForm
          key={editing.id}
          kind={editing.kind}
          initial={editing}
          open
          onOpenChange={(v) => !v && setEditing(null)}
        />
      )}
      <PostponeDialog item={postponing} onClose={() => setPostponing(null)} />
    </AppLayout>
  );
}
