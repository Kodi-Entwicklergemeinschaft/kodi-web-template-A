import { useGetUserProfile } from '@/api/queries';
import { useTypedTranslation } from '@/hooks';

import PasswordForm from './PasswordForm';
import PersonalInfoForm from './PersonalInfoForm';

function Account() {
  const { t } = useTypedTranslation();
  // const deleteAccount = useDeleteAccount();

  // const navigate = useNavigate();
  // const resetStore = useGlobalStore((state) => state.reset);
  const { data: profileData, isLoading, isFetching } = useGetUserProfile();
  // const handleDeleteAccount = () => {
  //   deleteAccount.mutate(undefined, {
  //     onSuccess: (data) => {
  //       if (data.success) {
  //         toast.success(data.message);
  //         resetStore();
  //         navigate(ROUTES.LogIn);
  //       } else {
  //         toast.error(data.error);
  //       }
  //     },
  //   });
  // };

  return (
    <div className="w-full px-1">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t('accountSetting.heading')}
          </h1>
          <p className="text-muted-foreground">
            {t('accountSetting.description')}
          </p>
        </div>
        {/* <Button
          type="button"
          className="bg-red-500"
          loading={deleteAccount.isPending}
          onClick={handleDeleteAccount}
        >
          <Trash className="w-4 h-4 mr-2" />
          {t('deleteAccount')}
        </Button> */}
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-start w-full mt-4">
        <PersonalInfoForm
          loading={isLoading || isFetching}
          profileData={profileData?.success ? profileData.data : undefined}
        />
        <div className="w-full flex flex-col gap-4">
          {/* <MetadataForm
            loading={isLoading || isFetching}
            metadata={
              profileData?.success ? profileData.data.metadata : undefined
            }
          /> */}
          <PasswordForm />
        </div>
      </div>
    </div>
  );
}

export default Account;
