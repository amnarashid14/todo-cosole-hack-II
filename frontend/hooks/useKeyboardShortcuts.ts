'use client';

import { useCallback, useEffect } from 'react';

// Define available keyboard shortcuts
interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean; // Cmd on Mac, Windows key on Windows
  handler: (event: KeyboardEvent) => void;
}

export const useKeyboardShortcuts = (shortcuts: ShortcutConfig[]) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    for (const shortcut of shortcuts) {
      const { key, ctrl, shift, alt, meta, handler } = shortcut;

      if (
        event.key.toLowerCase() === key.toLowerCase() &&
        !!event.ctrlKey === !!ctrl &&
        !!event.shiftKey === !!shift &&
        !!event.altKey === !!alt &&
        !!event.metaKey === !!meta
      ) {
        event.preventDefault();
        handler(event);
        break;
      }
    }
  }, [shortcuts]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
};

// Predefined shortcuts for task operations
export const TASK_SHORTCUTS = {
  CREATE_TASK: { key: 'n', ctrl: true, label: 'Create new task (Ctrl+N)' },
  FOCUS_SEARCH: { key: '/', label: 'Focus search (just press /)' },
  SAVE_EDIT: { key: 's', ctrl: true, label: 'Save edit (Ctrl+S)' },
  CANCEL_EDIT: { key: 'Escape', label: 'Cancel edit (Esc)' },
  TOGGLE_COMPLETION: { key: 'Space', label: 'Toggle completion (Space)' },
  DELETE_TASK: { key: 'Delete', label: 'Delete task (Delete)' },
};