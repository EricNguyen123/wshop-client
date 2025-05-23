'use client';

import BoxInfoItem from '@/components/box/drop-box/base-info';
import { showErrorToast, showSuccessToast } from '@/components/toast/custom-toast';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { useTranslations } from 'next-intl';
import type React from 'react';
import { useEffect, useState } from 'react';
import { symbols } from '@/constant/common';
import { selectDetailProduct } from '@/lib/store/features/product/slice';
import { getDetailProductAsync } from '@/lib/store/features/product/thunk';
import { IMedia } from '@/types/common';
import images from '@/assets/images';
import { PreviewCarousel } from '@/components/carousel/preview-carousel';
import { formatCurrency, formatDiscount, formatMultiplicationRate } from '@/utils/helpers';
import StatusProductCell from './status-product-cell';
import { DescriptionCell } from '../banner/description-cell';
import ProductInfoDialog from './product-info-dialog';

export default function ProductDetail({ productId }: { productId?: string }) {
  const dispatch = useAppDispatch();
  const selectProduct = useAppSelector(selectDetailProduct);
  const tMessage = useTranslations('Messages.error');
  const t = useTranslations('Component.Products');
  const [productInfo, setProductInfo] = useState<
    { name: string; content: string | React.ReactNode }[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    if (productId) {
      if (!isLoading) {
        setIsLoading(true);
        dispatch(
          getDetailProductAsync({
            data: {
              value: {
                productId,
              },
              setToastSuccess: (status?: number) => {
                setIsLoading(false);
                if (isMounted) {
                  showSuccessToast(tMessage(`toast.${status}`));
                }
              },
              setToastError: (status?: number) => {
                if (isMounted) {
                  showErrorToast(tMessage(`toast.${status}`) || tMessage('toast.error'));
                }
              },
            },
          })
        );
      }
    }

    return () => {
      isMounted = false;
    };
  }, [dispatch, productId, tMessage, isLoading]);

  useEffect(() => {
    if (selectProduct) {
      const medias = selectProduct.medias;
      const slides = Array.isArray(medias)
        ? medias.map((item: IMedia, idx: number) => {
            return {
              id: item.id ?? idx,
              src: item.mediaUrl ?? `${images.noImage}`,
              type: 'image' as const,
              alt: item.fileName ?? '',
            };
          })
        : [];
      setProductInfo([
        {
          name: t('fields.media'),
          content: (
            <PreviewCarousel
              items={slides}
              variant='product'
              enableZoom={true}
              enableFullscreen={true}
              showThumbnails={true}
              thumbnailPosition='bottom'
              aspectRatio='square'
            />
          ),
        },
        { name: t('fields.id'), content: selectProduct.id || symbols.inValid },
        { name: t('fields.name'), content: selectProduct.name || symbols.inValid },
        { name: t('fields.code'), content: selectProduct.code || symbols.inValid },
        {
          name: t('fields.price'),
          content: formatCurrency(selectProduct.price) || symbols.inValid,
        },
        { name: t('fields.quantity'), content: selectProduct.quantity || symbols.inValid },
        {
          name: t('fields.quantityAlert'),
          content: selectProduct.quantityAlert || symbols.inValid,
        },
        { name: t('fields.orderUnit'), content: selectProduct.orderUnit || symbols.inValid },
        {
          name: t('fields.multiplicationRate'),
          content: selectProduct.multiplicationRate
            ? formatMultiplicationRate(selectProduct.multiplicationRate, {
                format: 'percent',
                digits: 2,
              }).displayText
            : symbols.inValid,
        },
        {
          name: t('fields.discount'),
          content: selectProduct.discount
            ? formatDiscount(selectProduct.discount, 'percent')
            : symbols.inValid,
        },
        {
          name: t('fields.status'),
          content: <StatusProductCell status={selectProduct.status} className='!justify-start' />,
        },
        {
          name: t('fields.description'),
          content: <DescriptionCell description={selectProduct.description} variant='expandable' />,
        },
      ]);

      setIsLoading(false);
    }
  }, [selectProduct, t]);

  return (
    <div className='w-full max-w-xl sm:min-w-md flex flex-col items-start justify-center gap-8'>
      <BoxInfoItem
        title={t('sections.productInfo')}
        options={productInfo}
        isLoading={isLoading}
        className='w-full'
        moreComponent={selectProduct && <ProductInfoDialog product={selectProduct} />}
      />
    </div>
  );
}
