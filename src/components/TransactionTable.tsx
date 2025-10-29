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
    <tr className="hover:bg-gray-50 transition">
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
    <div className="rounded-2xl bg-white/90 backdrop-blur-md p-6 shadow-[0_8px_36px_rgba(12,12,16,0.04)]">
      <h3 className="text-lg font-medium mb-4">{title}</h3>

      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left text-xs text-gray-500 uppercase tracking-wide">
              <th className="p-3">Descrição</th>
              <th className="p-3">Data</th>
              <th className="p-3">Valor</th>
              <th className="p-3">Conta</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((t) => <TransactionRow key={t.id} transaction={t} />)
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  Nenhuma transação encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {transactions.length > itemsPerPage && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}
    </div>
  );
};

export default TransactionTable;
