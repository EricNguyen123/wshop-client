import React from 'react';
import ItemMenu from './item-menu';
import { ListPlus } from 'lucide-react';
import { useAppDispatch } from '@/lib/store/hooks';
import { getListBannersAsync } from '@/lib/store/features/banner/thunk';
import { query } from '@/constant/common';
import { useTranslations } from 'next-intl';

export default function ItemBannerAll() {
  const dispatch = useAppDispatch();
  const t = useTranslations('Button.DropdownMenu.BannerFilter');

  const handleItem = () => {
    dispatch(
      getListBannersAsync({
        data: {
          value: {
            page: query.page,
            limit: query.limit,
          },
          setToastSuccess: () => {},
          setToastError: () => {},
        },
      })
    );
  };
  return (
    <ItemMenu
      icon={<ListPlus className='size-4' />}
      onClick={handleItem}
      className='cursor-pointer'
    >
      {t('all')}
    </ItemMenu>
  );
}
