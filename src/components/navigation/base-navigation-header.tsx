import React from 'react';
import { OptionMenu } from '../dropdown-menu/option-menu';
import { Separator } from '../ui/separator';
import LoginDialog from '../auth/login/login-dialog';

export default function BaseNavigationHeader() {
  return (
    <div className='w-full h-14 flex items-center justify-between py-2 px-6 z-50 border-b'>
      <div></div>
      <div className='flex items-center space-x-2'>
        <LoginDialog />
        <Separator orientation='vertical' className='!h-6' />
        <OptionMenu />
      </div>
    </div>
  );
}
