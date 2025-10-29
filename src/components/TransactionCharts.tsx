import React, { useMemo, useState, useEffect } from "react";
import { Transaction } from "../utils/types";
import { formatCurrency } from "../utils/helpers";
import { useFilters } from "../hooks/useFilters";

type RechartsModule = typeof import("recharts");

interface TransactionChartsProps {
  data: Transaction[];
}

type TooltipPayload = {
  dataKey?: string;
  color?: string;
  name?: string;
  value?: number;
};

const CustomTooltipComponent: React.FC<{
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string | number | null;
}> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        role="tooltip"
        aria-live="polite"
        className="rounded-lg p-3 bg-white shadow-md text-xs"
      >
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((pld: TooltipPayload, i: number) => (
          <p
            key={`${pld.dataKey ?? pld.name}-${i}`}
            style={{ color: pld.color }}
            className="text-xs"
          >
            {`${pld.name}: ${formatCurrency(pld.value ?? 0)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const CustomTooltip = React.memo(CustomTooltipComponent);

const TransactionCharts: React.FC<TransactionChartsProps> = ({ data }) => {
  const [recharts, setRecharts] = useState<RechartsModule | null>(null);
  const { filters } = useFilters();

  useEffect(() => {
    let mounted = true;
    import("recharts")
      .then((mod) => {
        if (mounted) setRecharts(mod);
      })
      .catch(() => {
        // ignore
      });
    return () => {
      mounted = false;
    };
  }, []);

  const barChartData = useMemo(() => {
    // Efficient aggregation with downsampling: daily, weekly or monthly buckets
    const startDate = filters.startDate ? new Date(filters.startDate) : null;
    const endDate = filters.endDate ? new Date(filters.endDate) : null;

    // determine window
    let startTs: number;
    let endTs: number;
    if (startDate && endDate) {
      const s = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate(),
      );
      const e = new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate(),
      );
      startTs = s.getTime();
      endTs = e.getTime() + 24 * 60 * 60 * 1000 - 1;
    } else {
      // fallback: last 30 days anchored to dataset max
      let maxTs = Date.now();
      for (let i = 0; i < data.length; i++) {
        const d = Date.parse(data[i].date);
        if (!isNaN(d) && d > maxTs) maxTs = d;
      }
      const e = new Date(maxTs);
      endTs =
        new Date(e.getFullYear(), e.getMonth(), e.getDate()).getTime() +
        24 * 60 * 60 * 1000 -
        1;
      const s = new Date(endTs);
      s.setDate(s.getDate() - 29);
      startTs = new Date(s.getFullYear(), s.getMonth(), s.getDate()).getTime();
    }

    const dayCount = Math.max(
      1,
      Math.ceil((endTs - startTs + 1) / (1000 * 60 * 60 * 24)),
    );

    // choose granularity based on dayCount to limit number of points (target <= 120)
    let granularity: "day" | "week" | "month" = "day";
    if (dayCount > 180) granularity = "week";
    if (dayCount > 900) granularity = "month";

    const bucketMap = new Map<
      string,
      { dateLabel: string; income: number; expense: number; ts: number }
    >();

    const pushToBucket = (ts: number, income: number, expense: number) => {
      let key = "";
      const d = new Date(ts);
      if (granularity === "day") {
        key = d.toISOString().split("T")[0];
      } else if (granularity === "week") {
        // week starting Monday
        const day = d.getDay();
        const diff = (day + 6) % 7; // days to subtract to get Monday
        const wkStart = new Date(d);
        wkStart.setDate(d.getDate() - diff);
        key = wkStart.toISOString().split("T")[0];
      } else {
        key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      }

      const existing = bucketMap.get(key);
      if (existing) {
        existing.income += income;
        existing.expense += expense;
      } else {
        bucketMap.set(key, { dateLabel: key, income, expense, ts });
      }
    };

    // Single pass aggregation to buckets (fast, no array filter allocations)
    for (let i = 0; i < data.length; i++) {
      const t = data[i];
      const ts = Date.parse(t.date);
      if (isNaN(ts)) continue;
      if (ts < startTs || ts > endTs) continue;
      if (t.status !== "completed") continue;
      if (filters.accounts.length && !filters.accounts.includes(t.account))
        continue;
      if (filters.states && filters.states.length) {
        const st = (t as unknown as { state?: string }).state || "";
        if (!filters.states.includes(st)) continue;
      }

      // honor transaction type filter
      if (
        filters.txType &&
        filters.txType !== "all" &&
        t.type !== filters.txType
      )
        continue;
      if (t.type === "income") pushToBucket(ts, t.amount, 0);
      else pushToBucket(ts, 0, t.amount);
    }

    // convert map to sorted array by ts (ascending)
    const entries = Array.from(bucketMap.entries())
      .map(([, v]) => v)
      .sort((a, b) => a.ts - b.ts);

    return entries.map((e) => ({
      day: e.dateLabel,
      label: e.dateLabel,
      income: e.income,
      expense: e.expense,
    }));
  }, [
    data,
    filters.startDate,
    filters.endDate,
    filters.accounts,
    filters.states,
    filters.txType,
  ]);

  const lineChartData = useMemo(() => {
    // cumulative net aggregated on same bucket cadence as barChartData (day/week/month)
    const startDate = filters.startDate ? new Date(filters.startDate) : null;
    const endDate = filters.endDate ? new Date(filters.endDate) : null;
    let startTs: number;
    let endTs: number;
    if (startDate && endDate) {
      const s = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate(),
      );
      const e = new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate(),
      );
      startTs = s.getTime();
      endTs = e.getTime() + 24 * 60 * 60 * 1000 - 1;
    } else {
      let maxTs = Date.now();
      for (let i = 0; i < data.length; i++) {
        const d = Date.parse(data[i].date);
        if (!isNaN(d) && d > maxTs) maxTs = d;
      }
      const e = new Date(maxTs);
      endTs =
        new Date(e.getFullYear(), e.getMonth(), e.getDate()).getTime() +
        24 * 60 * 60 * 1000 -
        1;
      const s = new Date(endTs);
      s.setDate(s.getDate() - 29);
      startTs = new Date(s.getFullYear(), s.getMonth(), s.getDate()).getTime();
    }

    const dayCount = Math.max(
      1,
      Math.ceil((endTs - startTs + 1) / (1000 * 60 * 60 * 24)),
    );
    let granularity: "day" | "week" | "month" = "day";
    if (dayCount > 180) granularity = "week";
    if (dayCount > 900) granularity = "month";

    const bucketNet = new Map<string, number>();

    const getBucketKey = (ts: number) => {
      const d = new Date(ts);
      if (granularity === "day") return d.toISOString().split("T")[0];
      if (granularity === "week") {
        const day = d.getDay();
        const diff = (day + 6) % 7;
        const wkStart = new Date(d);
        wkStart.setDate(d.getDate() - diff);
        return wkStart.toISOString().split("T")[0];
      }
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    };

    for (let i = 0; i < data.length; i++) {
      const t = data[i];
      const ts = Date.parse(t.date);
      if (isNaN(ts)) continue;
      if (ts < startTs || ts > endTs) continue;
      if (t.status !== "completed") continue;
      if (filters.accounts.length && !filters.accounts.includes(t.account))
        continue;
      if (filters.states && filters.states.length) {
        const st = (t as unknown as { state?: string }).state || "";
        if (!filters.states.includes(st)) continue;
      }
      if (
        filters.txType &&
        filters.txType !== "all" &&
        t.type !== filters.txType
      )
        continue;

      const key = getBucketKey(ts);
      const delta = t.type === "income" ? t.amount : -t.amount;
      bucketNet.set(key, (bucketNet.get(key) || 0) + delta);
    }

    const keys = Array.from(bucketNet.keys()).sort(
      (a, b) => Date.parse(a) - Date.parse(b),
    );
    let running = 0;
    return keys.map((k) => {
      running += bucketNet.get(k) || 0;
      return {
        date: k,
        label: new Date(k).toLocaleDateString(undefined, {
          day: "2-digit",
          month: "short",
        }),
        net: running,
      };
    });
  }, [
    data,
    filters.accounts,
    filters.states,
    filters.startDate,
    filters.endDate,
    filters.txType,
  ]);

  if (!recharts) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-[300px] rounded-lg bg-gray-100 animate-pulse" />
        <div className="h-[300px] rounded-lg bg-gray-100 animate-pulse" />
      </div>
    );
  }

  const {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
  } = (recharts ?? ({} as RechartsModule)) as unknown as RechartsModule;

  const hasBarChartData = barChartData.length > 0;
  const hasLineChartData = lineChartData.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium">Receitas vs Despesas</h3>
        </div>
        {hasBarChartData ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={barChartData}
              margin={{ top: 5, right: 20, left: 50, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e6edf2"
              />
              <XAxis
                dataKey="label"
                tick={{ fill: "#6b7280" }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("pt-BR", {
                    day: "numeric",
                    month: "numeric",
                  });
                }}
              />
              <YAxis
                tickFormatter={(v) => formatCurrency(v as number)}
                tick={{ fill: "#6b7280" }}
                axisLine={false}
                tickLine={false}
                width={60}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, marginTop: "20px" }} />
              {/* stacked bars */}
              <Bar
                dataKey="income"
                name="Receitas"
                fill="#059669"
                stackId="a"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="expense"
                name="Despesas"
                fill="#ef4444"
                stackId="a"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-400">
            Sem dados suficientes
          </div>
        )}
      </div>

      <div className="rounded-lg">
        <h3 className="text-lg font-medium mb-4">Fluxo de Caixa Acumulado</h3>
        {hasLineChartData ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={lineChartData}
              margin={{ top: 5, right: 20, left: 50, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e6edf2"
              />
              <XAxis
                dataKey="label"
                tick={{ fill: "#6b7280" }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("pt-BR", {
                    day: "numeric",
                    month: "numeric",
                  });
                }}
              />
              <YAxis
                tickFormatter={(v) => formatCurrency(v as number)}
                tick={{ fill: "#6b7280" }}
                axisLine={false}
                tickLine={false}
                width={60}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, marginTop: "20px" }} />
              {/* net cumulative cash flow */}
              <Line
                type="monotone"
                dataKey="net"
                name="Fluxo Acumulado"
                stroke="#2563eb"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-400">
            Sem dados suficientes
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionCharts;
