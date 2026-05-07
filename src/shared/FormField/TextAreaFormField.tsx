import React from 'react';

import { Control, FieldValues, Path } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import FormErrorMessage from '@/shared/FormErrorMessage';

type TextAreaProps = React.ComponentProps<typeof Textarea>;

export type TextAreaFormFieldProps<FormType extends FieldValues> = {
  name: Path<FormType>;
  control: Control<FormType>;
  label: string;
  placeholder: string;
  required?: boolean;
  className?: string;
} & Omit<TextAreaProps, 'name'>;

export function TextAreaFormField<FormType extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  required,
  className,
  ...props
}: TextAreaFormFieldProps<FormType>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className="w-full">
          <FormLabel className="text-primary">
            {label.concat(required ? ' *' : '')}
          </FormLabel>
          <FormControl>
            <Textarea
              {...field}
              {...props}
              placeholder={placeholder}
              className={cn(
                'w-full border p-3 min-h-[120px] shadow-md duration-300 border-gray-300 rounded-lg focus:border-primary focus:ring-primary',
                className,
                fieldState?.error?.message && 'border-red-500'
              )}
            />
          </FormControl>
          <FormErrorMessage className="text-red-600" />
        </FormItem>
      )}
    />
  );
}
