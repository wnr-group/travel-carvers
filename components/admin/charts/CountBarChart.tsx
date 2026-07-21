'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { AXIS_TICK, GRID_STROKE, SERIES_COLOR, TOOLTIP_STYLE } from './theme';

export interface BarDatum {
  name: string;
  count: number;
}

interface CountBarChartProps {
  data: BarDatum[];
  layout?: 'vertical' | 'horizontal';
  unit?: string;
}

export default function CountBarChart({ data, layout = 'vertical', unit = 'count' }: CountBarChartProps) {
  const horizontal = layout === 'horizontal';

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout={horizontal ? 'vertical' : 'horizontal'}
        margin={{ top: 4, right: 8, bottom: 0, left: horizontal ? 8 : -20 }}
        barCategoryGap="28%"
      >
        <CartesianGrid
          stroke={GRID_STROKE}
          strokeDasharray="3 3"
          horizontal={!horizontal}
          vertical={horizontal}
        />
        {horizontal ? (
          <>
            <XAxis type="number" tick={AXIS_TICK} axisLine={false} tickLine={false} allowDecimals={false} />
            <YAxis
              type="category"
              dataKey="name"
              tick={AXIS_TICK}
              axisLine={false}
              tickLine={false}
              width={120}
            />
          </>
        ) : (
          <>
            <XAxis dataKey="name" tick={AXIS_TICK} axisLine={false} tickLine={false} />
            <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} allowDecimals={false} />
          </>
        )}
        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          cursor={{ fill: 'rgba(0, 0, 0, 0.04)' }}
          formatter={(value) => [Number(value ?? 0), unit]}
        />
        <Bar
          dataKey="count"
          fill={SERIES_COLOR}
          radius={horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]}
          maxBarSize={28}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
