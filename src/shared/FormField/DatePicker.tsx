import { X } from 'lucide-react';
import React, { useMemo } from 'react';

import { Control, FieldValues, Path } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import FormErrorMessage from '@/shared/FormErrorMessage';

type DateInputMode = 'date' | 'datetime-local';

export type DateTimePickerFieldProps<FormType extends FieldValues> = {
  name: Path<FormType>;
  control: Control<FormType>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  /** If true, use datetime-local input so user can pick time too */
  showTime?: boolean;
  /** store form value as ISO string when true; otherwise Date | null (default: false) */
  storeAsISOString?: boolean;
  /** Minimum allowed date (Date or ISO string 'YYYY-MM-DD' / 'YYYY-MM-DDTHH:MM') */
  min?: Date | string;
  /** Maximum allowed date */
  max?: Date | string;
  /** If true, display a small clear (x) button to reset value */
  allowClear?: boolean;
  /** optional id for the input (defaults to generated from name) */
  id?: string;
};

/** Helpers: format Date -> input string (local) and parse back */
const pad2 = (n: number) => String(n).padStart(2, '0');

function formatDateForInput(d: Date, mode: DateInputMode) {
  const year = d.getFullYear();
  const month = pad2(d.getMonth() + 1);
  const day = pad2(d.getDate());
  if (mode === 'date') {
    return `${year}-${month}-${day}`;
  } else {
    // datetime-local expects local date/time without timezone suffix
    const hours = pad2(d.getHours());
    const minutes = pad2(d.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
}

/** Parse input string (from date/datetime-local) -> Date | null */
function parseInputValue(value: string, mode: DateInputMode): Date | null {
  if (!value) return null;
  // value for date: 'YYYY-MM-DD' -> treat as local midnight
  // for datetime-local: 'YYYY-MM-DDTHH:MM'
  // Create a Date using local values:
  if (mode === 'date') {
    // append T00:00:00 to interpret as local midnight
    const parsed = new Date(`${value}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return null;
    return parsed;
  } else {
    // For datetime-local, the browser gives a local time string: new Date(value) treats it as local
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return null;
    return parsed;
  }
}

/**
 * DateTimePickerField - native input-based date / datetime picker integrated with RHF
 *
 * By default it stores `Date | null` in the form. If you prefer ISO strings
 * set `storeAsISOString={true}` to store `.toISOString()` values instead.
 */
export function DateTimePickerField<FormType extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  required = false,
  className,
  showTime = false,
  storeAsISOString = false,
  min,
  max,
  allowClear = true,
  id,
}: DateTimePickerFieldProps<FormType>) {
  const inputMode: DateInputMode = showTime ? 'datetime-local' : 'date';

  // convert min/max props to strings suitable for the input element
  const minStr = useMemo(() => {
    if (!min) return undefined;
    if (typeof min === 'string') return min;
    return formatDateForInput(min, inputMode);
  }, [min, inputMode]);

  const maxStr = useMemo(() => {
    if (!max) return undefined;
    if (typeof max === 'string') return max;
    return formatDateForInput(max, inputMode);
  }, [max, inputMode]);

  const inputId = id ?? `date-${String(name)}`;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        // Accept various shapes from the form: Date | string | null
        // Normalize to input-friendly string
        const normalizeFieldValueToInput = (): string => {
          const v = field.value;
          if (v) {
            return formatDateForInput(v, inputMode);
          }
          if (typeof v === 'string' && v.length > 0) {
            // Attempt to parse a string (ISO or input-like). If parseable -> format to local input format.
            const maybe = new Date(v);
            if (!Number.isNaN(maybe.getTime())) {
              return formatDateForInput(maybe, inputMode);
            }
            // fallback: assume it's already in input format
            return v;
          }
          return '';
        };

        const currentValueStr = normalizeFieldValueToInput();

        const changeToForm = (date: Date | null) => {
          if (storeAsISOString) {
            field.onChange(date ? date.toISOString() : null);
          } else {
            field.onChange(date);
          }
        };

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const val = e.target.value;
          const parsed = parseInputValue(val, inputMode);
          changeToForm(parsed);
        };

        const handleClear = (e?: React.MouseEvent) => {
          e?.stopPropagation();
          changeToForm(null);
        };

        return (
          <FormItem className="w-full">
            {label && (
              <FormLabel className="text-primary">
                {label}
                {required ? ' *' : ''}
              </FormLabel>
            )}

            <FormControl>
              <div
                className={cn(
                  'relative flex items-center gap-2 w-full',
                  className
                )}
              >
                <input
                  id={inputId}
                  type={inputMode}
                  value={currentValueStr}
                  onChange={handleChange}
                  placeholder={placeholder}
                  min={minStr}
                  max={maxStr}
                  className={cn(
                    'w-full border bg-primary-foreground p-3 h-12 shadow-md duration-300 border-gray-300 rounded-lg focus:border-primary focus:ring-primary',
                    fieldState?.error?.message && 'border-red-500'
                  )}
                />

                {allowClear && currentValueStr && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 bg-primary text-secondary"
                    onClick={handleClear}
                    aria-label="Clear date"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </FormControl>

            <FormErrorMessage className="text-red-600">
              {fieldState.error?.message as React.ReactNode}
            </FormErrorMessage>
          </FormItem>
        );
      }}
    />
  );
}
