import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { compact, inr } from "@/lib/financials";

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface SpendMixDonutProps {
  categories: CategoryData[];
  totalExpense?: number;
}

function DonutTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="rounded-xl border border-white/[0.1] bg-[#111722]/95 p-2.5 shadow-2xl backdrop-blur-xl text-xs space-y-1">
        <div className="flex items-center gap-1.5 font-semibold text-white">
          <span className="size-2 rounded-full" style={{ background: data.payload.color }} />
          <span>{data.name}</span>
        </div>
        <div className="font-mono text-zinc-300 font-bold">
          {inr(data.value)}
        </div>
      </div>
    );
  }
  return null;
}

export function SpendMixDonut({ categories }: SpendMixDonutProps) {
  if (!categories || categories.length === 0) return null;

  const total = categories.reduce((sum, c) => sum + c.value, 0);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      {/* Donut Chart */}
      <div className="relative h-[210px] w-full sm:w-1/2 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<DonutTooltip />} />
            <Pie
              data={categories}
              dataKey="value"
              nameKey="name"
              innerRadius={58}
              outerRadius={86}
              paddingAngle={4}
              stroke="rgba(17, 23, 34, 0.8)"
              strokeWidth={3}
            >
              {categories.map((c) => (
                <Cell key={c.name} fill={c.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Total Display */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
            Total Spend
          </div>
          <div className="font-display text-base font-bold text-white tabular-nums">
            {compact(total)}
          </div>
        </div>
      </div>

      {/* Legend list */}
      <div className="w-full sm:w-1/2 space-y-2.5">
        {categories.map((c) => {
          const pct = total > 0 ? Math.round((c.value / total) * 100) : 0;
          return (
            <div
              key={c.name}
              className="flex items-center justify-between text-xs rounded-lg p-1.5 hover:bg-white/[0.03] transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="size-2.5 rounded-full shrink-0 shadow-sm"
                  style={{ background: c.color }}
                />
                <span className="truncate text-zinc-300 font-medium">
                  {c.name}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-zinc-500 font-mono text-[11px]">{pct}%</span>
                <span className="font-mono font-semibold text-white">
                  {compact(c.value)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
