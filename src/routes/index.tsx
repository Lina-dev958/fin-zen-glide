import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeftRight,
  Banknote,
  CalendarClock,
  Minus,
  Plus,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AppLayout } from "@/components/app-layout";
import { EmptyState, ListSkeleton, ProgressBar, SectionCard, StatCard } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import {
  aiInsights,
  cashflow,
  upcomingBills,
  useCategoryBreakdown,
  useStore,
  useTotals,
} from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Smart Spend" },
      {
        name: "description",
        content:
          "Live financial overview: total balance, income, expenses, cash flow, budgets and AI insights.",
      },
      { property: "og:title", content: "Dashboard — Smart Spend" },
      {
        property: "og:description",
        content: "Live financial overview with cash flow, budgets, goals and AI insights.",
      },
    ],
  }),
  component: Dashboard,
});

const PIE_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

function Dashboard() {
  const { t, lang, money } = useI18n();
  const { transactions, budgets, goals } = useStore();
  const totals = useTotals();
  const categories = useCategoryBreakdown().slice(0, 5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(id);
  }, []);

  const quick = [
    { key: "dash.addIncome", icon: Plus, to: "/transactions" as const },
    { key: "dash.addExpense", icon: Minus, to: "/transactions" as const },
    { key: "dash.transfer", icon: ArrowLeftRight, to: "/transactions" as const },
    { key: "dash.newGoal", icon: Target, to: "/goals" as const },
  ];

  return (
    <AppLayout>
      <section className="panel gradient-brand mb-6 grid gap-6 border-transparent p-6 text-primary-foreground sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="min-w-0">
          <Badge className="mb-3 border-0 bg-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/20">
            {new Date().toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
              month: "long",
              year: "numeric",
            })}
          </Badge>
          <h1 className="text-2xl font-bold sm:text-3xl">{t("dash.welcome")}</h1>
          <p className="mt-2 max-w-xl text-sm text-primary-foreground/80">{t("dash.welcomeSub")}</p>
          <p className="mt-6 font-display text-4xl font-bold tabular-nums sm:text-5xl">
            {money(totals.totalBalance)}
          </p>
          <p className="text-xs text-primary-foreground/70">{t("dash.totalBalance")}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:w-[320px]">
          {quick.map((q) => (
            <Button
              key={q.key}
              asChild
              variant="ghost"
              className="h-auto flex-col items-start gap-2 rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 p-4 text-primary-foreground hover:bg-primary-foreground/20"
            >
              <Link to={q.to}>
                <q.icon className="size-4" />
                <span className="text-xs font-medium">{t(q.key)}</span>
              </Link>
            </Button>
          ))}
        </div>
      </section>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={t("dash.totalBalance")}
          value={money(totals.totalBalance)}
          delta={8.2}
          icon={<Wallet className="size-4" />}
        />
        <StatCard
          label={t("dash.income")}
          value={money(totals.income)}
          delta={12.4}
          icon={<TrendingUp className="size-4" />}
        />
        <StatCard
          label={t("dash.expenses")}
          value={money(totals.expenses)}
          delta={-4.1}
          icon={<TrendingDown className="size-4" />}
        />
        <StatCard
          label={t("dash.savings")}
          value={money(totals.savings)}
          delta={6.7}
          icon={<Banknote className="size-4" />}
        />
      </div>

      <SectionCard
        title={t("dash.accountsSplit")}
        subtitle={t("dash.accountsSplitSub")}
        className="mb-6"
        action={
          <Button asChild variant="ghost" size="sm">
            <Link to="/accounts">{t("common.viewAll")}</Link>
          </Button>
        }
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {groups.map((g) => (
            <BalanceGroup key={g.type} group={g} />
          ))}
        </div>
      </SectionCard>

      <SectionCard title={t("dash.stats")} subtitle={t("dash.statsSub")} className="mb-6">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: t("dash.savingsRate"),
              value: `${savingsRate}%`,
              icon: <PiggyBank className="size-4" />,
            },
            {
              label: t("dash.avgDaily"),
              value: money(avgDaily),
              icon: <Receipt className="size-4" />,
            },
            {
              label: t("dash.txCount"),
              value: String(transactions.length),
              icon: <ArrowLeftRight className="size-4" />,
            },
            {
              label: t("dash.topCategory"),
              value: topCategory
                ? lang === "ar"
                  ? topCategory.categoryAr
                  : topCategory.category
                : "—",
              icon: <Target className="size-4" />,
            },
          ].map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-3 rounded-xl border bg-surface-muted p-4"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-muted text-primary">
                {s.icon}
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs text-muted-foreground">{s.label}</p>
                <p className="truncate font-display text-lg font-bold tabular-nums">{s.value}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>



      <div className="grid gap-6 xl:grid-cols-3">
        <SectionCard
          title={t("dash.cashflow")}
          subtitle={t("dash.cashflowSub")}
          className="xl:col-span-2"
        >
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashflow} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="inc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-3)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--color-chart-3)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey={lang === "ar" ? "monthAr" : "month"}
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
                  contentStyle={{
                    borderRadius: 14,
                    border: "1px solid var(--color-border)",
                    background: "var(--color-surface)",
                    fontSize: 12,
                  }}
                  formatter={(v: number) => money(v)}
                />
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="var(--color-chart-2)"
                  strokeWidth={2.5}
                  fill="url(#inc)"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="var(--color-chart-3)"
                  strokeWidth={2.5}
                  fill="url(#exp)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title={t("dash.categories")}>
          <div className="h-[190px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categories}
                  dataKey="value"
                  innerRadius={54}
                  outerRadius={80}
                  paddingAngle={3}
                  stroke="none"
                >
                  {categories.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 14,
                    border: "1px solid var(--color-border)",
                    background: "var(--color-surface)",
                    fontSize: 12,
                  }}
                  formatter={(v: number) => money(v)}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-4 space-y-2">
            {categories.map((c, i) => (
              <li key={c.category} className="flex items-center gap-2 text-sm">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                />
                <span className="min-w-0 flex-1 truncate text-muted-foreground">
                  {lang === "ar" ? c.categoryAr : c.category}
                </span>
                <span className="tabular-nums font-medium">{money(c.value)}</span>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard
          title={t("dash.budgetProgress")}
          action={
            <Button asChild variant="ghost" size="sm">
              <Link to="/budgets">{t("common.viewAll")}</Link>
            </Button>
          }
        >
          <ul className="space-y-4">
            {budgets.slice(0, 4).map((b) => {
              const pct = Math.round((b.spent / b.limit) * 100);
              return (
                <li key={b.id}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="truncate font-medium">
                      {lang === "ar" ? b.categoryAr : b.category}
                    </span>
                    <span
                      className={cn(
                        "tabular-nums text-xs",
                        pct > 100 ? "text-destructive" : "text-muted-foreground",
                      )}
                    >
                      {money(b.spent)} / {money(b.limit)}
                    </span>
                  </div>
                  <ProgressBar value={pct} tone={pct > 100 ? "danger" : "brand"} />
                </li>
              );
            })}
          </ul>
        </SectionCard>

        <SectionCard
          title={t("dash.goals")}
          action={
            <Button asChild variant="ghost" size="sm">
              <Link to="/goals">{t("common.viewAll")}</Link>
            </Button>
          }
        >
          <ul className="space-y-4">
            {goals.map((g) => {
              const pct = Math.round((g.current / g.target) * 100);
              return (
                <li key={g.id}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="truncate font-medium">{lang === "ar" ? g.nameAr : g.name}</span>
                    <span className="text-xs tabular-nums text-muted-foreground">{pct}%</span>
                  </div>
                  <ProgressBar value={pct} />
                </li>
              );
            })}
          </ul>
        </SectionCard>

        <SectionCard title={t("dash.bills")}>
          <ul className="space-y-3">
            {upcomingBills.map((b) => (
              <li
                key={b.id}
                className="flex items-center gap-3 rounded-xl border p-3 transition-colors hover:bg-muted/50"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-muted text-primary">
                  <CalendarClock className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{lang === "ar" ? b.nameAr : b.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t("dash.due")} · {lang === "ar" ? b.dueAr : b.due}
                  </p>
                </div>
                <span className="text-sm font-semibold tabular-nums">{money(b.amount)}</span>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard
          title={t("dash.recent")}
          className="xl:col-span-2"
          action={
            <Button asChild variant="ghost" size="sm">
              <Link to="/transactions">{t("common.viewAll")}</Link>
            </Button>
          }
        >
          {loading ? (
            <ListSkeleton />
          ) : transactions.length === 0 ? (
            <EmptyState title={t("common.empty")} hint={t("common.emptyHint")} />
          ) : (
            <ul className="divide-y">
              {transactions.slice(0, 6).map((tx) => (
                <li key={tx.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
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
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {lang === "ar" ? tx.titleAr : tx.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {lang === "ar" ? tx.categoryAr : tx.category} · {tx.date}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "text-sm font-semibold tabular-nums",
                      tx.type === "income" ? "text-success" : "text-foreground",
                    )}
                  >
                    {tx.type === "income" ? "+" : tx.type === "expense" ? "−" : ""}
                    {money(tx.amount)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard
          title={t("dash.insights")}
          action={
            <Button asChild variant="ghost" size="sm">
              <Link to="/assistant">{t("nav.assistant")}</Link>
            </Button>
          }
        >
          <ul className="space-y-3">
            {aiInsights.map((ins) => (
              <li
                key={ins.id}
                className="rounded-xl border bg-surface-muted p-4 transition-shadow hover:shadow-[var(--shadow-soft)]"
              >
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <Sparkles
                    className={cn(
                      "size-4 shrink-0",
                      ins.tone === "warning"
                        ? "text-warning"
                        : ins.tone === "success"
                          ? "text-success"
                          : "text-primary",
                    )}
                  />
                  <span className="truncate">{lang === "ar" ? ins.titleAr : ins.title}</span>
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {lang === "ar" ? ins.bodyAr : ins.body}
                </p>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </AppLayout>
  );
}
