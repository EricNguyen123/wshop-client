'use client';

import React from 'react';
import GroupSidebar from './group-sidebar';
import { GalleryVertical, Package, User, Users } from 'lucide-react';
import config from '@/config';
import { useTranslations } from 'next-intl';
import { ValidRolesEnum } from '@/common/enum';
import { useAppSelector } from '@/lib/store/hooks';
import { selectCurrentAccount } from '@/lib/store/features/auth/slice';

export default function BaseSidebar() {
  const t = useTranslations('Component.BaseSidebar');
  const currentAccount = useAppSelector(selectCurrentAccount);
  const navData = [
    {
      title: t('account.label'),
      icon: User,
      url: config.routes.private.account,
      roles: [ValidRolesEnum.ADMIN, ValidRolesEnum.EDITOR, ValidRolesEnum.USER],
    },
    {
      title: t('users.label'),
      icon: Users,
      items: [
        {
          title: t('users.manage'),
          url: config.routes.private.users,
          roles: [ValidRolesEnum.ADMIN, ValidRolesEnum.EDITOR],
        },
      ],
      roles: [ValidRolesEnum.ADMIN, ValidRolesEnum.EDITOR],
    },
    {
      title: t('banners.label'),
      icon: GalleryVertical,
      url: config.routes.private.banners,
      roles: [ValidRolesEnum.ADMIN, ValidRolesEnum.EDITOR],
    },
    {
      title: t('products.label'),
      icon: Package,
      url: config.routes.private.products,
      roles: [ValidRolesEnum.ADMIN, ValidRolesEnum.EDITOR],
    },
  ];
  return (
    <div className='w-full h-full flex flex-row items-start justify-start gap-2'>
      <GroupSidebar
        options={navData}
        currentRole={currentAccount?.user.role ?? ValidRolesEnum.USER}
      />
    </div>
  );
}
