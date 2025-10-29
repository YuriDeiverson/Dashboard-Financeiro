/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { Filters } from "../utils/types";
import { availableAccounts, availableIndustries } from "../utils/mockData";

interface FiltersContextType {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  resetFilters: () => void;
}

const FiltersContext = createContext<FiltersContextType | undefined>(undefined);

const getInitialFilters = (): Filters => {
  try {
    const storedFilters = localStorage.getItem("filters");
    if (storedFilters) {
      return JSON.parse(storedFilters);
    }
  } catch (error) {
    console.error("Failed to parse filters from localStorage", error);
  }

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 30);

  return {
    startDate: startDate.toISOString().split("T")[0],
    endDate: endDate.toISOString().split("T")[0],
    accounts: [...availableAccounts],
    industries: [...availableIndustries],
    states: [],
    status: "all",
    txType: 'all',
  };
};

export const FiltersProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [filters, setFilters] = useState<Filters>(getInitialFilters);

  useEffect(() => {
    try {
      localStorage.setItem("filters", JSON.stringify(filters));
    } catch (error) {
      console.error("Failed to save filters to localStorage", error);
    }
  }, [filters]);

  const resetFilters = () => {
    setFilters(getInitialFilters());
  };

  return (
    <FiltersContext.Provider value={{ filters, setFilters, resetFilters }}>
      {children}
    </FiltersContext.Provider>
  );
};

export const useFilters = (): FiltersContextType => {
  const context = useContext(FiltersContext);
  if (context === undefined) {
    throw new Error("useFilters must be used within a FiltersProvider");
  }
  return context;
};
