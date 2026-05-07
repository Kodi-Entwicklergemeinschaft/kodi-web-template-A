import { useState } from 'react';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { signInUser } from '@/api/endpoints';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { saveDataInCookie } from '@/lib/cookieStorage';
import SendVerificationLink from '@/pages/SignIn/SendVerificationLink';
import ROUTES from '@/route/routesConstant';
import { LoginForm, loginSchema } from '@/schema/login';
import {
  CheckboxField,
  PasswordField,
  TextInputField,
} from '@/shared/FormField';
import { setUserDataAction } from '@/store/slices/userSlice';
import { useGlobalStore } from '@/store/useGlobalStore';

function SignIn() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatchUserData = useGlobalStore(setUserDataAction);

  const [loading, setLoading] = useState(false);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const [forgotPassword, setForgotPassword] = useState(false);

  const onCancelForgotPassword = () => {
    setForgotPassword(false);
  };

  const onSubmit = async (values: LoginForm) => {
    setLoading(true);
    try {
      const signedInResponse = await signInUser(values);
      if (signedInResponse.success) {
        const token = signedInResponse.data.accessToken;
        const refreshToken = signedInResponse.data.refreshToken;
        await saveDataInCookie('refreshToken', refreshToken);
        await saveDataInCookie('accessToken', token);
        dispatchUserData({
          ...signedInResponse.data.user,
        });
        toast.success(signedInResponse.message);
        navigate(`${ROUTES.Tiles}/${ROUTES.TileListing}`);
      } else {
        toast.error(signedInResponse.error);
      }
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <TextInputField
            control={form.control}
            name="email"
            label={t('email')}
            placeholder={t('usernameOrEmail')}
            maxLength={50}
            minLength={3}
            required
          />

          <PasswordField
            control={form.control}
            name="password"
            label={t('password')}
            placeholder={t('pleaseEnterPassword')}
            required
          />

          <div className="flex items-center justify-between gap-6">
            <CheckboxField
              control={form.control}
              name="rememberMe"
              label={<div>{t('rememberMe')}</div>}
            />

            <div className="text-sm">
              <span
                onClick={() => setForgotPassword(true)}
                className="cursor-pointer hover:text-purple-500 ml-1 text-primary"
              >
                {t('forgotYourPassword')}
              </span>
            </div>
          </div>

          <Button
            loading={loading}
            type="submit"
            className="w-full bg-primary text-base text-primary-foreground py-2 rounded-md hover:bg-primary-dark transition duration-300 ease-in-out"
          >
            {t('signIn')}
          </Button>

          <div className="flex justify-between mt-3">
            <div className="text-sm text-primary">
              {t('notMember')}
              <Link to={'/register'} className="hover:text-purple-500 ml-1">
                {t('register')}
              </Link>
            </div>

            {/* <HelpDialog btnName={t('signInHelp')} /> */}
          </div>
        </form>
      </Form>

      {forgotPassword && (
        <SendVerificationLink onCancel={onCancelForgotPassword} />
      )}
    </>
  );
}

export default SignIn;
