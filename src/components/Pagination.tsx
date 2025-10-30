import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="w-full sm:w-auto px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        aria-label="Página anterior"
      >
        ← Anterior
      </button>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">
          Página <strong className="text-gray-800">{currentPage}</strong> de <strong>{totalPages}</strong>
        </span>
      </div>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="w-full sm:w-auto px-4 py-2 text-sm font-semibold text-white bg-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        aria-label="Próxima página"
      >
        Próxima →
      </button>
    </div>
  );
};

export default Pagination;
