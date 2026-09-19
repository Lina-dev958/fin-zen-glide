import { Link, useRouterState } from "@tanstack/react-router";
import {
  BadgeCheck,
  Bell,
  Bot,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ChartNoAxesCombined,
  ChevronDown,
  CircleDollarSign,
  ClipboardCheck,
  FolderKanban,
  Landmark,
  LayoutDashboard,
  Menu,
  Moon,
  Plus,
  ReceiptText,
  Search,
  Settings,
  ShieldCheck,
  Sun,
  Tags,
  Users,
  WalletCards,
} from "lucide-react";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";

import companyLogo from "@/assets/smartspend-company-mark.png.asset.json";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export type CompanyRole =
  | "owner"
  | "finance"
  | "department"
  | "accountant"
  | "employee"
  | "auditor";

type CompanyContextValue = {
  role: CompanyRole;
  setRole: (role: CompanyRole) => void;
  canApprove: boolean;
  canConfigure: boolean;
};

const CompanyContext = createContext<CompanyContextValue | null>(null);

export function useCompanyWorkspace() {
  const value = useContext(CompanyContext);
  if (!value) throw new Error("useCompanyWorkspace must be used inside CompanyLayout");
  return value;
}

const copy = {
  en: {
    company: "Company Workspace",
    personal: "Personal Workspace",
    active: "Active",
    create: "Create company",
    switcher: "Switch workspace",
    search: "Search company workspace…",
    notifications: "Notifications",
    allNotifications: "View all notifications",
    overview: "Overview",
    finance: "Finance",
    expenses: "Expense management",
    organization: "Organization",
    planning: "Planning",
    advances: "Advances",
    reporting: "Reporting",
    team: "Team",
    more: "More",
    dashboard: "Dashboard",
    accounts: "Accounts",
    transactions: "Transactions",
    requests: "Expense Requests",
    approvals: "Approvals",
    departments: "Departments",
    projects: "Projects",
    centers: "Cost Centers",
    budgets: "Budgets",
    custody: "Advances & Custody",
    reports: "Reports",
    members: "Members",
    roles: "Roles & Permissions",
    calendar: "Financial Calendar",
    assistant: "AI Assistant",
    settings: "Settings",
    owner: "Company Owner",
    financeRole: "Financial Manager",
    departmentRole: "Department Manager",
    accountant: "Accountant",
    employee: "Employee",
    auditor: "Auditor",
    rolePreview: "Preview as role",
    createTitle: "Create a new company",
    createBody: "Company creation will be available in the next workspace setup step.",
    gotIt: "Got it",
    approvalNotice: "3 expense requests are waiting for your review.",
    budgetNotice: "Marketing budget has reached 90%.",
  },
  ar: {
    company: "مساحة الشركة",
    personal: "المساحة الشخصية",
    active: "نشطة",
    create: "إنشاء شركة",
    switcher: "تبديل مساحة العمل",
    search: "ابحث في مساحة الشركة…",
    notifications: "الإشعارات",
    allNotifications: "عرض كل الإشعارات",
    overview: "نظرة عامة",
    finance: "المالية",
    expenses: "إدارة المصروفات",
    organization: "المنظمة",
    planning: "التخطيط",
    advances: "العُهد والسلف",
    reporting: "التقارير",
    team: "الفريق",
    more: "المزيد",
    dashboard: "لوحة التحكم",
    accounts: "الحسابات",
    transactions: "العمليات المالية",
    requests: "طلبات المصروفات",
    approvals: "الموافقات",
    departments: "الأقسام",
    projects: "المشاريع",
    centers: "مراكز التكلفة",
    budgets: "الميزانيات",
    custody: "السلف والعُهد",
    reports: "التقارير",
    members: "الأعضاء",
    roles: "الأدوار والصلاحيات",
    calendar: "التقويم المالي",
    assistant: "المساعد الذكي",
    settings: "الإعدادات",
    owner: "مالك الشركة",
    financeRole: "المدير المالي",
    departmentRole: "مدير القسم",
    accountant: "المحاسب",
    employee: "الموظف",
    auditor: "المدقق",
    rolePreview: "معاينة بصلاحية",
    createTitle: "إنشاء شركة جديدة",
    createBody: "سيصبح إعداد الشركة متاحاً في خطوة تجهيز مساحة العمل القادمة.",
    gotIt: "حسناً",
    approvalNotice: "هناك 3 طلبات مصروفات بانتظار مراجعتك.",
    budgetNotice: "بلغت ميزانية التسويق 90٪.",
  },
} as const;

const roleKeys: { value: CompanyRole; key: keyof typeof copy.en }[] = [
  { value: "owner", key: "owner" },
  { value: "finance", key: "financeRole" },
  { value: "department", key: "departmentRole" },
  { value: "accountant", key: "accountant" },
  { value: "employee", key: "employee" },
  { value: "auditor", key: "auditor" },
];

const navigation = [
  { label: "overview", items: [{ slug: "", label: "dashboard", icon: LayoutDashboard }] },
  {
    label: "finance",
    items: [
      { slug: "accounts", label: "accounts", icon: Landmark },
      { slug: "transactions", label: "transactions", icon: CircleDollarSign },
    ],
  },
  {
    label: "expenses",
    items: [
      { slug: "expense-requests", label: "requests", icon: ReceiptText },
      { slug: "approvals", label: "approvals", icon: ClipboardCheck, permission: "approve" },
    ],
  },
  {
    label: "organization",
    items: [
      { slug: "departments", label: "departments", icon: Building2 },
      { slug: "projects", label: "projects", icon: FolderKanban },
      { slug: "cost-centers", label: "centers", icon: Tags },
    ],
  },
  { label: "planning", items: [{ slug: "budgets", label: "budgets", icon: ChartNoAxesCombined }] },
  { label: "advances", items: [{ slug: "advances", label: "custody", icon: WalletCards }] },
  { label: "reporting", items: [{ slug: "reports", label: "reports", icon: ChartNoAxesCombined }] },
  {
    label: "team",
    items: [
      { slug: "members", label: "members", icon: Users },
      { slug: "roles", label: "roles", icon: ShieldCheck, permission: "configure" },
    ],
  },
  {
    label: "more",
    items: [
      { slug: "calendar", label: "calendar", icon: CalendarDays },
      { slug: "notifications", label: "notifications", icon: Bell },
      { slug: "assistant", label: "assistant", icon: Bot },
      { slug: "settings", label: "settings", icon: Settings, permission: "configure" },
    ],
  },
] as const;

function WorkspaceSwitcher({ compact = false }: { compact?: boolean }) {
  const { lang } = useI18n();
  const c = copy[lang];
  const [createOpen, setCreateOpen] = useState(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className={cn("h-auto min-w-0 justify-start gap-2 p-2", !compact && "w-full")}>
            <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-lg bg-primary/10">
              <img src={companyLogo.url} alt="SmartSpend" className="size-8 object-contain" />
            </span>
            {!compact && (
              <span className="min-w-0 flex-1 text-start">
                <span className="block truncate text-sm font-bold">Acme Corp</span>
                <span className="block truncate text-[11px] text-muted-foreground">{c.company}</span>
              </span>
            )}
            <Badge className="shrink-0 border-0 bg-success/10 px-1.5 text-[10px] text-success hover:bg-success/10">
              <BadgeCheck className="me-1 size-3" /> {c.active}
            </Badge>
            <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-72 p-2">
          <DropdownMenuLabel className="text-xs text-muted-foreground">{c.switcher}</DropdownMenuLabel>
          <DropdownMenuItem asChild className="py-2.5">
            <Link to="/">
              <Avatar className="size-8"><AvatarFallback>LH</AvatarFallback></Avatar>
              <span className="min-w-0 flex-1"><span className="block font-medium">Layla Haddad</span><span className="text-xs text-muted-foreground">{c.personal}</span></span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="bg-primary/5 py-2.5 text-primary">
            <img src={companyLogo.url} alt="" className="size-8 object-contain" />
            <span className="min-w-0 flex-1"><span className="block font-medium">Acme Corp</span><span className="text-xs">{c.company}</span></span>
            <Badge className="bg-primary text-primary-foreground">{c.active}</Badge>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setCreateOpen(true)}>
            <Plus /> {c.create}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{c.createTitle}</DialogTitle>
            <DialogDescription>{c.createBody}</DialogDescription>
          </DialogHeader>
          <Button onClick={() => setCreateOpen(false)}>{c.gotIt}</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

function CompanyNav({ onNavigate }: { onNavigate?: () => void }) {
  const { lang } = useI18n();
  const { canApprove, canConfigure } = useCompanyWorkspace();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const c = copy[lang];
  return (
    <nav className="flex flex-1 flex-col gap-5 overflow-y-auto px-3 py-3 scrollbar-slim">
      {navigation.map((group) => (
        <div key={group.label} className="space-y-1">
          <p className="px-3 pb-1 text-[10px] font-semibold uppercase text-muted-foreground">{c[group.label]}</p>
          {group.items.map((item) => {
            const allowed = item.permission === "approve" ? canApprove : item.permission === "configure" ? canConfigure : true;
            const path = item.slug ? `/company/${item.slug}` : "/company";
            const active = pathname === path;
            const Icon = item.icon;
            if (!allowed) return (
              <div key={item.slug} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground opacity-45" title={lang === "ar" ? "غير متاح لهذا الدور" : "Unavailable for this role"}>
                <Icon className="size-4 shrink-0" /><span className="truncate">{c[item.label]}</span><ShieldCheck className="ms-auto size-3.5" />
              </div>
            );
            return item.slug ? (
              <Link key={item.slug} to="/company/$section" params={{ section: item.slug }} onClick={onNavigate} className={cn("focus-ringed flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors", active ? "bg-primary text-primary-foreground shadow-[var(--shadow-brand)]" : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground")}>
                <Icon className="size-4 shrink-0" /><span className="truncate">{c[item.label]}</span>
              </Link>
            ) : (
              <Link key="dashboard" to="/company" onClick={onNavigate} className={cn("focus-ringed flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors", active ? "bg-primary text-primary-foreground shadow-[var(--shadow-brand)]" : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground")}>
                <Icon className="size-4 shrink-0" /><span>{c.dashboard}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

function RoleSelector({ role, setRole, compact = false }: { role: CompanyRole; setRole: (role: CompanyRole) => void; compact?: boolean }) {
  const { lang } = useI18n();
  const c = copy[lang];
  const current = roleKeys.find((item) => item.value === role);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-10 gap-2 px-2">
          <Avatar className="size-8 border"><AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">LH</AvatarFallback></Avatar>
          {!compact && <span className="hidden min-w-0 text-start xl:block"><span className="block truncate text-xs font-semibold">Layla Haddad</span><span className="block truncate text-[10px] text-muted-foreground">{current ? c[current.key] : ""}</span></span>}
          <ChevronDown className="size-3.5 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>{c.rolePreview}</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={role} onValueChange={(value) => setRole(value as CompanyRole)}>
          {roleKeys.map((item) => <DropdownMenuRadioItem key={item.value} value={item.value}>{c[item.key]}</DropdownMenuRadioItem>)}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function CompanyTopbar({ role, setRole }: { role: CompanyRole; setRole: (role: CompanyRole) => void }) {
  const { lang, toggleLang } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const c = copy[lang];
  const [query, setQuery] = useState("");
  return (
    <header className="sticky top-0 z-30 border-b bg-surface/90 backdrop-blur-xl">
      <div className="grid h-16 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-3 sm:px-5">
        <Sheet>
          <SheetTrigger asChild><Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menu"><Menu /></Button></SheetTrigger>
          <SheetContent side={lang === "ar" ? "right" : "left"} className="flex w-80 flex-col p-0">
            <SheetTitle className="sr-only">{c.company}</SheetTitle>
            <div className="border-b p-3"><WorkspaceSwitcher /></div><CompanyNav />
          </SheetContent>
        </Sheet>
        <div className="hidden lg:block"><WorkspaceSwitcher compact /></div>
        <form className="relative mx-auto w-full max-w-xl" onSubmit={(event) => { event.preventDefault(); if (query.trim()) toast(`${c.search} ${query}`); }}>
          <Search className="pointer-events-none absolute inset-inline-start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={c.search} className="h-10 bg-surface-muted ps-10" />
        </form>
        <div className="flex shrink-0 items-center gap-0.5">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={theme === "dark" ? "Light mode" : "Dark mode"}>{theme === "dark" ? <Sun /> : <Moon />}</Button>
          <Button variant="ghost" size="sm" onClick={toggleLang} className="px-2 font-bold">{lang === "ar" ? "EN" : "AR"}</Button>
          <Popover>
            <PopoverTrigger asChild><Button variant="ghost" size="icon" className="relative" aria-label={c.notifications}><Bell /><span className="absolute end-1.5 top-1.5 size-2 rounded-full bg-destructive ring-2 ring-surface" /></Button></PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0">
              <div className="border-b px-4 py-3"><p className="font-semibold">{c.notifications}</p></div>
              <div className="space-y-1 p-2"><div className="rounded-lg bg-warning/10 p-3 text-sm"><p className="font-medium">{c.budgetNotice}</p><p className="mt-1 text-xs text-muted-foreground">12 min</p></div><div className="rounded-lg bg-primary/10 p-3 text-sm"><p className="font-medium">{c.approvalNotice}</p><p className="mt-1 text-xs text-muted-foreground">28 min</p></div></div>
              <Button asChild variant="ghost" className="w-full"><Link to="/company/$section" params={{ section: "notifications" }}>{c.allNotifications}</Link></Button>
            </PopoverContent>
          </Popover>
          <RoleSelector role={role} setRole={setRole} compact />
        </div>
      </div>
    </header>
  );
}

export function CompanyLayout({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<CompanyRole>("owner");
  const permissions = useMemo(() => ({ role, setRole, canApprove: ["owner", "finance", "department"].includes(role), canConfigure: ["owner", "finance"].includes(role) }), [role]);
  return (
    <CompanyContext.Provider value={permissions}>
      <div className="flex min-h-screen w-full bg-background">
        <aside className="sticky top-0 hidden h-screen w-[268px] shrink-0 flex-col border-e bg-sidebar lg:flex">
          <div className="border-b p-3"><WorkspaceSwitcher /></div>
          <CompanyNav />
          <div className="border-t p-3"><RoleSelector role={role} setRole={setRole} /></div>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col"><CompanyTopbar role={role} setRole={setRole} /><main className="mx-auto w-full max-w-[1500px] flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">{children}</main></div>
      </div>
    </CompanyContext.Provider>
  );
}

export { copy as companyLayoutCopy };