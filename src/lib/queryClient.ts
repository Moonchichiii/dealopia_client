import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { persistQueryClient } from '@tanstack/react-query-persist-client';

// Create query client with default options
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

// Session storage persister
const persister = createSyncStoragePersister({
  storage: window.sessionStorage,
});

persistQueryClient({
  queryClient,
  persister,
  maxAge: 1000 * 60 * 60 * 24,
  // Add this dehydrateOptions configuration
  dehydrateOptions: {
    shouldDehydrateQuery: (query) => {
      // Don't persist auth queries to storage
      const queryKey = query.queryKey;
      if (Array.isArray(queryKey) && queryKey[0] === 'auth') {
        return false;
      }
      return true;
    }
  }
});

export { queryClient, QueryClientProvider };