import { Outlet, createFileRoute } from "@tanstack/react-router";

import { CompanyLayout } from "@/components/company-layout";

export const Route = createFileRoute("/company")({
  component: CompanyWorkspaceLayout,
});

function CompanyWorkspaceLayout() {
  return <CompanyLayout><Outlet /></CompanyLayout>;
}