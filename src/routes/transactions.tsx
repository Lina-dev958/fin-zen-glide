import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Camera, Loader2, Mic, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AppLayout } from "@/components/app-layout";
import { EmptyState, SectionCard } from "@/components/shared";
import { Button } from "@/components/ui/button";
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
import { useStore, type TxType } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/transactions")({
  head: () => ({
    meta: [
      { title: "Financial operations — Smart Spend" },
      {
        name: "description",
        content:
          "Record income, expenses and transfers with smart voice or invoice capture, and review your full ledger.",
      },
      { property: "og:title", content: "Financial operations — Smart Spend" },
      {
        property: "og:description",
        content: "Log operations fast and keep a clean financial ledger in Smart Spend.",
      },
    ],
  }),
  component: OperationsPage,
});

const CATEGORIES: { key: string; en: string; ar: string }[] = [
  { key: "Dining", en: "Food & drink", ar: "طعام وشراب" },
  { key: "Groceries", en: "Groceries", ar: "بقالة" },
  { key: "Transport", en: "Transport", ar: "مواصلات" },
  { key: "Housing", en: "Housing & rent", ar: "سكن وإيجار" },
  { key: "Utilities", en: "Utilities", ar: "فواتير" },
  { key: "Shopping", en: "Shopping", ar: "تسوق" },
  { key: "Health", en: "Health", ar: "صحة" },
  { key: "Entertainment", en: "Entertainment", ar: "ترفيه" },
  { key: "Salary", en: "Salary", ar: "راتب" },
  { key: "Freelance", en: "Freelance", ar: "عمل حر" },
  { key: "Transfer", en: "Transfer", ar: "تحويل" },
];

const FILTERS: { key: "all" | TxType; label: string }[] = [
  { key: "all", label: "ops.all" },
  { key: "expense", label: "ops.expense" },
  { key: "income", label: "ops.income" },
  { key: "transfer", label: "ops.transfer" },
];

const TYPES: { key: TxType; label: string }[] = [
  { key: "expense", label: "ops.tExpense" },
  { key: "income", label: "ops.tIncome" },
  { key: "transfer", label: "ops.tTransfer" },
];

function OperationsPage() {
  const { t, lang, money } = useI18n();
  const { transactions, accounts, addTransaction, removeTransaction } = useStore();

  const [filter, setFilter] = useState<"all" | TxType>("all");
  const [type, setType] = useState<TxType>("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Dining");
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? "");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [capture, setCapture] = useState<CaptureMode | null>(null);


  const list = useMemo(
    () =>
      [...transactions]
        .filter((tx) => filter === "all" || tx.type === filter)
        .sort((a, b) => (a.date < b.date ? 1 : -1)),
    [transactions, filter],
  );

  const accountName = (id: string) => {
    const a = accounts.find((x) => x.id === id);
    if (!a) return "—";
    return lang === "ar" ? a.nameAr : a.name;
  };
  const catLabel = (key: string) => {
    const c = CATEGORIES.find((x) => x.key === key);
    return c ? (lang === "ar" ? c.ar : c.en) : key;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      toast.error(t("ops.invalidAmount"));
      return;
    }
    if (!note.trim()) {
      toast.error(t("ops.needTitle"));
      return;
    }
    setSaving(true);
    const cat = CATEGORIES.find((c) => c.key === category);
    await addTransaction({
      title: note.trim(),
      titleAr: note.trim(),
      type,
      amount: value,
      category: cat?.key ?? category,
      categoryAr: cat?.ar ?? category,
      accountId,
      date,
      note: note.trim(),
    });
    setSaving(false);
    setAmount("");
    setNote("");
    toast.success(t("ops.saved"));
  };

  const remove = async (id: string) => {
    setDeleting(id);
    await removeTransaction(id);
    setDeleting(null);
    toast.success(t("ops.deleted"));
  };

  return (
    <AppLayout>
      <header className="mb-6">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">{t("ops.title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("ops.sub")}</p>
      </header>

      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <div className="space-y-6">
          <section className="panel overflow-hidden p-5">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              <h2 className="font-display text-base font-semibold">{t("ops.smart")}</h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{t("ops.smartSub")}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button onClick={() => setCapture("receipt")} className="rounded-xl">
                <Camera className="size-4" />
                {t("cap.receipt")}
              </Button>
              <Button
                variant="outline"
                onClick={() => setCapture("transfer")}
                className="rounded-xl"
              >
                <Mic className="size-4" />
                {t("cap.transfer")}
              </Button>
            </div>

          </section>

          <SectionCard title={t("ops.new")}>
            <form onSubmit={submit} className="space-y-4">
              <div className="grid grid-cols-3 gap-1 rounded-xl bg-muted p-1">
                {TYPES.map((tp) => (
                  <button
                    key={tp.key}
                    type="button"
                    onClick={() => setType(tp.key)}
                    className={cn(
                      "focus-ringed rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      type === tp.key
                        ? "bg-surface text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {t(tp.label)}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">{t("ops.amount")}</Label>
                <Input
                  id="amount"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>{t("ops.category")}</Label>
                <Select value={category} onValueChange={setCategory}>
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

              <div className="space-y-2">
                <Label>{t("ops.account")}</Label>
                <Select value={accountId} onValueChange={setAccountId}>
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
                <Label htmlFor="note">{t("ops.note")}</Label>
                <Input
                  id="note"
                  placeholder={t("ops.notePh")}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">{t("ops.date")}</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full rounded-xl" disabled={saving}>
                {saving && <Loader2 className="size-4 animate-spin" />}
                {t("ops.save")}
              </Button>
            </form>
          </SectionCard>
        </div>

        <SectionCard
          title={`${t("ops.ledger")} (${list.length})`}
          action={
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                  className={cn(
                    "focus-ringed rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                    filter === f.key
                      ? "border-transparent bg-primary text-primary-foreground"
                      : "bg-surface text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t(f.label)}
                </button>
              ))}
            </div>
          }
        >
          {list.length === 0 ? (
            <EmptyState title={t("ops.empty")} hint={t("ops.emptyHint")} />
          ) : (
            <ul className="divide-y">
              {list.map((tx) => (
                <li key={tx.id} className="flex items-center gap-3 py-3.5">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{lang === "ar" ? tx.titleAr : tx.title}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {catLabel(tx.category)} · {accountName(tx.accountId)} ·{" "}
                      {new Date(tx.date).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 text-sm font-semibold tabular-nums",
                      tx.type === "income"
                        ? "text-success"
                        : tx.type === "expense"
                          ? "text-destructive"
                          : "text-muted-foreground",
                    )}
                  >
                    {tx.type === "income" ? "+" : tx.type === "expense" ? "-" : ""}
                    {money(tx.amount)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={t("common.delete")}
                    disabled={deleting === tx.id}
                    onClick={() => remove(tx.id)}
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    {deleting === tx.id ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Trash2 className="size-4" />
                    )}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </AppLayout>
  );
}
