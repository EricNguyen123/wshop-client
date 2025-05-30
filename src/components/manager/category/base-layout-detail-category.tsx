'use client';
import { Breadcrumb } from '@/components/breadcrumb/breadcrumb';
import config from '@/config';
import { selectCategories } from '@/lib/store/features/category/slice';
import { useAppSelector } from '@/lib/store/hooks';
import { ICategoryRes } from '@/types/common';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import React from 'react';
interface PageParams {
  id: string;
}
export default function BaseLayoutDetailCategory({ children }: { children?: React.ReactNode }) {
  const t = useTranslations('BaseLayout.Category');
  const params = useParams() as unknown as PageParams;
  const getCategories = useAppSelector(selectCategories);
  const [data, setData] = React.useState<ICategoryRes[]>([]);

  React.useEffect(() => {
    if (getCategories?.data) {
      setData(getCategories.data);
    }
  }, [getCategories]);

  const currentCategory = React.useMemo(() => {
    if (!params.id || !data.length) return null;
    const findCategory = (categories: ICategoryRes[]): ICategoryRes | null => {
      for (const category of categories) {
        if (category.id === params.id) return category;
        const found = findCategory(category.subCategories || []);
        if (found) return found;
      }
      return null;
    };
    return findCategory(data);
  }, [data, params.id]);

  return (
    <div className='w-full h-full'>
      <Breadcrumb
        data={data}
        currentKey={params.id as string}
        getKey={(item) => item.id ?? ''}
        getLabel={(item) => item.name ?? ''}
        getHref={(item) => `${config.routes.private.categories}/${item.id}`}
        getChildren={(item) => item.subCategories || []}
        getParentKey={(item) => item.parentCategoryId ?? ''}
        fallbackLabel={currentCategory?.name || t('unknownCategory')}
        linkClassName='hover:text-rose-600 hover:no-underline'
        truncateText={(label) => (label.length > 20 ? `${label.slice(0, 16)}...` : label)}
        tooltipContent={(item) => item.label}
        homeLabel={t('label')}
        homeHref={config.routes.private.categories}
        maxItems={4}
      />
      <div className='w-full'>{children}</div>
    </div>
  );
}
