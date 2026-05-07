import React from 'react';

import { Outlet } from 'react-router-dom';

import KodiLogo from '@/assets/kodi_logo.png';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTypedTranslation } from '@/hooks';
import LanguageSelector from '@/shared/LanguageSelector';
import ThemeSwitcher from '@/shared/ThemeSwitcher';
import { TranslationKey } from '@/translation/translation';

type Props = React.PropsWithChildren<{
  heading: TranslationKey;
  showThemeSwitcher?: boolean;
  showLanguageSelector?: boolean;
}>;

function AuthWrapper({
  showLanguageSelector = true,
  showThemeSwitcher = true,
  heading,
}: Props) {
  const { t } = useTypedTranslation();
  return (
    <>
      <div className="w-full flex justify-end p-3 space-x-4">
        {showThemeSwitcher && <ThemeSwitcher />}
        {showLanguageSelector && <LanguageSelector />}
      </div>
      <div className="min-h-[90vh] w-full flex justify-center items-center overflow-y-auto">
        <Card className="rounded-[20px] shadow-[0_3px_10px_rgb(0,0,0,0.2)] p-1 m-2">
          <CardHeader>
            <CardTitle>
              <div>
                <img
                  className="mx-auto h-20 w-auto cursor-pointer"
                  src={KodiLogo}
                  alt="KODI Logo"
                />
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
                  {t(heading)}
                </h2>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Outlet />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default AuthWrapper;
