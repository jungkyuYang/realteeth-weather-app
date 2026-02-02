import Pencil from 'lucide-react/dist/esm/icons/pencil';

import { EditableTextDialog } from '@/shared/ui/EditableTextDialog';

import { useUpdateNickname } from '../model/useUpdateNickname';

interface Props {
  id: string;
  currentNickname?: string;
  originalName: string;
}

export const EditNicknameButton = ({ id, currentNickname, originalName }: Props) => {
  const { updateNickname, isSaving } = useUpdateNickname();

  const defaultInputValue = currentNickname || originalName;
  const originalDescription = `실제 위치: ${originalName}`;

  return (
    <EditableTextDialog
      title={CONSTANTS.TEXT.TITLE}
      label={CONSTANTS.TEXT.LABEL}
      description={originalDescription}
      initialValue={defaultInputValue}
      placeholder={CONSTANTS.TEXT.PLACEHOLDER}
      isLoading={isSaving}
      onSave={(val) => updateNickname(id, val)}
      triggerIcon={<Pencil className={CONSTANTS.STYLE.ICON_SIZE} />} // 👈 깔끔한 참조
    />
  );
};

// 파일 하단으로 묶어서 관리
const CONSTANTS = {
  STYLE: {
    ICON_SIZE: 'size-[1.4rem]',
  },
  TEXT: {
    TITLE: '이름을 지어주세요',
    LABEL: '지역 별칭',
    PLACEHOLDER: '예: 우리집, 자주 가는 곳',
  },
} as const;
