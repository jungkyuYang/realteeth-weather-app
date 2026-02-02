import { lazy, Suspense, useEffect } from 'react';
import { createBrowserRouter, RouterProvider as ReactRouterProvider } from 'react-router';
import { RootLayout } from '../layouts/root-layout';
import NotFoundPage from '@/pages/error/not-found';
import HomePage from '@/pages/HomePage';
import { PageLoader } from '@/shared/ui/PageLoader';
import ReactGA from 'react-ga4';

const GA_TRACKING_ID = import.meta.env.VITE_GA_ID;

if (GA_TRACKING_ID) {
  ReactGA.initialize(GA_TRACKING_ID);
}

const LocationDetailPage = lazy(() => import('@/pages/LocationDetailPage'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'detail/:lat/:lon',
        element: (
          <Suspense fallback={<PageLoader />}>
            <LocationDetailPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export const RouterProvider = () => {
  useEffect(() => {
    if (GA_TRACKING_ID) {
      ReactGA.send({
        hitType: 'pageview',
        page: window.location.pathname + window.location.search,
      });
    }
  }, []);

  return <ReactRouterProvider router={router} />;
};
