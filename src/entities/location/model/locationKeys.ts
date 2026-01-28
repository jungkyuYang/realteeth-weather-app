export const locationKeys = {
  all: ['location'] as const,
  current: () => [...locationKeys.all, 'current'] as const,
};
