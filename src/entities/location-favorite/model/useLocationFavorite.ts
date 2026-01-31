import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { locationFavoriteApi } from '../api/locationFavoriteApi';
import { locationFavoriteKeys } from './locationFavoriteKeys';
import { type LocationFavorite } from './types';
import { STORAGE_KEY } from '../api/locationFavoriteApi';

export const useFavorite = () => {
  const queryClient = useQueryClient();
  const queryKey = locationFavoriteKeys.lists();

  const query = useQuery({
    queryKey,
    queryFn: () => locationFavoriteApi.get(),
    staleTime: Infinity,
    initialData: () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    },
  });

  const saveMutation = useMutation({
    mutationFn: locationFavoriteApi.save,
    onMutate: async (newFavorites: LocationFavorite[]) => {
      await queryClient.cancelQueries({ queryKey });
      const previousFavorites = queryClient.getQueryData<LocationFavorite[]>(queryKey);

      queryClient.setQueryData(queryKey, newFavorites);

      return { previousFavorites };
    },
    onError: (_err, _newFavorites, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(queryKey, context.previousFavorites);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const removeMutation = useMutation({
    mutationFn: locationFavoriteApi.remove,
    onMutate: async (targetId: string) => {
      await queryClient.cancelQueries({ queryKey });
      const previousFavorites = queryClient.getQueryData<LocationFavorite[]>(queryKey);

      if (previousFavorites) {
        queryClient.setQueryData(
          queryKey,
          previousFavorites.filter((fav) => fav.id !== targetId),
        );
      }

      return { previousFavorites };
    },
    onError: (_err, _targetId, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(queryKey, context.previousFavorites);
      }
    },
    onSettled: () => {
      // 최종 동기화
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    favorites: query.data ?? [],
    isLoading: query.isPending,
    isRefreshing: query.isFetching && !query.isPending,
    isError: query.isError || saveMutation.isError || removeMutation.isError,
    save: saveMutation.mutate,
    remove: removeMutation.mutate,
    isSaving: saveMutation.isPending,
    refresh: () => query.refetch(),
  };
};
