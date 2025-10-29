import React, { useMemo } from 'react';
import { Transaction } from '../utils/types';
import SummaryCard from './SummaryCard';
import { ICONS } from '../constants';
import TransactionCharts from './TransactionCharts';
import RecentActivity from './RecentActivity';

interface DashboardContentProps {
  transactions: Transaction[];
  setActivePage: (page: string) => void;
}
// const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

const DashboardContent: React.FC<DashboardContentProps> = ({ transactions, setActivePage }) => {
  // Aggregações com distinção explícita entre receita, despesa e pendentes
  const summary = useMemo(() => {
    const completed = transactions.filter((t) => t.status === 'completed');
    const pending = transactions.filter((t) => t.status === 'pending');

    const totals = completed.reduce(
      (acc, t) => {
        if (t.type === 'income') {
          acc.totalIncome += t.amount;
          acc.incomeCount += 1;
        } else {
          acc.totalExpense += t.amount;
          acc.expenseCount += 1;
        }
        return acc;
      },
      { totalIncome: 0, totalExpense: 0, incomeCount: 0, expenseCount: 0, balance: 0, netPct: 0, avgIncome: 0, avgExpense: 0 }
    );

    const pendingTotals = pending.reduce(
      (acc, t) => {
        acc.pendingCount += 1;
        acc.pendingTotal += t.amount;
        return acc;
      },
      { pendingCount: 0, pendingTotal: 0 }
    );

    totals.balance = totals.totalIncome - totals.totalExpense;
    totals.netPct = totals.totalIncome > 0 ? (totals.balance / totals.totalIncome) * 100 : 0;
    totals.avgIncome = totals.incomeCount ? totals.totalIncome / totals.incomeCount : 0;
    totals.avgExpense = totals.expenseCount ? totals.totalExpense / totals.expenseCount : 0;

    return { ...totals, ...pendingTotals };
  }, [transactions]);

  return (
    <div className="space-y-8 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <SummaryCard
          title="Receita Total"
          value={summary.totalIncome}
          subtitle={`${summary.incomeCount} transações`}
          icon={ICONS.income}
          variant="positive"
        />
        <SummaryCard
          title="Despesa Total"
          value={summary.totalExpense}
          subtitle={`${summary.expenseCount} transações`}
          icon={ICONS.expense}
          variant="negative"
        />
        <SummaryCard
          title="Saldo Atual"
          value={summary.balance}
          subtitle={`${summary.netPct.toFixed(1)}% líquido`}
          icon={ICONS.balance}
          variant={summary.balance >= 0 ? 'positive' : 'negative'}
        />
        <SummaryCard
          title="Transações Pendentes"
          value={summary.pendingTotal}
          subtitle={`${summary.pendingCount} transações`}
          icon={ICONS.transactions}
          variant="negative"
        />
      </div>

      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-[0_8px_36px_rgba(12,12,16,0.06)] transition">
        <h3 className="text-sm text-gray-500 mb-4">Fluxo</h3>
        <TransactionCharts data={transactions} />
      </div>

      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-[0_8px_36px_rgba(12,12,16,0.06)] transition">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Atividade recente</h3>
          <button
            onClick={() => setActivePage('transactions')}
            className="text-sm text-sky-600 hover:underline"
            aria-label="Ver todas transações"
          >
            Ver todas
          </button>
        </div>
        <RecentActivity transactions={transactions} setActivePage={setActivePage} />
      </div>
    </div>
  );
};

export default DashboardContent;
