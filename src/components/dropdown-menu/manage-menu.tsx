import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import ItemLogout from '../auth/logout/item-logout';
import { useTranslations } from 'next-intl';
import ItemAccount from './item-account';

export default function ManageMenu({ currentAccount }: { currentAccount?: string }) {
  const t = useTranslations('Component');
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className='relative'>
        <Avatar>
          <AvatarImage src='https://github.com/shadcn.png' />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
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
