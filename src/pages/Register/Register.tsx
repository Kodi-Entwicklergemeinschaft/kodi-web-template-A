import { useState } from 'react';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';

import { registerUser } from '@/api/endpoints/register';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import ROUTES from '@/route/routesConstant';
import { RegisterForm, registerSchema } from '@/schema/register';
import {
  CheckboxField,
  PasswordField,
  TextInputField,
} from '@/shared/FormField';
import HelpDialog from '@/shared/HelpDialog';
import { setUserDataAction } from '@/store/slices/userSlice';
import { useGlobalStore } from '@/store/useGlobalStore';

function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatchUserData = useGlobalStore(setUserDataAction);
  const theme = useTheme();
  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      username: '',
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
      acceptPolicy: false,
    },
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: RegisterForm) => {
    setLoading(true);
    try {
      const { email, username, firstName, lastName, password } = values;
      const payload = { email, username, firstName, lastName, password };
      const registerResponse = await registerUser(payload);
      if (registerResponse.success) {
        dispatchUserData({
          ...registerResponse.data,
        });
        toast.success(registerResponse.message);
        navigate(ROUTES.LogIn);
      } else {
        toast.error(registerResponse.error);
      }
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <TextInputField
          control={form.control}
          name="email"
          label={t('email')}
          placeholder={t('usernameOrEmail')}
          required
          minLength={3}
          maxLength={50}
        />

        <TextInputField
          control={form.control}
          name="username"
          label={t('registration.form.username.label')}
          placeholder={t('registration.form.username.placeholder')}
          required
          minLength={3}
          maxLength={50}
        />

        <TextInputField
          control={form.control}
          name="firstName"
          label={t('registration.form.firstName.label')}
          placeholder={t('registration.form.firstName.placeholder')}
          required
          minLength={2}
          maxLength={50}
        />

        <TextInputField
          control={form.control}
          name="lastName"
          label={t('registration.form.lastName.label')}
          placeholder={t('registration.form.lastName.placeholder')}
          required
          minLength={2}
          maxLength={50}
        />

        <PasswordField
          control={form.control}
          name="password"
          label={t('registration.form.password.label')}
          placeholder={t('registration.form.password.placeholder')}
          required
        />

        <PasswordField
          control={form.control}
          name="confirmPassword"
          label={t('registration.form.confirmPassword.label')}
          placeholder={t('registration.form.confirmPassword.placeholder')}
          required
        />

        <div className="flex items-center justify-between">
          <CheckboxField
            control={form.control}
            name="acceptPolicy"
            label={
              <div>
                {t('registration.general.acceptPolicy')}{' '}
                {/* <Link
                  to="/privacy"
                  className="hover:opacity-70 transition-opacity duration-200"
                  style={{
                    color: `${theme.theme === 'dark' ? '#A6A6A6' : '#595959'}`,
                  }}
                >
                  {t('registration.general.privacy')}
                </Link>{' '} */}
                {/* {t('registration.general.and')}{' '} */}
                <Link
                  to="/terms"
                  className="hover:opacity-70 transition-opacity duration-200"
                  style={{
                    color: `${theme.theme === 'dark' ? '#A6A6A6' : '#595959'}`,
                  }}
                >
                  {t('registration.general.terms')}
                </Link>
              </div>
            }
          />
        </div>
        <Button
          loading={loading}
          type="submit"
          className="w-full bg-primary text-base text-primary-foreground py-2 rounded-md hover:bg-primary-dark transition duration-300 ease-in-out"
        >
          {t('register')}
        </Button>

        <div className="flex justify-between mt-3">
          <div className="text-sm text-foreground">
            {t('registration.general.alreadyHaveAccount')}
            <Link to={'/login'} className=" hover:text-purple-500 ml-1">
              {t('registration.general.login')}
            </Link>
          </div>

          <HelpDialog btnName={t('signInHelp')} />
        </div>
      </form>
    </Form>
  );
}

export default Register;
