/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { ValidRolesEnum } from '@/common/enum';
import { UseTable } from '@/components/table/use-table';
import { Button } from '@/components/ui/button';
import { columnsKeyProduct, query, sort, symbols } from '@/constant/common';
import { IProductRes } from '@/types/common';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Copy, Eye, Trash } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/lib/store/hooks';
import { ActionButton } from '@/components/button/button-action';
import BasePagination from '@/components/pagination/base-pagination';
import { useRouter } from '@/i18n/navigation';
import config from '@/config';
import { selectCurrentAccount } from '@/lib/store/features/auth/slice';
import { DeleteConfirmation } from '@/components/delete/delete-confirmation';
import BaseTitle from '@/components/box/drop-box/base-title';
import { DescriptionCell } from '../banner/description-cell';
import { CustomCarousel } from '@/components/carousel/custom-carousel';
import { formatCurrency, formatNumber } from '@/utils/helpers';
import BaseTooltip from '@/components/tooltip/base-tooltip';
import images from '@/assets/images';
import Image from 'next/image';
import StatusProductCell from './status-product-cell';
import ProductFeatures from './product-features';

export default function ProductsForItem({
  products,
  handleRemoveProduct,
  labelRemove,
  actionRemove,
  moreComponent,
}: {
  products: IProductRes[];
  handleRemoveProduct: (id: string) => void;
  labelRemove?: string;
  actionRemove?: string;
  moreComponent?: React.ReactNode;
}) {
  const t = useTranslations('Component.Products');
  const [data, setData] = useState<IProductRes[]>([]);
  const tMessage = useTranslations('Messages.error');
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
            handleRemoveProduct(product.id);
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
                  content: t('actions.detail'),
                  icon: <Eye className='h-4 w-4' />,
                  onSelect: () => routes.push(`${config.routes.private.products}/${product.id}`),
                  roles: [ValidRolesEnum.ADMIN, ValidRolesEnum.EDITOR],
                },
                {
                  content: actionRemove || t('actions.delete'),
                  icon: <Trash className='h-4 w-4 text-red-500 hover:text-red-600' />,
                  className: 'text-red-500 hover:!text-red-600',
                  dialog: {
                    content: (
                      <DeleteConfirmation
                        title={labelRemove || t('actions.dialogs.delete.title')}
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
    setIsLoading(true);
    if (products) {
      setData(products.slice(0, query.limit));
      setTotalPages(Math.ceil(products.length / query.limit));
      setIsLoading(false);
    }
  }, [products, tMessage]);

  const handleGetProducts = (payload: {
    page?: number;
    limit?: number;
    textSearch?: string;
    [key: string]: string | number | undefined;
  }) => {
    const { page = query.page, limit = query.limit, textSearch, ...rest } = payload;

    let filteredProducts = [...products];

    if (textSearch) {
      const searchLower = textSearch.toLowerCase();
      filteredProducts = filteredProducts.filter((product) => {
        const nameMatch = product.name?.toLowerCase().includes(searchLower);
        const codeMatch = product.code?.toLowerCase().includes(searchLower);
        return nameMatch || codeMatch;
      });
    }

    for (const [key, value] of Object.entries(rest)) {
      if (value !== undefined) {
        filteredProducts = filteredProducts.filter(
          (product) => String((product as Record<string, unknown>)[key]) === String(value)
        );
      }
    }
    const offset = (page - 1) * limit;
    const paginatedData = filteredProducts.slice(offset, offset + limit);
    setCurrentPage(page);
    setData(paginatedData);
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
    setCurrentStatus('');
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
            moreComponent={moreComponent}
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
