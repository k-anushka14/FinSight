import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { inr } from "@/lib/financials";

interface MonthlyBucket {
  month: string;
  revenue: number;
  expenses: number;
  cash?: number;
}

interface RevenueExpenseChartProps {
  data: MonthlyBucket[];
  height?: number;
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-white/[0.1] bg-[#111722]/95 p-3 shadow-2xl backdrop-blur-xl text-xs space-y-1.5">
        <div className="font-semibold text-zinc-300 border-b border-white/[0.08] pb-1">
          {label}
        </div>
        {payload.map((item: any) => {
          const isRev = item.dataKey === "revenue";
          return (
            <div key={item.dataKey} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-zinc-400">
                <span
                  className="size-2 rounded-full"
                  style={{ background: isRev ? "#10B981" : "#F59E0B" }}
                />
                {isRev ? "Revenue" : "Expenses"}
              </span>
              <span className="font-mono font-bold text-white">
                {inr(item.value)}
              </span>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
}

export function RevenueExpenseChart({
  data,
  height = 280,
}: RevenueExpenseChartProps) {
  return (
    <div className="w-full" style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity={0.35} />
              <stop offset="90%" stopColor="#10B981" stopOpacity={0.01} />
            </linearGradient>
            <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.25} />
              <stop offset="90%" stopColor="#F59E0B" stopOpacity={0.01} />
            </linearGradient>
          </defs>

          <CartesianGrid vertical={false} stroke="rgba(255, 255, 255, 0.06)" strokeDasharray="3 3" />

          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#94A3B8" }}
            dy={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => (Number(v) >= 100000 ? `₹${(Number(v) / 100000).toFixed(1)}L` : `₹${v}`)}
            tick={{ fontSize: 10, fill: "#94A3B8" }}
          />

          <Tooltip content={<CustomTooltip />} />

          <Area
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke="#10B981"
            strokeWidth={2.5}
            fill="url(#revGrad)"
            activeDot={{ r: 5, fill: "#10B981", stroke: "#080B12", strokeWidth: 2 }}
          />
          <Area
            type="monotone"
            dataKey="expenses"
            name="Expenses"
            stroke="#F59E0B"
            strokeWidth={2}
            fill="url(#expGrad)"
            activeDot={{ r: 4, fill: "#F59E0B", stroke: "#080B12", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
