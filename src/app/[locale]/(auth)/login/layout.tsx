import { IProps } from '@/types';
import { getTranslations } from 'next-intl/server';
import React from 'react';

export async function generateMetadata({ params }: Omit<IProps, 'children'>) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'BaseLayout.Login' });

  return {
    title: t('label'),
  };
}

export default function LayoutLogin({ children }: IProps) {
  return <div className='w-full h-full flex flex-col items-start p-1.5 rounded-xl'>{children}</div>;
}
