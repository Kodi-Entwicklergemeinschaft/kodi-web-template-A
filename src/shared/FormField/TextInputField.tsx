import React from 'react';

import { Control, FieldValues, Path } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import FormErrorMessage from '@/shared/FormErrorMessage';

type InputProps = React.ComponentProps<typeof Input>;

export type TextInputFieldProps<FormType extends FieldValues> = {
  name: Path<FormType>;
  control: Control<FormType>;
  label: string;
  placeholder: string;
  required?: boolean;
  className?: string;
} & Omit<InputProps, 'name'>;

export function TextInputField<FormType extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  required,
  className,
  type,
  ...props
}: TextInputFieldProps<FormType>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        // Handle number inputs - convert string to number
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          if (type === 'number') {
            const value = e.target.value;
            // Convert empty string to undefined, otherwise parse as number
            const numValue = value === '' ? undefined : Number(value);
            // Only update if it's a valid number or empty
            if (value === '' || !isNaN(numValue as number)) {
              field.onChange(numValue);
            }
          } else {
            field.onChange(e);
          }
        };

        // Convert number value to string for input display
        const inputValue =
          type === 'number'
            ? field.value !== undefined && field.value !== null
              ? String(field.value)
              : ''
            : (field.value ?? '');

        return (
          <FormItem className="w-full">
            <FormLabel className="text-primary">
              {label.concat(required ? ' *' : '')}
            </FormLabel>
            <FormControl>
              <Input
                {...props}
                type={type}
                name={field.name}
                placeholder={placeholder}
                onChange={handleChange}
                onBlur={field.onBlur}
                value={inputValue}
                ref={field.ref}
                className={cn(
                  'border p-3 h-12 shadow-md duration-300 border-gray-300 rounded-lg focus:border-primary focus:ring-primary',
                  className,
                  fieldState?.error?.message && 'border-red-500'
                )}
              />
            </FormControl>
            <FormErrorMessage className="text-red-600" />
          </FormItem>
        );
      }}
    />
  );
}
