export interface User {
  id: string;
  name: string;
  email: string;
}

export type TransactionType = 'income' | 'expense';
export type TransactionStatus = 'completed' | 'pending';
export type PaymentMethod = 'Cartão de Crédito' | 'Débito' | 'PIX';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  account: string;
  state?: string;
  industry: string; // Could be deprecated or reused
  method: PaymentMethod;
  category: string;
}

export interface Filters {
  startDate: string;
  endDate: string;
  industries: string[];
  states: string[];
  companies: string; // Empresa única selecionada  
  companiesMulti: string[]; // Multi-seleção de empresas
  txType?: 'all' | 'income' | 'expense';
}

export interface Goal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline: string;
    category: string;
}

export interface BudgetCategory {
    id: string;
    name: string;
    budgetedAmount: number;
}
