'use client';
import BaseSidebar from '@/components/sidebar/base-sidebar';
import CustomSidebar from '@/components/sidebar/custom-sidebar';
import { IProps } from '@/types';
import React from 'react';
import { usePathname } from '@/i18n/navigation';
import { useCurrentTitle } from '@/utils/hooks/use-current-title';
import ScrollToTopButton from '@/components/button/button-scroll-top';
import ScrollNoteButton from '@/components/button/button-note-scroll';
import config from '@/config';
import { useTranslations } from 'next-intl';

export default function LayoutManager({ children }: IProps) {
  const pathname = usePathname();
  const t = useTranslations('Component.BaseSidebar');
  const pathToTitle: Record<string, string> = {
    [config.routes.private.users]: t('users.label'),
    [config.routes.private.account]: t('account.label'),
    [config.routes.private.banners]: t('banners.label'),
    [config.routes.private.products]: t('products.label'),
  };
  const currentTitle = useCurrentTitle(pathname, pathToTitle);

  return (
    <div className='w-full h-full flex items-start flex-col md:flex-row'>
      <div className='h-full hidden md:flex flex-col items-center justify-center duration-200'>
        <BaseSidebar />
      </div>

      <div className='w-full flex items-center justify-start space-x-2 md:hidden p-1.5'>
        <CustomSidebar currentTitle={currentTitle} />
        <h1 className='text-lg font-medium'>{currentTitle}</h1>
      </div>

      <div
        className='md:pl-3 w-full h-full overflow-auto scrollbar-hidden custom-scrollbar'
        id='scrollable-container'
      >
        {children}
      </div>
      <ScrollToTopButton />
      <ScrollNoteButton />
    </div>
  );
}
