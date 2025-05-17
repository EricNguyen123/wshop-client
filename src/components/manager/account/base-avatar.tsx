import { AvatarUpload } from '@/components/input/avatar-upload/avatar-upload';
import { showErrorToast, showSuccessToast } from '@/components/toast/custom-toast';
import { selectAccount } from '@/lib/store/features/user/slice';
import { deleteAvatarAsync, uploadAvatarAsync } from '@/lib/store/features/user/thunk';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';

export default function BaseAvatar({ userId }: { userId?: string }) {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const dispatch = useAppDispatch();
  const tMessage = useTranslations('Messages.error');
  const selectUser = useAppSelector(selectAccount);

  const handleAvatarChange = (url: string | null, file: File | null) => {
    setAvatar(url);
    setAvatarFile(file);

    if (!file && userId) {
      dispatch(
        deleteAvatarAsync({
          data: {
            value: { userId },
            setToastSuccess: (status) => {
              showSuccessToast(tMessage(`toast.${status}`));
            },
            setToastError: (status) => {
              showErrorToast(tMessage(`toast.${status}`) || tMessage('toast.error'));
            },
          },
        })
      );
    }
  };

  useEffect(() => {
    if (avatarFile && userId) {
      dispatch(
        uploadAvatarAsync({
          data: {
            value: { file: avatarFile, userId },
            setToastSuccess: (status) => {
              showSuccessToast(tMessage(`toast.${status}`));
            },
            setToastError: (status) => {
              showErrorToast(tMessage(`toast.${status}`) || tMessage('toast.error'));
            },
          },
        })
      );
    }
  }, [avatarFile, userId]);

  useEffect(() => {
    setAvatar(selectUser?.avatarUrl || null);
  }, [selectUser?.avatarUrl, userId]);

  return (
    <div className='flex items-center justify-start'>
      <AvatarUpload value={avatar} onChange={handleAvatarChange} size='lg' />
    </div>
  );
}
