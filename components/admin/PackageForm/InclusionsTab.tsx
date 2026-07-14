'use client';

import { useFormContext, useWatch } from 'react-hook-form';
import { Check, X } from 'lucide-react';
import DynamicIcon from '@/components/ui/DynamicIcon';
import { isIconName } from '@/lib/icons';
import { cn } from '@/lib/utils';
import type {
  PackageFormInput,
  PackageFormOutput,
} from '@/lib/validations/package.schema';
import ChecklistEditor from './ChecklistEditor';
import FormSection from './FormSection';
import type { ChecklistItem } from './inclusions';

export default function InclusionsTab() {
  const { control } = useFormContext<PackageFormInput, unknown, PackageFormOutput>();

  const inclusions = useWatch({ control, name: 'inclusions' }) ?? [];
  const exclusions = useWatch({ control, name: 'exclusions' }) ?? [];

  return (
    <div className="space-y-6">
      <FormSection
        title="Inclusions & Exclusions"
        description="What the price covers, and what it doesn't. Both lists show on the package page in the order below."
      >
        <div className="grid gap-8 lg:grid-cols-2">
          <ChecklistEditor
            field="inclusions"
            title="What's included"
            addLabel="Add inclusion"
            emptyMessage="Nothing listed as included yet."
            placeholder="e.g. Airport transfers"
          />

          <ChecklistEditor
            field="exclusions"
            title="What's not included"
            addLabel="Add exclusion"
            emptyMessage="Nothing listed as excluded yet."
            placeholder="e.g. International flights"
          />
        </div>
      </FormSection>

      <FormSection
        title="Preview"
        description="How these lists will appear to a customer. Updates as you type."
      >
        <div className="grid gap-6 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:grid-cols-2">
          <PreviewList
            items={inclusions}
            heading="Included"
            tone="included"
            emptyMessage="No inclusions yet."
          />
          <PreviewList
            items={exclusions}
            heading="Not included"
            tone="excluded"
            emptyMessage="No exclusions yet."
          />
        </div>
      </FormSection>
    </div>
  );
}

function PreviewList({
  items,
  heading,
  tone,
  emptyMessage,
}: {
  items: ChecklistItem[];
  heading: string;
  tone: 'included' | 'excluded';
  emptyMessage: string;
}) {
  const isIncluded = tone === 'included';
  const FallbackIcon = isIncluded ? Check : X;

  return (
    <div>
      <p
        className={cn(
          'mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide',
          isIncluded ? 'text-brand-dark' : 'text-gray-500'
        )}
      >
        <FallbackIcon className="h-3.5 w-3.5" />
        {heading}
      </p>

      {items.length === 0 ? (
        <p className="text-sm text-gray-400">{emptyMessage}</p>
      ) : (
        <ul className="space-y-1.5">
          {items.map((item, index) => {
            const iconClasses = cn(
              'mt-0.5 h-4 w-4 shrink-0',
              isIncluded ? 'text-brand-dark' : 'text-gray-400'
            );

            return (
              <li key={index} className="flex items-start gap-2 text-sm">
                {isIconName(item.icon) ? (
                  <DynamicIcon name={item.icon} className={iconClasses} />
                ) : (
                  <FallbackIcon className={iconClasses} />
                )}
                <span
                  className={cn(
                    'text-brand-darkest',
                    !item.text && 'italic text-gray-400',
                    !isIncluded && 'text-gray-600 line-through decoration-gray-300'
                  )}
                >
                  {item.text || 'Empty item'}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
