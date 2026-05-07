import React from 'react';

import { Control, FieldValues, Path } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import FormErrorMessage from '@/shared/FormErrorMessage';

/**
 * Keep this in sync with the Select component's options shape.
 */
export type SelectOption = {
  id?: string;
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  hidden?: boolean;
};

export type DropdownFieldProps<FormType extends FieldValues> = {
  name: Path<FormType>;
  control: Control<FormType>;
  label: string;
  placeholder?: string;
  options: SelectOption[];
  required?: boolean;
  className?: string;
};

/**
 * DropdownField - single-select UI, but form value is string[]
 */
export function SingleDropdownField<FormType extends FieldValues>({
  name,
  control,
  label,
  placeholder = 'Select...',
  options,
  required,
  className,
}: DropdownFieldProps<FormType>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        // Ensure we always deal with an array in the form value
        const valueArray: string[] = Array.isArray(field.value)
          ? (field.value as string[])
          : field.value
            ? [String(field.value)]
            : [];

        const currentValue = valueArray[0] ?? '';

        const visibleOptions: SelectOption[] = options.filter(
          (o) => !(o as SelectOption).hidden
        );

        return (
          <FormItem className="w-full">
            <FormLabel className="text-primary">
              {label.concat(required ? ' *' : '')}
            </FormLabel>

            <Select
              value={currentValue || undefined}
              onValueChange={(val) => {
                // IMPORTANT: store as an array in the form
                field.onChange([val]);
              }}
            >
              <FormControl>
                <SelectTrigger
                  className={className}
                  aria-invalid={!!fieldState.error}
                >
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>

              <SelectContent>
                {visibleOptions.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <FormErrorMessage className="text-red-600">
              {fieldState.error?.message as React.ReactNode}
            </FormErrorMessage>
          </FormItem>
        );
      }}
    />
  );
}
