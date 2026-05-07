import { Suspense } from 'react';

import { BrowserRouter } from 'react-router-dom';
import ThemeProvider from '@context/ThemeProvider';

import './i18n';

import { SIDEBAR_CONFIG } from '@/config/sidebar';
import { ReactQueryProvider } from '@/context';
import AppRoutes from '@/route/AppRoutes';
import { DashboardSkeleton } from '@/shared/DashboardLayout';
import ToastNotification from '@/shared/ToastNotification';

function App() {
  return (
    <ReactQueryProvider>
      <ThemeProvider>
        <BrowserRouter>
          <ToastNotification />
          <Suspense
            fallback={<DashboardSkeleton sidebarData={SIDEBAR_CONFIG} />}
          >
            <AppRoutes />
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
    </ReactQueryProvider>
  );
}

export default App;
