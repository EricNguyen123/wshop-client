import React from 'react';
import LoginForm from './login-form';
import images from '@/assets/images';
import Image from 'next/image';

export default function LoginBase() {
  return (
    <div className='w-full grid h-full lg:grid-cols-2 rounded-l-2xl'>
      <div className='flex flex-col gap-4 md:p-10 lg:border lg:rounded-l-2xl'>
        <div className='flex flex-1 items-center justify-center'>
          <div className='w-full max-w-md'>
            <LoginForm />
          </div>
        </div>
      </div>
      <div className='relative hidden bg-muted lg:block rounded-r-2xl'>
        <Image
          src={images.wallpaper}
          alt='wallpaper'
          className='absolute inset-0 h-full w-full object-cover rounded-r-2xl'
        />
      </div>
    </div>
  );
}
