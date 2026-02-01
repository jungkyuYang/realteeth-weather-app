import { Pencil } from 'lucide-react';
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

  return (
    <EditableTextDialog
      title="이름을 지어주세요"
      label="지역 별칭"
      description={`원본 위치: ${originalName}`}
      initialValue={defaultInputValue}
      placeholder="예: 우리집, 자주 가는 곳"
      isLoading={isSaving}
      onSave={(val) => updateNickname(id, val)}
      triggerIcon={<Pencil className="size-[1.4rem]" />}
    />
  );
};
