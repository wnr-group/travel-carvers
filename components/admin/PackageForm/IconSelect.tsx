'use client';

import DynamicIcon from '@/components/ui/DynamicIcon';
import { ICON_NAMES, isIconName } from '@/lib/icons';
import { cn } from '@/lib/utils';

export default function IconSelect({
  value,
  onChange,
  onBlur,
  id,
  label,
  disabled,
}: {
  value: string;
  onChange: (icon: string) => void;
  onBlur?: () => void;
  id?: string;
  label: string;
  disabled?: boolean;
}) {
  const isKnown = isIconName(value);

  return (
    <div className="flex items-center gap-2">
      <span
        aria-hidden="true"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-brand-dark"
      >
        {isKnown ? (
          <DynamicIcon name={value} className="h-4 w-4" />
        ) : (
          <span className="text-xs text-gray-400">—</span>
        )}
      </span>

      <select
        id={id}
        aria-label={label}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        className={cn(
          'w-36 rounded-lg border border-gray-300 bg-white px-2 py-2 text-sm text-gray-900',
          'focus:outline-none focus:ring-2 focus:ring-brand-medium disabled:opacity-50'
        )}
      >

        {value && !isKnown && <option value={value}>{value} (unknown)</option>}

        {ICON_NAMES.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}
