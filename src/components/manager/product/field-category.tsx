/* eslint-disable @typescript-eslint/no-explicit-any */
import { MultiCommandSelector } from '@/components/select/multi-command-selector';
import { Badge } from '@/components/ui/badge';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { X } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ProductFormValues } from './product-form';
import { useTranslations } from 'next-intl';
import { ICategoryRes } from '@/types/common';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { selectCategories } from '@/lib/store/features/category/slice';
import { getListCategoriesAsync } from '@/lib/store/features/category/thunk';
import { Category } from '@/utils/common';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';

type OptionType = { value: string; label: string };

export default function FieldCategory({
  form,
}: {
  form: UseFormReturn<ProductFormValues, any, ProductFormValues>;
}) {
  const t = useTranslations('Form.ProductCreate');
  const dispatch = useAppDispatch();
  const [data, setData] = useState<ICategoryRes[]>([]);
  const getCategories = useAppSelector(selectCategories);

  const allFlatCategories = useMemo(() => {
    const result: OptionType[] = [];
    const flatten = (cats: Category[]): void => {
      cats.forEach((cat) => {
        result.push({
          value: cat.id,
          label: `${cat.name}`,
        });
        if (cat.subCategories?.length) flatten(cat.subCategories);
      });
    };
    flatten(data as Category[]);
    return result;
  }, [data]);

  useEffect(() => {
    dispatch(
      getListCategoriesAsync({
        data: {
          value: {},
          setToastSuccess: () => {},
          setToastError: () => {},
        },
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (getCategories?.data) {
      setData(getCategories?.data);
    }
  }, [getCategories]);

  const handleRemoveCategory = (catIdToRemove: string, currentValue: string[]) => {
    const newValue = currentValue.filter((id) => id !== catIdToRemove);
    form.setValue('categoryIds', newValue);
  };

  return (
    <div className='grid gap-6'>
      <div className='space-y-2'>
        <Label className='text-lg font-bold'>{t('label.organization')}</Label>
        <Separator />
      </div>
      <FormField
        control={form.control}
        name='categoryIds'
        render={({ field }) => (
          <FormItem className='grid gap-2'>
            <FormLabel>{t('label.categoryIds')}</FormLabel>
            <FormControl>
              <MultiCommandSelector
                options={allFlatCategories}
                value={field.value || []}
                onChange={field.onChange}
                placeholder={t('placeholder.categoryIds')}
                placeholderSearch={t('placeholder.searchCategoryIds')}
                searchable
                emptyMessage={t('message.noCategoryFound')}
                showCount
                className='w-full'
              />
            </FormControl>
            <FormMessage />
            <div className='flex flex-wrap gap-2 mt-2'>
              {field.value?.map((catId: string) => {
                const category = allFlatCategories.find((c) => c.value === catId);
                return category ? (
                  <Badge key={catId} variant='secondary' className='gap-1'>
                    {category.label}
                    <button
                      type='button'
                      onClick={() => handleRemoveCategory(catId, field.value ?? [])}
                      className='ml-1 rounded-full hover:bg-muted cursor-pointer'
                    >
                      <X className='h-3 w-3' />
                    </button>
                  </Badge>
                ) : null;
              })}
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}
