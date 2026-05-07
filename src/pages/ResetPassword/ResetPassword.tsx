import { useParams } from 'react-router-dom';

import ResetForm from './ResetForm';

function ResetPassword() {
  // const { t } = useTypedTranslation();
  const { token } = useParams();
  // const {
  //   data: verifyToken,
  //   isFetching,
  //   isLoading,
  // } = useVerifyPasswordToken(token ?? '');

  // if (!token) return <Navigate to={ROUTES.Unauthorized} />;
  // if (isFetching || isLoading) return <Spinner className="size-8" />;

  // if (verifyToken?.success) {
  //   return <ResetForm token={token} />;
  // }
  // return <div>{t('accountSetting.form.websiteLink.error.invalidLink')}</div>;
  return <ResetForm token={token ?? ''} />;
}

export default ResetPassword;
