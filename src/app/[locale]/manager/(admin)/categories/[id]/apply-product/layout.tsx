import { IProps } from '@/types';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: Omit<IProps, 'children'>) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'BaseLayout.Category' });

  return {
    title: t('applyProduct'),
  };
}

export default function LayoutApplyCategory({ children }: IProps) {
  return children;
}
