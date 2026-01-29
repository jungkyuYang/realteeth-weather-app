export const weatherKeys = {
  all: ['weather'] as const,
  details: () => [...weatherKeys.all, 'detail'] as const,
  detail: (lat?: number, lon?: number) => [...weatherKeys.details(), { lat, lon }] as const,
};
