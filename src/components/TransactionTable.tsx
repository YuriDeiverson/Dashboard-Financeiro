import React, { useState, useMemo } from "react";
import { Transaction } from "../utils/types";
import { formatCurrency, formatDate } from "../utils/helpers";
import Pagination from "./Pagination";

interface TransactionTableProps {
  transactions: Transaction[];
  title: string;
  itemsPerPage?: number;
}

const TransactionRow: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
  const isExpense = transaction.type === "expense";
  const amountClass = isExpense ? "text-rose-600" : "text-emerald-600";

  const statusBadge =
    transaction.status === "completed"
      ? "bg-emerald-50 text-emerald-700"
      : "bg-amber-50 text-amber-700";

  return (
    <>
      {/* Desktop Row */}
      <tr className="hover:bg-gray-50 transition hidden md:table-row">
        <td className="py-4 px-3">
          <div className="font-medium text-gray-900">{transaction.description}</div>
          <div className="text-sm text-gray-500">{transaction.category}</div>
        </td>
        <td className="py-4 px-3 text-sm text-gray-600">{formatDate(transaction.date)}</td>
        <td className={`py-4 px-3 font-semibold ${amountClass}`}>
          {isExpense ? '−' : '+'} {formatCurrency(transaction.amount)}
        </td>
        <td className="py-4 px-3 text-sm text-gray-600">{transaction.account}</td>
        <td className="py-4 px-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge}`}>
            {transaction.status === "completed" ? "Completo" : "Pendente"}
          </span>
        </td>
      </tr>

      {/* Mobile Card */}
      <tr className="md:hidden">
        <td colSpan={5} className="p-0">
          <div className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate">{transaction.description}</h4>
                <p className="text-sm text-gray-500">{transaction.category}</p>
              </div>
              <div className="ml-4 text-right">
                <p className={`font-bold ${amountClass}`}>
                  {isExpense ? '−' : '+'} {formatCurrency(transaction.amount)}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">{formatDate(transaction.date)}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-500">{transaction.account}</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusBadge}`}>
                {transaction.status === "completed" ? "Completo" : "Pendente"}
              </span>
            </div>
          </div>
        </td>
      </tr>
    </>
  );
};

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, title, itemsPerPage = 10 }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return transactions.slice(startIndex, startIndex + itemsPerPage);
  }, [transactions, currentPage, itemsPerPage]);

  const totalPages = Math.max(1, Math.ceil(transactions.length / itemsPerPage));

  return (
    <div className="rounded-2xl bg-white/90 backdrop-blur-md p-4 sm:p-6 shadow-[0_8px_36px_rgba(12,12,16,0.04)]">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left text-xs text-gray-500 uppercase tracking-wide border-b border-gray-200">
              <th className="p-3">Descrição</th>
              <th className="p-3">Data</th>
              <th className="p-3">Valor</th>
              <th className="p-3">Conta</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((t) => <TransactionRow key={t.id} transaction={t} />)
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="font-medium">Nenhuma transação encontrada</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile List */}
      <div className="md:hidden">
        {paginatedTransactions.length > 0 ? (
          <div className="space-y-0 -mx-4">
            <table className="w-full">
              <tbody>
                {paginatedTransactions.map((t) => (
                  <TransactionRow key={t.id} transaction={t} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="flex flex-col items-center gap-3">
              <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <div>
                <p className="font-medium text-gray-900">Nenhuma transação encontrada</p>
                <p className="text-sm text-gray-500 mt-1">Ajuste os filtros para ver mais resultados</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {transactions.length > itemsPerPage && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}
    </div>
  );
};

export default TransactionTable;
