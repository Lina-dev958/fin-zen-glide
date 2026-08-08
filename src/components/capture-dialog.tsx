import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Camera, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export type CaptureMode = "receipt" | "transfer";

type Extracted = {
  merchant: string;
  amount: string;
  tax: string;
  date: string;
  items: string;
  sender: string;
  receiver: string;
  reference: string;
};

const empty: Extracted = {
  merchant: "",
  amount: "",
  tax: "",
  date: new Date().toISOString().slice(0, 10),
  items: "",
  sender: "",
  receiver: "",
  reference: "",
};

// Simulated OCR extraction — replaced by a real OCR service when available.
function fakeExtract(mode: CaptureMode, fileName: string): Extracted | null {
  if (/fail|blur/i.test(fileName)) return null;
  const amount = (Math.random() * 180 + 12).toFixed(2);
  if (mode === "receipt") {
    return {
      ...empty,
      merchant: "Carrefour",
      amount,
      tax: (Number(amount) * 0.16).toFixed(2),
      items: "Groceries · 7 items",
    };
  }
  return {
    ...empty,
    amount,
    sender: "Layla Haddad",
    receiver: "Arab Bank ****4821",
    reference: `TRX-${Math.floor(Math.random() * 900000 + 100000)}`,
  };
}

export function CaptureDialog({
  mode,
  open,
  onOpenChange,
}: {
  mode: CaptureMode;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { t, lang } = useI18n();
  const { accounts, addTransaction } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [phase, setPhase] = useState<"idle" | "loading" | "review" | "error">("idle");
  const [data, setData] = useState<Extracted>(empty);
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) {
      setPreview(null);
      setFileName("");
      setPhase("idle");
      setData(empty);
      setSaving(false);
    }
  }, [open]);

  const handleFile = (file?: File) => {
    if (!file) return;
    setFileName(file.name);
    setPreview(URL.createObjectURL(file));
    setPhase("loading");
    window.setTimeout(() => {
      const result = fakeExtract(mode, file.name);
      if (!result) {
        setPhase("error");
        return;
      }
      setData(result);
      setPhase("review");
    }, 1400);
  };

  const set = <K extends keyof Extracted>(k: K, v: Extracted[K]) =>
    setData((p) => ({ ...p, [k]: v }));

  const save = async () => {
    const value = Number(data.amount);
    if (!Number.isFinite(value) || value <= 0) {
      toast.error(t("err.amount"));
      return;
    }
    if (!accountId) {
      toast.error(t("err.account"));
      return;
    }
    const title =
      mode === "receipt"
        ? data.merchant.trim() || t("cap.receipt")
        : `${t("cap.transfer")} · ${data.receiver || ""}`.trim();
    setSaving(true);
    await addTransaction({
      title,
      titleAr: title,
      type: mode === "receipt" ? "expense" : "transfer",
      amount: value,
      category: mode === "receipt" ? "Shopping" : "Transfer",
      categoryAr: mode === "receipt" ? "تسوق" : "تحويل",
      accountId,
      date: data.date,
      note: mode === "receipt" ? data.items : data.reference,
    });
    setSaving(false);
    toast.success(t("cap.saved"));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto scrollbar-slim sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display">
            {mode === "receipt" ? t("cap.receipt") : t("cap.transfer")}
          </DialogTitle>
          <DialogDescription>
            {mode === "receipt" ? t("cap.receiptSub") : t("cap.transferSub")}
          </DialogDescription>
        </DialogHeader>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          hidden
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-3">
            <div className="grid aspect-[4/3] place-items-center overflow-hidden rounded-xl border border-dashed bg-muted/40">
              {preview ? (
                <img src={preview} alt={fileName} className="size-full object-contain" />
              ) : (
                <p className="px-4 text-center text-sm text-muted-foreground">{t("cap.empty")}</p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {mode === "receipt" && (
                <Button variant="outline" onClick={() => cameraRef.current?.click()}>
                  <Camera className="size-4" />
                  {t("cap.camera")}
                </Button>
              )}
              <Button variant="outline" onClick={() => fileRef.current?.click()}>
                <Upload className="size-4" />
                {preview ? t("cap.reupload") : t("cap.upload")}
              </Button>
              {preview && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setPreview(null);
                    setPhase("idle");
                  }}
                >
                  <X className="size-4" />
                  {t("cap.remove")}
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {phase === "loading" && (
              <div className="flex items-center gap-2 rounded-xl border bg-muted/40 p-4 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                {t("cap.processing")}
              </div>
            )}

            {phase === "error" && (
              <div className="space-y-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
                <p className="flex items-center gap-2 text-sm font-medium text-destructive">
                  <AlertTriangle className="size-4" />
                  {t("cap.failed")}
                </p>
                <p className="text-xs text-muted-foreground">{t("cap.failedHint")}</p>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()}>
                    {t("cap.retry")}
                  </Button>
                  <Button size="sm" onClick={() => setPhase("review")}>
                    {t("cap.manual")}
                  </Button>
                </div>
              </div>
            )}

            {phase === "review" && (
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold">{t("cap.review")}</p>
                  <p className="text-xs text-muted-foreground">{t("cap.reviewHint")}</p>
                </div>

                {mode === "receipt" ? (
                  <>
                    <Field label={t("cap.merchant")}>
                      <Input
                        value={data.merchant}
                        onChange={(e) => set("merchant", e.target.value)}
                      />
                    </Field>
                    <Field label={t("cap.tax")}>
                      <Input
                        inputMode="decimal"
                        value={data.tax}
                        onChange={(e) => set("tax", e.target.value)}
                      />
                    </Field>
                    <Field label={t("cap.items")}>
                      <Input value={data.items} onChange={(e) => set("items", e.target.value)} />
                    </Field>
                  </>
                ) : (
                  <>
                    <Field label={t("cap.sender")}>
                      <Input value={data.sender} onChange={(e) => set("sender", e.target.value)} />
                    </Field>
                    <Field label={t("cap.receiver")}>
                      <Input
                        value={data.receiver}
                        onChange={(e) => set("receiver", e.target.value)}
                      />
                    </Field>
                    <Field label={t("cap.reference")}>
                      <Input
                        value={data.reference}
                        onChange={(e) => set("reference", e.target.value)}
                      />
                    </Field>
                  </>
                )}

                <Field label={t("cap.total")}>
                  <Input
                    inputMode="decimal"
                    value={data.amount}
                    onChange={(e) => set("amount", e.target.value)}
                  />
                </Field>
                <Field label={t("ops.date")}>
                  <Input
                    type="date"
                    value={data.date}
                    onChange={(e) => set("date", e.target.value)}
                  />
                </Field>
                <Field label={t("ops.account")}>
                  <Select value={accountId} onValueChange={setAccountId}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((a) => (
                        <SelectItem key={a.id} value={a.id}>
                          {lang === "ar" ? a.nameAr : a.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.cancel")}
          </Button>
          <Button disabled={phase !== "review" || saving} onClick={save}>
            {saving && <Loader2 className="size-4 animate-spin" />}
            {t("cap.confirmSave")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
