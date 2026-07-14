'use client';

import { useController, useFormContext } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import FieldError from '@/components/admin/FieldError';
import { cn } from '@/lib/utils';
import type {
  PackageFormInput,
  PackageFormOutput,
} from '@/lib/validations/package.schema';
import IconSelect from './IconSelect';
import { INPUT_CLASSES } from './fields';
import { type ChecklistField, createItem } from './inclusions';
import { useOrderedFieldArray } from './useOrderedFieldArray';

export default function ChecklistEditor({
  field,
  title,
  addLabel,
  emptyMessage,
  placeholder,
}: {
  field: ChecklistField;
  title: string;
  addLabel: string;
  emptyMessage: string;
  placeholder: string;
}) {
  const { formState } = useFormContext<PackageFormInput, unknown, PackageFormOutput>();

  const { fields, append, removeAt } = useOrderedFieldArray(field);

  const errors = formState.errors[field];

  const addItem = () => append(createItem(field, fields.length));

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h4 className="text-sm font-semibold text-brand-darkest">{title}</h4>
        <span className="text-xs text-gray-400">
          {fields.length} {fields.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {fields.length === 0 ? (
        <p className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
          {emptyMessage}
        </p>
      ) : (
        <ul className="space-y-2">
          {fields.map((item, index) => (
            <ChecklistRow
              key={item.id}
              field={field}
              index={index}
              placeholder={placeholder}
              onRemove={() => removeAt(index)}
            />
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={addItem}
        className="mt-3 inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-brand-dark transition-colors hover:bg-brand-lightest/40"
      >
        <Plus className="h-4 w-4" />
        {addLabel}
      </button>

      <FieldError message={typeof errors?.message === 'string' ? errors.message : undefined} />
    </div>
  );
}

function ChecklistRow({
  field,
  index,
  placeholder,
  onRemove,
}: {
  field: ChecklistField;
  index: number;
  placeholder: string;
  onRemove: () => void;
}) {
  const { control, register, formState } = useFormContext<
    PackageFormInput,
    unknown,
    PackageFormOutput
  >();

  const { field: iconField } = useController({
    control,
    name: `${field}.${index}.icon`,
  });

  const rowErrors = formState.errors[field]?.[index];

  return (
    <li className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-2 sm:flex-row sm:items-start">
      <IconSelect
        id={`${field}-${index}-icon`}
        label={`Icon for item ${index + 1}`}
        value={iconField.value ?? ''}
        onChange={iconField.onChange}
        onBlur={iconField.onBlur}
      />

      <div className="flex-1">
        <input
          type="text"
          aria-label={`Text for item ${index + 1}`}
          placeholder={placeholder}
          {...register(`${field}.${index}.text`)}
          className={cn(INPUT_CLASSES, 'py-2')}
        />
        <FieldError message={rowErrors?.text?.message} />
      </div>

      <input
        type="hidden"
        {...register(`${field}.${index}.display_order`, { valueAsNumber: true })}
      />

      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove item ${index + 1}`}
        className="shrink-0 self-start rounded-md p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </li>
  );
}
