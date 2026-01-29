// src/app/providers/QueryProvider.tsx
import { QueryClient, QueryClientProvider, QueryCache } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { toast } from '@/shared/lib/store/useToastStore';

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      // meta에 hideToast가 true면 토스트를 띄우지 않음
      if (query.meta?.hideToast) return;

      // 에러 메시지가 실제로 존재할 때만 토스트 실행
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
