import { useEffect } from 'react';

type KeyMap = Partial<Record<string, () => void>>;

export function useKeyboard(keyMap: KeyMap, enabled = true): void {
  useEffect(() => {
    if (!enabled) return;

    const handler = (e: KeyboardEvent) => {
      keyMap[e.key]?.();
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [keyMap, enabled]);
}
