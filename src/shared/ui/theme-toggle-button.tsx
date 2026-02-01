import { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from './button';
import { toggleDarkMode } from '@/shared/lib/theme';

export const ThemeToggleButton = () => {
  // 💡 useEffect 대신 초기값 함수를 사용하여 에러 해결
  const [isDark, setIsDark] = useState(() => {
    // SSR 대응을 위해 window가 있을 때만 확인
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  const handleToggle = () => {
    toggleDarkMode(); // 클래스 토글 및 localStorage 저장
    setIsDark(!isDark); // 아이콘 변경
  };

  return (
    <Button variant="ghost" size="icon-sm" onClick={handleToggle} className="rounded-full transition-colors">
      {isDark ? (
        <Sun className="size-8 text-yellow-400 fill-yellow-400 animate-in zoom-in duration-300" />
      ) : (
        <Moon className="size-8 text-toss-text-sub animate-in zoom-in duration-300" />
      )}
    </Button>
  );
};
