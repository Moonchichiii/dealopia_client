import { QueryClient } from '@tanstack/react-query';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { persistQueryClient } from '@tanstack/react-query-persist-client';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 30,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const persister = createSyncStoragePersister({
  storage: window.sessionStorage,
  key: 'dealopia-query-cache',
  serialize: (data): string => JSON.stringify(data),
  deserialize: (data): unknown => JSON.parse(data),
});

persistQueryClient({
  queryClient,
  persister,
  maxAge: 1000 * 60 * 60 * 24,
  dehydrateOptions: {
    shouldDehydrateQuery: (query) => {
      const queryKey = query.queryKey;
      
      if (Array.isArray(queryKey)) {
        if (
          queryKey[0] === 'auth' || 
          (queryKey.length > 1 && queryKey[0] === 'user') ||
          queryKey.join('/').includes('auth') ||
          queryKey.join('/').includes('login') ||
          queryKey.join('/').includes('register')
        ) {
          return false;
        }
      }
      
      if (query.state.status !== 'success') {
        return false;
      }
      
      if (query.state.error) {
        return false;
      }
      
      return true;
    }
  }
});

export { queryClient };
