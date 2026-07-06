export interface Account {
  id: string;
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  parentId?: string;
  balance: number;
  currency: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  date: Date;
  description: string;
  entries: JournalEntry[];
  status: 'draft' | 'posted' | 'void';
  reference?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JournalEntry {
  accountId: string;
  debit: number;
  credit: number;
  description?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  type: 'sales' | 'purchase';
  customerId?: string;
  vendorId?: string;
  date: Date;
  dueDate: Date;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'void';
  currency: string;
  notes?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  amount: number;
  accountId?: string;
}

export interface Payment {
  id: string;
  type: 'receivable' | 'payable';
  invoiceId: string;
  amount: number;
  date: Date;
  method: 'cash' | 'bank_transfer' | 'check' | 'credit_card';
  reference?: string;
  status: 'pending' | 'completed' | 'failed';
  createdBy: string;
  createdAt: Date;
}

export interface Budget {
  id: string;
  fiscalYear: number;
  accountId: string;
  plannedAmount: number;
  actualAmount: number;
  variance: number;
  period: 'monthly' | 'quarterly' | 'annually';
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface FinancialReport {
  id: string;
  type: 'balance_sheet' | 'income_statement' | 'cash_flow' | 'trial_balance';
  period: {
    startDate: Date;
    endDate: Date;
  };
  data: Record<string, unknown>;
  generatedBy: string;
  generatedAt: Date;
}
