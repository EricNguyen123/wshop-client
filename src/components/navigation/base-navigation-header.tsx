'use client';

import React from 'react';
import { OptionMenu } from '../dropdown-menu/option-menu';
import { Separator } from '../ui/separator';
import LoginDialog from '../auth/login/login-dialog';
import ManageMenu from '../dropdown-menu/manage-menu';
import { useAppSelector } from '@/lib/store/hooks';
import { selectAuthenticated, selectCurrentAccount } from '@/lib/store/features/auth/slice';
import images from '@/assets/images';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import config from '@/config';

export default function BaseNavigationHeader() {
  const isAuthenticated = useAppSelector(selectAuthenticated);
  const currentAccount = useAppSelector(selectCurrentAccount);
  const email = currentAccount && 'user' in currentAccount ? currentAccount.user.email : undefined;

  return (
    <div className='w-full h-14 flex items-center justify-between py-2 px-6 z-50 border-b'>
      <div className='flex items-center justify-center'>
        <Link href={config.routes.public.home} className='flex items-center'>
          <Image src={images.logo} alt='logo' className='size-14 object-cover rounded-r-2xl' />
        </Link>
      </div>
      <div className='flex items-center space-x-2'>
        {isAuthenticated ? <ManageMenu currentAccount={email} /> : <LoginDialog />}
        <Separator orientation='vertical' className='!h-6' />
        <OptionMenu />
      </div>
    </div>
  );
}
