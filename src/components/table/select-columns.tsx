'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { columnsKey } from '@/constant/common';
import type { Table } from '@tanstack/react-table';

import { Columns, ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface SelectColumnsProps<TData> {
  table: Table<TData>;
}

export function SelectColumns<TData>({ table }: SelectColumnsProps<TData>) {
  const t = useTranslations('Component.Tables');

  const visibleColumnsCount = table
    .getAllColumns()
    .filter(
      (column) => column.getCanHide() && column.getIsVisible() && column.id !== columnsKey.select
    ).length;

  const totalColumnsCount = table
    .getAllColumns()
    .filter((column) => column.getCanHide() && column.id !== columnsKey.select).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='sm' className='ml-auto h-9 gap-1'>
          <Columns className='h-4 w-4' />
          <span className='hidden sm:inline-block'>{t('columns.title')}</span>
          <span className='text-xs text-muted-foreground'>
            ({visibleColumnsCount}/{totalColumnsCount})
          </span>
          <ChevronDown className='h-4 w-4 opacity-50' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[180px]'>
        <DropdownMenuLabel>{t('columns.toggleColumns')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide() && column.id !== columnsKey.select)
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className='capitalize'
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
