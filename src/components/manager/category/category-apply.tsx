/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { ValidRolesEnum } from '@/common/enum';
import { UseTable } from '@/components/table/use-table';
import { Button } from '@/components/ui/button';
import { columnsKeyProduct, query, sort, symbols } from '@/constant/common';
import { IProductRes } from '@/types/common';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Copy, Eye } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { showErrorToast, showSuccessToast } from '@/components/toast/custom-toast';
import { ActionButton } from '@/components/button/button-action';
import BasePagination from '@/components/pagination/base-pagination';
import { useRouter } from '@/i18n/navigation';
import config from '@/config';
import { selectCurrentAccount } from '@/lib/store/features/auth/slice';
import BaseTitle from '@/components/box/drop-box/base-title';
import { getListProductsAsync } from '@/lib/store/features/product/thunk';
import { DescriptionCell } from '../banner/description-cell';
import { selectProducts } from '@/lib/store/features/product/slice';
import { CustomCarousel } from '@/components/carousel/custom-carousel';
import { formatCurrency } from '@/utils/helpers';
import BaseTooltip from '@/components/tooltip/base-tooltip';
import images from '@/assets/images';
import Image from 'next/image';
import { Checkbox } from '@/components/ui/checkbox';
import FeatureApply from './feature-apply';

export default function CategoryApply({ categoryId }: { categoryId: string }) {
  const t = useTranslations('Component.Products');
  const [data, setData] = useState<IProductRes[]>([]);
  const dispatch = useAppDispatch();
  const tMessage = useTranslations('Messages.error');
  const getProducts = useAppSelector(selectProducts);
  const currentAccount = useAppSelector(selectCurrentAccount);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [keySearch, setKeySearch] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(query.page);
  const [totalPages, setTotalPages] = useState<number>(query.totalPages);
  const routes = useRouter();

  const columns: ColumnDef<IProductRes>[] = [
    {
      id: columnsKeyProduct.select,
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
          className='cursor-pointer'
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
          onClick={(e) => e.stopPropagation()}
          className='cursor-pointer'
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
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
      id: columnsKeyProduct.actions,
      enableHiding: false,

      cell: ({ row }) => {
        const product = row.original;
        const handle = () => {
          if (product.id) {
            return navigator.clipboard.writeText(product.id);
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
      const dataProducts = getProducts?.data.filter(
        (product) => !product.categories?.some((category) => category.id === categoryId)
      );
      setData(dataProducts);
      setTotalPages(getProducts?.totalPages);
      setIsLoading(false);
    }
  }, [getProducts, categoryId]);

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

  return (
    <div className='container  space-y-4'>
      <div className='flex justify-between items-center'>
        <BaseTitle title={t('titleApplyProducts')} />
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
        moreFeatures={<FeatureApply data={data} categoryId={categoryId} />}
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
