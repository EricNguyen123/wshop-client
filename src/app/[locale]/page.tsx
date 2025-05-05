import BasePage from '@/components/base-page';
import { TProps } from '@/types';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export default async function HomePage({ params }: TProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'Root' });

  return (
    <BasePage>
      <div className='h-[1000px]'>{t('title')}</div>
    </BasePage>
  );
}
