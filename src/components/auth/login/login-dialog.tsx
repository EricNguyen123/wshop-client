'use client';

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import config from '@/config';
import { usePathname, useRouter } from '@/i18n/navigation';
import React, { useEffect, useState } from 'react';
import { ButtonLogin } from '@/components/button/button-login';
import LoginBase from './login-base';
import { useAppSelector } from '@/lib/store/hooks';
import { selectAuthenticated } from '@/lib/store/features/auth/slice';

export default function LoginDialog() {
  const pathname = usePathname();
  const [check, setCheck] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectAuthenticated);

  const handleClick = () => {
    if (pathname === `/${config.routes.public.register}`) {
      router.push(`${config.routes.public.login}`);
    }
  };

  useEffect(() => {
    if (
      (pathname === `/${config.routes.public.login}` ||
        pathname === `/${config.routes.public.register}`) &&
      !isAuthenticated
    ) {
      setCheck(true);
    } else {
      setCheck(false);
      setOpen(false);
    }
  }, [pathname, isAuthenticated, router]);

  return (
    <>
      {check ? (
        <ButtonLogin handleClick={handleClick} />
      ) : (
        <Dialog open={open && !isAuthenticated} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <ButtonLogin />
          </DialogTrigger>
          <DialogContent className='max-w-[350px] sm:!max-w-[600px] lg:!max-w-[900px] sm:!p-0 !rounded-2xl'>
            <DialogTitle className='hidden'></DialogTitle>
            <LoginBase />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
