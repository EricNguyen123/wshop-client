'use client';

import React, { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import ItemLogout from '../auth/logout/item-logout';
import { useTranslations } from 'next-intl';
import ItemAccount from './item-account';
import { useAppSelector } from '@/lib/store/hooks';
import { selectCurrentAccount } from '@/lib/store/features/auth/slice';
import { UserAvatar } from '../input/avatar-upload/generator-avatar';

export default function ManageMenu({ currentAccount }: { currentAccount?: string }) {
  const t = useTranslations('Component');
  const [avatar, setAvatar] = useState<string | null>(null);
  const selectUser = useAppSelector(selectCurrentAccount);

  useEffect(() => {
    setAvatar(selectUser?.user.avatarUrl || null);
  }, [selectUser?.user.avatarUrl]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='focus:outline-none'>
        <div className='relative cursor-pointer hover:opacity-80 transition-opacity'>
          <UserAvatar name={selectUser?.user.name || ''} imageUrl={avatar} size='xs' />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56 absolute sm:right-[-60px] right-[-84px]'>
        <DropdownMenuLabel className='font-extrabold flex flex-col items-start justify-center'>
          <span>{t('ManageMenu.label')}</span>
          {currentAccount && <span className='text-xs font-light'>{currentAccount}</span>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ItemAccount />
        <ItemLogout />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
