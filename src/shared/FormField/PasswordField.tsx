import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

import { type Control, type FieldValues, type Path } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import FormErrorMessage from '@/shared/FormErrorMessage';

export interface PasswordFieldProps<FormType extends FieldValues> {
  control: Control<FormType>;
  name: Path<FormType>;
  placeholder: string;
  labelClassName?: string;
  formClassName?: string;
  inputClassName?: string;
  label?: string;
  required?: boolean;
}

export function PasswordField<FormType extends FieldValues>({
  control,
  name,
  label,
  required,
  placeholder,
  labelClassName,
  formClassName,
  inputClassName,
}: PasswordFieldProps<FormType>) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FormItem className={cn('relative', formClassName)}>
          {label && (
            <FormLabel className={cn('text-primary', labelClassName)}>
              {label} {required && '*'}
            </FormLabel>
          )}
          <FormControl>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder={placeholder}
                {...field}
                className={cn(
                  'border p-3 h-12 text-base shadow-md duration-300 border-gray-300 rounded-lg focus:border-primary focus:ring-primary pr-10 hide-edge-eye',
                  inputClassName,
                  error?.message && 'border-red-500'
                )}
                maxLength={50}
                minLength={3}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-4 flex items-center"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <Eye aria-label={'Show password'.concat(name)} size={24} />
                ) : (
                  <EyeOff aria-label={'Hide password'.concat(name)} size={24} />
                )}
              </button>
            </div>
          </FormControl>
          <FormErrorMessage className="text-red-600" />
        </FormItem>
      )}
    />
  );
}
