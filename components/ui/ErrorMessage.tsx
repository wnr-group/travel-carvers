'use client';

import { AlertCircle, AlertTriangle, Info, RefreshCw, type LucideIcon } from 'lucide-react';

export type ErrorVariant = 'info' | 'warning' | 'error';

const VARIANTS: Record<ErrorVariant, { Icon: LucideIcon; iconClass: string; role: 'status' | 'alert' }> = {
  info: { Icon: Info, iconClass: 'text-brand-medium', role: 'status' },
  warning: { Icon: AlertTriangle, iconClass: 'text-amber-500', role: 'alert' },
  error: { Icon: AlertCircle, iconClass: 'text-red-500', role: 'alert' },
};

interface ErrorMessageProps {
  title?: string;
  message?: string;
  /** When provided, renders a retry button that calls this. */
  retry?: () => void;
  retryLabel?: string;
  /** Override the variant's default icon. */
  icon?: LucideIcon;
  variant?: ErrorVariant;
  className?: string;
}

/**
 * Friendly, reusable error panel. Screen-reader announced (assertive for warning/error,
 * polite for info). Uses centralized brand tokens.
 */
export default function ErrorMessage({
  title,
  message = 'Something went wrong. Please try again.',
  retry,
  retryLabel = 'Try again',
  icon,
  variant = 'error',
  className = '',
}: ErrorMessageProps) {
  const v = VARIANTS[variant];
  const Icon = icon ?? v.Icon;

  return (
    <div
      role={v.role}
      aria-live={v.role === 'alert' ? 'assertive' : 'polite'}
      className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-brand-light bg-white/60 px-6 py-12 text-center ${className}`}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-lightest">
        <Icon className={`h-7 w-7 ${v.iconClass}`} aria-hidden="true" />
      </div>
      {title && <h3 className="mb-1 text-base font-semibold text-brand-darkest">{title}</h3>}
      <p className="max-w-sm text-sm text-brand-medium">{message}</p>
      {retry && (
        <button
          type="button"
          onClick={retry}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-brand-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          {retryLabel}
        </button>
      )}
    </div>
  );
}
