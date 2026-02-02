import { lazy } from 'react';
import { createBrowserRouter, RouterProvider as ReactRouterProvider } from 'react-router';
import { RootLayout } from '../layouts/root-layout';
import NotFoundPage from '@/pages/error/not-found';
import HomePage from '@/pages/HomePage';

const LocationDetailPage = lazy(() => import('@/pages/LocationDetailPage'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />, // 1. 여기서 전체 레이아웃을 잡고
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />, // 2. 여기서는 컴포넌트만 깔끔하게 호출
      },
      {
        path: 'detail/:lat/:lon',
        element: <LocationDetailPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export const RouterProvider = () => {
  return <ReactRouterProvider router={router} />;
};
