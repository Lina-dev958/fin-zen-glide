import { useRouterState } from "@tanstack/react-router";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";


export type Lang = "en" | "ar";

type Dict = Record<string, { en: string; ar: string }>;

export const dict: Dict = {
  "app.name": { en: "Smart Spend", ar: "سمارت سبِند" },
  "app.tagline": { en: "AI money management", ar: "إدارة مالية بالذكاء الاصطناعي" },

  "nav.dashboard": { en: "Dashboard", ar: "لوحة التحكم" },
  "nav.accounts": { en: "Accounts", ar: "الحسابات" },
  "nav.transactions": { en: "Financial operations", ar: "العمليات المالية" },
  "nav.budgets": { en: "Budgets", ar: "الميزانيات" },
  "nav.goals": { en: "Savings Goals", ar: "أهداف الادخار" },
  "nav.reports": { en: "Reports", ar: "التقارير" },
  "nav.assistant": { en: "AI Assistant", ar: "المساعد الذكي" },
  "nav.notifications": { en: "Notifications", ar: "الإشعارات" },
  "nav.settings": { en: "Settings", ar: "الإعدادات" },
  "nav.logout": { en: "Log out", ar: "تسجيل الخروج" },
  "nav.main": { en: "Overview", ar: "نظرة عامة" },
  "nav.manage": { en: "Manage", ar: "الإدارة" },
  "nav.more": { en: "More", ar: "المزيد" },

  "top.search": { en: "Search transactions, accounts…", ar: "ابحث في المعاملات والحسابات…" },
  "top.profile": { en: "Profile", ar: "الملف الشخصي" },
  "top.lang": { en: "العربية", ar: "English" },

  "common.add": { en: "Add", ar: "إضافة" },
  "common.edit": { en: "Edit", ar: "تعديل" },
  "common.delete": { en: "Delete", ar: "حذف" },
  "common.cancel": { en: "Cancel", ar: "إلغاء" },
  "common.confirm": { en: "Confirm", ar: "تأكيد" },

  "common.save": { en: "Save", ar: "حفظ" },
  "common.saving": { en: "Saving…", ar: "جارٍ الحفظ…" },
  "common.details": { en: "Details", ar: "التفاصيل" },
  "common.search": { en: "Search", ar: "بحث" },
  "common.all": { en: "All", ar: "الكل" },
  "common.filters": { en: "Filters", ar: "عوامل التصفية" },
  "common.reset": { en: "Reset", ar: "إعادة تعيين" },
  "common.export": { en: "Export", ar: "تصدير" },
  "common.viewAll": { en: "View all", ar: "عرض الكل" },
  "common.empty": { en: "Nothing here yet", ar: "لا يوجد شيء بعد" },
  "common.emptyHint": {
    en: "Once you add data it will show up right here.",
    ar: "بمجرد إضافة البيانات ستظهر هنا.",
  },
  "common.required": { en: "This field is required", ar: "هذا الحقل مطلوب" },
  "common.invalidAmount": { en: "Enter a valid amount", ar: "أدخل مبلغًا صحيحًا" },
  "common.deleteTitle": { en: "Delete this item?", ar: "حذف هذا العنصر؟" },
  "common.deleteBody": {
    en: "This action cannot be undone.",
    ar: "لا يمكن التراجع عن هذا الإجراء.",
  },
  "common.saved": { en: "Changes saved", ar: "تم حفظ التغييرات" },
  "common.deleted": { en: "Deleted successfully", ar: "تم الحذف بنجاح" },
  "common.networkError": {
    en: "Network error. Please try again.",
    ar: "خطأ في الشبكة. حاول مرة أخرى.",
  },
  "common.page": { en: "Page", ar: "صفحة" },
  "common.of": { en: "of", ar: "من" },
  "common.prev": { en: "Previous", ar: "السابق" },
  "common.next": { en: "التالي", ar: "التالي" },
  "common.sort": { en: "Sort", ar: "الترتيب" },
  "common.name": { en: "Name", ar: "الاسم" },
  "common.amount": { en: "Amount", ar: "المبلغ" },
  "common.category": { en: "Category", ar: "الفئة" },
  "common.date": { en: "Date", ar: "التاريخ" },
  "common.type": { en: "Type", ar: "النوع" },
  "common.account": { en: "Account", ar: "الحساب" },
  "common.currency": { en: "Currency", ar: "العملة" },
  "common.balance": { en: "Balance", ar: "الرصيد" },
  "common.results": { en: "results", ar: "نتيجة" },

  "dash.welcome": { en: "Welcome back, Layla", ar: "أهلاً بعودتك، ليلى" },
  "dash.welcomeSub": {
    en: "Your money is on track this month. Net cash flow is up 12.4%.",
    ar: "أموالك على المسار الصحيح هذا الشهر. صافي التدفق النقدي ارتفع 12.4%.",
  },
  "dash.quick": { en: "Quick actions", ar: "إجراءات سريعة" },
  "dash.addIncome": { en: "Add income", ar: "إضافة دخل" },
  "dash.addExpense": { en: "Add expense", ar: "إضافة مصروف" },
  "dash.transfer": { en: "Transfer", ar: "تحويل" },
  "dash.newGoal": { en: "New goal", ar: "هدف جديد" },
  "dash.totalBalance": { en: "Total balance", ar: "الرصيد الإجمالي" },
  "dash.income": { en: "Income", ar: "الدخل" },
  "dash.expenses": { en: "Expenses", ar: "المصروفات" },
  "dash.savings": { en: "Savings", ar: "المدخرات" },
  "dash.cashflow": { en: "Cash flow", ar: "التدفق النقدي" },
  "dash.cashflowSub": { en: "Last 8 months", ar: "آخر 8 أشهر" },
  "dash.categories": { en: "Expense categories", ar: "فئات المصروفات" },
  "dash.budgetProgress": { en: "Budget progress", ar: "تقدم الميزانية" },
  "dash.goals": { en: "Savings goals", ar: "أهداف الادخار" },
  "dash.recent": { en: "Recent transactions", ar: "أحدث المعاملات" },
  "dash.bills": { en: "Upcoming bills", ar: "الفواتير القادمة" },
  "dash.insights": { en: "AI insights", ar: "رؤى الذكاء الاصطناعي" },
  "dash.vsLast": { en: "vs last month", ar: "مقارنة بالشهر الماضي" },
  "dash.due": { en: "Due", ar: "الاستحقاق" },
  "dash.pay": { en: "Pay now", ar: "ادفع الآن" },
  "dash.stats": { en: "General statistics", ar: "إحصائيات عامة" },
  "dash.statsSub": {
    en: "A quick pulse on this month's activity.",
    ar: "نظرة سريعة على نشاط هذا الشهر.",
  },
  "dash.savingsRate": { en: "Savings rate", ar: "معدل الادخار" },
  "dash.avgDaily": { en: "Avg. daily spend", ar: "متوسط الإنفاق اليومي" },
  "dash.txCount": { en: "Transactions", ar: "عدد المعاملات" },
  "dash.topCategory": { en: "Top category", ar: "أعلى فئة إنفاق" },
  "dash.accountsSplit": { en: "Where your money is", ar: "أين تتوزع أموالك" },
  "dash.accountsSplitSub": {
    en: "Total cash and total bank balance, broken down per account.",
    ar: "إجمالي الكاش وإجمالي الرصيد البنكي مع تفرعات كل حساب.",
  },
  "dash.totalCash": { en: "Total cash", ar: "إجمالي الكاش" },
  "dash.totalBank": { en: "Total bank", ar: "إجمالي البنوك" },
  "dash.totalWallets": { en: "Total wallets", ar: "إجمالي المحافظ" },
  "dash.totalCards": { en: "Total cards", ar: "إجمالي البطاقات" },
  "dash.accountsCount": { en: "accounts", ar: "حسابات" },
  "dash.showDetails": { en: "Show accounts", ar: "عرض الحسابات" },
  "dash.hideDetails": { en: "Hide accounts", ar: "إخفاء الحسابات" },
  "dash.shareOfTotal": { en: "of total", ar: "من الإجمالي" },

  "ops.title": { en: "Financial operations", ar: "العمليات المالية" },
  "ops.sub": {
    en: "Record income, expenses and transfers, and review your ledger.",
    ar: "سجّل الدخل والمصروفات والتحويلات وراجع سجلك المالي.",
  },
  "ops.smart": { en: "Smart capture", ar: "التسجيل الذكي" },
  "ops.smartSub": {
    en: "Say your operation out loud, or snap the invoice and we'll fill the fields automatically.",
    ar: "سجّل عمليتك بصوتك، أو صوّر الفاتورة وسنملأ الحقول تلقائيًا.",
  },
  "ops.voice": { en: "Voice record", ar: "تسجيل صوتي" },
  "ops.photo": { en: "Scan invoice", ar: "تصوير فاتورة" },
  "ops.new": { en: "New operation", ar: "تسجيل عملية جديدة" },
  "ops.amount": { en: "Amount", ar: "المبلغ" },
  "ops.category": { en: "Category", ar: "الفئة" },
  "ops.account": { en: "Account", ar: "الحساب" },
  "ops.note": { en: "Note", ar: "ملاحظة" },
  "ops.notePh": { en: "Short description", ar: "وصف مختصر" },
  "ops.date": { en: "Date", ar: "التاريخ" },
  "ops.save": { en: "Save operation", ar: "حفظ العملية" },
  "ops.ledger": { en: "Ledger", ar: "السجل" },
  "ops.all": { en: "All", ar: "الكل" },
  "ops.expense": { en: "Expenses", ar: "مصروفات" },
  "ops.income": { en: "Income", ar: "دخل" },
  "ops.transfer": { en: "Transfers", ar: "تحويلات" },
  "ops.tExpense": { en: "Expense", ar: "مصروف" },
  "ops.tIncome": { en: "Income", ar: "دخل" },
  "ops.tTransfer": { en: "Transfer", ar: "تحويل" },
  "ops.saved": { en: "Operation saved", ar: "تم حفظ العملية" },
  "ops.deleted": { en: "Operation deleted", ar: "تم حذف العملية" },
  "ops.soon": { en: "Coming soon", ar: "قريبًا" },
  "ops.invalidAmount": { en: "Enter a valid amount", ar: "أدخل مبلغًا صحيحًا" },
  "ops.needTitle": { en: "Add a short description", ar: "أضف وصفًا مختصرًا" },
  "ops.empty": { en: "No operations yet", ar: "لا توجد عمليات بعد" },
  "ops.emptyHint": {
    en: "Record your first operation from the form beside.",
    ar: "سجّل أول عملية من النموذج المجاور.",
  },




  "nav.recurring": { en: "Recurring", ar: "العمليات المتكررة" },
  "nav.import": { en: "Import", ar: "استيراد البيانات" },

  "rec.title": { en: "Recurring operations", ar: "العمليات المتكررة" },
  "rec.sub": {
    en: "Salaries, rent, bills and subscriptions — reviewed before every deduction.",
    ar: "الرواتب والإيجار والفواتير والاشتراكات — تُراجع قبل كل خصم.",
  },
  "rec.addIncome": { en: "Add recurring income", ar: "إضافة دخل متكرر" },
  "rec.addExpense": { en: "Add recurring expense", ar: "إضافة مصروف متكرر" },
  "rec.incomeList": { en: "Recurring income", ar: "الدخل المتكرر" },
  "rec.expenseList": { en: "Recurring expenses", ar: "المصروفات المتكررة" },
  "rec.due": { en: "Due now", ar: "مستحقة الآن" },
  "rec.dueSub": {
    en: "Review these before they are deducted.",
    ar: "راجع هذه العمليات قبل خصمها.",
  },
  "rec.dueTitle": { en: "Due expense", ar: "مصروف مستحق" },
  "rec.dueIncomeTitle": { en: "Due income", ar: "دخل مستحق" },
  "rec.name": { en: "Name", ar: "الاسم" },
  "rec.namePhIncome": { en: "e.g. Monthly salary", ar: "مثال: الراتب الشهري" },
  "rec.namePhExpense": { en: "e.g. Rent", ar: "مثال: الإيجار" },
  "rec.firstDue": { en: "First due date", ar: "تاريخ أول استحقاق" },
  "rec.dueDate": { en: "Due date", ar: "تاريخ الاستحقاق" },
  "rec.recurrence": { en: "Recurrence", ar: "تكرار العملية" },
  "rec.notes": { en: "Notes", ar: "ملاحظات" },
  "rec.weekly": { en: "Weekly", ar: "أسبوعي" },
  "rec.biweekly": { en: "Every 2 weeks", ar: "كل أسبوعين" },
  "rec.monthly": { en: "Monthly", ar: "شهري" },
  "rec.quarterly": { en: "Every 3 months", ar: "كل ثلاثة أشهر" },
  "rec.yearly": { en: "Yearly", ar: "سنوي" },
  "rec.preview": { en: "Preview", ar: "معاينة" },
  "rec.previewTitle": { en: "Preview", ar: "معاينة العملية" },
  "rec.saveIncome": { en: "Save income", ar: "حفظ الدخل" },
  "rec.saveExpense": { en: "Save expense", ar: "حفظ المصروف" },
  "rec.savedIncome": { en: "Recurring income added", ar: "تمت إضافة الدخل المتكرر" },
  "rec.savedExpense": { en: "Recurring expense added", ar: "تمت إضافة المصروف المتكرر" },
  "rec.confirm": { en: "Confirm deduction", ar: "تأكيد الخصم" },
  "rec.confirmIncome": { en: "Confirm deposit", ar: "تأكيد الإيداع" },
  "rec.confirmBody": {
    en: "The transaction will be created and the account balance updated.",
    ar: "سيتم إنشاء العملية وتحديث رصيد الحساب.",
  },
  "rec.confirmed": { en: "Transaction created", ar: "تم إنشاء العملية" },
  "rec.postpone": { en: "Postpone", ar: "تأجيل" },
  "rec.postponeTitle": { en: "Postpone to", ar: "التأجيل إلى" },
  "rec.postponed": { en: "Postponed successfully", ar: "تم التأجيل بنجاح" },
  "rec.week": { en: "One week", ar: "أسبوع" },
  "rec.month": { en: "One month", ar: "شهر" },
  "rec.custom": { en: "Custom date", ar: "تاريخ مخصص" },
  "rec.editTitle": { en: "Edit recurring operation", ar: "تعديل العملية المتكررة" },
  "rec.updated": { en: "Recurring operation updated", ar: "تم تحديث العملية المتكررة" },
  "rec.removed": { en: "Recurring operation deleted", ar: "تم حذف العملية المتكررة" },
  "rec.previousAmount": { en: "Previous amount", ar: "المبلغ السابق" },
  "rec.next": { en: "Next", ar: "الاستحقاق القادم" },
  "rec.emptyIncome": { en: "No recurring income yet", ar: "لا يوجد دخل متكرر بعد" },
  "rec.emptyExpense": { en: "No recurring expenses yet", ar: "لا توجد مصروفات متكررة بعد" },
  "rec.emptyDue": { en: "Nothing due right now", ar: "لا يوجد استحقاق حاليًا" },
  "rec.notFound": { en: "Operation not found", ar: "العملية غير موجودة" },
  "rec.overdue": { en: "Overdue", ar: "متأخرة" },
  "rec.inDays": { en: "in {n} days", ar: "خلال {n} يوم" },

  "err.account": { en: "Please select an account.", ar: "يرجى اختيار الحساب." },
  "err.amount": {
    en: "Please enter an amount greater than zero.",
    ar: "يرجى إدخال مبلغ أكبر من صفر.",
  },
  "err.date": { en: "Please enter a valid date.", ar: "يرجى إدخال تاريخ صحيح." },
  "err.name": { en: "Please enter a name.", ar: "يرجى إدخال الاسم." },
  "err.read": { en: "Could not read data from the file.", ar: "تعذر قراءة البيانات من الملف." },
  "err.duplicate": { en: "A similar transaction was found.", ar: "تم العثور على عملية مشابهة." },

  "cap.receipt": { en: "Scan receipt", ar: "تصوير فاتورة" },
  "cap.receiptSub": {
    en: "Photograph or upload a receipt and we extract the details for your review.",
    ar: "صوّر أو ارفع فاتورة وسنستخرج التفاصيل لمراجعتها.",
  },
  "cap.transfer": { en: "Upload transfer screenshot", ar: "رفع لقطة تحويل" },
  "cap.transferSub": {
    en: "Upload a bank or wallet transfer screenshot to extract its details.",
    ar: "ارفع لقطة تحويل بنكي أو محفظة رقمية لاستخراج تفاصيلها.",
  },
  "cap.camera": { en: "Open camera", ar: "فتح الكاميرا" },
  "cap.upload": { en: "Upload image", ar: "رفع صورة" },
  "cap.retake": { en: "Retake", ar: "إعادة التصوير" },
  "cap.reupload": { en: "Re-upload", ar: "إعادة الرفع" },
  "cap.remove": { en: "Remove image", ar: "حذف الصورة" },
  "cap.processing": { en: "Reading the image…", ar: "جارٍ قراءة الصورة…" },
  "cap.review": { en: "Review extracted data", ar: "مراجعة البيانات المستخرجة" },
  "cap.reviewHint": {
    en: "Nothing is saved until you confirm. Edit any field first.",
    ar: "لن يتم الحفظ قبل تأكيدك. يمكنك تعديل أي حقل.",
  },
  "cap.merchant": { en: "Merchant", ar: "اسم المتجر" },
  "cap.total": { en: "Total amount", ar: "المبلغ الإجمالي" },
  "cap.tax": { en: "Tax", ar: "الضريبة" },
  "cap.items": { en: "Items", ar: "تفاصيل الأصناف" },
  "cap.sender": { en: "Sender", ar: "المرسل" },
  "cap.receiver": { en: "Receiver", ar: "المستلم" },
  "cap.reference": { en: "Reference number", ar: "الرقم المرجعي" },
  "cap.saveTx": { en: "Save operation", ar: "حفظ العملية" },
  "cap.confirmSave": { en: "Confirm & save", ar: "تأكيد وحفظ" },
  "cap.failed": { en: "Could not read the image", ar: "تعذر قراءة الصورة" },
  "cap.failedHint": {
    en: "Try another photo, or enter the details manually.",
    ar: "جرّب صورة أخرى، أو أدخل البيانات يدويًا.",
  },
  "cap.retry": { en: "Try again", ar: "إعادة المحاولة" },
  "cap.manual": { en: "Enter manually", ar: "إدخال يدوي" },
  "cap.saved": { en: "Operation saved", ar: "تم حفظ العملية" },
  "cap.empty": { en: "No image selected yet", ar: "لم يتم اختيار صورة بعد" },

  "imp.title": { en: "Import bank statement", ar: "استيراد كشف حساب" },
  "imp.sub": {
    en: "PDF, Excel or CSV — extracted, reviewed and matched before import.",
    ar: "PDF أو Excel أو CSV — تُستخرج وتُراجع وتُطابق قبل الاستيراد.",
  },
  "imp.step1": { en: "Upload file", ar: "رفع الملف" },
  "imp.step2": { en: "Extract data", ar: "استخراج البيانات" },
  "imp.step3": { en: "Review data", ar: "مراجعة البيانات" },
  "imp.step4": { en: "Match operations", ar: "مطابقة العمليات" },
  "imp.step5": { en: "Confirm import", ar: "تأكيد الاستيراد" },
  "imp.drop": { en: "Drag & drop your file here", ar: "اسحب الملف وأفلته هنا" },
  "imp.browse": { en: "Browse files", ar: "استعراض الملفات" },
  "imp.formats": { en: "Supported: PDF, XLSX, CSV", ar: "الصيغ المدعومة: PDF، XLSX، CSV" },
  "imp.fileName": { en: "File name", ar: "اسم الملف" },
  "imp.fileType": { en: "File type", ar: "نوع الملف" },
  "imp.fileSize": { en: "File size", ar: "حجم الملف" },
  "imp.status": { en: "Status", ar: "الحالة" },
  "imp.extracting": { en: "Extracting transactions…", ar: "جارٍ استخراج العمليات…" },
  "imp.extracted": { en: "Extracted operations", ar: "العمليات المستخرجة" },
  "imp.description": { en: "Description", ar: "الوصف" },
  "imp.detected": { en: "Detected account", ar: "الحساب المكتشف" },
  "imp.selected": { en: "selected", ar: "محددة" },
  "imp.importSelected": { en: "Import selected", ar: "استيراد المحدد" },
  "imp.next": { en: "Continue", ar: "متابعة" },
  "imp.back": { en: "Back", ar: "رجوع" },
  "imp.match": { en: "Match operations", ar: "مطابقة العمليات" },
  "imp.matchSub": {
    en: "We compared each extracted operation with your existing ledger.",
    ar: "قارنّا كل عملية مستخرجة مع سجلك الحالي.",
  },
  "imp.newOnes": { en: "New operations", ar: "العمليات الجديدة" },
  "imp.dupes": { en: "Duplicate operations", ar: "العمليات المكررة" },
  "imp.needsReview": { en: "Need review", ar: "تحتاج مراجعة" },
  "imp.countExtracted": { en: "Extracted operations", ar: "عدد العمليات المستخرجة" },
  "imp.s.new": { en: "New operation", ar: "عملية جديدة" },
  "imp.s.duplicate": { en: "Possible duplicate", ar: "مكرر محتمل" },
  "imp.s.review": { en: "Needs review", ar: "تحتاج مراجعة" },
  "imp.s.matched": { en: "Matched", ar: "مطابق" },
  "imp.markDuplicate": { en: "Mark as duplicate", ar: "اعتبارها مكررة" },
  "imp.importAsNew": { en: "Import as new", ar: "استيراد كعملية جديدة" },
  "imp.reviewIt": { en: "Review", ar: "مراجعة" },
  "imp.ignore": { en: "Ignore", ar: "تجاهل" },
  "imp.importedTx": { en: "Imported operation", ar: "العملية المستوردة" },
  "imp.existingTx": { en: "Existing operation", ar: "العملية الحالية" },
  "imp.confirmImport": { en: "Confirm import", ar: "تأكيد الاستيراد" },
  "imp.done": { en: "Import completed", ar: "تم الاستيراد بنجاح" },
  "imp.doneSub": {
    en: "The selected operations were added to your ledger.",
    ar: "تمت إضافة العمليات المحددة إلى سجلك.",
  },
  "imp.noneSelected": { en: "Select at least one operation.", ar: "اختر عملية واحدة على الأقل." },
  "imp.startOver": { en: "Import another file", ar: "استيراد ملف آخر" },
  "imp.badFile": {
    en: "Unsupported file format.",
    ar: "صيغة الملف غير مدعومة.",
  },
  "imp.recent": { en: "Recently imported", ar: "المستوردة حديثًا" },

  "ops.more": { en: "More ways to add", ar: "طرق إضافة أخرى" },
  "ops.moreSub": {
    en: "Recurring operations, receipts, transfers and statement imports.",
    ar: "عمليات متكررة وفواتير وتحويلات واستيراد كشوف الحساب.",
  },

  "acc.title": { en: "Accounts", ar: "الحسابات" },

  "acc.sub": {
    en: "Cash, bank accounts, wallets and cards in one place.",
    ar: "النقد والحسابات البنكية والمحافظ والبطاقات في مكان واحد.",
  },
  "acc.add": { en: "Add account", ar: "إضافة حساب" },
  "acc.type.cash": { en: "Cash", ar: "نقد" },
  "acc.type.bank": { en: "Bank account", ar: "حساب بنكي" },
  "acc.type.wallet": { en: "Digital wallet", ar: "محفظة رقمية" },
  "acc.type.card": { en: "Credit card", ar: "بطاقة ائتمان" },
  "acc.limit": { en: "Credit limit", ar: "حد الائتمان" },
  "acc.updated": { en: "Updated today", ar: "تم التحديث اليوم" },

  "tx.title": { en: "Transactions", ar: "المعاملات" },
  "tx.sub": {
    en: "Every income, expense and internal transfer.",
    ar: "كل الدخل والمصروفات والتحويلات الداخلية.",
  },
  "tx.add": { en: "Add transaction", ar: "إضافة معاملة" },
  "tx.income": { en: "Income", ar: "دخل" },
  "tx.expense": { en: "Expense", ar: "مصروف" },
  "tx.transfer": { en: "Transfer", ar: "تحويل" },
  "tx.note": { en: "Note", ar: "ملاحظة" },

  "bud.title": { en: "Budgets", ar: "الميزانيات" },
  "bud.sub": {
    en: "Monthly limits per category, tracked live.",
    ar: "حدود شهرية لكل فئة، تُتابع لحظيًا.",
  },
  "bud.create": { en: "Create budget", ar: "إنشاء ميزانية" },
  "bud.monthly": { en: "Monthly budget", ar: "الميزانية الشهرية" },
  "bud.spent": { en: "Spent", ar: "المصروف" },
  "bud.remaining": { en: "Remaining", ar: "المتبقي" },
  "bud.over": { en: "Over budget", ar: "تجاوز الميزانية" },
  "bud.limit": { en: "Limit", ar: "الحد" },

  "goal.title": { en: "Savings goals", ar: "أهداف الادخار" },
  "goal.sub": {
    en: "Track targets and let AI pick your pace.",
    ar: "تابع أهدافك ودع الذكاء الاصطناعي يختار وتيرتك.",
  },
  "goal.new": { en: "New goal", ar: "هدف جديد" },
  "goal.target": { en: "Target", ar: "الهدف" },
  "goal.current": { en: "Saved", ar: "المدخر" },
  "goal.plans": { en: "AI saving plans", ar: "خطط الادخار الذكية" },
  "goal.fast": { en: "Fast", ar: "سريعة" },
  "goal.balanced": { en: "Balanced", ar: "متوازنة" },
  "goal.comfortable": { en: "Comfortable", ar: "مريحة" },
  "goal.perMonth": { en: "/ month", ar: "/ شهريًا" },
  "goal.choose": { en: "Choose plan", ar: "اختر الخطة" },
  "goal.deposit": { en: "Add funds", ar: "إضافة مبلغ" },

  "rep.title": { en: "Reports", ar: "التقارير" },
  "rep.sub": {
    en: "Income, expenses and monthly analytics.",
    ar: "الدخل والمصروفات والتحليلات الشهرية.",
  },
  "rep.income": { en: "Income report", ar: "تقرير الدخل" },
  "rep.expense": { en: "Expense report", ar: "تقرير المصروفات" },
  "rep.monthly": { en: "Monthly report", ar: "التقرير الشهري" },
  "rep.pdf": { en: "Export PDF", ar: "تصدير PDF" },
  "rep.excel": { en: "Export Excel", ar: "تصدير Excel" },
  "rep.exporting": { en: "Preparing file…", ar: "جارٍ تجهيز الملف…" },
  "rep.exported": { en: "Export ready", ar: "التصدير جاهز" },
  "rep.savingsRate": { en: "Savings rate", ar: "معدل الادخار" },
  "rep.topCategory": { en: "Top category", ar: "أعلى فئة" },
  "rep.avgSpend": { en: "Avg. daily spend", ar: "متوسط الإنفاق اليومي" },

  "ai.title": { en: "AI Financial Assistant", ar: "المساعد المالي الذكي" },
  "ai.sub": {
    en: "Ask anything about your money.",
    ar: "اسأل عن أي شيء يخص أموالك.",
  },
  "ai.placeholder": { en: "Ask Smart Spend…", ar: "اسأل سمارت سبِند…" },
  "ai.send": { en: "Send", ar: "إرسال" },
  "ai.history": { en: "Conversations", ar: "المحادثات" },
  "ai.newChat": { en: "New chat", ar: "محادثة جديدة" },
  "ai.suggested": { en: "Suggested questions", ar: "أسئلة مقترحة" },
  "ai.thinking": { en: "Analyzing your data…", ar: "جارٍ تحليل بياناتك…" },

  "not.title": { en: "Notifications", ar: "الإشعارات" },
  "not.sub": { en: "Alerts, bills and AI nudges.", ar: "التنبيهات والفواتير وتنبيهات الذكاء." },
  "not.markAll": { en: "Mark all as read", ar: "تعليم الكل كمقروء" },
  "not.unread": { en: "Unread", ar: "غير مقروء" },

  "set.title": { en: "Settings", ar: "الإعدادات" },
  "set.sub": { en: "Profile, security and preferences.", ar: "الملف الشخصي والأمان والتفضيلات." },
  "set.profile": { en: "Profile", ar: "الملف الشخصي" },
  "set.security": { en: "Security", ar: "الأمان" },
  "set.prefs": { en: "Preferences", ar: "التفضيلات" },
  "set.privacy": { en: "Privacy", ar: "الخصوصية" },
  "set.fullName": { en: "Full name", ar: "الاسم الكامل" },
  "set.email": { en: "Email", ar: "البريد الإلكتروني" },
  "set.phone": { en: "Phone", ar: "الهاتف" },
  "set.password": { en: "Change password", ar: "تغيير كلمة المرور" },
  "set.current": { en: "Current password", ar: "كلمة المرور الحالية" },
  "set.newPass": { en: "New password", ar: "كلمة المرور الجديدة" },
  "set.2fa": { en: "Two-factor authentication", ar: "المصادقة الثنائية" },
  "set.2faSub": {
    en: "Require a one-time code at every login.",
    ar: "طلب رمز لمرة واحدة عند كل تسجيل دخول.",
  },
  "set.language": { en: "Language", ar: "اللغة" },
  "set.notifications": { en: "Notifications", ar: "الإشعارات" },
  "set.appearance": { en: "Appearance", ar: "المظهر" },
  "set.dark": { en: "Dark mode", ar: "الوضع الليلي" },
  "set.emailAlerts": { en: "Email alerts", ar: "تنبيهات البريد" },
  "set.pushAlerts": { en: "Push alerts", ar: "التنبيهات الفورية" },
  "set.dataSharing": { en: "Anonymous data sharing", ar: "مشاركة البيانات مجهولة الهوية" },
  "set.logoutBody": {
    en: "You will need to sign in again to access your data.",
    ar: "ستحتاج لتسجيل الدخول مرة أخرى للوصول إلى بياناتك.",
  },
};

type Ctx = {
  lang: Lang;
  dir: "rtl" | "ltr";
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  t: (k: string) => string;
  money: (n: number) => string;
  num: (n: number) => string;
};

const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const href = useRouterState({ select: (s) => s.location.href });

  useEffect(() => {
    const fromUrl = new URL(window.location.href).searchParams.get("lang");
    if (fromUrl === "ar" || fromUrl === "en") {
      setLangState(fromUrl);
      window.localStorage.setItem("ss-lang", fromUrl);
      return;
    }
    const stored = window.localStorage.getItem("ss-lang") as Lang | null;
    if (stored === "ar" || stored === "en") setLangState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  // Keep ?lang=… in the URL in sync with the active language, across navigations.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("lang") !== lang) {
      url.searchParams.set("lang", lang);
      window.history.replaceState(window.history.state, "", url.toString());
    }
  }, [lang, href]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    window.localStorage.setItem("ss-lang", l);
    const url = new URL(window.location.href);
    url.searchParams.set("lang", l);
    window.history.replaceState(window.history.state, "", url.toString());
  }, []);


  const value = useMemo<Ctx>(() => {
    const locale = lang === "ar" ? "ar-EG" : "en-US";
    return {
      lang,
      dir: lang === "ar" ? "rtl" : "ltr",
      setLang,
      toggleLang: () => setLang(lang === "ar" ? "en" : "ar"),
      t: (k) => dict[k]?.[lang] ?? k,
      money: (n) =>
        new Intl.NumberFormat(locale, {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }).format(n),
      num: (n) => new Intl.NumberFormat(locale).format(n),
    };
  }, [lang, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
