import React from 'react';

interface SummaryCardProps {
  title: string;
  value: number;
  subtitle?: string;
  icon?: React.ReactNode;
  variant?: 'positive' | 'negative' | 'neutral';
}

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, subtitle, icon, variant = 'neutral' }) => {
  const isPositive = variant === 'positive';
  const isNegative = variant === 'negative';

  const accent = isPositive ? 'text-emerald-600' : isNegative ? 'text-rose-600' : 'text-sky-600';
  const bg = isPositive ? 'bg-emerald-50/40' : isNegative ? 'bg-rose-50/30' : 'bg-sky-50/30';
  const border = isPositive ? 'border-emerald-100' : isNegative ? 'border-rose-100' : 'border-sky-100';

  return (
    <div className={`rounded-2xl p-4 backdrop-blur-md shadow-[0_4px_18px_rgba(12,12,16,0.04)] bg-white/80 border ${border} transition`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500">{title}</p>
          <div className="mt-2 flex items-baseline gap-3">
            <h3 className={`text-2xl font-semibold ${value >= 0 ? 'text-gray-900' : 'text-gray-900'}`}>
              {currency.format(value)}
            </h3>
            {/* small indicator */}
            <span className={`text-xs font-medium ${accent} bg-white/0 rounded-full`}>
              {isPositive ? '↑ Receita' : isNegative ? '↓ Despesa' : '•'}
            </span>
          </div>
          {subtitle && <p className="mt-2 text-sm text-gray-500">{subtitle}</p>}
        </div>

        {icon ? (
          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${bg}`}>
            {icon}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SummaryCard;
