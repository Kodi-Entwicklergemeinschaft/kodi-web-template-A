import { RotateCcw, SaveAll } from 'lucide-react';
import { useEffect } from 'react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { useProfileDataMutation } from '@/api/queries';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { useTypedTranslation } from '@/hooks';
import { PersonalInfoFormType, personalInfoSchema } from '@/schema/profile';
import { TextInputField } from '@/shared/FormField';

type PersonalInfoFormProps = {
  profileData?: PersonalInfoFormType;
  loading: boolean;
};

function PersonalInfoForm({ profileData, loading }: PersonalInfoFormProps) {
  const { t } = useTypedTranslation();
  const updatePersonalInfo = useProfileDataMutation();
  // const userId = useGlobalStore(selectUserId);
  const form = useForm<PersonalInfoFormType>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: profileData || {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
    },
  });
  useEffect(() => {
    if (profileData) {
      form.reset(profileData);
    }
  }, [profileData]);
  const onSubmit = (data: PersonalInfoFormType) => {
    const {
      username: _unusedUsername,
      email: _unusedEmail,
      ...userFormData
    } = data;
    void _unusedUsername;
    void _unusedEmail;
    updatePersonalInfo.mutate(
      { userFormData },
      {
        onSuccess: (data) => {
          if (data.success) {
            toast.success(data.message);
          } else {
            toast.error(data.error);
          }
        },
      }
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {t('accountSetting.section.personalInfo.heading')}
        </CardTitle>
        <CardDescription>
          {t('accountSetting.section.personalInfo.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Spinner className="size-8 w-full" />
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex gap-5 flex-col md:flex-row mb-4">
                <TextInputField
                  control={form.control}
                  name="firstName"
                  label={t('registration.form.firstName.label')}
                  placeholder={t('registration.form.firstName.placeholder')}
                />
                <TextInputField
                  control={form.control}
                  name="lastName"
                  label={t('registration.form.lastName.label')}
                  placeholder={t('registration.form.lastName.placeholder')}
                />
              </div>
              <TextInputField
                control={form.control}
                name="username"
                label={t('accountSetting.form.username.label')}
                placeholder={t('accountSetting.form.username.placeholder')}
                disabled
              />
              <div className="flex flex-col space-y-4">
                <Separator />
                <span className="text-muted-foreground">
                  {/* Note: Below information will be publicly available. */}
                </span>
              </div>

              <div className="flex gap-5 flex-col md:flex-row pb-2">
                <TextInputField
                  control={form.control}
                  name="email"
                  label={t('accountSetting.form.email.label')}
                  placeholder={t('accountSetting.form.email.placeholder')}
                  disabled
                />

                {/* <TextInputField
                  control={form.control}
                  name="phoneNumber"
                  label={t('accountSetting.form.phoneNumber.label')}
                  placeholder={t('accountSetting.form.phoneNumber.placeholder')}
                /> */}
              </div>

              <Separator />

              {/* <TextInputField
                control={form.control}
                name="website"
                label={t('accountSetting.form.website.label')}
                placeholder={t('accountSetting.form.website.placeholder')}
              />

              <TextAreaFormField
                control={form.control}
                name="description"
                label={t('accountSetting.form.description.label')}
                placeholder={t('accountSetting.form.description.placeholder')}
                rows={4}
              /> */}

              <div className="flex gap-5 flex-col md:flex-row justify-center pt-4 items-center">
                <Button type="submit" className="w-52">
                  <SaveAll className="size-7" />{' '}
                  {t('accountSetting.form.saveBtn')}
                </Button>
                <Button
                  type="reset"
                  className="w-52 border-red-500"
                  variant="outline"
                  onClick={() => form.reset()}
                >
                  <RotateCcw /> {t('accountSetting.form.resetBtn')}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}

export default PersonalInfoForm;
