import { useNavigate } from 'react-router';
import { ChevronLeft, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface LocationDetailHeaderProps {
  title: string;
  onShare?: () => void;
}

export const LocationDetailHeader = ({ title, onShare }: LocationDetailHeaderProps) => {
  const navigate = useNavigate();

  const handleShareClick = () => {
    if (onShare) {
      onShare();
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('링크가 복사되었습니다.');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md px-6 h-24 flex items-center justify-between border-b border-toss-grey/10 transition-colors">
      <div className="flex items-center gap-1">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 hover:bg-toss-grey/10 rounded-full transition-all active:scale-90"
          aria-label="뒤로 가기"
        >
          <ChevronLeft size={28} />
        </button>
      </div>

      <h1 className="text-[1.8rem] font-bold truncate max-w-[20rem] text-center">{title}</h1>

      <div className="flex items-center gap-1">
        <button
          onClick={handleShareClick}
          className="p-2 -mr-2 hover:bg-toss-grey/10 rounded-full transition-all active:scale-90 text-toss-blue"
          aria-label="공유하기"
        >
          <Share2 size={22} />
        </button>
      </div>
    </header>
  );
};
