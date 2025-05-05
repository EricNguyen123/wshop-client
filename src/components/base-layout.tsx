import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ReactNode } from 'react';
import { Quicksand } from 'next/font/google';
import { ThemeProvider } from './theme/theme-provider';
import BaseNavigationHeader from './navigation/base-navigation-header';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { AnimatePresence } from 'framer-motion';
import { ReduxProvider } from '@/lib/store/provider';
import { Toaster } from './ui/sonner';

const quicksand = Quicksand({
  variable: '--font-quicksand',
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

type Props = {
  children: ReactNode;
  locale: string;
};

export default async function BaseLayout({ children, locale }: Props) {
  const messages = await getMessages();

  return (
    <html className='h-screen' lang={locale} suppressHydrationWarning>
      <body className={`${quicksand.className} antialiased flex h-full flex-col overflow-hidden`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='light'
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            <ReduxProvider>
              <AnimatePresence mode='wait'>
                <TooltipProvider>
                  <BaseNavigationHeader />
                  <div className='w-full h-full p-6 flex-1 overflow-hidden'>{children}</div>
                  <Toaster closeButton />
                </TooltipProvider>
              </AnimatePresence>
            </ReduxProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
