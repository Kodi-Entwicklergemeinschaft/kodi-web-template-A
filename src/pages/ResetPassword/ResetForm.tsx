import { SaveAll } from 'lucide-react';

import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { useConfirmResetPassword } from '@/api/queries/resetPassword';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useTypedTranslation } from '@/hooks';
import ROUTES from '@/route/routesConstant';
import {
  ResetPasswordFormType,
  resetPasswordSchema,
} from '@/schema/resetPassword';
import { PasswordField } from '@/shared/FormField';

type ResetFormProps = {
  token: string;
};

function ResetForm({ token }: ResetFormProps) {
  const { t } = useTypedTranslation();
  const navigate = useNavigate();

  const updatePassword = useConfirmResetPassword();

  const form = useForm<ResetPasswordFormType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: ResetPasswordFormType) => {
    updatePassword.mutate(
      {
        token,
        newPassword: data.newPassword,
      },
      {
        onSuccess: (data) => {
          if (data.success) {
            toast.success(data.message);
            navigate(ROUTES.LogIn);
          } else {
            toast.error(data.error);
          }
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <PasswordField
          control={form.control}
          name="newPassword"
          label={t('accountSetting.form.newPassword.label')}
          placeholder={t('accountSetting.form.newPassword.placeholder')}
        />
        <PasswordField
          control={form.control}
          name="confirmPassword"
          label={t('accountSetting.form.confirmPassword.label')}
          placeholder={t('accountSetting.form.confirmPassword.placeholder')}
        />
        <Button type="submit" className="">
          <SaveAll className="size-7" />{' '}
          {t('accountSetting.section.password.description')}
        </Button>
      </form>
    </Form>
  );
}

export default ResetForm;
