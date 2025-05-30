'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CategoryTree } from './category-tree';
import BaseSearch from '@/components/input/search';
import { useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { getListCategoriesAsync } from '@/lib/store/features/category/thunk';
import { query } from '@/constant/common';
import { showErrorToast, showSuccessToast } from '@/components/toast/custom-toast';
import BasePagination from '@/components/pagination/base-pagination';
import { selectCategories } from '@/lib/store/features/category/slice';
import { ICategoryRes } from '@/types/common';
import { CategoryListSkeleton } from './category-list-skeleton';
import CreateCategoryDialog from './create-category-dialog';
import { Category } from '@/utils/common';
import NoResult from '@/components/not-found/no-result';

export function CategoryList() {
  const t = useTranslations('Component.Categories');
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<ICategoryRes[]>([]);
  const tMessage = useTranslations('Messages.error');
  const [keySearch, setKeySearch] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(query.page);
  const [totalPages, setTotalPages] = useState<number>(query.totalPages);
  const getCategories = useAppSelector(selectCategories);

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    dispatch(
      getListCategoriesAsync({
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
    if (getCategories?.data) {
      setData(getCategories?.data);
      setTotalPages(getCategories?.totalPages);
      setCurrentPage(getCategories?.page);
      setIsLoading(false);
    }
  }, [getCategories]);

  const handleGetCategories = (payload: {
    page?: number;
    limit?: number;
    textSearch?: string;
    [key: string]: string | number | undefined;
  }) => {
    const { page, limit, textSearch, ...rest } = payload;
    setIsLoading(true);
    dispatch(
      getListCategoriesAsync({
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
    handleGetCategories({ page: query.page, textSearch: value });
  };

  const handlePageChange = (page: number) => {
    if (keySearch.trim() !== '') {
      handleGetCategories({ page, textSearch: keySearch });
    } else {
      handleGetCategories({ page });
    }
  };

  return (
    <div className='space-y-4'>
      <div className='w-full flex  items-center justify-between space-y-2 lg:space-y-0 space-x-2'>
        <div className='w-full flex items-center justify-start mb-0'>
          <BaseSearch placeholder={t('titleSearch')} onChange={handleSearch} variant='default' />
        </div>
        <CreateCategoryDialog categories={data as Category[]} />
      </div>

      {!isLoading ? (
        <Card>
          <CardHeader>
            <CardTitle>{t('titleAll')}</CardTitle>
            <CardDescription>{t('description')}</CardDescription>
          </CardHeader>
          <CardContent className='p-0 sm:px-6'>
            {data.length > 0 ? (
              <div className='space-y-1'>
                <CategoryTree categories={data} allData={data} />
              </div>
            ) : (
              <NoResult />
            )}
          </CardContent>
          <CardFooter className='flex justify-between items-center'>
            {totalPages > 1 && (
              <BasePagination
                pages={totalPages}
                changeData={handlePageChange}
                currentPage={currentPage}
              />
            )}
          </CardFooter>
        </Card>
      ) : (
        <CategoryListSkeleton />
      )}
    </div>
  );
}
