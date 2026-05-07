// TODO: Delete it later
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { usePostsQuery } from '@/api/queries';
import { Button } from '@/components/ui/button';
import { RoleName, USER_ROLE_MAP } from '@/lib/constant';
import { setUserDataAction } from '@/store/slices/userSlice';
import { useGlobalStore } from '@/store/useGlobalStore';

import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';

function Dummy() {
  const { t } = useTranslation();
  const dispatchUserData = useGlobalStore(setUserDataAction);
  const { data: posts } = usePostsQuery();
  console.log('🚀 ~ Dashboard ~ posts:', posts);

  const updateUserRole = (userRole: RoleName) => {
    dispatchUserData({
      lastName: '',
      email: '',
      firstName: '',
      id: '',
      username: '',
      role: USER_ROLE_MAP[userRole],
    });
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg:dark">
      <div>
        <h1>{t('heading')}</h1>
        <Button variant={'secondary'}>Welcome</Button>
        <ThemeToggle />
        <LanguageToggle />
        <Button onClick={() => toast.success('Event has been created')}>
          {' '}
          Raise Toast
        </Button>
        <Button
          onClick={() => {
            updateUserRole('SUPER_ADMIN');
          }}
        >
          Make Super Admin
        </Button>
        <Button
          onClick={() => {
            updateUserRole('CITY_ADMIN');
          }}
        >
          Make City Admin
        </Button>
        <Button
          onClick={() => {
            updateUserRole('CITIZEN');
          }}
        >
          Make Citizen
        </Button>
      </div>
    </div>
  );
}

export default Dummy;
