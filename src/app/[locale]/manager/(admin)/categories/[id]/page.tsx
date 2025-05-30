'use client';

import BaseTitle from '@/components/box/drop-box/base-title';
import ButtonBack from '@/components/button/button-back';
import CategoryDetail from '@/components/manager/category/category-detail';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface PageParams {
  id: string;
}

export default function DetailCategoryPage() {
  const params = useParams() as unknown as PageParams;
  const [categoryId, setCategoryId] = useState<string>(params.id);
  const tPage = useTranslations('Component.Categories');

  useEffect(() => {
    setCategoryId(params.id);
  }, [params.id]);

  return (
    <div className='w-full h-full space-y-6'>
      <div className='w-full flex items-center justify-start space-x-2.5'>
        <ButtonBack />
        <BaseTitle title={tPage('title')} />
      </div>
      <CategoryDetail categoryId={categoryId} />
    </div>
  );
}
