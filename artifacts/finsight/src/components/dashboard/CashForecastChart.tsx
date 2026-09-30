import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { compact, inr } from "@/lib/financials";

interface ForecastItem {
  days: number;
  label: string;
  inflow: number;
  outflow: number;
  balance: number;
}

interface CashForecastChartProps {
  data: ForecastItem[];
  height?: number;
}

function ForecastTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-white/[0.1] bg-[#111722]/95 p-3 shadow-2xl backdrop-blur-xl text-xs space-y-2">
        <div className="font-semibold text-zinc-300 border-b border-white/[0.08] pb-1">
          {label} Forecast
        </div>
        <div className="space-y-1">
          <div className="flex justify-between gap-4">
            <span className="flex items-center gap-1.5 text-zinc-400">
              <span className="size-2 rounded-full bg-emerald-400" />
              Expected Inflow:
            </span>
            <span className="font-mono font-semibold text-emerald-400">
              {inr(payload[0]?.value ?? 0)}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="flex items-center gap-1.5 text-zinc-400">
              <span className="size-2 rounded-full bg-rose-400" />
              Expected Outflow:
            </span>
            <span className="font-mono font-semibold text-rose-400">
              {inr(payload[1]?.value ?? 0)}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export function CashForecastChart({
  data,
  height = 200,
}: CashForecastChartProps) {
  return (
    <div className="w-full space-y-4">
      <div style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            barGap={4}
          >
            <CartesianGrid vertical={false} stroke="rgba(255, 255, 255, 0.06)" strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#94A3B8" }}
              dy={6}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => compact(v)}
              tick={{ fontSize: 10, fill: "#94A3B8" }}
            />
            <Tooltip content={<ForecastTooltip />} />
            <Bar
              dataKey="inflow"
              name="Inflow"
              fill="#10B981"
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            />
            <Bar
              dataKey="outflow"
              name="Outflow"
              fill="#EF4444"
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 30/60/90 cards overview */}
      <div className="grid grid-cols-3 gap-2.5 pt-2">
        {data.map((item) => {
          const isPositive = item.balance >= 0;
          return (
            <div
              key={item.days}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5 text-center"
            >
              <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                {item.label}
              </div>
              <div
                className={`mt-1 font-mono text-xs sm:text-sm font-bold ${
                  isPositive ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {compact(item.balance)}
              </div>
              <div className="text-[10px] text-zinc-400">
                {isPositive ? "Healthy buffer" : "Deficit alert"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
