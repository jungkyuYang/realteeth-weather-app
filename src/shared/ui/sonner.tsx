import CircleCheckIcon from 'lucide-react/dist/esm/icons/circle-check';
import InfoIcon from 'lucide-react/dist/esm/icons/info';
import Loader2Icon from 'lucide-react/dist/esm/icons/loader-2';
import OctagonXIcon from 'lucide-react/dist/esm/icons/octagon-x';
import TriangleAlertIcon from 'lucide-react/dist/esm/icons/triangle-alert';
import { useTheme } from 'next-themes';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      position="bottom-center"
      // 토스트 간의 간격을 벌려 가독성 높임
      gap={12}
      icons={{
        // 아이콘 사이즈를 size-5에서 size-6(24px)으로 업그레이드
        success: <CircleCheckIcon className="size-6 text-blue-500" />,
        info: <InfoIcon className="size-6 text-gray-500" />,
        warning: <TriangleAlertIcon className="size-6 text-yellow-500" />,
        error: <OctagonXIcon className="size-6 text-red-500" />,
        loading: <Loader2Icon className="size-6 animate-spin text-blue-500" />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: `
            group 
            flex items-center gap-4 
            w-[calc(100vw-32px)] sm:w-[400px] // 모바일에선 꽉 차게, 데스크탑에선 더 넓게(400px)
            min-h-[64px] // 최소 높이를 지정해서 두툼하게 만듦
            p-5 // 패딩을 늘려 내부 여유 공간 확보
            mb-6 // 하단에서 좀 더 띄움
            bg-white/95 dark:bg-zinc-900/95 // 투명도를 낮춰 더 선명하게
            backdrop-blur-2xl 
            border border-zinc-200/50 dark:border-zinc-700/50 
            shadow-[0_20px_40px_rgba(0,0,0,0.15)] // 그림자를 더 깊고 부드럽게
            rounded-[24px] // 더 둥글게 처리하여 Toss 감성 극대화
            transition-all duration-300
          `,
          // 텍스트 사이즈를 text-sm에서 text-base(16px)로 키움
          title: 'text-base font-semibold text-zinc-900 dark:text-zinc-100',
          description: 'text-sm text-zinc-500 dark:text-zinc-400 mt-0.5',
          actionButton: 'bg-blue-600 text-white rounded-xl px-4 py-2 text-sm font-bold',
          cancelButton:
            'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl px-4 py-2 text-sm font-bold',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
