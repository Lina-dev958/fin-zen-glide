import { createFileRoute } from "@tanstack/react-router";
import { FileSpreadsheet, FileText } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { AppLayout, PageHeader } from "@/components/app-layout";
import { SectionCard, StatCard } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/lib/i18n";
import { cashflow, useCategoryBreakdown, useTotals } from "@/lib/store";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — Smart Spend" },
      {
        name: "description",
        content: "Income, expense and monthly analytics with PDF and Excel export.",
      },
      { property: "og:title", content: "Reports — Smart Spend" },
      { property: "og:description", content: "Financial analytics and exportable reports." },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  const { t, lang, money } = useI18n();
  const totals = useTotals();
  const categories = useCategoryBreakdown();
  const [exporting, setExporting] = useState<string | null>(null);

  const runExport = async (kind: string) => {
    setExporting(kind);
    toast.loading(t("rep.exporting"), { id: "exp" });
    await new Promise((r) => setTimeout(r, 900));
    toast.success(t("rep.exported"), { id: "exp" });
    setExporting(null);
  };

  const chartData = cashflow.map((c) => ({
    label: lang === "ar" ? c.monthAr : c.month,
    income: c.income,
    expenses: c.expenses,
  }));

  return (
    <AppLayout>
      <PageHeader
        title={t("rep.title")}
        subtitle={t("rep.sub")}
        action={
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="gap-2 rounded-xl"
              disabled={exporting === "pdf"}
              onClick={() => runExport("pdf")}
            >
              <FileText className="size-4" />
              <span className="hidden sm:inline">{t("rep.pdf")}</span>
            </Button>
            <Button
              className="gap-2 rounded-xl"
              disabled={exporting === "xls"}
              onClick={() => runExport("xls")}
            >
              <FileSpreadsheet className="size-4" />
              <span className="hidden sm:inline">{t("rep.excel")}</span>
            </Button>
          </div>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          label={t("rep.savingsRate")}
          value={`${Math.round((totals.savings / Math.max(1, totals.income)) * 100)}%`}
          icon={<span className="text-xs font-bold">%</span>}
          highlight
        />
        <StatCard
          label={t("rep.topCategory")}
          value={
            categories[0] ? (lang === "ar" ? categories[0].categoryAr : categories[0].category) : "—"
          }
          icon={<span className="text-xs font-bold">#</span>}
        />
        <StatCard
          label={t("rep.avgSpend")}
          value={money(Math.round(totals.expenses / 30))}
          icon={<span className="text-xs font-bold">Ø</span>}
        />
      </div>

      <Tabs defaultValue="monthly">
        <TabsList className="mb-4 rounded-xl">
          <TabsTrigger value="monthly" className="rounded-lg">
            {t("rep.monthly")}
          </TabsTrigger>
          <TabsTrigger value="income" className="rounded-lg">
            {t("rep.income")}
          </TabsTrigger>
          <TabsTrigger value="expense" className="rounded-lg">
            {t("rep.expense")}
          </TabsTrigger>
        </TabsList>

        {(["monthly", "income", "expense"] as const).map((tab) => (
          <TabsContent key={tab} value={tab}>
            <SectionCard title={t(`rep.${tab}`)} subtitle={t("dash.cashflowSub")}>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                    <XAxis
                      dataKey="label"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                      tickFormatter={(v) => `${v / 1000}k`}
                    />
                    <Tooltip
                      cursor={{ fill: "var(--color-muted)" }}
                      contentStyle={{
                        borderRadius: 14,
                        border: "1px solid var(--color-border)",
                        background: "var(--color-surface)",
                        fontSize: 12,
                      }}
                      formatter={(v: number) => money(v)}
                    />
                    {tab !== "expense" && (
                      <Bar dataKey="income" fill="var(--color-chart-1)" radius={[8, 8, 0, 0]} />
                    )}
                    {tab !== "income" && (
                      <Bar dataKey="expenses" fill="var(--color-chart-3)" radius={[8, 8, 0, 0]} />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>
          </TabsContent>
        ))}
      </Tabs>

      <SectionCard className="mt-6" title={t("dash.categories")}>
        <ul className="divide-y">
          {categories.map((c) => (
            <li key={c.category} className="flex items-center justify-between py-3 text-sm">
              <span>{lang === "ar" ? c.categoryAr : c.category}</span>
              <span className="font-semibold tabular-nums">{money(c.value)}</span>
            </li>
          ))}
        </ul>
      </SectionCard>
    </AppLayout>
  );
}
