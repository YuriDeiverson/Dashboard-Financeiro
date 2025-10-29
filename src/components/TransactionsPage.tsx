import React from "react";
import { Transaction } from "../utils/types";
import TransactionTable from "./TransactionTable";

interface TransactionsPageProps {
  transactions: Transaction[];
}

const TransactionsPage: React.FC<TransactionsPageProps> = ({
  transactions,
}) => {
  return (
    <div className="space-y-6">
      <TransactionTable
        transactions={transactions}
        title="Histórico de Transações"
      />
    </div>
  );
};

export default TransactionsPage;
