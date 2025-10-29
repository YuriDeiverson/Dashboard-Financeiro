import React, { useState, useMemo, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useFilters } from "../hooks/useFilters";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { loadExternalTransactions } from "../utils/transactionsLoader";
import { Transaction } from "../utils/types";
import DashboardContent from "./DashboardContent";
import TransactionsPage from "./TransactionsPage";

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { filters, setFilters } = useFilters();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activePage, setActivePageState] = useState<
    "dashboard" | "transactions" | "goals" | "budgets"
  >("dashboard");
  const setActivePage = (page: string) =>
    setActivePageState(
      page as "dashboard" | "transactions" | "goals" | "budgets",
    );

  // Data state
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        const transactionDate = new Date(t.date);
        const startDate = new Date(filters.startDate);
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);

        const dateMatch =
          transactionDate >= startDate && transactionDate <= endDate;
        const accountMatch = filters.accounts.includes(t.account);
        const industryMatch = filters.industries.includes(t.industry);
        const stateMatch = filters.states.length
          ? filters.states.includes(
              (t as unknown as { state?: string }).state || "",
            )
          : true;
        const typeMatch =
          filters.txType && filters.txType !== "all"
            ? filters.txType === t.type
            : true;
        const statusMatch =
          filters.status === "all" || filters.status === t.status;

        return (
          dateMatch &&
          accountMatch &&
          industryMatch &&
          stateMatch &&
          statusMatch &&
          typeMatch
        );
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, filters]);

  // Load external dataset (transactions.json) on mount
  React.useEffect(() => {
    let mounted = true;
    loadExternalTransactions()
      .then((list) => {
        if (!mounted) return;
        setTransactions(list);

        // update filters so dataset items are included (accounts, industries, and date range)
        try {
          const accounts = Array.from(
            new Set(list.map((t) => t.account)),
          ).slice(0, 200);
          const industries = Array.from(
            new Set(list.map((t) => t.industry)),
          ).slice(0, 200);
          const states = Array.from(
            new Set(
              list.map((t) => (t as unknown as { state?: string }).state),
            ),
          ).slice(0, 200);
          const dates = list
            .map((t) => new Date(t.date).getTime())
            .filter(Boolean);
          const min = new Date(Math.min(...dates));
          const max = new Date(Math.max(...dates));
          const minIso = min.toISOString().split("T")[0];
          const maxIso = max.toISOString().split("T")[0];

          setFilters((prev) => ({
            ...prev,
            accounts,
            industries,
            states,
            startDate: minIso,
            endDate: maxIso,
          }));
        } catch (e) {
          // ignore filter setup errors
          console.error(
            "Failed to adjust filters after loading external transactions",
            e,
          );
        }
      })
      .catch((err) => {
        // keep empty list on failure but log for developer
        console.error("Failed to load external transactions", err);
      });
    return () => {
      mounted = false;
    };
  }, [setFilters]);

  const statesOptions = useMemo(
    () =>
      Array.from(
        new Set(
          transactions.map(
            (t) => (t as unknown as { state?: string }).state || "",
          ),
        ),
      ).filter(Boolean),
    [transactions],
  );

  // Compute accounts filtered by currently selected states
  const filteredAccountsOptions = useMemo(() => {
    if (!filters.states || filters.states.length === 0) {
      return Array.from(new Set(transactions.map((t) => t.account)));
    }
    const set = new Set<string>();
    transactions.forEach((t) => {
      const st = (t as unknown as { state?: string }).state || "";
      if (filters.states.includes(st)) set.add(t.account);
    });
    return Array.from(set);
  }, [transactions, filters.states]);

  // When available accounts change because of state selection, adjust selected accounts:
  useEffect(() => {
    const available = filteredAccountsOptions;
    setFilters((prev) => {
      if (!available.length) return prev; // don't clobber if no available accounts
      const intersection = prev.accounts.filter((a) => available.includes(a));
      if (intersection.length) return { ...prev, accounts: intersection };
      return { ...prev, accounts: available };
    });
  }, [filteredAccountsOptions, setFilters]);

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return (
          <DashboardContent
            transactions={filteredTransactions}
            setActivePage={setActivePage}
          />
        );
      case "transactions":
        return <TransactionsPage transactions={filteredTransactions} />;
      case "goals":
      case "budgets":
    }
  };

  return (
    <div className="flex h-screen bg-[#f6f7f8] text-gray-900 font-sans">
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        logout={logout}
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          user={user}
          toggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          accountsOptions={filteredAccountsOptions}
          statesOptions={statesOptions}
        />

        <main className="flex-1 overflow-y-auto px-8 py-6">
          <div className="w-full">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
