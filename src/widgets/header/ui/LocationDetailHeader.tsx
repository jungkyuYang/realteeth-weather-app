import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left';
import Share2 from 'lucide-react/dist/esm/icons/share-2';
import { useNavigate } from 'react-router';
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
      toast.success(CONSTANTS.TEXT.SHARE_SUCCESS);
    }
  };

  return (
    <header className={CONSTANTS.STYLE.HEADER_WRAPPER}>
      <div className="flex items-center gap-1">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 hover:bg-toss-grey/10 rounded-full transition-all active:scale-90"
          aria-label={CONSTANTS.TEXT.ARIA_BACK}
        >
          <ChevronLeft size={CONSTANTS.STYLE.ICON_BACK} />
        </button>
      </div>

      <h1 className="text-[1.8rem] font-bold truncate max-w-[20rem] text-center">{title}</h1>

      <div className="flex items-center gap-1">
        <button
          onClick={handleShareClick}
          className="p-2 -mr-2 hover:bg-toss-grey/10 rounded-full transition-all active:scale-90 text-toss-blue"
          aria-label={CONSTANTS.TEXT.ARIA_SHARE}
        >
          <Share2 size={CONSTANTS.STYLE.ICON_SHARE} />
        </button>
      </div>
    </header>
  );
};

/**
 * 💡 최하단 통합 상수 관리
 */
const CONSTANTS = {
  TEXT: {
    SHARE_SUCCESS: '링크가 복사되었습니다.',
    ARIA_BACK: '뒤로 가기',
    ARIA_SHARE: '공유하기',
  },
  STYLE: {
    HEADER_WRAPPER:
      'sticky top-0 z-50 bg-background/80 backdrop-blur-md px-6 h-24 flex items-center justify-between border-b border-toss-grey/10 transition-colors',
    ICON_BACK: 28,
    ICON_SHARE: 22,
  },
} as const;
