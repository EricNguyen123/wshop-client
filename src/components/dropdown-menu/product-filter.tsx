import React from 'react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import BaseTooltip from '../tooltip/base-tooltip';
import { IconButton } from '../button/button-icon';
import { ListFilter, ListFilterPlus, ListPlus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { StatusOption } from '../select/status-selector';
import { StatusProductEnum } from '@/common/enum';
import ItemMenu from './item-menu';

export default function ProductFilter({
  handleStatusChange,
  currentStatus,
  handleAll,
}: {
  handleStatusChange: (value?: string) => void;
  currentStatus?: string;
  handleAll: () => void;
}) {
  const t = useTranslations('Button.DropdownMenu.ProductFilter');

  const statusOptions: StatusOption[] = [
    ...Object.values(StatusProductEnum)
      .filter((value) => typeof value === 'number')
      .map((status) => ({
        label: t(`status.${status}`),
        value: String(status),
      })),
    {
      label: t('status.all'),
      value: '',
    },
  ];

  return (
    <DropdownMenu>
      <BaseTooltip nameTooltip={t('tooltip')}>
        <DropdownMenuTrigger asChild className='relative'>
          <IconButton icon={ListFilter} variant='outline' className='rounded-md' />
        </DropdownMenuTrigger>
      </BaseTooltip>
      <DropdownMenuContent className='w-max sm:absolute sm:-right-6'>
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <ListFilterPlus className='size-4 mr-2' />
              {t('title.status')}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuLabel className='font-extrabold'>
                  {t('label.status')}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {statusOptions.map((option) => (
                  <DropdownMenuCheckboxItem
                    key={option.value}
                    checked={currentStatus === option.value}
                    onCheckedChange={() => handleStatusChange(option.value)}
                  >
                    {option.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <ItemMenu
            icon={<ListPlus className='size-4' />}
            onClick={handleAll}
            className='cursor-pointer'
          >
            {t('all')}
          </ItemMenu>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
