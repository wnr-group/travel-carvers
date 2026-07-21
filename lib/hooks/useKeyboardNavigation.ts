'use client';

import { useCallback, useState, type KeyboardEvent } from 'react';

export interface UseKeyboardNavigationOptions {
  itemCount: number;
  onSelect: (index: number) => void;
  onEscape?: () => void;
  enabled?: boolean;
}

export interface UseKeyboardNavigationResult {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  handleKeyDown: (event: KeyboardEvent) => void;
  reset: () => void;
}

export function useKeyboardNavigation({
  itemCount,
  onSelect,
  onEscape,
  enabled = true,
}: UseKeyboardNavigationOptions): UseKeyboardNavigationResult {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [prevItemCount, setPrevItemCount] = useState(itemCount);

  if (prevItemCount !== itemCount) {
    setPrevItemCount(itemCount);
    setActiveIndex(-1);
  }

  const reset = useCallback(() => setActiveIndex(-1), []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      switch (event.key) {
        case 'ArrowDown':
          if (itemCount === 0) return;
          event.preventDefault();
          setActiveIndex((index) => (index < itemCount - 1 ? index + 1 : 0));
          break;
        case 'ArrowUp':
          if (itemCount === 0) return;
          event.preventDefault();
          setActiveIndex((index) => (index > 0 ? index - 1 : itemCount - 1));
          break;
        case 'Enter':
          event.preventDefault();
          onSelect(activeIndex);
          break;
        case 'Escape':
          event.preventDefault();
          onEscape?.();
          break;
        default:
          break;
      }
    },
    [enabled, itemCount, activeIndex, onSelect, onEscape],
  );

  return { activeIndex, setActiveIndex, handleKeyDown, reset };
}
