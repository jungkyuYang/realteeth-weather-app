import { createBrowserRouter, RouterProvider as ReactRouterProvider } from 'react-router';
import { RootLayout } from '../layouts/root-layout';
import { NotFoundPage } from '@/pages/error/not-found';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true, // '/' 경로일 때
        element: <div className="p-4">Home Page (준비 중)</div>, // <HomePage />
      },
      {
        path: 'detail/:id',
        element: <div className="p-4">Detail Page (준비 중)</div>, // <DetailPage />
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
