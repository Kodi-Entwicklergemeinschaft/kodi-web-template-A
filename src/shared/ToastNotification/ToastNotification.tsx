import { useTheme } from 'next-themes';
import { ToasterProps } from 'sonner';

import { Toaster as Sonner } from '@/components/ui/sonner';

type ToasterTheme = ToasterProps['theme'];

const ToastNotification = () => {
  const { theme } = useTheme() as { theme: ToasterTheme };
  const currentSonnerTheme = theme ?? 'system';

  return <Sonner key={currentSonnerTheme} theme={currentSonnerTheme} />;
};

export default ToastNotification;
