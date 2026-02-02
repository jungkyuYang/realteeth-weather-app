import { useEffect } from 'react';

import { useLocation } from 'react-router';

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // 경로(URL)가 바뀔 때마다 스크롤을 제일 위로!
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};
