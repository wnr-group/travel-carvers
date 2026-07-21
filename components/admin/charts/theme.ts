/**
 * Centralized chart theme for the admin dashboard.
 */

/** Fixed lead-status → color mapping. Green = converted, on brand. */
export const STATUS_COLORS: Record<string, string> = {
  new: '#2a78d6', // blue
  contacted: '#eda100', // yellow
  qualified: '#e87ba4', // magenta
  converted: '#008300', // green
};

export const STATUS_LABELS: Record<string, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  converted: 'Converted',
};

/** Single-series marks (bars, lines) use the brand forest green. ~6:1 on white. */
export const SERIES_COLOR = 'var(--logo-forest, #2D5F2D)';

/** Recessive scaffolding — grid and axis text never compete with the marks. */
export const GRID_STROKE = '#e5e7eb';

/** Surface colour charts punch through with (slice borders, active dots). */
export const CHART_SURFACE = '#ffffff';

/** Fallback for an unmapped series. */
export const CHART_MUTED = '#6b7280';
export const AXIS_TICK = { fill: '#6b7280', fontSize: 12 } as const;

/** Shared tooltip surface, matching the admin card language. */
export const TOOLTIP_STYLE = {
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '0.5rem',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  fontSize: '12px',
  color: '#1f2937',
} as const;
