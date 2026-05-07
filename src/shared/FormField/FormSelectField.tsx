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
import { cn } from '@/lib/utils';
import FormErrorMessage from '@/shared/FormErrorMessage';

export type Option = {
  label: string;
  value: string;
};

export type FormSelectFieldProps<FormType extends FieldValues> = {
  name: Path<FormType>;
  control: Control<FormType>;
  label: string;
  placeholder?: string;
  options: Option[];
  required?: boolean;
  className?: string;
  selectClassName?: string;
  ariaLabel?: string;
};

export function FormSelectField<FormType extends FieldValues>({
  name,
  control,
  label,
  placeholder = 'Select an option',
  options,
  required,
  className,
  selectClassName,
  ariaLabel,
}: FormSelectFieldProps<FormType>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FormItem className={cn('w-full', className)}>
          <FormLabel className="text-primary">
            {label.concat(required ? ' *' : '')}
          </FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              defaultValue={field.value}
            >
              <SelectTrigger
                className={cn(
                  'w-full border p-3 h-12 shadow-md border-gray-300 rounded-lg focus:border-primary focus:ring-primary duration-300',
                  selectClassName,
                  error?.message && 'border-red-500'
                )}
                aria-label={ariaLabel || label}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormErrorMessage className="text-red-600" />
        </FormItem>
      )}
    />
  );
}
