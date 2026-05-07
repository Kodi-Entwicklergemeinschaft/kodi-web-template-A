import { SaveAll } from 'lucide-react';

import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { useUpdateUserPassword } from '@/api/queries';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useTypedTranslation } from '@/hooks';
import ROUTES from '@/route/routesConstant';
import { PasswordFormType, passwordSchema } from '@/schema/profile';
import { PasswordField } from '@/shared/FormField';
import { useGlobalStore } from '@/store/useGlobalStore';

function PasswordForm() {
  const { t } = useTypedTranslation();
  const resetStore = useGlobalStore((state) => state.reset);
  const navigate = useNavigate();

  const updatePassword = useUpdateUserPassword();

  const form = useForm<PasswordFormType>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: PasswordFormType) => {
    updatePassword.mutate(data, {
      onSuccess: (data) => {
        if (data.success) {
          resetStore();
          toast.success(data.message);
          navigate(ROUTES.LogIn);
        } else {
          toast.error(data.error);
        }
      },
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t('accountSetting.section.password.heading')}</CardTitle>
        <CardDescription>
          {t('accountSetting.section.password.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <PasswordField
              control={form.control}
              name="currentPassword"
              label={t('accountSetting.form.currentPassword.label')}
              placeholder={t('accountSetting.form.currentPassword.placeholder')}
            />
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
      </CardContent>
    </Card>
  );
}

export default PasswordForm;
