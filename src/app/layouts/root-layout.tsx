import { Outlet } from 'react-router';
import { Toaster } from '@/shared/ui/sonner';
import { ThemeToggleButton } from '@/shared/ui/theme-toggle-button';
import { ScrollToTop } from '@/shared/lib/components/ScrollToTop';

export const RootLayout = () => {
  return (
    <>
      <ScrollToTop />
      <div className="app-container">
        {/* 공통 헤더 영역 */}
        <header className="py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-brand-primary">Weather App</h1>
          {/* 다크모드 스위치 등을 여기에 배치 */}
          <ThemeToggleButton />
        </header>

        {/* 실제 페이지 내용이 갈아끼워지는 지점 */}
        <main className="flex-1">
          <Outlet />
        </main>

        <footer className="py-8 text-center text-slate-400 text-sm">© 2026 Weather Cast. All rights reserved.</footer>
        <Toaster />
      </div>
    </>
  );
};
