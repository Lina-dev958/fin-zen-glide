import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Clock3, Construction, ShieldX } from "lucide-react";

import { useCompanyWorkspace } from "@/components/company-layout";
import { EmptyState } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/company/$section")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.section.replaceAll("-", " ")} — SmartSpend Company` },
      { name: "description", content: `SmartSpend Company workspace foundation for ${params.section.replaceAll("-", " ")}.` },
      { property: "og:title", content: `${params.section.replaceAll("-", " ")} — SmartSpend Company` },
      { property: "og:description", content: "A modular company finance workspace built for growing teams." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CompanyFoundationPage,
});

const titles: Record<string, { en: string; ar: string }> = {
  accounts: { en: "Company Accounts", ar: "حسابات الشركة" },
  transactions: { en: "Company Transactions", ar: "عمليات الشركة المالية" },
  "expense-requests": { en: "Expense Requests", ar: "طلبات المصروفات" },
  approvals: { en: "Approvals", ar: "الموافقات" },
  departments: { en: "Departments", ar: "الأقسام" },
  projects: { en: "Projects", ar: "المشاريع" },
  "cost-centers": { en: "Cost Centers", ar: "مراكز التكلفة" },
  budgets: { en: "Company Budgets", ar: "ميزانيات الشركة" },
  advances: { en: "Advances & Custody", ar: "السلف والعُهد" },
  reports: { en: "Company Reports", ar: "تقارير الشركة" },
  members: { en: "Members", ar: "الأعضاء" },
  roles: { en: "Roles & Permissions", ar: "الأدوار والصلاحيات" },
  calendar: { en: "Financial Calendar", ar: "التقويم المالي" },
  notifications: { en: "Company Notifications", ar: "إشعارات الشركة" },
  assistant: { en: "Company AI Assistant", ar: "المساعد الذكي للشركة" },
  settings: { en: "Company Settings", ar: "إعدادات الشركة" },
};

function CompanyFoundationPage() {
  const { section } = Route.useParams();
  const { lang } = useI18n();
  const { canApprove, canConfigure } = useCompanyWorkspace();
  const title = titles[section]?.[lang] ?? section;
  const restricted = (section === "approvals" && !canApprove) || (["roles", "settings"].includes(section) && !canConfigure);
  return <div className="mx-auto max-w-4xl"><header className="mb-6"><Button asChild variant="ghost" size="sm" className="mb-3"><Link to="/company"><ArrowLeft className="rtl:rotate-180" />{lang === "ar" ? "العودة للوحة التحكم" : "Back to dashboard"}</Link></Button><div className="flex flex-wrap items-center gap-3"><h1 className="text-2xl font-bold sm:text-3xl">{title}</h1><Badge variant="outline" className="gap-1"><Clock3 className="size-3" />{lang === "ar" ? "قيد الإعداد" : "In preparation"}</Badge></div><p className="mt-2 text-sm text-muted-foreground">{lang === "ar" ? "هذه الصفحة جزء من البنية المعيارية لمساحة الشركة وستتوفر في المرحلة القادمة." : "This page is part of the modular Company Workspace foundation and will be available in the next phase."}</p></header><section className="panel p-6">{restricted ? <EmptyState title={lang === "ar" ? "ليس لديك صلاحية لعرض هذه المنطقة" : "You don't have permission to view this area"} hint={lang === "ar" ? "اطلب من مالك الشركة تعديل دورك أو صلاحياتك." : "Ask a company owner to update your role or permissions."} action={<ShieldX className="size-6 text-destructive" />} /> : <EmptyState title={lang === "ar" ? "نعمل على تجهيز هذه الصفحة" : "We're preparing this page"} hint={lang === "ar" ? "تم إعداد المسار والتنقل والصلاحيات، وسيتم إضافة أدوات العمل هنا لاحقاً." : "Navigation, access rules and the page foundation are ready. Working tools will be added here next."} action={<Construction className="size-6 text-primary" />} />}</section></div>;
}