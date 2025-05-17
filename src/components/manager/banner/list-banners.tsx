/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { ValidRolesEnum } from '@/common/enum';
import { UseTable } from '@/components/table/use-table';
import { Button } from '@/components/ui/button';
import { columnsKeyBanner, query, sort, symbols } from '@/constant/common';
import { IBannerRes } from '@/types/common';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Copy, Eye, SquarePen, Trash } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { showErrorToast, showSuccessToast } from '@/components/toast/custom-toast';
import { ActionButton } from '@/components/button/button-action';
import BasePagination from '@/components/pagination/base-pagination';
import { useRouter } from '@/i18n/navigation';
import config from '@/config';
import { selectCurrentAccount } from '@/lib/store/features/auth/slice';
import { DeleteConfirmation } from '@/components/delete/delete-confirmation';
import BaseTitle from '@/components/box/drop-box/base-title';
import { deleteBannerAsync, getListBannersAsync } from '@/lib/store/features/banner/thunk';
import { selectBanners } from '@/lib/store/features/banner/slice';
import Image from 'next/image';
import { DescriptionCell } from './description-cell';
import { format } from 'date-fns';
import BannerFeatures from './banner-features';
import BannerForm from './banner-form';
import images from '@/assets/images';

export default function ListBanners() {
  const t = useTranslations('Component.Banners');
  const [data, setData] = useState<IBannerRes[]>([]);
  const dispatch = useAppDispatch();
  const tMessage = useTranslations('Messages.error');
  const getBanners = useAppSelector(selectBanners);
  const currentAccount = useAppSelector(selectCurrentAccount);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [keySearch, setKeySearch] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(query.page);
  const [totalPages, setTotalPages] = useState<number>(query.totalPages);
  const routes = useRouter();

  const columns: ColumnDef<IBannerRes>[] = [
    {
      accessorKey: columnsKeyBanner.url,
      header: () => {
        return (
          <Button className='w-full' variant='ghost'>
            {t('fields.url')}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className='w-full flex items-center justify-center'>
          {row.getValue('url') ? (
            <div className='relative h-16 w-32 overflow-hidden rounded-md border border-border shadow-sm'>
              <Image
                src={row.getValue('url') || images.noImage}
                alt={`Banner ${row.getValue('descriptions') || 'image'}`}
                fill
                sizes='(max-width: 768px) 100vw, 128px'
                className='object-cover transition-transform hover:scale-105'
                onError={(e) => {
                  e.currentTarget.src = `${images.noImage}?height=64&width=128`;
                }}
              />
            </div>
          ) : (
            <div className='flex h-16 w-32 items-center justify-center rounded-md border border-border bg-muted/30'>
              <span className='text-xs text-muted-foreground'>{symbols.inValid}</span>
            </div>
          )}
        </div>
      ),
      enableHiding: false,
    },
    {
      accessorKey: columnsKeyBanner.descriptions,
      header: ({ column }) => {
        return (
          <Button
            className='w-full'
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === sort.asc)}
          >
            {t('fields.descriptions')}
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        const description = row.getValue('descriptions');
        return (
          <div className='w-full flex items-center justify-center'>
            {description ? (
              <div className='max-w-xs'>
                <DescriptionCell
                  description={typeof description === 'string' ? description : ''}
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
      accessorKey: columnsKeyBanner.startDate,
      header: ({ column }) => {
        return (
          <Button
            className='w-full'
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === sort.asc)}
          >
            {t('fields.startDate')}
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className='w-full flex items-center justify-center'>
          <span className='w-max text-nowrap text-sm font-normal'>
            {row.getValue('startDate') ? format(row.getValue('startDate'), 'PP') : symbols.inValid}
          </span>
        </div>
      ),
    },
    {
      accessorKey: columnsKeyBanner.endDate,
      header: ({ column }) => {
        return (
          <Button
            className='w-full'
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === sort.asc)}
          >
            {t('fields.endDate')}
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className='w-full flex items-center justify-center'>
          <span className='w-max text-nowrap text-sm font-normal'>
            {row.getValue('endDate') ? format(row.getValue('endDate'), 'PP') : symbols.inValid}
          </span>
        </div>
      ),
    },
    {
      accessorKey: columnsKeyBanner.numberOrder,
      header: ({ column }) => {
        return (
          <Button
            className='w-full'
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === sort.asc)}
          >
            {t('fields.numberOrder')}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className='w-full flex items-center justify-center'>
          <span className='w-max text-nowrap text-sm font-normal'>
            {row.getValue('numberOrder') ? row.getValue('numberOrder') : symbols.inValid}
          </span>
        </div>
      ),
      enableHiding: false,
    },
    {
      id: columnsKeyBanner.actions,
      enableHiding: false,

      cell: ({ row }) => {
        const banner = row.original;
        const handle = () => {
          if (banner.id) {
            return navigator.clipboard.writeText(banner.id);
          }
        };

        const handleDelete = () => {
          if (banner.id) {
            dispatch(
              deleteBannerAsync({
                data: {
                  value: { bannerId: banner.id },
                  setToastSuccess: (status?: number) => {
                    showSuccessToast(tMessage(`toast.${status?.toString()}`));
                  },
                  setToastError: (status?: number) => {
                    showErrorToast(
                      tMessage(`toast.${status?.toString()}`) || tMessage('toast.error')
                    );
                  },
                },
              })
            );
          }
        };

        return (
          <div className='w-max' onClick={(e) => e.stopPropagation()}>
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
                    content: <BannerForm bannerId={banner.id} variant='edit' data={banner} />,
                  },
                  roles: [ValidRolesEnum.ADMIN, ValidRolesEnum.EDITOR],
                },
                {
                  content: t('actions.detail'),
                  icon: <Eye className='h-4 w-4' />,
                  onSelect: () => routes.push(`${config.routes.private.banners}/${banner.id}`),
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
                        itemName={`${format(row.getValue('startDate'), 'PP')} - ${format(
                          row.getValue('endDate'),
                          'PP'
                        )}`}
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
      getListBannersAsync({
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
    if (getBanners?.data) {
      setData(getBanners?.data);
      setTotalPages(getBanners?.totalPages);
      setIsLoading(false);
    }
  }, [getBanners]);

  const handleGetBanners = (payload: { page?: number; limit?: number; textSearch?: string }) => {
    const { page, limit, textSearch } = payload;
    setIsLoading(true);
    dispatch(
      getListBannersAsync({
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
    handleGetBanners({ page: query.page, textSearch: value });
  };

  const handlePageChange = (page: number) => {
    if (keySearch.trim() !== '') {
      handleGetBanners({ page, textSearch: keySearch });
    } else {
      handleGetBanners({ page });
    }
  };

  return (
    <div className='container  space-y-4'>
      <div className='flex justify-between items-center'>
        <BaseTitle title={t('titleListBanners')} />
      </div>
      <UseTable
        onChange={handleSearch}
        columns={columns}
        data={data}
        isLoading={isLoading}
        onRowClick={(row) => {
          const banner = row.original;
          if (
            banner.id &&
            [ValidRolesEnum.ADMIN, ValidRolesEnum.EDITOR].includes(
              currentAccount?.user.role ?? ValidRolesEnum.USER
            )
          ) {
            routes.push(`${config.routes.private.banners}/${banner.id}`);
          }
        }}
        moreFeatures={<BannerFeatures />}
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
