import { createBrowserRouter, RouterProvider as ReactRouterProvider } from 'react-router';
import { RootLayout } from '../layouts/root-layout';
import NotFoundPage from '@/pages/error/not-found';
import LocationDetailPage from '@/pages/LocationDetailPage';
import HomePage from '@/pages/HomePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true, // '/' 경로일 때
        element: <HomePage />, // <HomePage />
      },
      {
        path: 'detail/:lat/:lon',
        element: <LocationDetailPage />, // <DetailPage />
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
