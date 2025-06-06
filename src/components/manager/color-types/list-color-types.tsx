'use client';

import { useEffect, useState } from 'react';
import { Plus, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ColorTypesGrid } from './color-types-grid';
import { ColorTypeDialog } from './color-type-dialog';
import { Badge } from '@/components/ui/badge';
import { IColorType } from '@/types/common';
import BaseSearch from '@/components/input/search';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  createColorTypeAsync,
  deleteColorTypeAsync,
  getListColorTypesAsync,
  updateColorTypeAsync,
} from '@/lib/store/features/color-type/thunk';
import { query } from '@/constant/common';
import { showErrorToast, showSuccessToast } from '@/components/toast/custom-toast';
import { useTranslations } from 'next-intl';
import { selectColorTypes } from '@/lib/store/features/color-type/slice';
import BasePagination from '@/components/pagination/base-pagination';

export function ListColorTypes() {
  const t = useTranslations('Component.ColorTypes');
  const dispatch = useAppDispatch();
  const tMessage = useTranslations('Messages.error');
  const [colorTypes, setColorTypes] = useState<IColorType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingColorType, setEditingColorType] = useState<IColorType | null>(null);
  const getColorTypes = useAppSelector(selectColorTypes);
  const [currentPage, setCurrentPage] = useState<number>(query.page);
  const [totalPages, setTotalPages] = useState<number>(query.totalPages);

  const handleCreate = (newColorType: Omit<IColorType, 'id' | 'createdAt' | 'updatedAt'>) => {
    dispatch(
      createColorTypeAsync({
        data: {
          value: newColorType,
          setToastSuccess: (status) => {
            showSuccessToast(tMessage(`toast.${status}`));
            setIsDialogOpen(false);
          },
          setToastError: (status) => {
            showErrorToast(tMessage(`toast.${status}`) || tMessage('toast.error'));
          },
        },
      })
    );
  };

  const handleUpdate = (updatedColorType: Omit<IColorType, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingColorType) return;

    dispatch(
      updateColorTypeAsync({
        data: {
          value: updatedColorType,
          setToastSuccess: (status) => {
            showSuccessToast(tMessage(`toast.${status}`));
            setEditingColorType(null);
            setIsDialogOpen(false);
          },
          setToastError: (status) => {
            showErrorToast(tMessage(`toast.${status}`) || tMessage('toast.error'));
          },
        },
        colorTypeId: editingColorType.id,
      })
    );
  };

  const handleEdit = (colorType: IColorType) => {
    setEditingColorType(colorType);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    dispatch(
      deleteColorTypeAsync({
        data: {
          value: {
            colorTypeId: id,
          },
          setToastSuccess: (status) => {
            showSuccessToast(tMessage(`toast.${status}`));
            setColorTypes((prev) => prev.filter((ct) => ct.id !== id));
          },
          setToastError: (status) => {
            showErrorToast(tMessage(`toast.${status}`) || tMessage('toast.error'));
          },
        },
      })
    );
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingColorType(null);
  };

  useEffect(() => {
    let isMounted = true;

    dispatch(
      getListColorTypesAsync({
        data: {
          value: {
            page: query.page,
            limit: query.limit,
          },
          setToastSuccess: (status) => {
            if (isMounted) {
              showSuccessToast(tMessage(`toast.${status}`));
            }
          },
          setToastError: (status) => {
            showErrorToast(tMessage(`toast.${status}`) || tMessage('toast.error'));
          },
        },
      })
    );

    return () => {
      isMounted = false;
    };
  }, [dispatch, tMessage]);

  useEffect(() => {
    if (getColorTypes?.data) {
      setColorTypes(getColorTypes?.data);
      setTotalPages(getColorTypes?.totalPages);
    }
  }, [getColorTypes]);

  const handleGetColorTypes = (payload: {
    page?: number;
    limit?: number;
    textSearch?: string;
    [key: string]: string | number | undefined;
  }) => {
    const { page, limit, textSearch, ...rest } = payload;

    dispatch(
      getListColorTypesAsync({
        data: {
          value: {
            page: page || query.page,
            limit: limit || query.limit,
            textSearch,
            ...rest,
          },
          setToastSuccess: () => {},
          setToastError: (status) => {
            showErrorToast(tMessage(`toast.${status}`) || tMessage('toast.error'));
          },
        },
      })
    );
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(query.page);
    handleGetColorTypes({ page: query.page, textSearch: value });
  };

  const handlePageChange = (page: number) => {
    if (searchTerm.trim() !== '') {
      handleGetColorTypes({ page, textSearch: searchTerm.trim() });
    } else {
      handleGetColorTypes({ page });
    }
  };

  return (
    <div className='space-y-8'>
      <div className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 p-8 text-white'>
        <div className='absolute inset-0 bg-black/20' />
        <div className='relative z-10 flex flex-col xl:flex-row items-start lg:items-center justify-between gap-6'>
          <div className='w-full flex sm:flex-row flex-col items-center justify-start sm:justify-between space-y-2'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='p-3 bg-white/20 backdrop-blur-sm rounded-2xl'>
                <Palette className='h-8 w-8' />
              </div>
              <div>
                <h1 className='text-4xl font-bold'>{t('title')}</h1>
                <p className='text-white/80 text-lg'>{t('titleDescription')}</p>
              </div>
            </div>
            <div className='flex items-center gap-4 text-sm'>
              <Badge variant='secondary' className='bg-white/20 text-white border-white/30'>
                {colorTypes.length} {t('titleColor')}
              </Badge>
              <Badge variant='secondary' className='bg-white/20 text-white border-white/30'>
                {t('titleUpdate')}
              </Badge>
            </div>
          </div>
          <div className='w-full flex flex-col sm:flex-row items-center justify-between  space-y-2 sm:space-y-0 space-x-2'>
            <div className='w-full flex items-center justify-start '>
              <BaseSearch
                onChange={handleSearch}
                value={searchTerm}
                variant='default'
                className='placeholder:text-white'
              />
            </div>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className='bg-white text-purple-600 hover:bg-white/90 gap-2 w-full sm:w-auto'
            >
              <Plus className='h-4 w-4' />
              {t('button.create')}
            </Button>
          </div>
        </div>

        <div className='absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-pink-400 to-red-400 rounded-full opacity-60 blur-xl' />
        <div className='absolute bottom-4 left-1/4 w-16 h-16 bg-gradient-to-br from-green-400 to-blue-400 rounded-full opacity-40 blur-lg' />
        <div className='absolute top-1/2 right-1/3 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full opacity-50 blur-md' />
      </div>

      <div className='min-h-[400px]'>
        <ColorTypesGrid colorTypes={colorTypes} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
      <div className='flex justify-between items-center'>
        {totalPages > 1 && (
          <BasePagination
            pages={totalPages}
            changeData={handlePageChange}
            currentPage={currentPage}
          />
        )}
      </div>

      <ColorTypeDialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        colorType={editingColorType}
        onSubmit={editingColorType ? handleUpdate : handleCreate}
      />
    </div>
  );
}
