import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import BaseTooltip from '../tooltip/base-tooltip';
import { IconButton } from '../button/button-icon';
import { ListFilter } from 'lucide-react';
import { useTranslations } from 'next-intl';
import ItemBannerDateRange from './item-banner-date-range';
import ItemBannerAll from './item-banner-all';

export default function BannerFilter() {
  const t = useTranslations('Button.DropdownMenu.BannerFilter');
  return (
    <DropdownMenu>
      <BaseTooltip nameTooltip={t('tooltip')}>
        <DropdownMenuTrigger asChild className='relative'>
          <IconButton icon={ListFilter} variant='outline' className='rounded-md' />
        </DropdownMenuTrigger>
      </BaseTooltip>
      <DropdownMenuContent className='w-xs sm:absolute sm:-right-6'>
        <DropdownMenuGroup>
          <ItemBannerDateRange />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <ItemBannerAll />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
