'use client';

import { PieChart, Pie, Tooltip, ResponsiveContainer } from 'recharts';
import { CHART_SURFACE, TOOLTIP_STYLE } from './theme';

export interface PieSlice {
  name: string;
  value: number;
  color: string;
}

export default function CategoryPieChart({ data }: { data: PieSlice[] }) {
  const total = data.reduce((sum, slice) => sum + slice.value, 0);
  // Recharts 3 reads `fill` straight off each datum (Cell is deprecated).
  const plotted = data
    .filter((slice) => slice.value > 0)
    .map((slice) => ({ ...slice, fill: slice.color }));

  return (
    <div className="flex h-full flex-col items-center gap-2 sm:flex-row sm:gap-6">
      <div className="h-full min-h-0 w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={plotted}
              dataKey="value"
              nameKey="name"
              innerRadius="55%"
              outerRadius="85%"
              paddingAngle={2}
              stroke={CHART_SURFACE}
              strokeWidth={2}
            />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              formatter={(value, name) => {
                const count = Number(value ?? 0);
                const pct = total ? Math.round((count / total) * 100) : 0;
                return [`${count} (${pct}%)`, String(name)];
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className="w-full shrink-0 space-y-1.5 sm:w-44">
        {data.map((slice) => (
          <li key={slice.name} className="flex items-center gap-2 text-sm">
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ backgroundColor: slice.color }}
            />
            <span className="flex-1 truncate text-gray-600">{slice.name}</span>
            <span className="font-semibold text-brand-darkest">{slice.value}</span>
            <span className="w-10 text-right text-xs text-gray-400">
              {total ? Math.round((slice.value / total) * 100) : 0}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
