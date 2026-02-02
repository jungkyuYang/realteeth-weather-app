// PageLoader.tsx
export const PageLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
      {/* 가벼운 CSS 애니메이션 스피너 */}
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>

      {/* 날씨 앱 느낌을 주는 문구 */}
      <p className="mt-4 text-gray-500 font-medium animate-pulse">실시간 날씨 정보를 가져오고 있습니다...</p>
    </div>
  );
};
