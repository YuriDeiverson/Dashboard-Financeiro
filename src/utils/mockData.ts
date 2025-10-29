import { Transaction, Goal, BudgetCategory } from './types';

const ACCOUNTS = ['Conta Corrente', 'Cartão de Crédito', 'Investimentos', 'Poupança'];
const INDUSTRIES = ['Tecnologia', 'Saúde', 'Varejo', 'Educação', 'Alimentação', 'Transporte'];
const CATEGORIES = ['Alimentação', 'Moradia', 'Transporte', 'Lazer', 'Salário', 'Educação', 'Saúde'];


// Empty seeds for deployment — ensures no user data is pre-populated when project is published
export const mockTransactions: Transaction[] = [];

export const mockGoals: Goal[] = [];

export const mockBudgetCategories: BudgetCategory[] = [];


export const availableAccounts = [...ACCOUNTS];
export const availableIndustries = [...INDUSTRIES];
export const availableCategories = [...CATEGORIES];
