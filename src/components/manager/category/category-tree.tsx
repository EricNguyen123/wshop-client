'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Eye, Folder, FolderOpen, SquarePen, Trash } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ActionButton } from '@/components/button/button-action';
import { ValidRolesEnum } from '@/common/enum';
import config from '@/config';
import { DeleteConfirmation } from '@/components/delete/delete-confirmation';
import { useRouter } from '@/i18n/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { selectCurrentAccount } from '@/lib/store/features/auth/slice';
import { useTranslations } from 'next-intl';
import { ICategoryRes, ICategoryTreeProps } from '@/types/common';
import { NewItemIndicator } from './new-item-indicator';
import CategoryForm from './category-form';
import { Category } from '@/utils/common';
import { deleteCategoryAsync } from '@/lib/store/features/category/thunk';
import { showErrorToast, showSuccessToast } from '@/components/toast/custom-toast';

export function CategoryTree({ categories, level = 0, allData }: ICategoryTreeProps) {
  return (
    <div className='space-y-1'>
      {categories.map((category) => (
        <CategoryTreeItem
          key={category.id}
          category={category}
          level={level}
          data={allData ?? []}
        />
      ))}
    </div>
  );
}

function CategoryTreeItem({
  category,
  level,
  data,
}: {
  category: ICategoryRes;
  level: number;
  data: ICategoryRes[];
}) {
  const t = useTranslations('Component.Categories');
  const tMessage = useTranslations('Messages.error');
  const routes = useRouter();
  const currentAccount = useAppSelector(selectCurrentAccount);
  const [isExpanded, setIsExpanded] = useState(level < 0);
  const hasChildren = category.subCategories && category.subCategories.length > 0;
  const dispatch = useAppDispatch();

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleDelete = () => {
    if (category.id) {
      dispatch(
        deleteCategoryAsync({
          data: {
            value: { categoryId: category.id },
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
    <div>
      <div
        className='flex items-center py-2 px-2 rounded-md hover:bg-muted group'
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {hasChildren ? (
          <Button variant='ghost' size='icon' className='h-6 w-6 mr-1' onClick={toggleExpand}>
            {isExpanded ? (
              <ChevronDown className='h-4 w-4' />
            ) : (
              <ChevronRight className='h-4 w-4' />
            )}
          </Button>
        ) : (
          <div className='w-7'></div>
        )}

        {isExpanded ? (
          <FolderOpen className='h-4 w-4 mr-2 text-muted-foreground' />
        ) : (
          <Folder className='h-4 w-4 mr-2 text-muted-foreground' />
        )}

        <Link
          href={`${config.routes.private.categories}/${category.id}`}
          className='flex-1 hover:underline truncate'
        >
          {category.name}
        </Link>
        <NewItemIndicator
          createdAt={category.createdAt}
          newThreshold={1 / 4} // 15 minutes
          variant='badge'
          size='sm'
          className='mr-2'
        />
        <Badge variant='outline' className='mr-2'>
          {category.productCount || 0} {t('fields.products')}
        </Badge>

        <div className='w-max' onClick={(e) => e.stopPropagation()}>
          <ActionButton
            currentRole={currentAccount?.user.role ?? ValidRolesEnum.USER}
            dropdownClassName='absolute right-[-36px]'
            className='md:opacity-0 md:group-hover:opacity-100'
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
                      categoryId={category.id}
                      categories={data as Category[]}
                    />
                  ),
                },
                roles: [ValidRolesEnum.ADMIN, ValidRolesEnum.EDITOR],
              },
              {
                content: t('actions.detail'),
                icon: <Eye className='h-4 w-4' />,
                onSelect: () => routes.push(`${config.routes.private.categories}/${category.id}`),
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
                      itemName={`${category.name}`}
                    />
                  ),
                },
                roles: [ValidRolesEnum.ADMIN, ValidRolesEnum.EDITOR],
              },
            ]}
          />
        </div>
      </div>

      {isExpanded && hasChildren && category.subCategories && (
        <CategoryTree categories={category.subCategories} level={level + 1} allData={data} />
      )}
    </div>
  );
}
