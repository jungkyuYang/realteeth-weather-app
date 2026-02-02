import { Suspense } from 'react'; // 1. Suspense 임포트
import { Outlet } from 'react-router';
import { Toaster } from '@/shared/ui/sonner';
import { ThemeToggleButton } from '@/shared/ui/theme-toggle-button';
import { ScrollToTop } from '@/shared/lib/components/ScrollToTop';
import { PageLoader } from '@/shared/ui/PageLoader'; // 2. 아까 만든 로더 임포트

export const RootLayout = () => {
  return (
    <>
      <ScrollToTop />
      <div className="app-container flex flex-col min-h-screen">
        {/* 공통 헤더 영역 */}
        <header className="py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-brand-primary">Weather App</h1>
          <ThemeToggleButton />
        </header>

        <main className="flex-1">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>

        <footer className="py-8 text-center text-slate-400 text-sm">© 2026 Weather Cast. All rights reserved.</footer>
        <Toaster />
      </div>
    </>
  );
};
