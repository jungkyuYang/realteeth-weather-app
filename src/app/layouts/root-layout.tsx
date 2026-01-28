import { Outlet } from 'react-router';
import { Toaster } from '@/shared/ui/sonner';

export const RootLayout = () => {
  return (
    <div className="app-container">
      {/* 공통 헤더 영역 */}
      <header className="py-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-brand-primary">Weather App</h1>
        {/* 다크모드 스위치 등을 여기에 배치 */}
        <button className="p-2 bg-slate-200 dark:bg-slate-800 rounded-lg">🌙</button>
      </header>

      {/* 실제 페이지 내용이 갈아끼워지는 지점 */}
      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="py-8 text-center text-slate-400 text-sm">© 2026 Weather Cast. All rights reserved.</footer>
      <Toaster />
    </div>
  );
};
