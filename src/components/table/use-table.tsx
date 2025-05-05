'use client';

import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
  type Row,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import React from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { FileX } from 'lucide-react';
import { columnsKey } from '@/constant/common';
import { SelectColumns } from './select-columns';
import BaseSearch from '../input/search';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onChange?: (value: string) => void;
  placeholder?: string;
  moreFeatures?: React.ReactNode;
  pageSize?: number;
  isLoading?: boolean;
  className?: string;
  onRowClick?: (row: Row<TData>) => void;
}

export function UseTable<TData, TValue>({
  columns,
  data,
  onChange,
  placeholder,
  moreFeatures,
  pageSize = 10,
  isLoading = false,
  className,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  const t = useTranslations('Component.Tables');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    [columnsKey.select]: false,
  });
  const [rowSelection, setRowSelection] = useState({});
  const [{ pageIndex, pageSize: currentPageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize,
  });

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize: currentPageSize,
    }),
    [pageIndex, currentPageSize]
  );

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  const handleColumnVisibility = useCallback((key: VisibilityState) => {
    setColumnVisibility((prev) => ({ ...prev, ...key }));
  }, []);

  const handleRowSelection = useCallback(
    <T,>(key?: VisibilityState, handleRowChoose?: (selected?: T) => void) => {
      if (key) {
        handleColumnVisibility(key);
      }
      if (handleRowChoose) {
        handleRowChoose(rowSelection as T);
      }
      setRowSelection({});
    },
    [rowSelection, handleColumnVisibility]
  );

  const renderTableContent = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={columns.length} className='h-[400px] p-0'>
            <div className='w-full h-full flex flex-col space-y-3 p-4'>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className='flex items-center space-x-4'>
                  {Array.from({ length: columns.length }).map((_, j) => (
                    <Skeleton key={j} className='h-10 w-full rounded-md' />
                  ))}
                </div>
              ))}
            </div>
          </TableCell>
        </TableRow>
      );
    }

    if (table.getRowModel().rows?.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={columns.length} className='h-[400px] text-center'>
            <div className='flex flex-col items-center justify-center h-full space-y-3 text-muted-foreground'>
              <FileX className='h-12 w-12 opacity-30' />
              <p className='text-lg font-medium'>{t('noResults')}</p>
              <p className='text-sm max-w-md'>{t('tryAdjustingFilters')}</p>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    return table.getRowModel().rows.map((row) => (
      <TableRow
        key={row.id}
        data-state={row.getIsSelected() && 'selected'}
        className={cn('transition-colors hover:bg-muted/50', onRowClick && 'cursor-pointer')}
        onClick={() => onRowClick && onRowClick(row)}
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  return (
    <div className={cn('w-full space-y-4', className)}>
      <div className='w-full flex flex-col lg:flex-row items-center justify-between space-y-2 lg:space-y-0 lg:space-x-2'>
        <BaseSearch
          placeholder={placeholder || t('filter.title')}
          onChange={onChange}
          variant='default'
        />
        <div className='flex items-center justify-between sm:justify-end space-x-2 w-full lg:w-max'>
          {moreFeatures &&
            React.isValidElement(moreFeatures) &&
            React.cloneElement(
              moreFeatures as React.ReactElement<{
                handle: typeof handleColumnVisibility;
                result: typeof handleRowSelection;
              }>,
              {
                handle: handleColumnVisibility,
                result: handleRowSelection,
              }
            )}
          <SelectColumns table={table} />
        </div>
      </div>
      <div className='rounded-md border overflow-hidden bg-background shadow-sm'>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className='bg-muted/50 hover:bg-muted'>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className='font-semibold'>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>{renderTableContent()}</TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
