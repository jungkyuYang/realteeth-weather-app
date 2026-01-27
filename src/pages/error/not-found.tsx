import { Link } from 'react-router';

export const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <h2 className="text-9xl font-black text-slate-200 dark:text-slate-800">404</h2>
      <p className="text-2xl mt-4 font-medium">페이지를 찾을 수 없습니다.</p>
      <p className="text-slate-500 mt-2">입력하신 주소가 올바른지 확인해주세요.</p>
      <Link
        to="/"
        className="mt-8 px-6 py-3 bg-brand-primary text-white rounded-full hover:bg-brand-dark transition-colors"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
};
