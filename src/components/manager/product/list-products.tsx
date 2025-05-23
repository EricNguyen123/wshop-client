/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { ValidRolesEnum } from '@/common/enum';
import { UseTable } from '@/components/table/use-table';
import { Button } from '@/components/ui/button';
import { columnsKeyProduct, query, sort, symbols } from '@/constant/common';
import { IBannerRes, IProductRes } from '@/types/common';
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
import { deleteProductAsync, getListProductsAsync } from '@/lib/store/features/product/thunk';
import { DescriptionCell } from '../banner/description-cell';
import { selectProducts } from '@/lib/store/features/product/slice';
import { CustomCarousel } from '@/components/carousel/custom-carousel';
import {
  formatCurrency,
  formatDiscount,
  formatMultiplicationRate,
  formatNumber,
} from '@/utils/helpers';
import BaseTooltip from '@/components/tooltip/base-tooltip';
import ProductFeatures from './product-features';
import ProductForm from './product-form';
import images from '@/assets/images';
import Image from 'next/image';
import StatusProductCell from './status-product-cell';

export default function ListProducts() {
  const t = useTranslations('Component.Products');
  const [data, setData] = useState<IBannerRes[]>([]);
  const dispatch = useAppDispatch();
  const tMessage = useTranslations('Messages.error');
  const getProducts = useAppSelector(selectProducts);
  const currentAccount = useAppSelector(selectCurrentAccount);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [keySearch, setKeySearch] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(query.page);
  const [totalPages, setTotalPages] = useState<number>(query.totalPages);
  const routes = useRouter();
  const [currentStatus, setCurrentStatus] = useState<string>('');

  const columns: ColumnDef<IProductRes>[] = [
    {
      accessorKey: columnsKeyProduct.medias,
      header: () => {
        return (
          <Button className='w-full' variant='ghost'>
            {t('fields.media')}
          </Button>
        );
      },
      cell: ({ row }) => {
        const medias = row.getValue('medias') as any[] | undefined;
        const slides = Array.isArray(medias)
          ? medias.map((item: any) => {
              return {
                id: item.id,
                image: item.mediaUrl,
              };
            })
          : [];
        return (
          <div className='w-full flex items-center justify-center'>
            {slides.length ? (
              <div className='relative h-18 w-32 overflow-hidden shadow-sm'>
                <CustomCarousel
                  slides={slides}
                  size='full'
                  variant='product'
                  showDots={false}
                  showArrows={false}
                  autoPlay={true}
                  arrowStyle={{
                    variant: 'minimal',
                    size: 'lg',
                    icon: 'chevron',
                    position: 'inside',
                  }}
                  aspectRatio='wide'
                />
              </div>
            ) : (
              <div className='relative h-18 w-32 overflow-hidden rounded-md border border-border shadow-sm'>
                <Image
                  src={images.noImage}
                  alt={`no-image`}
                  fill
                  sizes='(max-width: 768px) 100vw, 128px'
                  className='object-cover transition-transform hover:scale-105'
                />
              </div>
            )}
          </div>
        );
      },
      enableHiding: false,
    },
    {
      accessorKey: columnsKeyProduct.name,
      header: ({ column }) => {
        return (
          <Button
            className='w-full'
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === sort.asc)}
          >
            {t('fields.name')}
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        const name = row.getValue('name');
        return (
          <div className='w-full flex items-center justify-center'>
            {name ? (
              <div className='max-w-xs'>
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
    },
    {
      accessorKey: columnsKeyProduct.code,
      header: ({ column }) => {
        return (
          <Button
            className='w-full'
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === sort.asc)}
          >
            {t('fields.code')}
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className='w-full flex items-center justify-center'>
          <span className='w-max text-nowrap text-sm font-normal'>
            {row.getValue('code') || symbols.inValid}
          </span>
        </div>
      ),
    },
    {
      accessorKey: columnsKeyProduct.description,
      header: ({ column }) => {
        return (
          <Button
            className='w-full'
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === sort.asc)}
          >
            {t('fields.description')}
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        const description = row.getValue('description');
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
      accessorKey: columnsKeyProduct.price,
      header: ({ column }) => {
        return (
          <Button
            className='w-full'
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === sort.asc)}
          >
            {t('fields.price')}
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className='w-full flex items-center justify-center'>
          <BaseTooltip nameTooltip={formatCurrency(row.getValue('price'))}>
            <span className='w-max text-nowrap text-sm font-normal'>
              {row.getValue('price')
                ? formatCurrency(row.getValue('price'), { compact: true })
                : symbols.inValid}
            </span>
          </BaseTooltip>
        </div>
      ),
    },
    {
      accessorKey: columnsKeyProduct.quantity,
      header: ({ column }) => {
        return (
          <Button
            className='w-full'
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === sort.asc)}
          >
            {t('fields.quantity')}
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className='w-full flex items-center justify-center'>
          <BaseTooltip nameTooltip={row.getValue('quantity')}>
            <span className='w-max text-nowrap text-sm font-normal'>
              {row.getValue('quantity') ? formatNumber(row.getValue('quantity')) : symbols.inValid}
            </span>
          </BaseTooltip>
        </div>
      ),
    },
    {
      accessorKey: columnsKeyProduct.quantityAlert,
      header: ({ column }) => {
        return (
          <Button
            className='w-full'
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === sort.asc)}
          >
            {t('fields.quantityAlert')}
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className='w-full flex items-center justify-center'>
          <BaseTooltip nameTooltip={row.getValue('quantityAlert')}>
            <span className='w-max text-nowrap text-sm font-normal'>
              {row.getValue('quantityAlert')
                ? formatNumber(row.getValue('quantityAlert'))
                : symbols.inValid}
            </span>
          </BaseTooltip>
        </div>
      ),
    },
    {
      accessorKey: columnsKeyProduct.orderUnit,
      header: ({ column }) => {
        return (
          <Button
            className='w-full'
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === sort.asc)}
          >
            {t('fields.orderUnit')}
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className='w-full flex items-center justify-center'>
          <BaseTooltip nameTooltip={row.getValue('orderUnit')}>
            <span className='w-max text-nowrap text-sm font-normal'>
              {row.getValue('orderUnit')
                ? formatNumber(row.getValue('orderUnit'))
                : symbols.inValid}
            </span>
          </BaseTooltip>
        </div>
      ),
    },
    {
      accessorKey: columnsKeyProduct.discount,
      header: ({ column }) => {
        return (
          <Button
            className='w-full'
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === sort.asc)}
          >
            {t('fields.discount')}
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className='w-full flex items-center justify-center'>
          <span className='w-max text-nowrap text-sm font-normal'>
            {row.getValue('discount')
              ? formatDiscount(row.getValue('discount'), 'percent')
              : symbols.inValid}
          </span>
        </div>
      ),
    },
    {
      accessorKey: columnsKeyProduct.status,
      header: ({ column }) => {
        return (
          <Button
            className='w-full'
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === sort.asc)}
          >
            {t('fields.status')}
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        const status = Number(row.getValue('status'));

        return <StatusProductCell status={status} />;
      },
    },
    {
      accessorKey: columnsKeyProduct.multiplicationRate,
      header: ({ column }) => {
        return (
          <Button
            className='w-full'
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === sort.asc)}
          >
            {t('fields.multiplicationRate')}
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className='w-full flex items-center justify-center'>
          <span className='w-max text-nowrap text-sm font-normal'>
            {row.getValue('multiplicationRate')
              ? String(
                  formatMultiplicationRate(row.getValue('multiplicationRate'), {
                    format: 'percent',
                    digits: 2,
                  }).displayText
                )
              : symbols.inValid}
          </span>
        </div>
      ),
    },
    {
      id: columnsKeyProduct.actions,
      enableHiding: false,

      cell: ({ row }) => {
        const product = row.original;
        const handle = () => {
          if (product.id) {
            return navigator.clipboard.writeText(product.id);
          }
        };

        const handleDelete = () => {
          if (product.id) {
            dispatch(
              deleteProductAsync({
                data: {
                  value: { productId: product.id },
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
                    content: <ProductForm data={product} variant='edit' productId={product.id} />,
                  },
                  roles: [ValidRolesEnum.ADMIN, ValidRolesEnum.EDITOR],
                },
                {
                  content: t('actions.detail'),
                  icon: <Eye className='h-4 w-4' />,
                  onSelect: () => routes.push(`${config.routes.private.products}/${product.id}`),
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
                        itemName={`${row.getValue('name')}`}
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
      getListProductsAsync({
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
    if (getProducts?.data) {
      setData(getProducts?.data);
      setTotalPages(getProducts?.totalPages);
      setIsLoading(false);
    }
  }, [getProducts]);

  const handleGetProducts = (payload: {
    page?: number;
    limit?: number;
    textSearch?: string;
    [key: string]: string | number | undefined;
  }) => {
    const { page, limit, textSearch, ...rest } = payload;
    setIsLoading(true);
    dispatch(
      getListProductsAsync({
        data: {
          value: {
            page: page || query.page,
            limit: limit || query.limit,
            textSearch,
            ...rest,
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
    setCurrentStatus('');
    setKeySearch(value);
    setCurrentPage(query.page);
    handleGetProducts({ page: query.page, textSearch: value });
  };

  const handlePageChange = (page: number) => {
    if (keySearch.trim() !== '') {
      handleGetProducts({ page, textSearch: keySearch });
    } else {
      handleGetProducts({ page });
    }
  };

  const handleStatusChange = (value?: string) => {
    setCurrentStatus(value || '');
    if (value !== '') {
      handleGetProducts({ page: query.page, limit: query.limit, status: value });
    } else {
      handleGetProducts({ page: query.page, limit: query.limit });
    }
  };

  const handleAll = () => {
    handleGetProducts({ page: query.page, limit: query.limit });
  };

  return (
    <div className='container  space-y-4'>
      <div className='flex justify-between items-center'>
        <BaseTitle title={t('titleListProducts')} />
      </div>
      <UseTable
        onChange={handleSearch}
        columns={columns}
        data={data}
        isLoading={isLoading}
        onRowClick={(row) => {
          const product = row.original;
          if (
            product.id &&
            [ValidRolesEnum.ADMIN, ValidRolesEnum.EDITOR].includes(
              currentAccount?.user.role ?? ValidRolesEnum.USER
            )
          ) {
            routes.push(`${config.routes.private.products}/${product.id}`);
          }
        }}
        moreFeatures={
          <ProductFeatures
            handleStatusChange={handleStatusChange}
            currentStatus={currentStatus}
            handleAll={handleAll}
          />
        }
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
