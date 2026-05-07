import React from 'react';

import { Control, FieldValues, Path } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { MultiSelect } from '@/components/ui/multiselect';
import FormErrorMessage from '@/shared/FormErrorMessage';

/**
 * Keep this in sync with the MultiSelect component's options shape.
 * MultiSelect accepts either { label, value, icon? }[] OR { name, _id }[]
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
  animation?: number;
  maxCount?: number;
  modalPopover?: boolean;
  selectedValues?: string[];
};

/**
 * DropdownField - integrates MultiSelect with react-hook-form.
 *
 * Note: MultiSelect is stateful and uses defaultValue internally;
 * we force a remount (key) when form value changes so MultiSelect's
 * internal state reflects the form.
 */
export function DropdownField<FormType extends FieldValues>({
  name,
  control,
  label,
  placeholder = 'Select...',
  options,
  required,
  className,
  animation = 0,
  maxCount = 3,
  modalPopover = false,
}: DropdownFieldProps<FormType>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        // normalize form value to string[] for MultiSelect
        const normalized: string[] = Array.isArray(field.value)
          ? (field.value as string[])
          : field.value
            ? [String(field.value)]
            : [];

        // filter hidden options — keep typed SelectOption[]
        const visibleOptions: SelectOption[] = options.filter(
          (o) => !(o as SelectOption).hidden
        );

        // force remount when normalized value changes (keeps MultiSelect in-sync)
        const multiKey = JSON.stringify(normalized);

        return (
          <FormItem className="w-full">
            <FormLabel className="text-primary">
              {label.concat(required ? ' *' : '')}
            </FormLabel>

            <FormControl>
              <MultiSelect
                key={multiKey}
                defaultValue={normalized}
                value={field.value}
                options={visibleOptions.map((item) => ({
                  _id: item.id,
                  label: item.label,
                  value: item.value,
                }))}
                placeholder={placeholder}
                onValueChange={(vals: string[]) => {
                  // update react-hook-form with the array of selected values
                  field.onChange(vals);
                }}
                className={className}
                animation={animation}
                maxCount={maxCount}
                modalPopover={modalPopover}
                aria-invalid={!!fieldState.error}
              />
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
