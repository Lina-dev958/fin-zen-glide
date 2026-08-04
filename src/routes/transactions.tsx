import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeftRight,
  Eye,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { AppLayout, PageHeader } from "@/components/app-layout";
import { EmptyState } from "@/components/shared";
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
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/lib/i18n";
import { useStore, type Transaction, type TxType } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/transactions")({
  head: () => ({
    meta: [
      { title: "Transactions — Smart Spend" },
      {
        name: "description",
        content:
          "Search, filter and manage every income, expense and internal transfer across your accounts.",
      },
      { property: "og:title", content: "Transactions — Smart Spend" },
      {
        property: "og:description",
        content: "Advanced filtering, sorting and pagination for all money movement.",
      },
    ],
  }),
  component: TransactionsPage,
});

const PER_PAGE = 8;

type Draft = {
  title: string;
  type: TxType;
  amount: string;
  category: string;
  accountId: string;
  date: string;
  note: string;
};

function TransactionsPage() {
  const { t, lang, money } = useI18n();
  const { transactions, accounts, addTransaction, updateTransaction, removeTransaction } =
    useStore();

  const [query, setQuery] = useState("");
  const [type, setType] = useState<"all" | TxType>("all");
  const [category, setCategory] = useState("all");
  const [from, setFrom] = useState("");
  const [sort, setSort] = useState<"date-desc" | "date-asc" | "amount-desc" | "amount-asc">(
    "date-desc",
  );
  const [page, setPage] = useState(1);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [viewing, setViewing] = useState<Transaction | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; amount?: string }>({});

  const emptyDraft: Draft = {
    title: "",
    type: "expense",
    amount: "",
    category: "Dining",
    accountId: accounts[0]?.id ?? "",
    date: new Date().toISOString().slice(0, 10),
    note: "",
  };
  const [draft, setDraft] = useState<Draft>(emptyDraft);

  const categories = useMemo(
    () => [...new Set(transactions.map((tx) => tx.category))],
    [transactions],
  );

  const filtered = useMemo(() => {
    const list = transactions.filter((tx) => {
      const text = `${tx.title} ${tx.titleAr} ${tx.category}`.toLowerCase();
      if (query && !text.includes(query.toLowerCase())) return false;
      if (type !== "all" && tx.type !== type) return false;
      if (category !== "all" && tx.category !== category) return false;
      if (from && tx.date < from) return false;
      return true;
    });
    return list.sort((a, b) => {
      switch (sort) {
        case "date-asc":
          return a.date.localeCompare(b.date);
        case "amount-desc":
          return b.amount - a.amount;
        case "amount-asc":
          return a.amount - b.amount;
        default:
          return b.date.localeCompare(a.date);
      }
    });
  }, [transactions, query, type, category, from, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, pages);
  const rows = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const accountName = (id: string) => {
    const a = accounts.find((x) => x.id === id);
    if (!a) return "—";
    return lang === "ar" ? a.nameAr : a.name;
  };

  const openNew = () => {
    setEditing(null);
    setDraft(emptyDraft);
    setErrors({});
    setOpen(true);
  };

  const openEdit = (tx: Transaction) => {
    setEditing(tx);
    setDraft({
      title: tx.title,
      type: tx.type,
      amount: String(tx.amount),
      category: tx.category,
      accountId: tx.accountId,
      date: tx.date,
      note: tx.note ?? "",
    });
    setErrors({});
    setOpen(true);
  };

  const submit = async () => {
    const next: { title?: string; amount?: string } = {};
    if (!draft.title.trim()) next.title = t("common.required");
    if (!draft.amount || Number(draft.amount) <= 0 || Number.isNaN(Number(draft.amount)))
      next.amount = t("common.invalidAmount");
    setErrors(next);
    if (Object.keys(next).length) return;

    setSaving(true);
    try {
      const payload = {
        title: draft.title.trim(),
        titleAr: draft.title.trim(),
        type: draft.type,
        amount: Number(draft.amount),
        category: draft.category,
        categoryAr: draft.category,
        accountId: draft.accountId,
        date: draft.date,
        note: draft.note.trim(),
      };
      if (editing) await updateTransaction({ ...editing, ...payload });
      else await addTransaction(payload);
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
      await removeTransaction(deleteId);
      toast.success(t("common.deleted"));
    } catch {
      toast.error(t("common.networkError"));
    } finally {
      setDeleteId(null);
    }
  };

  const resetFilters = () => {
    setQuery("");
    setType("all");
    setCategory("all");
    setFrom("");
    setSort("date-desc");
    setPage(1);
  };

  return (
    <AppLayout>
      <PageHeader
        title={t("tx.title")}
        subtitle={t("tx.sub")}
        action={
          <Button onClick={openNew} className="gap-2 rounded-xl shadow-[var(--shadow-brand)]">
            <Plus className="size-4" />
            <span className="hidden sm:inline">{t("tx.add")}</span>
          </Button>
        }
      />

      <div className="panel mb-5 p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <SlidersHorizontal className="size-4" />
          {t("common.filters")}
        </div>
        <div className="grid gap-3 lg:grid-cols-[minmax(0,2fr)_repeat(4,minmax(0,1fr))]">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground ltr:left-3 rtl:right-3" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder={t("common.search")}
              className="rounded-xl ltr:pl-10 rtl:pr-10"
            />
          </div>
          <Select
            value={type}
            onValueChange={(v) => {
              setType(v as typeof type);
              setPage(1);
            }}
          >
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder={t("common.type")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("common.all")}</SelectItem>
              <SelectItem value="income">{t("tx.income")}</SelectItem>
              <SelectItem value="expense">{t("tx.expense")}</SelectItem>
              <SelectItem value="transfer">{t("tx.transfer")}</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={category}
            onValueChange={(v) => {
              setCategory(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder={t("common.category")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("common.all")}</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={from}
            onChange={(e) => {
              setFrom(e.target.value);
              setPage(1);
            }}
            className="rounded-xl"
          />
          <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder={t("common.sort")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">{t("common.date")} ↓</SelectItem>
              <SelectItem value="date-asc">{t("common.date")} ↑</SelectItem>
              <SelectItem value="amount-desc">{t("common.amount")} ↓</SelectItem>
              <SelectItem value="amount-asc">{t("common.amount")} ↑</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {filtered.length} {t("common.results")}
          </span>
          <button onClick={resetFilters} className="focus-ringed rounded text-primary hover:underline">
            {t("common.reset")}
          </button>
        </div>
      </div>

      <div className="panel overflow-hidden">
        {rows.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title={t("common.empty")}
              hint={t("common.emptyHint")}
              action={
                <Button variant="outline" className="mt-2 rounded-xl" onClick={resetFilters}>
                  {t("common.reset")}
                </Button>
              }
            />
          </div>
        ) : (
          <ul className="divide-y">
            {rows.map((tx) => (
              <li
                key={tx.id}
                className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3.5 transition-colors hover:bg-muted/50 sm:px-5"
              >
                <span
                  className={cn(
                    "grid size-10 shrink-0 place-items-center rounded-xl",
                    tx.type === "income"
                      ? "bg-success/10 text-success"
                      : tx.type === "expense"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-muted text-primary",
                  )}
                >
                  {tx.type === "income" ? (
                    <TrendingUp className="size-4" />
                  ) : tx.type === "expense" ? (
                    <TrendingDown className="size-4" />
                  ) : (
                    <ArrowLeftRight className="size-4" />
                  )}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {lang === "ar" ? tx.titleAr : tx.title}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {lang === "ar" ? tx.categoryAr : tx.category} · {accountName(tx.accountId)} ·{" "}
                    {tx.date}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-sm font-semibold tabular-nums",
                      tx.type === "income" ? "text-success" : "text-foreground",
                    )}
                  >
                    {tx.type === "income" ? "+" : tx.type === "expense" ? "−" : ""}
                    {money(tx.amount)}
                  </span>
                  <div className="hidden gap-1 opacity-0 transition-opacity group-hover:opacity-100 sm:flex">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={t("common.details")}
                      onClick={() => setViewing(tx)}
                    >
                      <Eye className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={t("common.edit")}
                      onClick={() => openEdit(tx)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={t("common.delete")}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => setDeleteId(tx.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {pages > 1 && (
          <div className="flex items-center justify-between border-t px-5 py-3 text-sm">
            <span className="text-muted-foreground">
              {t("common.page")} {current} {t("common.of")} {pages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
                disabled={current === 1}
                onClick={() => setPage(current - 1)}
              >
                {t("common.prev")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
                disabled={current === pages}
                onClick={() => setPage(current + 1)}
              >
                {t("common.next")}
              </Button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? t("common.edit") : t("tx.add")}</DialogTitle>
            <DialogDescription>{t("tx.sub")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tx-title">{t("common.name")}</Label>
              <Input
                id="tx-title"
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                aria-invalid={!!errors.title}
              />
              {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>{t("common.type")}</Label>
                <Select
                  value={draft.type}
                  onValueChange={(v) => setDraft({ ...draft, type: v as TxType })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">{t("tx.income")}</SelectItem>
                    <SelectItem value="expense">{t("tx.expense")}</SelectItem>
                    <SelectItem value="transfer">{t("tx.transfer")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tx-amount">{t("common.amount")}</Label>
                <Input
                  id="tx-amount"
                  inputMode="decimal"
                  value={draft.amount}
                  onChange={(e) => setDraft({ ...draft, amount: e.target.value })}
                  aria-invalid={!!errors.amount}
                />
                {errors.amount && <p className="text-xs text-destructive">{errors.amount}</p>}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>{t("common.category")}</Label>
                <Select
                  value={draft.category}
                  onValueChange={(v) => setDraft({ ...draft, category: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[...new Set([...categories, "Dining", "Groceries", "Transfer"])].map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t("common.account")}</Label>
                <Select
                  value={draft.accountId}
                  onValueChange={(v) => setDraft({ ...draft, accountId: v })}
                >
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
                <Label htmlFor="tx-date">{t("common.date")}</Label>
                <Input
                  id="tx-date"
                  type="date"
                  value={draft.date}
                  onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tx-note">{t("tx.note")}</Label>
              <Textarea
                id="tx-note"
                rows={2}
                value={draft.note}
                onChange={(e) => setDraft({ ...draft, note: e.target.value })}
              />
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

      <Dialog open={!!viewing} onOpenChange={(v) => !v && setViewing(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{viewing && (lang === "ar" ? viewing.titleAr : viewing.title)}</DialogTitle>
            <DialogDescription>{viewing?.date}</DialogDescription>
          </DialogHeader>
          {viewing && (
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{t("common.amount")}</dt>
                <dd className="font-semibold tabular-nums">{money(viewing.amount)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{t("common.type")}</dt>
                <dd>
                  <Badge variant="secondary" className="rounded-full">
                    {t(`tx.${viewing.type}`)}
                  </Badge>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{t("common.category")}</dt>
                <dd>{lang === "ar" ? viewing.categoryAr : viewing.category}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{t("common.account")}</dt>
                <dd>{accountName(viewing.accountId)}</dd>
              </div>
              {viewing.note && (
                <div>
                  <dt className="text-muted-foreground">{t("tx.note")}</dt>
                  <dd className="mt-1">{viewing.note}</dd>
                </div>
              )}
            </dl>
          )}
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
