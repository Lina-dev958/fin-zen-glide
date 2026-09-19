import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BanknoteArrowDown,
  BellRing,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ChartNoAxesCombined,
  Check,
  CheckCircle2,
  CircleDollarSign,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  FolderKanban,
  Inbox,
  LoaderCircle,
  Plus,
  ReceiptText,
  RefreshCw,
  ShieldAlert,
  ShieldX,
  TrendingDown,
  TriangleAlert,
  UserPlus,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

import { useCompanyWorkspace } from "@/components/company-layout";
import { EmptyState, ListSkeleton, SectionCard } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/company/")({
  head: () => ({
    meta: [
      { title: "Company Dashboard — SmartSpend" },
      { name: "description", content: "A clear overview of company balances, spending, approvals, budgets, projects, advances and financial alerts." },
      { property: "og:title", content: "Company Dashboard — SmartSpend" },
      { property: "og:description", content: "Manage company finances, expense approvals, department budgets and projects in one workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CompanyDashboard,
});

const text = {
  en: {
    title: "Company Dashboard", subtitle: "A clear overview of your company's financial activity.", live: "Live overview", updated: "Updated just now",
    available: "Available Balance", spending: "Company Spending", pending: "Pending Approvals", budgets: "Active Budgets",
    currentMonth: "Current month", previous: "vs previous period", requests: "12 Requests", review: "Review Requests", active: "8 Active", attention: "2 Need Attention",
    cashflow: "Cash Flow", cashflowSub: "Income and expenses shown in one selected currency.", income: "Income", expenses: "Expenses", currency: "Chart currency",
    thisMonth: "This Month", lastMonth: "Last Month", threeMonths: "3 Months", sixMonths: "6 Months", custom: "Custom",
    expenseRequests: "Pending Expense Requests", viewAll: "View All Requests", employee: "Employee", requestTitle: "Request title", department: "Department", amount: "Amount", date: "Date", status: "Status", actions: "Actions", view: "View", reviewAction: "Review",
    approvals: "Needs Your Approval", approvalsSub: "Time-sensitive decisions across your teams.", approve: "Approve", reject: "Reject", purpose: "Purpose", project: "Project", priority: "Priority",
    dept: "Department Spending", deptSub: "Budget utilization by department", budget: "Budget", spent: "Spent", remaining: "Remaining", used: "used",
    projects: "Project Financial Overview", viewProjects: "View Projects", progress: "Progress",
    advances: "Advances & Custody", viewAdvances: "View All Advances", issueDate: "Issue Date", settlement: "Settlement Status",
    activity: "Recent Company Activity", activitySub: "Latest actions across Acme Corp", alerts: "Financial Alerts", alertsSub: "Items that need attention",
    quick: "Quick Actions", newRequest: "New Expense Request", addTransaction: "Add Transaction", createProject: "Create Project", inviteMember: "Invite Member",
    preview: "Preview dashboard state", normal: "Normal", loading: "Loading", error: "Error", empty: "Empty", noPermission: "No Permission", caughtUp: "No Pending Approvals",
    retry: "Try Again", errorTitle: "We couldn't load the company dashboard", errorBody: "Your data is safe. Try loading this view again.", noAccessTitle: "You don't have permission to view this area", noAccessBody: "Ask a company owner to update your role or permissions.",
    allCaught: "You're all caught up", allCaughtBody: "There are no expense requests waiting for your approval.", emptyTitle: "Your company workspace is ready", emptyBody: "Add a transaction or invite a member to start seeing financial activity here.",
    alertBudget: "Marketing budget reached 90%", alertBudgetBody: "Only ILS 4,800 remains in this month's marketing budget.", alertRequests: "3 expense requests require review", alertRequestsBody: "The oldest request has been waiting for 2 days.", alertAdvance: "Employee advance settlement overdue", alertAdvanceBody: "Omar Khalil's ILS 2,400 advance is 4 days overdue.", manageBudget: "Manage Budget", settleNow: "Review Advance",
    submitted: "Submitted", underReview: "Under Review", needsChanges: "Needs Changes", approved: "Approved", rejected: "Rejected", paid: "Paid", high: "High", medium: "Medium",
    projectActive: "On Track", projectRisk: "Needs Attention", settlementActive: "Active", settlementRequired: "Settlement Required", settlementReview: "Under Review", closed: "Closed",
    website: "Website Redesign", campaign: "Marketing Campaign", mobile: "Mobile App Development", marketing: "Marketing", operations: "Operations", it: "IT", sales: "Sales", hr: "HR",
    office: "Office equipment", travel: "Client visit travel", software: "Annual software license", event: "Campaign production", inventory: "Warehouse supplies",
    activity1: "Expense request approved", activity2: "Transaction imported", activity3: "Project budget updated", activity4: "New member invited", activity5: "Advance submitted for settlement",
    minAgo: "12 min ago", hourAgo: "1 hour ago", yesterday: "Yesterday", today: "Today", acme: "Acme Corp",
  },
  ar: {
    title: "لوحة تحكم الشركة", subtitle: "نظرة شاملة وواضحة على النشاط المالي لشركتك.", live: "نظرة مباشرة", updated: "تم التحديث الآن",
    available: "الرصيد المتاح", spending: "إنفاق الشركة", pending: "الموافقات المعلقة", budgets: "الميزانيات النشطة",
    currentMonth: "الشهر الحالي", previous: "مقارنة بالفترة السابقة", requests: "12 طلباً", review: "مراجعة الطلبات", active: "8 نشطة", attention: "2 تحتاج انتباهاً",
    cashflow: "التدفق النقدي", cashflowSub: "الدخل والمصروفات بعملة واحدة محددة.", income: "الدخل", expenses: "المصروفات", currency: "عملة الرسم",
    thisMonth: "هذا الشهر", lastMonth: "الشهر الماضي", threeMonths: "3 أشهر", sixMonths: "6 أشهر", custom: "مخصص",
    expenseRequests: "طلبات المصروفات المعلقة", viewAll: "عرض كل الطلبات", employee: "الموظف", requestTitle: "عنوان الطلب", department: "القسم", amount: "المبلغ", date: "التاريخ", status: "الحالة", actions: "الإجراءات", view: "عرض", reviewAction: "مراجعة",
    approvals: "تحتاج موافقتك", approvalsSub: "قرارات عاجلة تخص فرق شركتك.", approve: "موافقة", reject: "رفض", purpose: "الغرض", project: "المشروع", priority: "الأولوية",
    dept: "إنفاق الأقسام", deptSub: "استخدام الميزانية حسب كل قسم", budget: "الميزانية", spent: "المصروف", remaining: "المتبقي", used: "مستخدم",
    projects: "نظرة مالية على المشاريع", viewProjects: "عرض المشاريع", progress: "التقدم",
    advances: "السلف والعُهد", viewAdvances: "عرض كل السلف", issueDate: "تاريخ الإصدار", settlement: "حالة التسوية",
    activity: "أحدث نشاطات الشركة", activitySub: "آخر الإجراءات في شركة Acme", alerts: "التنبيهات المالية", alertsSub: "بنود تحتاج إلى انتباه",
    quick: "إجراءات سريعة", newRequest: "طلب مصروف جديد", addTransaction: "إضافة عملية", createProject: "إنشاء مشروع", inviteMember: "دعوة عضو",
    preview: "معاينة حالة اللوحة", normal: "طبيعي", loading: "تحميل", error: "خطأ", empty: "فارغ", noPermission: "لا توجد صلاحية", caughtUp: "لا موافقات معلقة",
    retry: "المحاولة مجدداً", errorTitle: "تعذر تحميل لوحة تحكم الشركة", errorBody: "بياناتك آمنة. حاول تحميل هذه الواجهة مجدداً.", noAccessTitle: "ليس لديك صلاحية لعرض هذه المنطقة", noAccessBody: "اطلب من مالك الشركة تعديل دورك أو صلاحياتك.",
    allCaught: "أنجزت كل شيء", allCaughtBody: "لا توجد طلبات مصروفات تنتظر موافقتك.", emptyTitle: "مساحة شركتك جاهزة", emptyBody: "أضف عملية أو ادعُ عضواً لبدء عرض النشاط المالي هنا.",
    alertBudget: "بلغت ميزانية التسويق 90٪", alertBudgetBody: "تبقى 4,800 ILS فقط من ميزانية التسويق لهذا الشهر.", alertRequests: "3 طلبات مصروفات تحتاج مراجعة", alertRequestsBody: "أقدم طلب ينتظر منذ يومين.", alertAdvance: "تسوية سلفة موظف متأخرة", alertAdvanceBody: "سلفة عمر خليل بقيمة 2,400 ILS متأخرة 4 أيام.", manageBudget: "إدارة الميزانية", settleNow: "مراجعة السلفة",
    submitted: "مُقدّم", underReview: "قيد المراجعة", needsChanges: "يحتاج تعديلاً", approved: "موافق عليه", rejected: "مرفوض", paid: "مدفوع", high: "عالية", medium: "متوسطة",
    projectActive: "على المسار", projectRisk: "يحتاج انتباهاً", settlementActive: "نشطة", settlementRequired: "التسوية مطلوبة", settlementReview: "قيد المراجعة", closed: "مغلقة",
    website: "إعادة تصميم الموقع", campaign: "الحملة التسويقية", mobile: "تطوير تطبيق الجوال", marketing: "التسويق", operations: "العمليات", it: "تقنية المعلومات", sales: "المبيعات", hr: "الموارد البشرية",
    office: "معدات مكتبية", travel: "سفر لزيارة عميل", software: "ترخيص برمجيات سنوي", event: "إنتاج الحملة", inventory: "لوازم المستودع",
    activity1: "تمت الموافقة على طلب مصروف", activity2: "تم استيراد عملية مالية", activity3: "تم تحديث ميزانية مشروع", activity4: "تمت دعوة عضو جديد", activity5: "تم تقديم سلفة للتسوية",
    minAgo: "منذ 12 دقيقة", hourAgo: "منذ ساعة", yesterday: "أمس", today: "اليوم", acme: "شركة Acme",
  },
} as const;

type Copy = Record<keyof typeof text.en, string>;
type StateMode = "normal" | "loading" | "error" | "empty" | "permission" | "caught";

const cashFlow = [
  { period: "Apr", periodAr: "أبريل", income: 54000, expenses: 39500 },
  { period: "May", periodAr: "مايو", income: 61000, expenses: 44200 },
  { period: "Jun", periodAr: "يونيو", income: 57000, expenses: 41800 },
  { period: "Jul", periodAr: "يوليو", income: 72000, expenses: 52600 },
  { period: "Aug", periodAr: "أغسطس", income: 68000, expenses: 49100 },
  { period: "Sep", periodAr: "سبتمبر", income: 79400, expenses: 58420 },
];

const requestRows = [
  { initials: "SA", name: "Sara Ahmed", nameAr: "سارة أحمد", title: "travel", dept: "sales", amount: 1250, currency: "USD", date: "18 Sep", status: "underReview" },
  { initials: "OK", name: "Omar Khalil", nameAr: "عمر خليل", title: "office", dept: "operations", amount: 3400, currency: "ILS", date: "18 Sep", status: "submitted" },
  { initials: "MN", name: "Maya Nasser", nameAr: "مايا ناصر", title: "software", dept: "it", amount: 2800, currency: "USD", date: "17 Sep", status: "needsChanges" },
  { initials: "YA", name: "Yousef Ali", nameAr: "يوسف علي", title: "event", dept: "marketing", amount: 6200, currency: "ILS", date: "16 Sep", status: "approved" },
] as const;

const approvalRows = [
  { initials: "SA", name: "Sara Ahmed", nameAr: "سارة أحمد", purpose: "travel", dept: "sales", project: "Website Redesign", projectAr: "إعادة تصميم الموقع", amount: 1250, currency: "USD", priority: "high", date: "18 Sep" },
  { initials: "OK", name: "Omar Khalil", nameAr: "عمر خليل", purpose: "office", dept: "operations", project: "Operations", projectAr: "العمليات", amount: 3400, currency: "ILS", priority: "medium", date: "18 Sep" },
  { initials: "LN", name: "Lina Nasser", nameAr: "لينا ناصر", purpose: "inventory", dept: "operations", project: "Mobile App", projectAr: "تطبيق الجوال", amount: 1850, currency: "ILS", priority: "high", date: "17 Sep" },
] as const;

const departments = [
  { key: "marketing", icon: ChartNoAxesCombined, budget: 48000, spent: 43200, currency: "ILS" },
  { key: "operations", icon: BriefcaseBusiness, budget: 62000, spent: 38500, currency: "ILS" },
  { key: "it", icon: Building2, budget: 24000, spent: 17100, currency: "USD" },
  { key: "sales", icon: TrendingDown, budget: 36000, spent: 21600, currency: "ILS" },
  { key: "hr", icon: Users, budget: 14000, spent: 6300, currency: "ILS" },
] as const;

const projects = [
  { key: "website", budget: 32000, spent: 22400, currency: "ILS", status: "projectActive" },
  { key: "campaign", budget: 48000, spent: 43200, currency: "ILS", status: "projectRisk" },
  { key: "mobile", budget: 28000, spent: 15400, currency: "USD", status: "projectActive" },
] as const;

const advances = [
  { name: "Omar Khalil", nameAr: "عمر خليل", amount: 2400, currency: "ILS", date: "04 Sep", status: "settlementRequired" },
  { name: "Maya Nasser", nameAr: "مايا ناصر", amount: 950, currency: "USD", date: "08 Sep", status: "settlementReview" },
  { name: "Sara Ahmed", nameAr: "سارة أحمد", amount: 1800, currency: "ILS", date: "12 Sep", status: "settlementActive" },
] as const;

function formatMoney(amount: number, currency: string, lang: "en" | "ar") {
  return `${new Intl.NumberFormat(lang === "ar" ? "ar-EG" : "en-US", { maximumFractionDigits: 0 }).format(amount)} ${currency}`;
}

function StatusBadge({ label, tone = "neutral", icon }: { label: string; tone?: "success" | "warning" | "danger" | "info" | "neutral"; icon?: ReactNode }) {
  const Icon = icon ?? (tone === "success" ? <CheckCircle2 /> : tone === "danger" ? <AlertCircle /> : tone === "warning" ? <Clock3 /> : <BadgeCheck />);
  return <Badge variant="outline" className={cn("gap-1 whitespace-nowrap border-0", tone === "success" && "bg-success/10 text-success", tone === "warning" && "bg-warning/10 text-warning", tone === "danger" && "bg-destructive/10 text-destructive", tone === "info" && "bg-primary/10 text-primary", tone === "neutral" && "bg-muted text-muted-foreground", "[&_svg]:size-3")}>{Icon}{label}</Badge>;
}

function DashboardHeader({ c, state, setState }: { c: Copy; state: StateMode; setState: (state: StateMode) => void }) {
  return <header className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
    <div className="min-w-0"><div className="mb-2 flex flex-wrap items-center gap-2"><Badge className="gap-1 border-0 bg-success/10 text-success hover:bg-success/10"><span className="size-1.5 rounded-full bg-success" />{c.live}</Badge><span className="text-xs text-muted-foreground">{c.updated}</span></div><h1 className="text-2xl font-bold sm:text-3xl">{c.title}</h1><p className="mt-1 text-sm text-muted-foreground">{c.subtitle}</p></div>
    <div className="hidden w-52 sm:block"><p className="mb-1 text-[11px] font-medium text-muted-foreground">{c.preview}</p><Select value={state} onValueChange={(value) => setState(value as StateMode)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="normal">{c.normal}</SelectItem><SelectItem value="loading">{c.loading}</SelectItem><SelectItem value="error">{c.error}</SelectItem><SelectItem value="empty">{c.empty}</SelectItem><SelectItem value="permission">{c.noPermission}</SelectItem><SelectItem value="caught">{c.caughtUp}</SelectItem></SelectContent></Select></div>
  </header>;
}

function KpiCards({ c, lang }: { c: Copy; lang: "en" | "ar" }) {
  const cards = [
    { title: c.available, icon: WalletCards, content: <div className="mt-4 space-y-2"><div className="flex items-baseline justify-between gap-2"><span className="font-display text-2xl font-bold tabular-nums">128,450 ILS</span><Badge variant="outline">ILS</Badge></div><div className="flex items-baseline justify-between gap-2 border-t pt-2"><span className="font-display text-xl font-bold tabular-nums">18,200 USD</span><Badge variant="outline">USD</Badge></div></div>, footer: <span className="inline-flex items-center gap-1 text-success"><ArrowUpRight className="size-3.5" />6.8% {c.previous}</span> },
    { title: c.spending, icon: BanknoteArrowDown, value: formatMoney(58420, "ILS", lang), detail: c.currentMonth, footer: <span className="inline-flex items-center gap-1 text-destructive"><ArrowUpRight className="size-3.5" />8.4% {c.previous}</span> },
    { title: c.pending, icon: ClipboardCheck, value: c.requests, detail: c.currentMonth, action: <Button asChild size="sm" className="mt-3 w-full"><Link to="/company/$section" params={{ section: "approvals" }}>{c.review}<ArrowRight /></Link></Button> },
    { title: c.budgets, icon: ChartNoAxesCombined, value: c.active, detail: c.attention, footer: <span className="inline-flex items-center gap-1 text-warning"><TriangleAlert className="size-3.5" />{c.attention}</span> },
  ];
  return <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map((card) => <section key={card.title} className="panel min-w-0 p-5 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"><div className="flex items-start justify-between gap-3"><p className="text-xs font-semibold uppercase text-muted-foreground">{card.title}</p><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><card.icon className="size-5" /></span></div>{card.content ?? <><p className="mt-4 font-display text-2xl font-bold tabular-nums">{card.value}</p><p className="mt-1 text-xs text-muted-foreground">{card.detail}</p></>}{card.action}{card.footer && <div className="mt-3 text-xs font-medium">{card.footer}</div>}</section>)}</div>;
}

function CashFlow({ c, lang }: { c: Copy; lang: "en" | "ar" }) {
  const [timeframe, setTimeframe] = useState("6");
  const [currency, setCurrency] = useState("ILS");
  const multiplier = currency === "USD" ? 0.27 : 1;
  const chartData = useMemo(() => cashFlow.map((row) => ({ ...row, income: Math.round(row.income * multiplier), expenses: Math.round(row.expenses * multiplier) })), [multiplier]);
  return <SectionCard title={c.cashflow} subtitle={c.cashflowSub} className="mb-6" action={<div className="hidden items-center gap-2 md:flex"><Select value={timeframe} onValueChange={setTimeframe}><SelectTrigger className="w-36"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="1">{c.thisMonth}</SelectItem><SelectItem value="last">{c.lastMonth}</SelectItem><SelectItem value="3">{c.threeMonths}</SelectItem><SelectItem value="6">{c.sixMonths}</SelectItem><SelectItem value="custom">{c.custom}</SelectItem></SelectContent></Select><Select value={currency} onValueChange={setCurrency}><SelectTrigger className="w-24" aria-label={c.currency}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ILS">ILS</SelectItem><SelectItem value="USD">USD</SelectItem></SelectContent></Select></div>}>
    <div className="mb-4 grid grid-cols-2 gap-2 md:hidden"><Select value={timeframe} onValueChange={setTimeframe}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="1">{c.thisMonth}</SelectItem><SelectItem value="last">{c.lastMonth}</SelectItem><SelectItem value="3">{c.threeMonths}</SelectItem><SelectItem value="6">{c.sixMonths}</SelectItem><SelectItem value="custom">{c.custom}</SelectItem></SelectContent></Select><Select value={currency} onValueChange={setCurrency}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ILS">ILS</SelectItem><SelectItem value="USD">USD</SelectItem></SelectContent></Select></div>
    <div className="mb-3 flex flex-wrap gap-4 text-xs"><span className="inline-flex items-center gap-2"><span className="size-2 rounded-full bg-success" />{c.income}</span><span className="inline-flex items-center gap-2"><span className="size-2 rounded-full bg-primary" />{c.expenses}</span><Badge variant="outline">{currency} · {c.currency}</Badge></div>
    <div className="h-[300px] w-full"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}><defs><linearGradient id="companyIncome" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--color-success)" stopOpacity={0.32} /><stop offset="100%" stopColor="var(--color-success)" stopOpacity={0} /></linearGradient><linearGradient id="companyExpenses" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.28} /><stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} /></linearGradient></defs><CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="4 4" /><XAxis dataKey={lang === "ar" ? "periodAr" : "period"} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} /><YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} tickFormatter={(value) => `${value / 1000}k`} /><Tooltip contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 10 }} formatter={(value: number) => formatMoney(value, currency, lang)} /><Area type="monotone" dataKey="income" name={c.income} stroke="var(--color-success)" fill="url(#companyIncome)" strokeWidth={2.5} /><Area type="monotone" dataKey="expenses" name={c.expenses} stroke="var(--color-primary)" fill="url(#companyExpenses)" strokeWidth={2.5} /></AreaChart></ResponsiveContainer></div>
  </SectionCard>;
}

function RequestTable({ c, lang }: { c: Copy; lang: "en" | "ar" }) {
  return <SectionCard title={c.expenseRequests} className="xl:col-span-2" padded={false} action={<Button asChild variant="ghost" size="sm"><Link to="/company/$section" params={{ section: "expense-requests" }}>{c.viewAll}<ArrowRight /></Link></Button>}><Table><TableHeader><TableRow><TableHead>{c.employee}</TableHead><TableHead>{c.requestTitle}</TableHead><TableHead>{c.department}</TableHead><TableHead>{c.amount}</TableHead><TableHead>{c.date}</TableHead><TableHead>{c.status}</TableHead><TableHead className="text-end">{c.actions}</TableHead></TableRow></TableHeader><TableBody>{requestRows.map((row) => <TableRow key={row.name}><TableCell><div className="flex min-w-36 items-center gap-2"><span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">{row.initials}</span><span className="truncate font-medium">{lang === "ar" ? row.nameAr : row.name}</span></div></TableCell><TableCell className="min-w-36">{c[row.title]}</TableCell><TableCell>{c[row.dept]}</TableCell><TableCell className="font-semibold tabular-nums">{formatMoney(row.amount, row.currency, lang)}</TableCell><TableCell className="whitespace-nowrap text-muted-foreground">{row.date}</TableCell><TableCell><StatusBadge label={c[row.status]} tone={row.status === "approved" ? "success" : row.status === "needsChanges" ? "warning" : "info"} /></TableCell><TableCell><div className="flex justify-end gap-1"><Button variant="ghost" size="sm" onClick={() => toast.info(`${c.view}: ${c[row.title]}`)}>{c.view}</Button><Button variant="outline" size="sm" onClick={() => toast.info(`${c.reviewAction}: ${c[row.title]}`)}>{c.reviewAction}</Button></div></TableCell></TableRow>)}</TableBody></Table></SectionCard>;
}

function ApprovalQueue({ c, lang, canApprove, caught }: { c: Copy; lang: "en" | "ar"; canApprove: boolean; caught: boolean }) {
  if (!canApprove) return <SectionCard title={c.approvals} subtitle={c.approvalsSub}><EmptyState title={c.noAccessTitle} hint={c.noAccessBody} action={<ShieldX className="size-5 text-muted-foreground" />} /></SectionCard>;
  if (caught) return <SectionCard title={c.approvals} subtitle={c.approvalsSub}><EmptyState title={c.allCaught} hint={c.allCaughtBody} action={<CheckCircle2 className="size-5 text-success" />} /></SectionCard>;
  return <SectionCard title={c.approvals} subtitle={c.approvalsSub} className="border-primary/20"><div className="space-y-3">{approvalRows.map((row) => <article key={row.name} className="rounded-xl border bg-surface-muted p-4"><div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"><div className="flex min-w-0 gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-xs font-bold text-primary">{row.initials}</span><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><p className="font-semibold">{lang === "ar" ? row.nameAr : row.name}</p><StatusBadge label={c[row.priority]} tone={row.priority === "high" ? "danger" : "warning"} icon={<TriangleAlert />} /></div><p className="mt-1 text-sm">{c[row.purpose]}</p><p className="mt-1 text-xs text-muted-foreground">{c[row.dept]} · {lang === "ar" ? row.projectAr : row.project} · {row.date}</p></div></div><div className="flex flex-wrap items-center gap-2 md:justify-end"><span className="me-2 font-display text-lg font-bold tabular-nums">{formatMoney(row.amount, row.currency, lang)}</span><Button size="sm" variant="outline" onClick={() => toast.info(c.reviewAction)}>{c.reviewAction}</Button><Button size="sm" className="bg-success text-success-foreground hover:bg-success/90" onClick={() => toast.success(c.approved)}><Check />{c.approve}</Button><Button size="icon" variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => toast.error(c.rejected)} aria-label={c.reject}><X /></Button></div></div></article>)}</div></SectionCard>;
}

function DepartmentSpending({ c, lang }: { c: Copy; lang: "en" | "ar" }) {
  return <SectionCard title={c.dept} subtitle={c.deptSub}><div className="space-y-4">{departments.map((dept) => { const pct = Math.round((dept.spent / dept.budget) * 100); return <div key={dept.key} className="grid gap-3 rounded-xl border p-4 sm:grid-cols-[minmax(160px,.8fr)_1.4fr] sm:items-center"><div className="flex items-center gap-3"><span className={cn("grid size-9 shrink-0 place-items-center rounded-lg", pct >= 85 ? "bg-warning/10 text-warning" : "bg-primary/10 text-primary")}><dept.icon className="size-4" /></span><div className="min-w-0"><p className="font-semibold">{c[dept.key]}</p><p className="text-xs text-muted-foreground">{formatMoney(dept.spent, dept.currency, lang)} / {formatMoney(dept.budget, dept.currency, lang)}</p></div></div><div><div className="mb-1.5 flex items-center justify-between gap-3 text-xs"><span className="inline-flex items-center gap-1 font-medium">{pct >= 85 ? <TriangleAlert className="size-3.5 text-warning" /> : <CheckCircle2 className="size-3.5 text-success" />}{pct}% {c.used}</span><span className="text-muted-foreground">{c.remaining}: {formatMoney(dept.budget - dept.spent, dept.currency, lang)}</span></div><Progress value={pct} className={cn(pct >= 85 && "[&>div]:bg-warning")} /></div></div>; })}</div></SectionCard>;
}

function ProjectOverview({ c, lang }: { c: Copy; lang: "en" | "ar" }) {
  return <SectionCard title={c.projects} action={<Button asChild variant="ghost" size="sm"><Link to="/company/$section" params={{ section: "projects" }}>{c.viewProjects}<ArrowRight /></Link></Button>}><div className="grid gap-3 md:grid-cols-3">{projects.map((project) => { const pct = Math.round((project.spent / project.budget) * 100); return <article key={project.key} className="rounded-xl border p-4"><div className="flex items-start justify-between gap-2"><span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary"><FolderKanban className="size-4" /></span><StatusBadge label={c[project.status]} tone={project.status === "projectRisk" ? "warning" : "success"} /></div><h3 className="mt-4 text-sm font-semibold">{c[project.key]}</h3><div className="mt-3 grid grid-cols-2 gap-2 text-xs"><div><p className="text-muted-foreground">{c.budget}</p><p className="mt-1 font-semibold tabular-nums">{formatMoney(project.budget, project.currency, lang)}</p></div><div><p className="text-muted-foreground">{c.remaining}</p><p className="mt-1 font-semibold tabular-nums">{formatMoney(project.budget - project.spent, project.currency, lang)}</p></div></div><div className="mt-4"><div className="mb-1 flex justify-between text-xs"><span>{c.progress}</span><span>{pct}%</span></div><Progress value={pct} className={cn(project.status === "projectRisk" && "[&>div]:bg-warning")} /></div></article>; })}</div></SectionCard>;
}

function Advances({ c, lang }: { c: Copy; lang: "en" | "ar" }) {
  return <SectionCard title={c.advances} padded={false} action={<Button asChild variant="ghost" size="sm"><Link to="/company/$section" params={{ section: "advances" }}>{c.viewAdvances}<ArrowRight /></Link></Button>}><Table><TableHeader><TableRow><TableHead>{c.employee}</TableHead><TableHead>{c.amount}</TableHead><TableHead>{c.issueDate}</TableHead><TableHead>{c.settlement}</TableHead></TableRow></TableHeader><TableBody>{advances.map((row) => <TableRow key={row.name}><TableCell className="font-medium">{lang === "ar" ? row.nameAr : row.name}</TableCell><TableCell className="font-semibold tabular-nums">{formatMoney(row.amount, row.currency, lang)}</TableCell><TableCell>{row.date}</TableCell><TableCell><StatusBadge label={c[row.status]} tone={row.status === "settlementRequired" ? "danger" : "info"} /></TableCell></TableRow>)}</TableBody></Table></SectionCard>;
}

function ActivityFeed({ c }: { c: Copy }) {
  const items = [
    { key: "activity1", person: "Layla Haddad", time: c.minAgo, entity: "ER-1042", icon: CheckCircle2, tone: "text-success bg-success/10" },
    { key: "activity2", person: "Omar Khalil", time: c.hourAgo, entity: "TR-8821", icon: CircleDollarSign, tone: "text-primary bg-primary/10" },
    { key: "activity3", person: "Maya Nasser", time: c.today, entity: c.website, icon: FolderKanban, tone: "text-warning bg-warning/10" },
    { key: "activity4", person: "Layla Haddad", time: c.yesterday, entity: "Nour Saleh", icon: UserPlus, tone: "text-repair bg-repair/10" },
    { key: "activity5", person: "Sara Ahmed", time: c.yesterday, entity: "ADV-203", icon: FileCheck2, tone: "text-primary bg-primary/10" },
  ] as const;
  return <SectionCard title={c.activity} subtitle={c.activitySub}><ol className="space-y-4">{items.map((item, index) => <li key={item.key} className="relative flex gap-3"><span className={cn("grid size-9 shrink-0 place-items-center rounded-lg", item.tone)}><item.icon className="size-4" /></span>{index < items.length - 1 && <span className="absolute start-[18px] top-10 h-5 border-s" />}<div className="min-w-0 flex-1"><p className="text-sm font-medium">{c[item.key]}</p><p className="mt-0.5 truncate text-xs text-muted-foreground">{item.person} · <button className="text-primary hover:underline">{item.entity}</button></p></div><time className="shrink-0 text-[11px] text-muted-foreground">{item.time}</time></li>)}</ol></SectionCard>;
}

function FinancialAlerts({ c }: { c: Copy }) {
  const alerts = [
    { title: c.alertBudget, body: c.alertBudgetBody, action: c.manageBudget, section: "budgets", icon: ChartNoAxesCombined, tone: "border-warning/30 bg-warning/5 text-warning" },
    { title: c.alertRequests, body: c.alertRequestsBody, action: c.review, section: "approvals", icon: ClipboardCheck, tone: "border-primary/30 bg-primary/5 text-primary" },
    { title: c.alertAdvance, body: c.alertAdvanceBody, action: c.settleNow, section: "advances", icon: ShieldAlert, tone: "border-destructive/30 bg-destructive/5 text-destructive" },
  ];
  return <SectionCard title={c.alerts} subtitle={c.alertsSub}><div className="space-y-3">{alerts.map((alert) => <article key={alert.title} className={cn("rounded-xl border p-4", alert.tone)}><div className="flex gap-3"><alert.icon className="mt-0.5 size-5 shrink-0" /><div className="min-w-0 flex-1"><p className="text-sm font-semibold text-foreground">{alert.title}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{alert.body}</p><Button asChild variant="outline" size="sm" className="mt-3 bg-surface"><Link to="/company/$section" params={{ section: alert.section }}>{alert.action}<ArrowRight /></Link></Button></div></div></article>)}</div></SectionCard>;
}

function QuickActions({ c }: { c: Copy }) {
  const actions = [
    { label: c.newRequest, section: "expense-requests", icon: ReceiptText },
    { label: c.addTransaction, section: "transactions", icon: Plus },
    { label: c.createProject, section: "projects", icon: FolderKanban },
    { label: c.inviteMember, section: "members", icon: UserPlus },
  ];
  return <section className="panel mb-6 flex flex-col gap-3 p-4 lg:flex-row lg:items-center"><div className="flex shrink-0 items-center gap-2"><span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary"><Plus className="size-4" /></span><h2 className="text-sm font-semibold">{c.quick}</h2></div><div className="grid flex-1 grid-cols-2 gap-2 lg:grid-cols-4">{actions.map((action, index) => <Button key={action.label} asChild variant={index === 0 ? "default" : "outline"} className="h-auto min-h-10 whitespace-normal py-2 text-xs"><Link to="/company/$section" params={{ section: action.section }}><action.icon />{action.label}</Link></Button>)}</div></section>;
}

function StateView({ c, state, setState }: { c: Copy; state: StateMode; setState: (state: StateMode) => void }) {
  if (state === "loading") return <><div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground"><LoaderCircle className="size-4 animate-spin" />{c.loading}</div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <div key={index} className="panel p-5"><ListSkeleton rows={2} /></div>)}</div><div className="panel mt-6 p-6"><ListSkeleton rows={7} /></div></>;
  if (state === "error") return <div className="panel p-6"><EmptyState title={c.errorTitle} hint={c.errorBody} action={<Button onClick={() => setState("normal")}><RefreshCw />{c.retry}</Button>} /></div>;
  if (state === "permission") return <div className="panel p-6"><EmptyState title={c.noAccessTitle} hint={c.noAccessBody} action={<ShieldX className="size-6 text-destructive" />} /></div>;
  if (state === "empty") return <div className="panel p-6"><EmptyState title={c.emptyTitle} hint={c.emptyBody} action={<Button asChild><Link to="/company/$section" params={{ section: "transactions" }}><Plus />{c.addTransaction}</Link></Button>} /></div>;
  return null;
}

function CompanyDashboard() {
  const { lang } = useI18n();
  const { canApprove } = useCompanyWorkspace();
  const c = text[lang];
  const [state, setState] = useState<StateMode>("normal");
  const exceptional = state === "loading" || state === "error" || state === "empty" || state === "permission";
  return <>
    <DashboardHeader c={c} state={state} setState={setState} />
    <div className="mb-5 sm:hidden"><Select value={state} onValueChange={(value) => setState(value as StateMode)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="normal">{c.normal}</SelectItem><SelectItem value="loading">{c.loading}</SelectItem><SelectItem value="error">{c.error}</SelectItem><SelectItem value="empty">{c.empty}</SelectItem><SelectItem value="permission">{c.noPermission}</SelectItem><SelectItem value="caught">{c.caughtUp}</SelectItem></SelectContent></Select></div>
    {exceptional ? <StateView c={c} state={state} setState={setState} /> : <><QuickActions c={c} /><KpiCards c={c} lang={lang} /><CashFlow c={c} lang={lang} /><div className="mb-6 grid gap-6 xl:grid-cols-3"><RequestTable c={c} lang={lang} /><FinancialAlerts c={c} /></div><div className="mb-6"><ApprovalQueue c={c} lang={lang} canApprove={canApprove} caught={state === "caught"} /></div><div className="mb-6 grid gap-6 xl:grid-cols-2"><DepartmentSpending c={c} lang={lang} /><ActivityFeed c={c} /></div><div className="mb-6"><ProjectOverview c={c} lang={lang} /></div><Advances c={c} lang={lang} /></>}
  </>;
}