import { Link, useRouterState } from "@tanstack/react-router";
import {
  BadgeDollarSign,
  Bell,
  Building2,
  ChartPie,
  CreditCard,
  FileUp,
  Repeat,

  Globe,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  PiggyBank,
  Search,
  Settings,
  Sparkles,
  Sun,
  Target,
  Wallet,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";

import logo from "@/assets/smartspend-mark.png.asset.json";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const groups = [
  {
    label: "nav.main",
    items: [
      { to: "/", key: "nav.dashboard", icon: LayoutDashboard },
      { to: "/accounts", key: "nav.accounts", icon: Wallet },
      { to: "/transactions", key: "nav.transactions", icon: BadgeDollarSign },
      { to: "/recurring", key: "nav.recurring", icon: Repeat },
      { to: "/import", key: "nav.import", icon: FileUp },

    ],
  },
  {
    label: "nav.manage",
    items: [
      { to: "/budgets", key: "nav.budgets", icon: ChartPie },
      { to: "/goals", key: "nav.goals", icon: Target },
      { to: "/reports", key: "nav.reports", icon: Building2 },
    ],
  },
  {
    label: "nav.more",
    items: [
      { to: "/assistant", key: "nav.assistant", icon: Sparkles },
      { to: "/notifications", key: "nav.notifications", icon: Bell },
      { to: "/settings", key: "nav.settings", icon: Settings },
    ],
  },
] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="flex flex-1 flex-col gap-6 overflow-y-auto scrollbar-slim px-3 py-4">
      {groups.map((group) => (
        <div key={group.label} className="space-y-1">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {t(group.label)}
          </p>
          {group.items.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onNavigate}
                className={cn(
                  "focus-ringed group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  active
                    ? "gradient-brand text-primary-foreground shadow-[var(--shadow-brand)]"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <item.icon
                  className={cn(
                    "size-[18px] shrink-0 transition-transform duration-200 group-hover:scale-110",
                  )}
                />
                <span className="truncate">{t(item.key)}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

function Brand() {
  const { t } = useI18n();
  return (
    <Link to="/" className="focus-ringed flex items-center gap-3 rounded-xl px-3 py-4">
      <img src={logo.url} alt="Smart Spend" className="size-10 rounded-xl object-contain" />
      <span className="min-w-0">
        <span className="block truncate font-display text-base font-bold leading-tight">
          {t("app.name")}
        </span>
        <span className="block truncate text-[11px] text-muted-foreground">{t("app.tagline")}</span>
      </span>
    </Link>
  );
}

function LogoutButton({ full = true }: { full?: boolean }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        variant="ghost"
        className={cn(
          "justify-start gap-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
          full && "w-full",
        )}
        onClick={() => setOpen(true)}
      >
        <LogOut className="size-[18px]" />
        {t("nav.logout")}
      </Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("nav.logout")}</AlertDialogTitle>
            <AlertDialogDescription>{t("set.logoutBody")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={() => toast.success(t("nav.logout"))}>
              {t("nav.logout")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function Topbar() {
  const { t, lang, toggleLang } = useI18n();
  const { theme, toggleTheme } = useTheme();

  const { notifications, markAllRead } = useStore();
  const unread = notifications.filter((n) => !n.read).length;
  const [query, setQuery] = useState("");

  return (
    <header className="sticky top-0 z-30 border-b bg-sidebar/85 backdrop-blur-xl backdrop-saturate-150">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side={lang === "ar" ? "right" : "left"} className="w-72 p-0">
            <SheetTitle className="sr-only">{t("app.name")}</SheetTitle>
            <div className="flex h-full flex-col">
              <Brand />
              <NavList />
              <div className="border-t p-3">
                <LogoutButton />
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <form
          className="relative min-w-0 flex-1 max-w-xl"
          onSubmit={(e) => {
            e.preventDefault();
            if (query.trim()) toast(`${t("common.search")}: ${query}`);
          }}
        >
          <Search className="pointer-events-none absolute inset-inline-start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground ltr:left-3 rtl:right-3" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("top.search")}
            className="h-10 rounded-xl border-border/70 bg-surface/70 ltr:pl-10 rtl:pr-10"
          />
        </form>

        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={t("set.dark")}
            title={t("set.dark")}
          >
            {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLang}
            className="gap-2 rounded-xl font-medium"
          >
            <Globe className="size-4" />
            <span className="hidden sm:inline">{t("top.lang")}</span>
          </Button>


          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative" aria-label={t("not.title")}>
                <Bell className="size-5" />
                {unread > 0 && (
                  <span className="absolute top-1.5 grid size-4 place-items-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground ltr:right-1.5 rtl:left-1.5">
                    {unread}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <p className="text-sm font-semibold">{t("not.title")}</p>
                <button
                  onClick={markAllRead}
                  className="focus-ringed rounded text-xs text-primary hover:underline"
                >
                  {t("not.markAll")}
                </button>
              </div>
              <ul className="max-h-72 overflow-y-auto scrollbar-slim">
                {notifications.slice(0, 5).map((n) => (
                  <li key={n.id} className="border-b px-4 py-3 last:border-0 hover:bg-muted/60">
                    <p className="text-sm font-medium">{lang === "ar" ? n.titleAr : n.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                      {lang === "ar" ? n.bodyAr : n.body}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="p-2">
                <Button asChild variant="ghost" className="w-full text-sm">
                  <Link to="/notifications">{t("common.viewAll")}</Link>
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <button className="focus-ringed rounded-full" aria-label={t("top.profile")}>
                <Avatar className="size-9 border border-border">
                  <AvatarFallback className="gradient-brand text-xs font-bold text-primary-foreground">
                    LH
                  </AvatarFallback>
                </Avatar>
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-60 p-2">
              <div className="px-2 py-2">
                <p className="text-sm font-semibold">Layla Haddad</p>
                <p className="text-xs text-muted-foreground">layla@smartspend.io</p>
              </div>
              <Button asChild variant="ghost" className="w-full justify-start gap-3">
                <Link to="/settings">
                  <Settings className="size-4" />
                  {t("nav.settings")}
                </Link>
              </Button>
              <LogoutButton />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="sticky top-0 hidden h-screen w-[272px] shrink-0 flex-col border-e bg-sidebar lg:flex">
        <Brand />
        <NavList />
        <div className="border-t p-3">
          <LogoutButton />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <header className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between">
      <div className="min-w-0">
        <h1 className="truncate text-2xl font-bold sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}

export function CreditCardIcon() {
  return <CreditCard className="size-5" />;
}

export function PiggyIcon() {
  return <PiggyBank className="size-5" />;
}
