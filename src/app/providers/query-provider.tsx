import { QueryClient, QueryClientProvider, QueryCache } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { toast } from '@/shared/lib/store/useToastStore';
import * as Sentry from '@sentry/react'; // 1. Sentry 임포트

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      Sentry.captureException(error, {
        extra: {
          queryKey: query.queryKey,
        },
      });

      if (query.meta?.hideToast) return;

      if (error instanceof Error && error.message) {
        toast.error(error.message);
      } else if (typeof error === 'string' && error !== '') {
        toast.error(error);
      }
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: import.meta.env.MODE === 'development' ? false : 3,
    },
  },
});

export const QueryProvider = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
