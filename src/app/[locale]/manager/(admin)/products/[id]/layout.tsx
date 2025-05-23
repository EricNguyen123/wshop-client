import { IProps } from '@/types';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: Omit<IProps, 'children'>) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'BaseLayout.Product' });

  return {
    title: t('detail'),
  };
}

export default function LayoutDetailProduct({ children }: IProps) {
  return children;
}
