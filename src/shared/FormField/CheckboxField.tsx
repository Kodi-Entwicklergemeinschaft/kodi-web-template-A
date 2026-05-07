import { ReactNode } from 'react';

import { Control, FieldError, FieldValues, Path } from 'react-hook-form';

import { Checkbox } from '@/components/ui/checkbox';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import FormErrorMessage from '@/shared/FormErrorMessage';

export type CheckboxFieldProps<FormType extends FieldValues> = {
  name: Path<FormType>;
  control: Control<FormType>;
  label: ReactNode;
  error?: FieldError;
  className?: string;
  checkboxClassName?: string;
};

export function CheckboxField<FormType extends FieldValues>({
  name,
  control,
  label,
  className,
  checkboxClassName,
}: CheckboxFieldProps<FormType>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FormItem
          className={cn(
            'flex flex-row items-start space-x-3 space-y-0 rounded-md py-4 cursor-pointer',
            className
          )}
        >
          <FormControl>
            <Checkbox
              aria-label={name}
              checked={!!field.value}
              onCheckedChange={(checked) => field.onChange(checked === true)}
              className={cn(
                'cursor-pointer',
                checkboxClassName,
                error?.message && 'border-red-500'
              )}
            />
          </FormControl>
          <div>
            <div className="leading-none">
              <FormLabel className={cn('cursor-pointer')} asChild>
                {label}
              </FormLabel>
            </div>
            <FormErrorMessage className="text-red-600" />
          </div>
        </FormItem>
      )}
    />
  );
}
