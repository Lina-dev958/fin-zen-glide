import { createFileRoute } from "@tanstack/react-router";
import { Plus, Send, Sparkles } from "lucide-react";
import { useState } from "react";

import { AppLayout, PageHeader } from "@/components/app-layout";
import { SectionCard } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI Financial Assistant — Smart Spend" },
      {
        name: "description",
        content: "Chat with an AI assistant for monthly analysis, savings tips and budget advice.",
      },
      { property: "og:title", content: "AI Financial Assistant — Smart Spend" },
      { property: "og:description", content: "Smart financial recommendations on demand." },
    ],
  }),
  component: AssistantPage,
});

type Msg = { id: string; role: "user" | "ai"; text: string };

const seed: Msg[] = [
  {
    id: "m1",
    role: "ai",
    text: "Your July net cash flow was +$4,450. Dining is your fastest-growing category at +24%. Want a plan to bring it back in line?",
  },
];

const suggestionsEn = [
  "How much can I safely save this month?",
  "Where did my money go in July?",
  "Suggest a budget for dining",
  "Am I on track for my emergency fund?",
];
const suggestionsAr = [
  "كم يمكنني الادخار بأمان هذا الشهر؟",
  "أين ذهبت أموالي في يوليو؟",
  "اقترح ميزانية للمطاعم",
  "هل أنا على المسار لصندوق الطوارئ؟",
];

function AssistantPage() {
  const { t, lang } = useI18n();
  const [messages, setMessages] = useState<Msg[]>(seed);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);

  const send = async (text: string) => {
    if (!text.trim()) return;
    setMessages((p) => [...p, { id: Math.random().toString(36), role: "user", text }]);
    setInput("");
    setThinking(true);
    await new Promise((r) => setTimeout(r, 1100));
    setMessages((p) => [
      ...p,
      {
        id: Math.random().toString(36),
        role: "ai",
        text:
          lang === "ar"
            ? "بناءً على معدل إنفاقك الحالي، يمكنك ادخار 1,250$ هذا الشهر مع الحفاظ على سيولة أمان لمدة 30 يومًا. أقترح تحويلًا تلقائيًا أسبوعيًا بقيمة 312$ إلى صندوق الطوارئ."
            : "Based on your current run rate you can save $1,250 this month while keeping a 30-day cash buffer. I suggest an automatic weekly transfer of $312 into Emergency Fund.",
      },
    ]);
    setThinking(false);
  };

  const suggestions = lang === "ar" ? suggestionsAr : suggestionsEn;

  return (
    <AppLayout>
      <PageHeader title={t("ai.title")} subtitle={t("ai.sub")} />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
        <SectionCard padded={false} className="flex h-[620px] flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto scrollbar-slim p-5">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn("flex gap-3", m.role === "user" ? "justify-end" : "justify-start")}
              >
                {m.role === "ai" && (
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl gradient-brand text-primary-foreground">
                    <Sparkles className="size-4" />
                  </span>
                )}
                <p
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    m.role === "user"
                      ? "gradient-brand text-primary-foreground"
                      : "bg-muted text-foreground",
                  )}
                >
                  {m.text}
                </p>
              </div>
            ))}
            {thinking && (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="size-4 animate-pulse text-primary" />
                {t("ai.thinking")}
              </p>
            )}
          </div>

          <div className="border-t p-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="focus-ringed rounded-full border bg-surface px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("ai.placeholder")}
                className="rounded-xl"
              />
              <Button type="submit" disabled={thinking || !input.trim()} className="gap-2 rounded-xl">
                <Send className="size-4" />
                <span className="hidden sm:inline">{t("ai.send")}</span>
              </Button>
            </form>
          </div>
        </SectionCard>

        <SectionCard
          title={t("ai.history")}
          action={
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5"
              onClick={() => setMessages(seed)}
            >
              <Plus className="size-3.5" />
              {t("ai.newChat")}
            </Button>
          }
        >
          <ul className="space-y-2 text-sm">
            {["Monthly analysis", "Savings tips", "Budget suggestions"].map((c, i) => (
              <li key={c}>
                <button className="focus-ringed w-full truncate rounded-xl px-3 py-2 text-start text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                  {lang === "ar"
                    ? ["التحليل الشهري", "نصائح الادخار", "اقتراحات الميزانية"][i]
                    : c}
                </button>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </AppLayout>
  );
}
