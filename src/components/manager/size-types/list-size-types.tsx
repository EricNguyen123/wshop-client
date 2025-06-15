/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { ValidRolesEnum } from '@/common/enum';
import { UseTable } from '@/components/table/use-table';
import { Button } from '@/components/ui/button';
import { columnsKeyBanner, columnsKeySizeType, query, sort, symbols } from '@/constant/common';
import { ISizeTypeRes } from '@/types/common';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Copy, SquarePen, Trash } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { showErrorToast, showSuccessToast } from '@/components/toast/custom-toast';
import { ActionButton } from '@/components/button/button-action';
import BasePagination from '@/components/pagination/base-pagination';
import { selectCurrentAccount } from '@/lib/store/features/auth/slice';
import { DeleteConfirmation } from '@/components/delete/delete-confirmation';
import BaseTitle from '@/components/box/drop-box/base-title';
import { deleteSizeTypeAsync, getListSizeTypesAsync } from '@/lib/store/features/size-type/thunk';
import { DescriptionCell } from '../banner/description-cell';
import { selectSizeTypes } from '@/lib/store/features/size-type/slice';
import SizeTypeForm from './size-type-form';
import SizeTypeFeatures from './size-type-features';
import { NewItemIndicator } from '../category/new-item-indicator';

export default function ListSizeTypes() {
  const t = useTranslations('Component.SizeTypes');
  const [data, setData] = useState<ISizeTypeRes[]>([]);
  const dispatch = useAppDispatch();
  const tMessage = useTranslations('Messages.error');
  const getSizeTypes = useAppSelector(selectSizeTypes);
  const currentAccount = useAppSelector(selectCurrentAccount);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [keySearch, setKeySearch] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(query.page);
  const [totalPages, setTotalPages] = useState<number>(query.totalPages);

  const columns: ColumnDef<ISizeTypeRes>[] = [
    {
      accessorKey: columnsKeySizeType.name,
      header: () => {
        return (
          <Button className='w-full' variant='ghost'>
            {t('fields.name')}
          </Button>
        );
      },
      cell: ({ row }) => {
        const name = row.getValue('name');
        return (
          <div className='w-full flex items-center justify-center'>
            {name ? (
              <div className='max-w-xs flex items-center space-x-2'>
                <NewItemIndicator
                  createdAt={`${row.original.createdAt}`}
                  newThreshold={1 / 4} // 15 minutes
                  variant='pulse'
                  size='sm'
                  className='mr-2'
                />
                <DescriptionCell
                  description={typeof name === 'string' ? name : ''}
                  variant='tooltip'
                  className='w-full'
                />
              </div>
            ) : (
              <span className='text-sm text-muted-foreground'>{symbols.inValid}</span>
            )}
          </div>
        );
      },
      enableHiding: false,
    },
    {
      accessorKey: columnsKeySizeType.sizeCode,
      header: ({ column }) => {
        return (
          <Button
            className='w-full'
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === sort.asc)}
          >
            {t('fields.sizeCode')}
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        const sizeCode = row.getValue('sizeCode');
        return (
          <div className='w-full flex items-center justify-center'>
            {sizeCode ? (
              <div className='max-w-xs'>
                <DescriptionCell
                  description={typeof sizeCode === 'string' ? sizeCode : ''}
                  variant='tooltip'
                  className='w-full'
                />
              </div>
            ) : (
              <span className='text-sm text-muted-foreground'>{symbols.inValid}</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: columnsKeySizeType.sizeType,
      header: ({ column }) => {
        return (
          <Button
            className='w-full'
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === sort.asc)}
          >
            {t('fields.sizeType')}
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className='w-full flex items-center justify-center'>
          <span className='w-max text-nowrap text-sm font-normal'>
            {row.getValue('sizeType') ? row.getValue('sizeType') : symbols.inValid}
          </span>
        </div>
      ),
    },
    {
      id: columnsKeyBanner.actions,
      enableHiding: false,

      cell: ({ row }) => {
        const sizeType = row.original;
        const handle = () => {
          if (sizeType.id) {
            return navigator.clipboard.writeText(sizeType.id);
          }
        };

        const handleDelete = () => {
          if (sizeType.id) {
            dispatch(
              deleteSizeTypeAsync({
                data: {
                  value: { sizeTypeId: sizeType.id },
                  setToastSuccess: (status?: number) => {
                    showSuccessToast(tMessage(`toast.${status?.toString()}`));
                  },
                  setToastError: (status?: number) => {
                    showErrorToast(
                      tMessage(`toast.${status?.toString()}`) || tMessage('toast.error')
                    );
                  },
                },
                getData: {
                  page: currentPage,
                  limit: query.limit,
                  textSearch: keySearch,
                },
              })
            );
          }
        };

        return (
          <div
            className='w-full flex items-center justify-end'
            onClick={(e) => e.stopPropagation()}
          >
            <ActionButton
              currentRole={currentAccount?.user.role ?? ValidRolesEnum.USER}
              dropdownClassName='absolute right-[-36px]'
              variant='ghost'
              actionVariant='horizontal'
              options={[
                {
                  content: t('actions.copyId'),
                  icon: <Copy className='h-4 w-4' />,
                  onSelect: handle,
                  roles: [ValidRolesEnum.ADMIN, ValidRolesEnum.EDITOR],
                },
                {
                  content: t('actions.edit'),
                  icon: <SquarePen className='h-4 w-4' />,
                  dialog: {
                    title: t('actions.dialogs.edit.title'),
                    content: (
                      <SizeTypeForm sizeTypeId={sizeType.id} variant='edit' data={sizeType} />
                    ),
                  },
                  roles: [ValidRolesEnum.ADMIN, ValidRolesEnum.EDITOR],
                },
                {
                  content: t('actions.delete'),
                  icon: <Trash className='h-4 w-4 text-red-500 hover:text-red-600' />,
                  className: 'text-red-500 hover:!text-red-600',
                  dialog: {
                    content: (
                      <DeleteConfirmation
                        title={t('actions.dialogs.delete.title')}
                        onDelete={handleDelete}
                        itemName={`${sizeType.name}`}
                      />
                    ),
                  },
                  roles: [ValidRolesEnum.ADMIN, ValidRolesEnum.EDITOR],
                },
              ]}
            />
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    dispatch(
      getListSizeTypesAsync({
        data: {
          value: {
            page: query.page,
            limit: query.limit,
          },
          setToastSuccess: (status) => {
            if (isMounted) {
              showSuccessToast(tMessage(`toast.${status}`));
              setIsLoading(false);
            }
          },
          setToastError: (status) => {
            showErrorToast(tMessage(`toast.${status}`) || tMessage('toast.error'));
            setIsLoading(false);
          },
        },
      })
    );

    return () => {
      isMounted = false;
    };
  }, [dispatch, tMessage]);

  useEffect(() => {
    if (getSizeTypes?.data) {
      setData(getSizeTypes?.data as ISizeTypeRes[]);
      setTotalPages(getSizeTypes?.totalPages);
      setIsLoading(false);
    }
  }, [getSizeTypes]);

  const handleGetSizeTypes = (payload: { page?: number; limit?: number; textSearch?: string }) => {
    const { page, limit, textSearch } = payload;
    setIsLoading(true);
    dispatch(
      getListSizeTypesAsync({
        data: {
          value: {
            page: page || query.page,
            limit: limit || query.limit,
            textSearch,
          },
          setToastSuccess: () => {
            setIsLoading(false);
          },
          setToastError: (status) => {
            showErrorToast(tMessage(`toast.${status}`) || tMessage('toast.error'));
            setIsLoading(false);
          },
        },
      })
    );
  };

  const handleSearch = (value: string) => {
    setKeySearch(value);
    setCurrentPage(query.page);
    handleGetSizeTypes({ page: query.page, textSearch: value });
  };

  const handlePageChange = (page: number) => {
    if (keySearch.trim() !== '') {
      handleGetSizeTypes({ page, textSearch: keySearch });
    } else {
      handleGetSizeTypes({ page });
    }
  };

  return (
    <div className='container  space-y-4'>
      <div className='flex justify-between items-center'>
        <BaseTitle title={t('titleListSizeTypes')} />
      </div>
      <UseTable
        onChange={handleSearch}
        columns={columns}
        data={data}
        isLoading={isLoading}
        moreFeatures={<SizeTypeFeatures />}
      />
      {totalPages > 1 && (
        <BasePagination
          pages={totalPages}
          changeData={handlePageChange}
          currentPage={currentPage}
        />
      )}
    </div>
  );
}
