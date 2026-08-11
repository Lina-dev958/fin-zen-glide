import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { AppLayout, PageHeader } from "@/components/app-layout";
import { SectionCard } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n, type Lang } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";


export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Smart Spend" },
      {
        name: "description",
        content: "Manage profile, security, two-factor authentication, language and preferences.",
      },
      { property: "og:title", content: "Settings — Smart Spend" },
      { property: "og:description", content: "Profile, security and preference controls." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { t, lang, setLang } = useI18n();
  const { theme, setTheme } = useTheme();
  const [saving, setSaving] = useState(false);
  const [twoFa, setTwoFa] = useState(true);

  const save = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    toast.success(t("common.saved"));
  };

  const toggleDark = (v: boolean) => setTheme(v ? "dark" : "light");


  return (
    <AppLayout>
      <PageHeader title={t("set.title")} subtitle={t("set.sub")} />

      <Tabs defaultValue="profile">
        <TabsList className="mb-4 rounded-xl">
          <TabsTrigger value="profile" className="rounded-lg">
            {t("set.profile")}
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg">
            {t("set.security")}
          </TabsTrigger>
          <TabsTrigger value="prefs" className="rounded-lg">
            {t("set.prefs")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <SectionCard title={t("set.profile")}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="s-name">{t("set.fullName")}</Label>
                <Input id="s-name" defaultValue="Layla Haddad" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="s-mail">{t("set.email")}</Label>
                <Input id="s-mail" type="email" defaultValue="layla@smartspend.io" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="s-phone">{t("set.phone")}</Label>
                <Input id="s-phone" defaultValue="+962 7 9000 1122" />
              </div>
              <div className="space-y-2">
                <Label>{t("common.currency")}</Label>
                <Select defaultValue="USD">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["USD", "EUR", "AED", "SAR", "JOD"].map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={save} disabled={saving} className="mt-5 rounded-xl">
              {saving ? t("common.saving") : t("common.save")}
            </Button>
          </SectionCard>
        </TabsContent>

        <TabsContent value="security" className="space-y-5">
          <SectionCard title={t("set.password")}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="s-cur">{t("set.current")}</Label>
                <Input id="s-cur" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="s-new">{t("set.newPass")}</Label>
                <Input id="s-new" type="password" />
              </div>
            </div>
            <Button onClick={save} disabled={saving} className="mt-5 rounded-xl">
              {saving ? t("common.saving") : t("common.save")}
            </Button>
          </SectionCard>

          <SectionCard title={t("set.2fa")}>
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">{t("set.2faSub")}</p>
              <Switch checked={twoFa} onCheckedChange={setTwoFa} />
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="prefs" className="space-y-5">
          <SectionCard title={t("set.language")}>
            <Select value={lang} onValueChange={(v) => setLang(v as Lang)}>
              <SelectTrigger className="max-w-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English (LTR)</SelectItem>
                <SelectItem value="ar">العربية (RTL)</SelectItem>
              </SelectContent>
            </Select>
          </SectionCard>

          <SectionCard title={t("set.notifications")}>
            <div className="space-y-4">
              {[
                { label: t("set.emailAlerts"), def: true },
                { label: t("set.pushAlerts"), def: true },
                { label: t("set.dataSharing"), def: false },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-4">
                  <span className="text-sm">{row.label}</span>
                  <Switch defaultChecked={row.def} />
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title={t("set.appearance")}>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm">{t("set.dark")}</span>
              <Switch checked={dark} onCheckedChange={toggleDark} />
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
