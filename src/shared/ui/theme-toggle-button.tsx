import { useState } from 'react';

import Moon from 'lucide-react/dist/esm/icons/moon';
import Sun from 'lucide-react/dist/esm/icons/sun';

import { toggleDarkMode } from '@/shared/lib/theme';

import { Button } from './button';

export const ThemeToggleButton = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }

    return false;
  });

  const handleToggle = () => {
    toggleDarkMode();
    setIsDark(!isDark);
  };

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={handleToggle}
      className="rounded-full transition-colors"
      aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
    >
      {isDark ? (
        <Sun className="size-8 text-yellow-400 fill-yellow-400 animate-in zoom-in duration-300" />
      ) : (
        <Moon className="size-8 text-toss-text-sub animate-in zoom-in duration-300" />
      )}
    </Button>
  );
};
