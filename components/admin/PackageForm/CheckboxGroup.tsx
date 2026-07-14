'use client';

import { cn } from '@/lib/utils';

export interface CheckboxOption {
  id: string;
  name: string;
  badge?: string;
}

/**
 * A multi-select list of checkboxes.
 */
export default function CheckboxGroup({
  legend,
  options,
  selected,
  onToggle,
  name,
  columns = 3,
}: {
  legend: string;
  options: CheckboxOption[];
  selected: string[];
  onToggle: (id: string) => void;
  name: string;
  columns?: 2 | 3;
}) {
  return (
    <fieldset>
      <legend className="sr-only">{legend}</legend>

      <div
        className={cn(
          'grid gap-2 sm:grid-cols-2',
          columns === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'
        )}
      >
        {options.map((option) => {
          const isChecked = selected.includes(option.id);

          return (
            <label
              key={option.id}
              className={cn(
                'flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 transition-colors',
                isChecked
                  ? 'border-brand-dark bg-brand-lightest/40'
                  : 'border-gray-200 hover:border-brand-medium'
              )}
            >
              <input
                type="checkbox"
                name={name}
                value={option.id}
                checked={isChecked}
                onChange={() => onToggle(option.id)}
                className="accent-[color:var(--logo-forest)]"
              />
              <span className="text-sm text-brand-darkest">{option.name}</span>

              {option.badge && (
                <span className="ml-auto rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">
                  {option.badge}
                </span>
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
