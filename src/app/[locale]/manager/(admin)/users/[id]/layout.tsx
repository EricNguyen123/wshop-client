import { IProps } from '@/types';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: Omit<IProps, 'children'>) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'BaseLayout.Users' });

  return {
    title: t('label'),
  };
}

export default function LayoutInformation({ children }: IProps) {
  return children;
}
