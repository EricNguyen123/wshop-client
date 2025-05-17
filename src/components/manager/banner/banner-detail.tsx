'use client';

import BoxInfoItem from '@/components/box/drop-box/base-info';
import { showErrorToast, showSuccessToast } from '@/components/toast/custom-toast';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { useTranslations } from 'next-intl';
import type React from 'react';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { symbols } from '@/constant/common';
import { selectDetailBanner } from '@/lib/store/features/banner/slice';
import { getDetailBannerAsync } from '@/lib/store/features/banner/thunk';
import { DescriptionCell } from './description-cell';
import { BannerImage } from './banner-image';

export default function BannerDetail({ bannerId }: { bannerId?: string }) {
  const dispatch = useAppDispatch();
  const selectBanner = useAppSelector(selectDetailBanner);
  const tMessage = useTranslations('Messages.error');
  const t = useTranslations('Component.Banners');
  const [bannerInfo, setBannerInfo] = useState<
    { name: string; content: string | React.ReactNode }[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    if (bannerId) {
      if (!isLoading) {
        setIsLoading(true);
        dispatch(
          getDetailBannerAsync({
            data: {
              value: {
                bannerId,
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
  }, [dispatch, bannerId, tMessage, isLoading]);

  useEffect(() => {
    if (selectBanner) {
      setBannerInfo([
        { name: t('fields.id'), content: selectBanner.id || symbols.inValid },
        {
          name: t('fields.url'),
          content:
            (selectBanner.url && (
              <BannerImage
                src={selectBanner.url}
                alt={selectBanner.url}
                className='!w-full !h-40 rounded-md border border-border bg-muted/30'
                fallbackText='No Image'
              />
            )) ||
            symbols.inValid,
        },
        {
          name: t('fields.startDate'),
          content:
            (selectBanner.startDate && format(selectBanner.startDate, 'PP')) || symbols.inValid,
        },
        {
          name: t('fields.endDate'),
          content: (selectBanner.endDate && format(selectBanner.endDate, 'PP')) || symbols.inValid,
        },
        { name: t('fields.numberOrder'), content: selectBanner.numberOrder || symbols.inValid },
        {
          name: t('fields.descriptions'),
          content: <DescriptionCell description={selectBanner.descriptions} variant='expandable' />,
        },
      ]);

      setIsLoading(false);
    }
  }, [selectBanner, t]);

  return (
    <div className='w-full max-w-xl sm:min-w-md flex flex-col items-start justify-center gap-8'>
      <BoxInfoItem
        title={t('sections.bannerInfo')}
        options={bannerInfo}
        isLoading={isLoading}
        className='w-full'
      />
    </div>
  );
}
