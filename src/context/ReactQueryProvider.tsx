import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import React from 'react';

import { QUERY_PERSISTENT_MAX_AGE } from '@lib/constant';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

type ReactQueryProviderProps = { children: React.ReactNode };

const queryClient = new QueryClient();

const localStoragePersister = createAsyncStoragePersister({
  storage: window.localStorage,
});

persistQueryClient({
  queryClient,
  persister: localStoragePersister,
  maxAge: QUERY_PERSISTENT_MAX_AGE,
});

function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export default ReactQueryProvider;
