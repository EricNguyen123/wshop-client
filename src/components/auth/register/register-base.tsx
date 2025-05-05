import React from 'react';
import images from '@/assets/images';
import Image from 'next/image';
import RegisterForm from './register-form';

export default function RegisterBase() {
  return (
    <div className='w-full grid h-full lg:grid-cols-2 rounded-2xl lg:shadow-md'>
      <div className='relative hidden bg-muted lg:block rounded-l-2xl'>
        <Image
          src={images.wallpaper}
          alt='wallpaper'
          className='absolute inset-0 h-full w-full object-cover rounded-l-2xl'
        />
      </div>
      <div className='h-full flex flex-col gap-4 md:p-auto lg:border lg:rounded-r-2xl py-3.5 overflow-hidden'>
        <div className='h-full overflow-auto scrollbar-hidden flex flex-1 items-start justify-center'>
          <div className='w-full max-w-md px-2 py-3.5 md:mx-auto md:py-5'>
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
}
