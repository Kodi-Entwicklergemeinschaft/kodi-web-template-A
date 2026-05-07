import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { useFormField } from '@/components/ui/form';
import { cn } from '@/lib/utils';

const FormErrorMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { t } = useTranslation();
  const { error, formMessageId } = useFormField();
  const body = useMemo(
    () => (error ? String(error?.message ? t(error.message) : '') : children),
    [children, error, t]
  );

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn('text-sm font-medium text-destructive', className)}
      {...props}
    >
      {body}
    </p>
  );
});
FormErrorMessage.displayName = 'FormErrorMessage';

export default FormErrorMessage;
