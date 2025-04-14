import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';
import BaseLayout from '@/components/base-layout';
import { IProps, TLocale } from '@/types';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Omit<IProps, 'children'>) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'BaseLayout' });

  return {
    title: t('LocaleLayout.title'),
  };
}

export default async function LocaleLayout({ children, params }: IProps) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as TLocale)) {
    notFound();
  }

  return (
    <BaseLayout locale={locale}>
      <div className='w-full h-full flex-1 box-border overflow-scroll'>{children}</div>
    </BaseLayout>
  );
}
