// Theme is permanently dark — hook kept for compatibility but does nothing
export type Theme = 'dark'

export function useTheme() {
  return { theme: 'dark' as Theme }
}
