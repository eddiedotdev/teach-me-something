import { QueryClient } from "@tanstack/react-query";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { persistQueryClient } from "@tanstack/react-query-persist-client";

export function createQueryClient(enablePersistence: boolean = true) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 1000 * 60 * 60 * 24,
        retry: 3,
        staleTime: Infinity,
      },
    },
  });

  if (enablePersistence && typeof window !== "undefined") {
    const persister = createSyncStoragePersister({
      storage: window.localStorage,
      key: "REACT_QUERY_CACHE",
      throttleTime: 1000,
    });

    persistQueryClient({
      queryClient,
      persister,
      maxAge: Infinity,
      dehydrateOptions: {
        shouldDehydrateQuery: () => true,
      },
    });
  }

  return queryClient;
}
