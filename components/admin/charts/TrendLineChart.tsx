'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { AXIS_TICK, GRID_STROKE, SERIES_COLOR, TOOLTIP_STYLE } from './theme';

export interface TrendPoint {
  /** YYYY-MM-DD */
  date: string;
  count: number;
}

function shortDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'UTC' });
}

export default function TrendLineChart({ data, unit = 'leads' }: { data: TrendPoint[]; unit?: string }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -20 }}>
        <CartesianGrid stroke={GRID_STROKE} strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="date"
          tick={AXIS_TICK}
          tickFormatter={shortDate}
          axisLine={false}
          tickLine={false}
          minTickGap={28}
        />
        <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          cursor={{ stroke: GRID_STROKE, strokeWidth: 1 }}
          labelFormatter={(label) => shortDate(String(label))}
          formatter={(value) => [Number(value ?? 0), unit]}
        />
        <Line
          type="monotone"
          dataKey="count"
          stroke={SERIES_COLOR}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 2, stroke: '#ffffff' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
