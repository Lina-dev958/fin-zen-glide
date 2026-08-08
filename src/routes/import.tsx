import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileSpreadsheet,
  Loader2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

import { AppLayout, PageHeader } from "@/components/app-layout";
import { SectionCard } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useStore, type ImportedTx, type TxType } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/import")({
  head: () => ({
    meta: [
      { title: "Import bank statements — Smart Spend" },
      {
        name: "description",
        content:
          "Upload a PDF, Excel or CSV bank statement, review the extracted operations, resolve duplicates and import them into your ledger.",
      },
      { property: "og:title", content: "Import bank statements — Smart Spend" },
      {
        property: "og:description",
        content: "Extract, review, match and import bank statement operations safely.",
      },
    ],
  }),
  component: ImportPage,
});

const STEPS = ["imp.step1", "imp.step2", "imp.step3", "imp.step4", "imp.step5"];
const uid = () => Math.random().toString(36).slice(2, 9);

const SAMPLE = [
  { description: "Carrefour City", amount: 62.4, type: "expense" as TxType, offset: 1 },
  { description: "Uber trip", amount: 12.9, type: "expense" as TxType, offset: 2 },
  { description: "Salary transfer", amount: 5200, type: "income" as TxType, offset: 4 },
  { description: "Electricity bill", amount: 88.15, type: "expense" as TxType, offset: 5 },
  { description: "Coffee Lab", amount: 7.5, type: "expense" as TxType, offset: 6 },
  { description: "Wallet top-up", amount: 150, type: "transfer" as TxType, offset: 8 },
  { description: "Pharmacy One", amount: 31.2, type: "expense" as TxType, offset: 9 },
];

function ImportPage() {
  const { t, lang, money } = useI18n();
  const { accounts, transactions, imported, setImported, commitImport } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(0);
  const [file, setFile] = useState<{ name: string; type: string; size: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? "");
  const [importedCount, setImportedCount] = useState(0);

  const pick = (f?: File) => {
    if (!f) return;
    if (!/\.(pdf|xlsx|xls|csv)$/i.test(f.name)) {
      toast.error(t("imp.badFile"));
      return;
    }
    setFile({ name: f.name, type: f.name.split(".").pop()?.toUpperCase() ?? "", size: f.size });
    setStep(1);
  };

  const extract = () => {
    setBusy(true);
    window.setTimeout(() => {
      const rows: ImportedTx[] = SAMPLE.map((s) => {
        const d = new Date();
        d.setDate(d.getDate() - s.offset);
        const date = d.toISOString().slice(0, 10);
        const match = transactions.find(
          (tx) => Math.abs(tx.amount - s.amount) < 0.01 && tx.date === date,
        );
        const near = transactions.find(
          (tx) =>
            Math.abs(tx.amount - s.amount) < 0.01 &&
            Math.abs(new Date(tx.date).getTime() - d.getTime()) <= 3 * 86400000,
        );
        const status: ImportedTx["status"] = match ? "duplicate" : near ? "review" : "new";
        return {
          id: uid(),
          date,
          description: s.description,
          amount: s.amount,
          type: s.type,
          currency: accounts.find((a) => a.id === accountId)?.currency ?? "USD",
          accountId,
          reference: `${file?.type ?? "CSV"}-${uid().toUpperCase()}`,
          status,
          matchId: (match ?? near)?.id,
          selected: status === "new",
        };
      });
      setImported(rows);
      setBusy(false);
      setStep(2);
    }, 1500);
  };

  const update = (id: string, patch: Partial<ImportedTx>) =>
    setImported(imported.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  const groups = useMemo(
    () => ({
      new: imported.filter((i) => i.status === "new"),
      duplicate: imported.filter((i) => i.status === "duplicate"),
      review: imported.filter((i) => i.status === "review"),
    }),
    [imported],
  );
  const selected = imported.filter((i) => i.selected);

  const finish = async () => {
    if (selected.length === 0) {
      toast.error(t("imp.noneSelected"));
      return;
    }
    setBusy(true);
    const n = await commitImport(selected);
    setBusy(false);
    setImportedCount(n);
    setStep(4);
    toast.success(t("imp.done"));
  };

  const accountName = (id: string) => {
    const a = accounts.find((x) => x.id === id);
    return a ? (lang === "ar" ? a.nameAr : a.name) : "—";
  };

  return (
    <AppLayout>
      <PageHeader title={t("imp.title")} subtitle={t("imp.sub")} />

      <ol className="mb-6 flex flex-wrap gap-2">
        {STEPS.map((s, i) => (
          <li
            key={s}
            className={cn(
              "flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium",
              i === step
                ? "border-transparent bg-primary text-primary-foreground"
                : i < step
                  ? "border-transparent bg-success/12 text-success"
                  : "bg-surface text-muted-foreground",
            )}
          >
            <span className="tabular-nums">{i + 1}</span>
            {t(s)}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <SectionCard title={t("imp.step1")} subtitle={t("imp.formats")}>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.xlsx,.xls,.csv"
            hidden
            onChange={(e) => pick(e.target.files?.[0])}
          />
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              pick(e.dataTransfer.files?.[0]);
            }}
            className="grid place-items-center gap-3 rounded-2xl border border-dashed bg-muted/40 px-6 py-14 text-center"
          >
            <FileSpreadsheet className="size-8 text-primary" />
            <p className="text-sm font-medium">{t("imp.drop")}</p>
            <p className="text-xs text-muted-foreground">{t("imp.formats")}</p>
            <Button className="rounded-xl" onClick={() => fileRef.current?.click()}>
              <Upload className="size-4" />
              {t("imp.browse")}
            </Button>
          </div>
          <div className="mt-4 space-y-2">
            <Label>{t("imp.detected")}</Label>
            <Select value={accountId} onValueChange={setAccountId}>
              <SelectTrigger className="max-w-sm">
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
        </SectionCard>
      )}

      {step === 1 && file && (
        <SectionCard title={t("imp.step2")}>
          <dl className="grid gap-3 sm:grid-cols-3">
            <Meta label={t("imp.fileName")} value={file.name} />
            <Meta label={t("imp.fileType")} value={file.type} />
            <Meta label={t("imp.fileSize")} value={`${(file.size / 1024).toFixed(1)} KB`} />
          </dl>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setStep(0)}>
              <ArrowLeft className="size-4" />
              {t("imp.back")}
            </Button>
            <Button onClick={extract} disabled={busy}>
              {busy ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
              {busy ? t("imp.extracting") : t("imp.next")}
            </Button>
          </div>
        </SectionCard>
      )}

      {step === 2 && (
        <SectionCard
          title={`${t("imp.extracted")} (${imported.length})`}
          subtitle={`${t("imp.detected")}: ${accountName(accountId)}`}
        >
          <div className="overflow-x-auto scrollbar-slim">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b text-start text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-2 py-2 text-start">{t("ops.date")}</th>
                  <th className="px-2 py-2 text-start">{t("imp.description")}</th>
                  <th className="px-2 py-2 text-start">{t("ops.amount")}</th>
                  <th className="px-2 py-2 text-start">{t("imp.status")}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {imported.map((i) => (
                  <tr key={i.id}>
                    <td className="px-2 py-2.5 tabular-nums text-muted-foreground">{i.date}</td>
                    <td className="px-2 py-2.5">
                      <Input
                        value={i.description}
                        onChange={(e) => update(i.id, { description: e.target.value })}
                        className="h-9"
                      />
                    </td>
                    <td className="px-2 py-2.5 font-medium tabular-nums">{money(i.amount)}</td>
                    <td className="px-2 py-2.5">
                      <StatusChip status={i.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setStep(1)}>
              <ArrowLeft className="size-4" />
              {t("imp.back")}
            </Button>
            <Button onClick={() => setStep(3)}>
              <ArrowRight className="size-4" />
              {t("imp.next")}
            </Button>
          </div>
        </SectionCard>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <SectionCard title={t("imp.match")} subtitle={t("imp.matchSub")}>
            <div className="grid gap-3 sm:grid-cols-3">
              <Meta label={t("imp.newOnes")} value={String(groups.new.length)} />
              <Meta label={t("imp.dupes")} value={String(groups.duplicate.length)} />
              <Meta label={t("imp.needsReview")} value={String(groups.review.length)} />
            </div>
          </SectionCard>

          <SectionCard title={`${t("imp.countExtracted")} (${imported.length})`}>
            <ul className="divide-y">
              {imported.map((i) => {
                const match = transactions.find((tx) => tx.id === i.matchId);
                return (
                  <li key={i.id} className="flex flex-wrap items-center gap-3 py-3.5">
                    <Checkbox
                      checked={i.selected}
                      onCheckedChange={(v) => update(i.id, { selected: v === true })}
                      aria-label={i.description}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{i.description}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {i.date} · {accountName(i.accountId)} · {i.reference}
                      </p>
                      {match && (
                        <p className="mt-0.5 text-xs text-warning">
                          {t("imp.existingTx")}: {lang === "ar" ? match.titleAr : match.title} ·{" "}
                          {match.date} · {money(match.amount)}
                        </p>
                      )}
                    </div>
                    <span className="shrink-0 text-sm font-semibold tabular-nums">
                      {money(i.amount)}
                    </span>
                    <StatusChip status={i.status} />
                    <div className="flex shrink-0 gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => update(i.id, { status: "new", selected: true })}
                      >
                        {t("imp.importAsNew")}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => update(i.id, { status: "duplicate", selected: false })}
                      >
                        {t("imp.markDuplicate")}
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Button variant="outline" onClick={() => setStep(2)}>
                <ArrowLeft className="size-4" />
                {t("imp.back")}
              </Button>
              <Button onClick={finish} disabled={busy}>
                {busy && <Loader2 className="size-4 animate-spin" />}
                {t("imp.importSelected")} ({selected.length})
              </Button>
              <span className="text-xs text-muted-foreground">
                {selected.length} {t("imp.selected")}
              </span>
            </div>
          </SectionCard>
        </div>
      )}

      {step === 4 && (
        <SectionCard title={t("imp.done")}>
          <div className="grid place-items-center gap-3 py-10 text-center">
            <CheckCircle2 className="size-10 text-success" />
            <p className="font-display text-lg font-semibold">
              {importedCount} · {t("imp.importedTx")}
            </p>
            <p className="max-w-sm text-sm text-muted-foreground">{t("imp.doneSub")}</p>
            <Button
              className="rounded-xl"
              onClick={() => {
                setFile(null);
                setImportedCount(0);
                setStep(0);
              }}
            >
              {t("imp.startOver")}
            </Button>
          </div>
        </SectionCard>
      )}
    </AppLayout>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-muted/40 p-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 truncate text-sm font-semibold">{value}</dd>
    </div>
  );
}

function StatusChip({ status }: { status: ImportedTx["status"] }) {
  const { t } = useI18n();
  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium",
        status === "new" && "bg-success/12 text-success",
        status === "duplicate" && "bg-destructive/10 text-destructive",
        status === "review" && "bg-warning/15 text-warning",
        status === "matched" && "bg-muted text-muted-foreground",
      )}
    >
      {t(`imp.s.${status}`)}
    </span>
  );
}
