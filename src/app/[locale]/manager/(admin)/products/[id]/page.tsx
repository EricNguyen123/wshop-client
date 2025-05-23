'use client';

import BaseTitle from '@/components/box/drop-box/base-title';
import ButtonBack from '@/components/button/button-back';
import ProductDetail from '@/components/manager/product/product-detail';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface PageParams {
  id: string;
}

export default function DetailProductPage() {
  const params = useParams() as unknown as PageParams;
  const [productId, setProductId] = useState<string>(params.id);
  const tPage = useTranslations('Component.Products');

  useEffect(() => {
    setProductId(params.id);
  }, [params.id]);

  return (
    <div className='w-full h-full space-y-6'>
      <div className='w-full flex items-center justify-start space-x-2.5'>
        <ButtonBack />
        <BaseTitle title={tPage('title')} />
      </div>
      <ProductDetail productId={productId} />
    </div>
  );
}
