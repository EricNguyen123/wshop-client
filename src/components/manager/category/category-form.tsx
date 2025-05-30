/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { showErrorToast, showSuccessToast } from '@/components/toast/custom-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { EMPTY_STRING } from '@/constant';
import { useAppDispatch } from '@/lib/store/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import ButtonLoading from '@/components/button/button-loading';
import { categoryCreateSchema, categoryEditSchema } from '@/validations/category/category-schema';
import { createCategoryAsync, updateCategoryAsync } from '@/lib/store/features/category/thunk';
import { FolderTree, FolderOpen, Info, Folder } from 'lucide-react';
import { type Category, flattenCategories } from '@/utils/common';
import { CommandSelector } from '@/components/select/command-selector';
import { MultiCommandSelector } from '@/components/select/multi-command-selector';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { symbols } from '@/constant/common';

type CategoryFormValues = z.infer<typeof categoryCreateSchema> | z.infer<typeof categoryEditSchema>;

interface CategoryFormProps {
  categoryId?: string;
  closeDialog?: () => void;
  data?: any;
  variant?: 'create' | 'edit';
  categories: Category[];
}

export default function CategoryForm({
  categoryId,
  closeDialog,
  data,
  variant = 'create',
  categories,
}: CategoryFormProps) {
  const t = useTranslations('Form.CategoryCreate');
  const tMessage = useTranslations('Messages.error');
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const isEdit = variant === 'edit';
  const currentSubCategoryIds = useMemo(
    () => (isEdit && data?.subCategories ? data.subCategories.map((sub: Category) => sub.id) : []),
    [isEdit, data?.subCategories]
  );

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(isEdit ? categoryEditSchema : categoryCreateSchema),
    defaultValues: isEdit
      ? {
          name: data?.name || EMPTY_STRING,
          parentCategoryId: data?.parentCategoryId || EMPTY_STRING,
          subCategoryIds: currentSubCategoryIds,
        }
      : {
          name: EMPTY_STRING,
          parentCategoryId: EMPTY_STRING,
          subCategoryIds: [],
        },
  });

  const watchedParentId = form.watch('parentCategoryId');
  const watchedSubCategoryIds = useMemo(() => form.watch('subCategoryIds') || [], [form]);

  const allFlatCategories = useMemo(() => {
    const result: Category[] = [];
    const flatten = (cats: Category[]): void => {
      cats.forEach((cat) => {
        result.push(cat);
        if (cat.subCategories?.length) flatten(cat.subCategories);
      });
    };
    flatten(categories);
    return result;
  }, [categories]);

  const getAllDescendantIds = useMemo(
    () =>
      (targetId: string): string[] => {
        const descendants = new Set<string>();
        const stack = [targetId];

        while (stack.length > 0) {
          const currentId = stack.pop()!;
          allFlatCategories.forEach((cat) => {
            if (cat.parentCategoryId === currentId && !descendants.has(cat.id)) {
              descendants.add(cat.id);
              stack.push(cat.id);
            }
          });
        }
        return Array.from(descendants);
      },
    [allFlatCategories]
  );

  const isRootCategory = useMemo(
    () =>
      (targetId: string): boolean => {
        return allFlatCategories.find((cat) => cat.id === targetId)?.parentCategoryId === null;
      },
    [allFlatCategories]
  );

  const categoryOptions = useMemo(() => {
    const flatOptions = flattenCategories(categories, 0, t('option.description'));
    const noneOption = {
      value: '',
      label: t('option.none'),
      description: t('option.noneDescription'),
      level: 0,
      icon: Folder,
    };

    return [
      noneOption,
      ...flatOptions.map((option) => ({
        ...option,
        icon: option.level === 0 ? FolderTree : FolderOpen,
      })),
    ];
  }, [categories, t]);

  const filteredParentOptions = useMemo(() => {
    if (!categoryId) return categoryOptions;

    const invalidIds = new Set([
      categoryId,
      ...getAllDescendantIds(categoryId),
      ...watchedSubCategoryIds,
    ]);

    return categoryOptions.filter((option) => option.value === '' || !invalidIds.has(option.value));
  }, [categoryOptions, categoryId, getAllDescendantIds, watchedSubCategoryIds]);

  const filteredSubCategoryOptions = useMemo(() => {
    return categoryOptions.filter((option) => {
      if (!option.value) return false;
      if (option.value === categoryId) return false;
      if (watchedParentId && option.value === watchedParentId) return false;

      if (watchedSubCategoryIds.includes(option.value)) return true;

      if (isEdit && currentSubCategoryIds.includes(option.value)) return true;

      return isRootCategory(option.value);
    });
  }, [
    categoryOptions,
    categoryId,
    watchedParentId,
    watchedSubCategoryIds,
    isEdit,
    currentSubCategoryIds,
    isRootCategory,
  ]);

  const selectedSubCategories = useMemo(
    () => categoryOptions.filter((option) => watchedSubCategoryIds.includes(option.value)),
    [categoryOptions, watchedSubCategoryIds]
  );

  useEffect(() => {
    if (watchedParentId && watchedSubCategoryIds.includes(watchedParentId)) {
      const updatedSubCategories = watchedSubCategoryIds.filter((id) => id !== watchedParentId);
      form.setValue('subCategoryIds', updatedSubCategories);
    }
  }, [watchedParentId, watchedSubCategoryIds, form]);

  useEffect(() => {
    if (watchedSubCategoryIds.length > 0 && watchedParentId) {
      if (watchedSubCategoryIds.includes(watchedParentId)) {
        form.setValue('parentCategoryId', '');
      }
    }
  }, [watchedSubCategoryIds, watchedParentId, form]);

  const validateForm = (): boolean => {
    form.clearErrors();
    let isValid = true;

    if (watchedParentId && watchedSubCategoryIds.includes(watchedParentId)) {
      const message = 'A category cannot be both parent and subcategory';
      form.setError('parentCategoryId', { type: 'manual', message });
      form.setError('subCategoryIds', { type: 'manual', message });
      isValid = false;
    }

    if (isEdit && categoryId && watchedParentId) {
      if (watchedParentId === categoryId) {
        form.setError('parentCategoryId', {
          type: 'manual',
          message: 'Category cannot be its own parent',
        });
        isValid = false;
      }

      if (getAllDescendantIds(categoryId).includes(watchedParentId)) {
        form.setError('parentCategoryId', {
          type: 'manual',
          message: 'Cannot select a descendant category as parent',
        });
        isValid = false;
      }
    }

    if (isEdit && categoryId && watchedSubCategoryIds.length > 0) {
      if (watchedSubCategoryIds.includes(categoryId)) {
        form.setError('subCategoryIds', {
          type: 'manual',
          message: 'Category cannot be its own subcategory',
        });
        isValid = false;
      }

      const invalidNewSubs = watchedSubCategoryIds.filter(
        (id) => !currentSubCategoryIds.includes(id) && !isRootCategory(id)
      );

      if (invalidNewSubs.length > 0) {
        form.setError('subCategoryIds', {
          type: 'manual',
          message: 'Only root categories can be selected as new subcategories',
        });
        isValid = false;
      }
    }

    return isValid;
  };

  useEffect(() => {
    if (form.formState.isSubmitted) validateForm();
  }, [watchedParentId, watchedSubCategoryIds, form.formState.isSubmitted]);

  const onSubmit = (values: CategoryFormValues) => {
    if (!validateForm()) return;

    setIsLoading(true);

    const callbacks = {
      setToastSuccess: (status?: number) => {
        closeDialog?.();
        showSuccessToast(tMessage(`toast.${status?.toString()}`));
      },
      setToastError: (status?: number) => {
        setIsLoading(false);
        showErrorToast(tMessage(`toast.${status?.toString()}`) || tMessage('toast.error'));
      },
    };

    switch (variant) {
      case 'edit':
        if (categoryId) {
          const parsedValues = categoryEditSchema.parse(values);
          dispatch(
            updateCategoryAsync({
              categoryId,
              data: {
                value: {
                  name: parsedValues.name,
                  parentCategoryId: parsedValues.parentCategoryId || null,
                  subCategoryIds: parsedValues.subCategoryIds,
                },
                ...callbacks,
              },
            })
          );
        } else {
          const parsedValues = categoryEditSchema.parse(values);
          dispatch(
            createCategoryAsync({
              data: {
                value: {
                  name: parsedValues.name,
                  parentCategoryId: parsedValues.parentCategoryId || null,
                  subCategoryIds: parsedValues.subCategoryIds,
                },
                ...callbacks,
              },
            })
          );
        }
        break;
      case 'create':
        const parsedValues = categoryCreateSchema.parse(values);
        dispatch(
          createCategoryAsync({
            data: {
              value: {
                name: parsedValues.name,
                parentCategoryId: parsedValues.parentCategoryId || null,
                subCategoryIds: parsedValues.subCategoryIds,
              },
              ...callbacks,
            },
          })
        );
        break;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-6'>
        <ScrollArea className='max-h-[500px]'>
          <div className='w-full sm:px-4 grid gap-6'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='grid gap-2 relative'>
                  <FormLabel>
                    <Folder className='h-4 w-4' />
                    {t('label.name')}
                    <span className='text-red-500 ml-0.5'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      placeholder={t('placeholder.name')}
                      className='w-full h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20'
                      required
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='absolute -bottom-5' />
                </FormItem>
              )}
            />

            <div className='space-y-6'>
              <FormField
                control={form.control}
                name='parentCategoryId'
                render={({ field }) => (
                  <FormItem className='grid gap-2'>
                    <FormLabel>
                      <FolderTree className='h-4 w-4' />
                      {t('label.parentCategoryId')}
                      {isEdit && data?.parentCategoryId && (
                        <span className='text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full ml-2'>
                          {t('label.currentParentIncluded')}
                        </span>
                      )}
                    </FormLabel>
                    <FormControl>
                      <CommandSelector
                        options={filteredParentOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t('placeholder.parentCategoryId')}
                        placeholderSearch={t('placeholder.searchParentCategoryId')}
                        searchable
                        emptyMessage={t('message.noCategoryFound')}
                        allowClear
                        className='w-full'
                      />
                    </FormControl>
                    <FormDescription className='text-xs text-muted-foreground'>
                      {t('description.parentCategoryId')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='subCategoryIds'
                render={({ field }) => (
                  <FormItem className='grid gap-2'>
                    <FormLabel>
                      <FolderOpen className='h-4 w-4' />
                      {t('label.subCategoryIds')}
                      {selectedSubCategories.length > 0 && (
                        <span className='text-xs bg-primary/10 text-primary px-2 py-1 rounded-full ml-2'>
                          {selectedSubCategories.length} {t('label.selectedCount')}
                        </span>
                      )}
                    </FormLabel>
                    <FormControl>
                      <MultiCommandSelector
                        options={filteredSubCategoryOptions}
                        value={field.value || []}
                        onChange={field.onChange}
                        placeholder={t('placeholder.subCategoryIds')}
                        placeholderSearch={t('placeholder.searchSubCategoryIds')}
                        searchable
                        emptyMessage={t('message.noSubCategoryFound')}
                        maxSelected={10}
                        showCount
                        className='w-full'
                      />
                    </FormControl>
                    <FormDescription className='text-xs text-muted-foreground'>
                      {t('description.subCategoryIds')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {(watchedParentId || selectedSubCategories.length > 0) && (
                <Alert className='border-primary/20 bg-primary/5'>
                  <Info className='h-4 w-4 text-primary' />
                  <AlertDescription className='text-sm'>
                    <div className='space-y-2'>
                      <p className='font-medium text-primary'>{t('description.hierarchyTitle')}</p>
                      {watchedParentId && (
                        <div className='text-xs text-muted-foreground'>
                          <span className='font-medium'>{t('description.parentCategory')}</span>{' '}
                          {categoryOptions.find((opt) => opt.value === watchedParentId)?.label ||
                            'Unknown'}
                          {isEdit && data?.parentCategoryId === watchedParentId && (
                            <span className='text-blue-600 ml-1'>(Current)</span>
                          )}
                        </div>
                      )}
                      <div className='text-xs text-muted-foreground'>
                        <span className='font-medium'>{t('description.currentCategory')}</span>{' '}
                        {isEdit ? data?.name || symbols.inValid : t('description.newCategory')}
                      </div>
                      {selectedSubCategories.length > 0 && (
                        <div className='text-xs text-muted-foreground'>
                          <span className='font-medium'>{t('description.subCategories')}</span>{' '}
                          {selectedSubCategories
                            .map((cat) => {
                              const isCurrent = isEdit && currentSubCategoryIds.includes(cat.value);
                              return `${cat.label}${isCurrent ? ' (Current)' : ''}`;
                            })
                            .join(', ')}
                        </div>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </ScrollArea>

        <div className='grid grid-cols-2 gap-4 pt-2'>
          <Button type='button' variant='outline' className='w-full' onClick={closeDialog}>
            {t('button.cancel')}
          </Button>
          <ButtonLoading isLoading={isLoading} label={t('button.save')} />
        </div>
      </form>
    </Form>
  );
}
