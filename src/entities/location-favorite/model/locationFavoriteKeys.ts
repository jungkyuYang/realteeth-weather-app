export const locationFavoriteKeys = {
  all: ['location-favorite'] as const,
  lists: () => [...locationFavoriteKeys.all, 'list'] as const,
  detail: (id: string) => [...locationFavoriteKeys.lists(), id] as const,
};
