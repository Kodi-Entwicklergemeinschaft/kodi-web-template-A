import React from 'react';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

import { useLoadTheme } from '@/hooks';

type ThemeProviderProps = {
  children: React.ReactNode;
};

function ThemeProvider({ children }: ThemeProviderProps) {
  useLoadTheme();
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  );
}

export default ThemeProvider;
