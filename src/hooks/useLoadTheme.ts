import { useEffect } from 'react';

import { useTheme } from 'next-themes';

import appConfig from '@/config/appConfig';

const {
  primaryLightColor,
  backgroundLightColor,
  foregroundLightColor,
  primaryDarkColor,
  backgroundDarkColor,
  foregroundDarkColor,
} = appConfig;

export default function useLoadTheme() {
  const { resolvedTheme } = useTheme(); // <- detects 'light' | 'dark' | undefined

  useEffect(() => {
    if (!resolvedTheme) return;

    const root = document.documentElement;

    const applyColors = (theme: 'light' | 'dark') => {
      if (theme === 'dark') {
        root.style.setProperty('--primary', primaryDarkColor);
        root.style.setProperty('--background', backgroundDarkColor);
        root.style.setProperty('--foreground', foregroundDarkColor);
      } else {
        root.style.setProperty('--primary', primaryLightColor);
        root.style.setProperty('--background', backgroundLightColor);
        root.style.setProperty('--foreground', foregroundLightColor);
      }
    };

    applyColors(resolvedTheme as 'light' | 'dark');
  }, [resolvedTheme]);
}
