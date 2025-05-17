'use client';

import ChangePasswordForm from '@/components/auth/change-password/change-password';
import BaseDropBox from '@/components/box/drop-box/base-drop-box';
import BaseTitle from '@/components/box/drop-box/base-title';
import ButtonBack from '@/components/button/button-back';
import { UserAvatar } from '@/components/input/avatar-upload/generator-avatar';
import BaseInfo from '@/components/manager/account/base-info';
import { selectAccount } from '@/lib/store/features/user/slice';
import { useAppSelector } from '@/lib/store/hooks';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface PageParams {
  id: string;
}

export default function InformationPage() {
  const params = useParams() as unknown as PageParams;
  const [userId, setUserId] = useState<string>(params.id);
  const t = useTranslations('Component.BaseDropBox');
  const tPage = useTranslations('Component.UserProfile');
  const selectUser = useAppSelector(selectAccount);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    setAvatar(selectUser?.avatarUrl || null);
    setName(selectUser?.name || null);
  }, [selectUser?.avatarUrl, selectUser?.name]);

  useEffect(() => {
    setUserId(params.id);
  }, [params.id]);

  return (
    <div className='w-full h-full space-y-6'>
      <div className='w-full flex items-center justify-start space-x-2.5'>
        <ButtonBack />
        <BaseTitle title={tPage('title')} />
      </div>
      <BaseDropBox
        title={t('uploadAvatar.label')}
        defaultOpen={false}
        description={t('uploadAvatar.description')}
      >
        <UserAvatar
          name={name || ''}
          imageUrl={avatar}
          size='custom'
          className='size-24 border-[1px] border-accent-foreground/10 shadow-sm shadow-accent-foreground/10'
        />
      </BaseDropBox>
      <BaseInfo userId={userId} />
      <BaseDropBox
        title={t('changePassword.label')}
        icon={Plus}
        defaultOpen={false}
        description={t('changePassword.description')}
      >
        <ChangePasswordForm userId={userId} />
      </BaseDropBox>
    </div>
  );
}
