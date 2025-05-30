import BoxInfoItem from '@/components/box/drop-box/base-info';
import NoResult from '@/components/not-found/no-result';
import { showErrorToast, showSuccessToast } from '@/components/toast/custom-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { symbols } from '@/constant/common';
import { selectCategories, selectDetailCategory } from '@/lib/store/features/category/slice';
import {
  deleteCategoryAsync,
  getDetailCategoryAsync,
  removeProductsFromCategory,
} from '@/lib/store/features/category/thunk';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { ICategoryDetailRes } from '@/types/common';
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { CategoryTree } from './category-tree';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ActionButton } from '@/components/button/button-action';
import { ValidRolesEnum } from '@/common/enum';
import { Plus, SquarePen, Trash } from 'lucide-react';
import CategoryForm from './category-form';
import { Category } from '@/utils/common';
import { DeleteConfirmation } from '@/components/delete/delete-confirmation';
import { selectCurrentAccount } from '@/lib/store/features/auth/slice';
import { findNodeById } from '@/utils/helpers';
import EditCategoryDialog from './edit-category-dialog';
import ProductsForItem from '../product/product-for-item';
import { Link, useRouter } from '@/i18n/navigation';
import config from '@/config';
import { Button } from '@/components/ui/button';

export default function CategoryDetail({ categoryId }: { categoryId: string }) {
  const dispatch = useAppDispatch();
  const selectCategory = useAppSelector(selectDetailCategory);
  const tMessage = useTranslations('Messages.error');
  const t = useTranslations('Component.Categories');
  const tForm = useTranslations('Form.CategoryCreate');
  const [categoryInfo, setCategoryInfo] = useState<
    { name: string; content: string | React.ReactNode }[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [category, setCategory] = useState<ICategoryDetailRes | null>(null);
  const getCategories = useAppSelector(selectCategories);
  const currentAccount = useAppSelector(selectCurrentAccount);
  const routes = useRouter();

  useEffect(() => {
    let isMounted = true;

    if (categoryId) {
      if (!isLoading) {
        setIsLoading(true);
        dispatch(
          getDetailCategoryAsync({
            data: {
              value: {
                categoryId,
              },
              setToastSuccess: (status?: number) => {
                setIsLoading(false);
                if (isMounted) {
                  showSuccessToast(tMessage(`toast.${status}`));
                }
              },
              setToastError: (status?: number) => {
                if (isMounted) {
                  showErrorToast(tMessage(`toast.${status}`) || tMessage('toast.error'));
                }
              },
            },
          })
        );
      }
    }

    return () => {
      isMounted = false;
    };
  }, [dispatch, categoryId, tMessage, isLoading]);

  useEffect(() => {
    if (selectCategory) {
      const parentData = selectCategory.parentCategoryId
        ? (findNodeById(getCategories?.data ?? [], selectCategory.parentCategoryId, {
            childrenKey: 'subCategories',
          }) as Category)
        : undefined;
      setCategoryInfo([
        { name: t('fields.id'), content: selectCategory.id || symbols.inValid },
        { name: t('fields.name'), content: selectCategory.name || symbols.inValid },
        {
          name: t('fields.parentCategoryId'),
          content: parentData?.name ? (
            <Link
              href={`${config.routes.private.categories}/${parentData.id}`}
              className='flex-1 hover:underline truncate'
            >
              {parentData?.name}
            </Link>
          ) : (
            t('label.parentCategoryId')
          ),
        },
        {
          name: t('fields.products'),
          content: selectCategory.products?.length ?? symbols.inValid,
        },
        {
          name: t('fields.createdAt'),
          content: selectCategory.createdAt
            ? format(new Date(selectCategory.createdAt), 'PPpp')
            : symbols.inValid,
        },
        {
          name: t('fields.updatedAt'),
          content: selectCategory.updatedAt
            ? format(new Date(selectCategory.updatedAt), 'PPpp')
            : symbols.inValid,
        },
      ]);

      setIsLoading(false);
      setCategory(selectCategory);
    }
  }, [selectCategory, t]);

  const handleDelete = () => {
    if (category?.id) {
      dispatch(
        deleteCategoryAsync({
          data: {
            value: { categoryId: category.id },
            setToastSuccess: (status?: number) => {
              showSuccessToast(tMessage(`toast.${status?.toString()}`));
              routes.back();
            },
            setToastError: (status?: number) => {
              showErrorToast(tMessage(`toast.${status?.toString()}`) || tMessage('toast.error'));
            },
          },
        })
      );
    }
  };

  const handleRemoveProduct = (id: string) => {
    if (category?.id) {
      dispatch(
        removeProductsFromCategory({
          data: {
            value: { categoryId: category.id, productIds: [id] },
            setToastSuccess: (status?: number) => {
              showSuccessToast(tMessage(`toast.${status?.toString()}`));
            },
            setToastError: (status?: number) => {
              showErrorToast(tMessage(`toast.${status?.toString()}`) || tMessage('toast.error'));
            },
          },
        })
      );
    }
  };

  return (
    <div className='space-y-6 pb-24'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card>
          <CardHeader className='hidden'>
            <CardTitle></CardTitle>
          </CardHeader>
          <CardContent className='px-3 md:px-6'>
            <BoxInfoItem
              title={t('sections.categoryInfo')}
              options={categoryInfo}
              isLoading={isLoading}
              className='w-full'
              moreComponent={
                <ActionButton
                  currentRole={currentAccount?.user.role ?? ValidRolesEnum.USER}
                  dropdownClassName='absolute right-[-36px]'
                  variant='ghost'
                  actionVariant='horizontal'
                  options={[
                    {
                      content: t('actions.edit'),
                      icon: <SquarePen className='h-4 w-4' />,
                      dialog: {
                        title: t('actions.dialogs.edit.title'),
                        content: (
                          <CategoryForm
                            data={category}
                            variant='edit'
                            categoryId={category?.id}
                            categories={getCategories?.data as Category[]}
                          />
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
                            itemName={`${category?.name}`}
                          />
                        ),
                      },
                      roles: [ValidRolesEnum.ADMIN, ValidRolesEnum.EDITOR],
                    },
                  ]}
                />
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='px-3 md:px-6'>
            <CardTitle>{t('label.subCategoryIds')}</CardTitle>
            <CardDescription>
              {t('label.subUnder')} {category?.name}
            </CardDescription>
          </CardHeader>
          <CardContent className='px-0 md:px-6'>
            {category?.subCategories && (category?.subCategories?.length ?? 0) > 0 ? (
              <ScrollArea className='h-[242px]'>
                <div className='w-full h-max'>
                  <CategoryTree
                    categories={category?.subCategories}
                    allData={getCategories?.data}
                  />
                </div>
              </ScrollArea>
            ) : (
              <NoResult className='h-[242px]' />
            )}
          </CardContent>
          <CardFooter className='px-3 md:px-6'>
            <EditCategoryDialog
              categories={getCategories?.data as Category[]}
              data={
                {
                  parentCategoryId: category?.id,
                } as Category
              }
              label={tForm('button.addSubCategory')}
              title={tForm('title.addSubCategory')}
              className='w-full'
            />
          </CardFooter>
        </Card>
      </div>

      <ProductsForItem
        products={category?.products ?? []}
        handleRemoveProduct={handleRemoveProduct}
        labelRemove={t('actions.remove')}
        actionRemove={t('actions.removeBtn')}
        moreComponent={
          <Button
            onClick={() => {
              if (category?.id) {
                routes.push(config.routes.private.applyProduct(category.id));
              }
            }}
          >
            <Plus className=' h-4 w-4' />
            <span className='hidden sm:block'>{t('actions.applyProduct')}</span>
          </Button>
        }
      />
    </div>
  );
}
