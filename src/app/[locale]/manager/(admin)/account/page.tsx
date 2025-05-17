'use client';

import ChangePasswordForm from '@/components/auth/change-password/change-password';
import BaseDropBox from '@/components/box/drop-box/base-drop-box';
import BaseAvatar from '@/components/manager/account/base-avatar';
import BaseInfo from '@/components/manager/account/base-info';
import { selectCurrentAccount } from '@/lib/store/features/auth/slice';
import { useAppSelector } from '@/lib/store/hooks';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';

export default function AccountPage() {
  const t = useTranslations('Component.BaseDropBox');
  const getCurrentAccount = useAppSelector(selectCurrentAccount);

  return (
    <div className='w-full h-full space-y-6'>
      <BaseDropBox
        title={t('uploadAvatar.label')}
        icon={Plus}
        defaultOpen={true}
        description={t('uploadAvatar.description')}
      >
        <BaseAvatar userId={getCurrentAccount?.user.id} />
      </BaseDropBox>
      <BaseInfo userId={getCurrentAccount?.user.id} />
      <BaseDropBox
        title={t('changePassword.label')}
        icon={Plus}
        defaultOpen={false}
        description={t('changePassword.description')}
      >
        <ChangePasswordForm userId={getCurrentAccount?.user.id} />
      </BaseDropBox>
    </div>
  );
}
