import React from 'react';

interface DetailStatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  desc: string;
}

export const DetailStatCard = ({ icon, title, value, desc }: DetailStatCardProps) => {
  return (
    <div className="bg-card p-8 rounded-[2.8rem] shadow-sm border border-toss-grey/10 transition-all hover:shadow-md">
      {/* 아이콘 및 타이틀 영역 */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-toss-grey/10 rounded-xl">{icon}</div>
        <p className="text-toss-btn font-semibold text-toss-text-sub">{title}</p>
      </div>

      {/* 메인 수치 */}
      <p className="text-[2.4rem] font-extrabold text-toss-text-main mb-2 tracking-tight">{value}</p>

      {/* 보조 설명 */}
      <p className="text-[1.3rem] text-toss-text-sub/80 font-medium leading-tight">{desc}</p>
    </div>
  );
};

/**
 * DetailStatCard 전용 스켈레톤
 * 실제 카드와 동일한 패딩과 라운딩 값을 공유하여 레이아웃 이질감을 최소화합니다.
 */
DetailStatCard.Skeleton = () => (
  <div className="bg-card p-8 rounded-[2.8rem] border border-toss-grey/5 animate-pulse">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 bg-toss-grey/10 rounded-xl" />
      <div className="w-16 h-5 bg-toss-grey/10 rounded-md" />
    </div>
    <div className="w-24 h-10 bg-toss-grey/10 rounded-lg mb-3" />
    <div className="w-32 h-4 bg-toss-grey/5 rounded-md" />
  </div>
);
