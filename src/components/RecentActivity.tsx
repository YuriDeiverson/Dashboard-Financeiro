import React from "react";
import { Transaction } from "../utils/types";
import { formatCurrency, formatDate } from "../utils/helpers";

interface RecentActivityProps {
  transactions: Transaction[];
  setActivePage: (page: string) => void;
}

const ActivityItem: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
  const isExpense = transaction.type === "expense";
  const amountColor = isExpense ? "text-rose-600" : "text-emerald-600";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 py-3 px-2 transition-all hover:bg-gray-50 rounded-xl group">
      <div className="flex flex-col min-w-0 flex-1">
        <p className="font-medium text-gray-900 truncate group-hover:text-gray-700 transition-colors">
          {transaction.description}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
          <span className={`text-xs px-2 py-1 rounded-full ${
            transaction.status === 'completed' 
              ? 'bg-emerald-100 text-emerald-700' 
              : 'bg-orange-100 text-orange-700'
          }`}>
            {transaction.status === 'completed' ? 'Completo' : 'Pendente'}
          </span>
        </div>
      </div>
      <div className="flex justify-between sm:justify-end items-center">
        <p className={`font-bold text-sm sm:text-base ${amountColor} group-hover:scale-105 transition-transform`}>
          {isExpense ? "−" : "+"} {formatCurrency(transaction.amount)}
        </p>
      </div>
    </div>
  );
};

const RecentActivity: React.FC<RecentActivityProps> = ({ transactions }) => {
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-1">
      {recentTransactions.length > 0 ? (
        <div className="space-y-1">
          {recentTransactions.map((t) => (
            <ActivityItem key={t.id} transaction={t} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">Nenhuma atividade recente</p>
          <p className="text-sm text-gray-400 mt-1">Suas transações aparecerão aqui</p>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
