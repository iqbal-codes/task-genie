import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Longer stale time since data primarily comes from Dexie
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      refetchOnWindowFocus: false,
      // Reduce network requests since data is managed locally
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  },
});
