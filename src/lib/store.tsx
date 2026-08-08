import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type AccountType = "cash" | "bank" | "wallet" | "card";
export type TxType = "income" | "expense" | "transfer";

export type Account = {
  id: string;
  name: string;
  nameAr: string;
  type: AccountType;
  balance: number;
  currency: string;
  institution: string;
  limit?: number;
};

export type Transaction = {
  id: string;
  title: string;
  titleAr: string;
  type: TxType;
  amount: number;
  category: string;
  categoryAr: string;
  accountId: string;
  date: string;
  note?: string;
};

export type Recurrence = "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly";

export type Recurring = {
  id: string;
  kind: "income" | "expense";
  name: string;
  nameAr: string;
  accountId: string;
  category: string;
  categoryAr: string;
  amount: number;
  currency: string;
  nextDate: string;
  recurrence: Recurrence;
  note?: string;
  lastAmount?: number;
  active: boolean;
};

export type ImportStatus = "new" | "duplicate" | "review" | "matched";

export type ImportedTx = {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TxType;
  currency: string;
  accountId: string;
  reference?: string;
  status: ImportStatus;
  matchId?: string;
  selected: boolean;
};

export function addPeriod(date: string, r: Recurrence) {
  const d = new Date(date);
  if (r === "weekly") d.setDate(d.getDate() + 7);
  else if (r === "biweekly") d.setDate(d.getDate() + 14);
  else if (r === "monthly") d.setMonth(d.getMonth() + 1);
  else if (r === "quarterly") d.setMonth(d.getMonth() + 3);
  else d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().slice(0, 10);
}

export type Budget = {
  id: string;
  category: string;
  categoryAr: string;
  limit: number;
  spent: number;
};

export type Goal = {
  id: string;
  name: string;
  nameAr: string;
  target: number;
  current: number;
  deadline: string;
  plan: "fast" | "balanced" | "comfortable";
};

export type Notification = {
  id: string;
  title: string;
  titleAr: string;
  body: string;
  bodyAr: string;
  kind: "bill" | "alert" | "ai" | "system";
  time: string;
  read: boolean;
};

export const cashflow = [
  { month: "Jan", monthAr: "يناير", income: 8200, expenses: 5400 },
  { month: "Feb", monthAr: "فبراير", income: 7900, expenses: 6100 },
  { month: "Mar", monthAr: "مارس", income: 9100, expenses: 5800 },
  { month: "Apr", monthAr: "أبريل", income: 8800, expenses: 6400 },
  { month: "May", monthAr: "مايو", income: 9600, expenses: 6000 },
  { month: "Jun", monthAr: "يونيو", income: 10200, expenses: 6900 },
  { month: "Jul", monthAr: "يوليو", income: 9800, expenses: 6300 },
  { month: "Aug", monthAr: "أغسطس", income: 11200, expenses: 6750 },
];

export const upcomingBills = [
  { id: "b1", name: "Rent", nameAr: "الإيجار", amount: 1850, due: "Aug 28", dueAr: "28 أغسطس" },
  {
    id: "b2",
    name: "Cloud subscriptions",
    nameAr: "اشتراكات سحابية",
    amount: 214,
    due: "Aug 30",
    dueAr: "30 أغسطس",
  },
  {
    id: "b3",
    name: "Car insurance",
    nameAr: "تأمين السيارة",
    amount: 320,
    due: "Sep 02",
    dueAr: "2 سبتمبر",
  },
];

export const aiInsights = [
  {
    id: "i1",
    title: "Dining is trending up",
    titleAr: "الإنفاق على المطاعم يرتفع",
    body: "You spent 24% more on restaurants than your 3-month average. Capping it at $520 keeps August on target.",
    bodyAr: "أنفقت 24% أكثر على المطاعم مقارنة بمتوسط 3 أشهر. تحديد سقف 520$ يبقي أغسطس ضمن الخطة.",
    tone: "warning" as const,
  },
  {
    id: "i2",
    title: "Move idle cash",
    titleAr: "حرّك السيولة الخاملة",
    body: "$4,200 has been idle in your wallet for 41 days. Moving it to savings adds ~$186 a year.",
    bodyAr: "4,200$ خاملة في محفظتك منذ 41 يومًا. نقلها للمدخرات يضيف ~186$ سنويًا.",
    tone: "info" as const,
  },
  {
    id: "i3",
    title: "Goal ahead of schedule",
    titleAr: "هدفك متقدم عن الجدول",
    body: "Emergency Fund will complete 2 months early if you keep the balanced plan.",
    bodyAr: "صندوق الطوارئ سيكتمل قبل شهرين إذا واصلت الخطة المتوازنة.",
    tone: "success" as const,
  },
];

const seedAccounts: Account[] = [
  {
    id: "a1",
    name: "Main Checking",
    nameAr: "الحساب الجاري",
    type: "bank",
    balance: 18420,
    currency: "USD",
    institution: "Mercury Bank",
  },
  {
    id: "a2",
    name: "Business Savings",
    nameAr: "مدخرات الأعمال",
    type: "bank",
    balance: 32750,
    currency: "USD",
    institution: "Mercury Bank",
  },
  {
    id: "a3",
    name: "Apple Wallet",
    nameAr: "محفظة آبل",
    type: "wallet",
    balance: 1240,
    currency: "USD",
    institution: "Apple Pay",
  },
  {
    id: "a4",
    name: "Platinum Card",
    nameAr: "البطاقة البلاتينية",
    type: "card",
    balance: -2380,
    currency: "USD",
    institution: "Visa",
    limit: 15000,
  },
  {
    id: "a5",
    name: "Cash on hand",
    nameAr: "النقد المتوفر",
    type: "cash",
    balance: 860,
    currency: "USD",
    institution: "—",
  },
];

const seedTransactions: Transaction[] = [
  {
    id: "t1",
    title: "Client retainer — Nexa",
    titleAr: "أتعاب عميل — نكسا",
    type: "income",
    amount: 4200,
    category: "Salary",
    categoryAr: "الرواتب",
    accountId: "a1",
    date: "2026-08-03",
  },
  {
    id: "t2",
    title: "Whole Foods",
    titleAr: "سوبرماركت",
    type: "expense",
    amount: 184,
    category: "Groceries",
    categoryAr: "بقالة",
    accountId: "a4",
    date: "2026-08-02",
  },
  {
    id: "t3",
    title: "To Business Savings",
    titleAr: "إلى مدخرات الأعمال",
    type: "transfer",
    amount: 1500,
    category: "Transfer",
    categoryAr: "تحويل",
    accountId: "a1",
    date: "2026-08-02",
  },
  {
    id: "t4",
    title: "Figma annual",
    titleAr: "اشتراك فيغما السنوي",
    type: "expense",
    amount: 144,
    category: "Software",
    categoryAr: "برمجيات",
    accountId: "a4",
    date: "2026-08-01",
  },
  {
    id: "t5",
    title: "Uber rides",
    titleAr: "رحلات أوبر",
    type: "expense",
    amount: 62,
    category: "Transport",
    categoryAr: "مواصلات",
    accountId: "a3",
    date: "2026-07-31",
  },
  {
    id: "t6",
    title: "Dividend payout",
    titleAr: "توزيعات أرباح",
    type: "income",
    amount: 810,
    category: "Investments",
    categoryAr: "استثمارات",
    accountId: "a2",
    date: "2026-07-30",
  },
  {
    id: "t7",
    title: "Nobu dinner",
    titleAr: "عشاء مطعم",
    type: "expense",
    amount: 268,
    category: "Dining",
    categoryAr: "مطاعم",
    accountId: "a4",
    date: "2026-07-29",
  },
  {
    id: "t8",
    title: "Electricity bill",
    titleAr: "فاتورة الكهرباء",
    type: "expense",
    amount: 132,
    category: "Utilities",
    categoryAr: "خدمات",
    accountId: "a1",
    date: "2026-07-28",
  },
  {
    id: "t9",
    title: "Consulting workshop",
    titleAr: "ورشة استشارية",
    type: "income",
    amount: 1600,
    category: "Freelance",
    categoryAr: "عمل حر",
    accountId: "a1",
    date: "2026-07-27",
  },
  {
    id: "t10",
    title: "Gym membership",
    titleAr: "اشتراك النادي",
    type: "expense",
    amount: 89,
    category: "Health",
    categoryAr: "صحة",
    accountId: "a3",
    date: "2026-07-26",
  },
  {
    id: "t11",
    title: "Flight to Dubai",
    titleAr: "رحلة إلى دبي",
    type: "expense",
    amount: 640,
    category: "Travel",
    categoryAr: "سفر",
    accountId: "a4",
    date: "2026-07-24",
  },
  {
    id: "t12",
    title: "To Cash on hand",
    titleAr: "إلى النقد المتوفر",
    type: "transfer",
    amount: 300,
    category: "Transfer",
    categoryAr: "تحويل",
    accountId: "a1",
    date: "2026-07-22",
  },
  {
    id: "t13",
    title: "Coffee roasters",
    titleAr: "محمصة قهوة",
    type: "expense",
    amount: 46,
    category: "Dining",
    categoryAr: "مطاعم",
    accountId: "a5",
    date: "2026-07-21",
  },
  {
    id: "t14",
    title: "App Store payout",
    titleAr: "أرباح متجر التطبيقات",
    type: "income",
    amount: 980,
    category: "Freelance",
    categoryAr: "عمل حر",
    accountId: "a1",
    date: "2026-07-20",
  },
];

const seedBudgets: Budget[] = [
  { id: "bg1", category: "Dining", categoryAr: "مطاعم", limit: 600, spent: 522 },
  { id: "bg2", category: "Groceries", categoryAr: "بقالة", limit: 900, spent: 612 },
  { id: "bg3", category: "Transport", categoryAr: "مواصلات", limit: 350, spent: 188 },
  { id: "bg4", category: "Software", categoryAr: "برمجيات", limit: 400, spent: 431 },
  { id: "bg5", category: "Travel", categoryAr: "سفر", limit: 1200, spent: 640 },
  { id: "bg6", category: "Health", categoryAr: "صحة", limit: 300, spent: 129 },
];

const seedGoals: Goal[] = [
  {
    id: "g1",
    name: "Emergency Fund",
    nameAr: "صندوق الطوارئ",
    target: 24000,
    current: 17400,
    deadline: "2027-02",
    plan: "balanced",
  },
  {
    id: "g2",
    name: "Studio Office",
    nameAr: "مكتب الاستوديو",
    target: 40000,
    current: 12800,
    deadline: "2027-09",
    plan: "comfortable",
  },
  {
    id: "g3",
    name: "New MacBook",
    nameAr: "ماك بوك جديد",
    target: 3600,
    current: 2950,
    deadline: "2026-11",
    plan: "fast",
  },
];

const seedNotifications: Notification[] = [
  {
    id: "n1",
    title: "Rent due in 4 days",
    titleAr: "الإيجار مستحق خلال 4 أيام",
    body: "$1,850 will be charged from Main Checking on Aug 28.",
    bodyAr: "سيتم خصم 1,850$ من الحساب الجاري في 28 أغسطس.",
    kind: "bill",
    time: "2h",
    read: false,
  },
  {
    id: "n2",
    title: "Software budget exceeded",
    titleAr: "تجاوز ميزانية البرمجيات",
    body: "You are $31 over the monthly software limit.",
    bodyAr: "تجاوزت حد البرمجيات الشهري بمقدار 31$.",
    kind: "alert",
    time: "5h",
    read: false,
  },
  {
    id: "n3",
    title: "AI monthly analysis ready",
    titleAr: "التحليل الشهري الذكي جاهز",
    body: "Your July breakdown and 3 recommendations are available.",
    bodyAr: "تحليل يوليو و3 توصيات متاحة الآن.",
    kind: "ai",
    time: "1d",
    read: false,
  },
  {
    id: "n4",
    title: "New device signed in",
    titleAr: "تسجيل دخول من جهاز جديد",
    body: "MacBook Pro · Amman, Jordan.",
    bodyAr: "ماك بوك برو · عمّان، الأردن.",
    kind: "system",
    time: "3d",
    read: true,
  },
];

const today = new Date();
const shift = (days: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

const seedRecurring: Recurring[] = [
  {
    id: "r1",
    kind: "income",
    name: "Monthly salary",
    nameAr: "الراتب الشهري",
    accountId: "a1",
    category: "Salary",
    categoryAr: "راتب",
    amount: 5200,
    currency: "USD",
    nextDate: shift(6),
    recurrence: "monthly",
    active: true,
  },
  {
    id: "r2",
    kind: "expense",
    name: "Rent",
    nameAr: "الإيجار",
    accountId: "a1",
    category: "Housing",
    categoryAr: "سكن وإيجار",
    amount: 1850,
    currency: "USD",
    nextDate: shift(2),
    recurrence: "monthly",
    lastAmount: 1800,
    active: true,
  },
  {
    id: "r3",
    kind: "expense",
    name: "Internet",
    nameAr: "الإنترنت",
    accountId: "a1",
    category: "Utilities",
    categoryAr: "فواتير",
    amount: 45,
    currency: "USD",
    nextDate: shift(-1),
    recurrence: "monthly",
    lastAmount: 45,
    active: true,
  },
  {
    id: "r4",
    kind: "expense",
    name: "Subscriptions",
    nameAr: "الاشتراكات",
    accountId: "a4",
    category: "Software",
    categoryAr: "برمجيات",
    amount: 68,
    currency: "USD",
    nextDate: shift(9),
    recurrence: "monthly",
    active: true,
  },
];

const wait = (ms = 650) => new Promise((r) => setTimeout(r, ms));
const uid = () => Math.random().toString(36).slice(2, 9);

function applyBalance(list: Account[], tx: Transaction, sign: 1 | -1) {
  const delta = (tx.type === "income" ? tx.amount : -tx.amount) * sign;
  return list.map((a) => (a.id === tx.accountId ? { ...a, balance: a.balance + delta } : a));
}


type Store = {
  accounts: Account[];
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  notifications: Notification[];
  recurring: Recurring[];
  imported: ImportedTx[];
  lastImportIds: string[];
  addRecurring: (r: Omit<Recurring, "id">) => Promise<void>;
  updateRecurring: (r: Recurring) => Promise<void>;
  removeRecurring: (id: string) => Promise<void>;
  confirmRecurring: (id: string) => Promise<void>;
  postponeRecurring: (id: string, date: string) => Promise<void>;
  setImported: (list: ImportedTx[]) => void;
  commitImport: (list: ImportedTx[]) => Promise<number>;

  addAccount: (a: Omit<Account, "id">) => Promise<void>;
  updateAccount: (a: Account) => Promise<void>;
  removeAccount: (id: string) => Promise<void>;
  addTransaction: (t: Omit<Transaction, "id">) => Promise<void>;
  updateTransaction: (t: Transaction) => Promise<void>;
  removeTransaction: (id: string) => Promise<void>;
  addBudget: (b: Omit<Budget, "id">) => Promise<void>;
  removeBudget: (id: string) => Promise<void>;
  addGoal: (g: Omit<Goal, "id">) => Promise<void>;
  removeGoal: (id: string) => Promise<void>;
  depositGoal: (id: string, amount: number) => Promise<void>;
  setGoalPlan: (id: string, plan: Goal["plan"]) => void;
  markAllRead: () => void;
  toggleRead: (id: string) => void;
};

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState(seedAccounts);
  const [transactions, setTransactions] = useState(seedTransactions);
  const [budgets, setBudgets] = useState(seedBudgets);
  const [goals, setGoals] = useState(seedGoals);
  const [notifications, setNotifications] = useState(seedNotifications);
  const [recurring, setRecurring] = useState(seedRecurring);
  const [imported, setImportedState] = useState<ImportedTx[]>([]);
  const [lastImportIds, setLastImportIds] = useState<string[]>([]);

  const value = useMemo<Store>(
    () => ({
      accounts,
      transactions,
      budgets,
      goals,
      notifications,
      recurring,
      imported,
      lastImportIds,
      addAccount: async (a) => {
        await wait();
        setAccounts((p) => [{ ...a, id: uid() }, ...p]);
      },
      updateAccount: async (a) => {
        await wait();
        setAccounts((p) => p.map((x) => (x.id === a.id ? a : x)));
      },
      removeAccount: async (id) => {
        await wait(400);
        setAccounts((p) => p.filter((x) => x.id !== id));
      },
      addTransaction: async (t) => {
        await wait();
        const full = { ...t, id: uid() };
        setTransactions((p) => [full, ...p]);
        setAccounts((p) => applyBalance(p, full, 1));
      },
      updateTransaction: async (t) => {
        await wait();
        setTransactions((p) => {
          const old = p.find((x) => x.id === t.id);
          if (old) setAccounts((acc) => applyBalance(applyBalance(acc, old, -1), t, 1));
          return p.map((x) => (x.id === t.id ? t : x));
        });
      },
      removeTransaction: async (id) => {
        await wait(400);
        setTransactions((p) => {
          const old = p.find((x) => x.id === id);
          if (old) setAccounts((acc) => applyBalance(acc, old, -1));
          return p.filter((x) => x.id !== id);
        });
      },
      addRecurring: async (r) => {
        await wait();
        setRecurring((p) => [{ ...r, id: uid() }, ...p]);
      },
      updateRecurring: async (r) => {
        await wait();
        setRecurring((p) => p.map((x) => (x.id === r.id ? r : x)));
      },
      removeRecurring: async (id) => {
        await wait(400);
        setRecurring((p) => p.filter((x) => x.id !== id));
      },
      confirmRecurring: async (id) => {
        await wait();
        const item = recurring.find((r) => r.id === id);
        if (!item) return;
        const tx: Transaction = {
          id: uid(),
          title: item.name,
          titleAr: item.nameAr,
          type: item.kind,
          amount: item.amount,
          category: item.category,
          categoryAr: item.categoryAr,
          accountId: item.accountId,
          date: item.nextDate,
          note: item.note,
        };
        setTransactions((p) => [tx, ...p]);
        setAccounts((p) => applyBalance(p, tx, 1));
        setRecurring((p) =>
          p.map((r) =>
            r.id === id
              ? { ...r, lastAmount: r.amount, nextDate: addPeriod(r.nextDate, r.recurrence) }
              : r,
          ),
        );
      },
      postponeRecurring: async (id, date) => {
        await wait(400);
        setRecurring((p) => p.map((r) => (r.id === id ? { ...r, nextDate: date } : r)));
      },
      setImported: (list) => setImportedState(list),
      commitImport: async (list) => {
        await wait(800);
        const txs: Transaction[] = list.map((i) => ({
          id: uid(),
          title: i.description,
          titleAr: i.description,
          type: i.type,
          amount: i.amount,
          category: "Imported",
          categoryAr: "مستورد",
          accountId: i.accountId,
          date: i.date,
          note: i.reference,
        }));
        setTransactions((p) => [...txs, ...p]);
        setAccounts((p) => txs.reduce((acc, t) => applyBalance(acc, t, 1), p));
        setLastImportIds(txs.map((t) => t.id));
        setImportedState([]);
        return txs.length;
      },

      addBudget: async (b) => {
        await wait();
        setBudgets((p) => [...p, { ...b, id: uid() }]);
      },
      removeBudget: async (id) => {
        await wait(400);
        setBudgets((p) => p.filter((x) => x.id !== id));
      },
      addGoal: async (g) => {
        await wait();
        setGoals((p) => [...p, { ...g, id: uid() }]);
      },
      removeGoal: async (id) => {
        await wait(400);
        setGoals((p) => p.filter((x) => x.id !== id));
      },
      depositGoal: async (id, amount) => {
        await wait(500);
        setGoals((p) =>
          p.map((g) => (g.id === id ? { ...g, current: Math.min(g.target, g.current + amount) } : g)),
        );
      },
      setGoalPlan: (id, plan) => setGoals((p) => p.map((g) => (g.id === id ? { ...g, plan } : g))),
      markAllRead: () => setNotifications((p) => p.map((n) => ({ ...n, read: true }))),
      toggleRead: (id) =>
        setNotifications((p) => p.map((n) => (n.id === id ? { ...n, read: !n.read } : n))),
    }),
    [accounts, transactions, budgets, goals, notifications],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

export function useTotals() {
  const { accounts, transactions } = useStore();
  return useMemo(() => {
    const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);
    const income = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);
    return { totalBalance, income, expenses, savings: income - expenses };
  }, [accounts, transactions]);
}

export function useCategoryBreakdown() {
  const { transactions } = useStore();
  return useMemo(() => {
    const map = new Map<string, { category: string; categoryAr: string; value: number }>();
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const cur = map.get(t.category);
        if (cur) cur.value += t.amount;
        else map.set(t.category, { category: t.category, categoryAr: t.categoryAr, value: t.amount });
      });
    return [...map.values()].sort((a, b) => b.value - a.value);
  }, [transactions]);
}
