import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Dashboard data is small and cheap; a short stale window keeps tab
      // switches instant without showing yesterday's numbers.
      staleTime: 15_000,
      retry: false
    }
  }
});
