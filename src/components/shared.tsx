import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, Inbox } from "lucide-react";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function SectionCard({
  title,
  subtitle,
  action,
  className,
  children,
  padded = true,
}: {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
  padded?: boolean;
}) {
  return (
    <section className={cn("panel overflow-hidden transition-shadow hover:shadow-[var(--shadow-lift)]", className)}>
      {(title || action) && (
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b px-5 py-4">
          <div className="min-w-0">
            {title && <h2 className="truncate text-base font-semibold">{title}</h2>}
            {subtitle && <p className="mt-0.5 truncate text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div className={cn(padded && "p-5")}>{children}</div>
    </section>
  );
}

export function StatCard({
  label,
  value,
  delta,
  icon,
  highlight = false,
}: {
  label: string;
  value: string;
  delta?: number;
  icon: ReactNode;
  highlight?: boolean;
}) {
  const up = (delta ?? 0) >= 0;
  return (
    <div
      className={cn(
        "panel group relative overflow-hidden p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]",
        highlight && "gradient-brand border-transparent text-primary-foreground",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p
          className={cn(
            "text-xs font-medium uppercase tracking-wider",
            highlight ? "text-primary-foreground/75" : "text-muted-foreground",
          )}
        >
          {label}
        </p>
        <span
          className={cn(
            "grid size-9 shrink-0 place-items-center rounded-xl",
            highlight ? "bg-primary-foreground/15" : "bg-muted text-primary",
          )}
        >
          {icon}
        </span>
      </div>
      <p className="mt-4 font-display text-2xl font-bold tabular-nums sm:text-[28px]">{value}</p>
      {delta !== undefined && (
        <p
          className={cn(
            "mt-2 inline-flex items-center gap-1 text-xs font-medium",
            highlight
              ? "text-primary-foreground/85"
              : up
                ? "text-success"
                : "text-destructive",
          )}
        >
          {up ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
          {Math.abs(delta)}%
        </p>
      )}
    </div>
  );
}

export function EmptyState({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed py-14 text-center">
      <span className="grid size-12 place-items-center rounded-2xl bg-muted text-muted-foreground">
        <Inbox className="size-5" />
      </span>
      <p className="font-semibold">{title}</p>
      {hint && <p className="max-w-sm text-sm text-muted-foreground">{hint}</p>}
      {action}
    </div>
  );
}

export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="size-10 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-1/3" />
            <Skeleton className="h-3 w-1/5" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  );
}

export function ProgressBar({ value, tone = "brand" }: { value: number; tone?: "brand" | "danger" }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-700",
          tone === "danger" ? "bg-destructive" : "gradient-accent",
        )}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function ProgressRing({ value, size = 104 }: { value: number; size?: number }) {
  const stroke = 9;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90" aria-hidden>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        strokeWidth={stroke}
        className="stroke-muted"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        strokeWidth={stroke}
        strokeLinecap="round"
        className="stroke-primary transition-[stroke-dashoffset] duration-700"
        strokeDasharray={c}
        strokeDashoffset={c - (c * Math.min(100, value)) / 100}
      />
    </svg>
  );
}
