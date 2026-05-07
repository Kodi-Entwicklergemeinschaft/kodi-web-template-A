import { Control, FieldValues, Path } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import FormErrorMessage from '@/shared/FormErrorMessage';

export type ColorPickerFieldProps<FormType extends FieldValues> = {
  name: Path<FormType>;
  control: Control<FormType>;
  label: string;
  required?: boolean;
  wrapperClassName?: string;
  className?: string;
};

export function ColorPickerField<FormType extends FieldValues>({
  name,
  control,
  label,
  required,
  wrapperClassName,
  className,
}: ColorPickerFieldProps<FormType>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={cn('flex flex-col space-y-2', wrapperClassName)}>
          <FormLabel className="text-primary">
            {label.concat(required ? ' *' : '')}
          </FormLabel>
          <FormControl>
            <input
              type="color"
              {...field}
              className={cn(
                'w-16 h-10 border rounded-md cursor-pointer',
                fieldState?.error?.message && 'border-red-500',
                className
              )}
            />
          </FormControl>
          <FormErrorMessage className="text-red-600" />
        </FormItem>
      )}
    />
  );
}
