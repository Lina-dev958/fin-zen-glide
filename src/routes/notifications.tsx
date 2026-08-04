import { createFileRoute } from "@tanstack/react-router";
import { Bell, CalendarClock, ShieldAlert, Sparkles } from "lucide-react";

import { AppLayout, PageHeader } from "@/components/app-layout";
import { EmptyState, SectionCard } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Smart Spend" },
      { name: "description", content: "Bill reminders, budget alerts and AI nudges in one feed." },
      { property: "og:title", content: "Notifications — Smart Spend" },
      { property: "og:description", content: "Stay ahead of bills, limits and AI recommendations." },
    ],
  }),
  component: NotificationsPage,
});

const icons = { bill: CalendarClock, alert: ShieldAlert, ai: Sparkles, system: Bell };

function NotificationsPage() {
  const { t, lang } = useI18n();
  const { notifications, markAllRead, toggleRead } = useStore();

  return (
    <AppLayout>
      <PageHeader
        title={t("not.title")}
        subtitle={t("not.sub")}
        action={
          <Button variant="outline" className="rounded-xl" onClick={markAllRead}>
            {t("not.markAll")}
          </Button>
        }
      />

      <SectionCard padded={false}>
        {notifications.length === 0 ? (
          <div className="p-6">
            <EmptyState title={t("common.empty")} hint={t("common.emptyHint")} />
          </div>
        ) : (
          <ul className="divide-y">
            {notifications.map((n) => {
              const Icon = icons[n.kind];
              return (
                <li
                  key={n.id}
                  className={cn(
                    "flex gap-4 px-5 py-4 transition-colors hover:bg-muted/50",
                    !n.read && "bg-primary/5",
                  )}
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-muted text-primary">
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-medium">
                        {lang === "ar" ? n.titleAr : n.title}
                      </p>
                      {!n.read && (
                        <Badge className="rounded-full border-0 bg-primary/10 text-primary hover:bg-primary/15">
                          {t("not.unread")}
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {lang === "ar" ? n.bodyAr : n.body}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleRead(n.id)}
                    className="focus-ringed shrink-0 self-start rounded text-xs text-muted-foreground hover:text-primary"
                  >
                    {n.time}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </SectionCard>
    </AppLayout>
  );
}
