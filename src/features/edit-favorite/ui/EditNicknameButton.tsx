import Pencil from 'lucide-react/dist/esm/icons/pencil';
import { EditableTextDialog } from '@/shared/ui/EditableTextDialog';
import { useUpdateNickname } from '../model/useUpdateNickname';

// 상단으로 분리된 상수 및 스타일
const ICON_SIZE = 'size-[1.4rem]';
const DIALOG_TEXT = {
  TITLE: '이름을 지어주세요',
  LABEL: '지역 별칭',
  PLACEHOLDER: '예: 우리집, 자주 가는 곳',
} as const;

interface Props {
  id: string;
  currentNickname?: string;
  originalName: string;
}

export const EditNicknameButton = ({ id, currentNickname, originalName }: Props) => {
  const { updateNickname, isSaving } = useUpdateNickname();

  // 비즈니스 로직: 우선순위에 따른 초기값 설정
  const defaultInputValue = currentNickname || originalName;
  const originalDescription = `실제 위치: ${originalName}`;

  return (
    <EditableTextDialog
      title={DIALOG_TEXT.TITLE}
      label={DIALOG_TEXT.LABEL}
      description={originalDescription}
      initialValue={defaultInputValue}
      placeholder={DIALOG_TEXT.PLACEHOLDER}
      isLoading={isSaving}
      onSave={(val) => updateNickname(id, val)}
      triggerIcon={<Pencil className={ICON_SIZE} />}
    />
  );
};
