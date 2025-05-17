'use client';

import BaseTitle from '@/components/box/drop-box/base-title';
import ButtonBack from '@/components/button/button-back';
import BannerDetail from '@/components/manager/banner/banner-detail';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface PageParams {
  id: string;
}

export default function DetailBannerPage() {
  const params = useParams() as unknown as PageParams;
  const [bannerId, setBannerId] = useState<string>(params.id);
  const tPage = useTranslations('Component.Banners');

  useEffect(() => {
    setBannerId(params.id);
  }, [params.id]);

  return (
    <div className='w-full h-full space-y-6'>
      <div className='w-full flex items-center justify-start space-x-2.5'>
        <ButtonBack />
        <BaseTitle title={tPage('title')} />
      </div>
      <BannerDetail bannerId={bannerId} />
    </div>
  );
}
