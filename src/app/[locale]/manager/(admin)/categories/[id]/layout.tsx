import BaseLayoutDetailCategory from '@/components/manager/category/base-layout-detail-category';
import { IProps } from '@/types';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: Omit<IProps, 'children'>) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'BaseLayout.Category' });

  return {
    title: t('detail'),
  };
}

export default function LayoutDetailCategory({ children }: IProps) {
  return <BaseLayoutDetailCategory>{children}</BaseLayoutDetailCategory>;
}
