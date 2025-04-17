import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ReactNode } from 'react';
import { Comfortaa } from 'next/font/google';
import { ThemeProvider } from './theme/theme-provider';
import BaseNavigationHeader from './navigation/base-navigation-header';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { AnimatePresence } from 'framer-motion';
import { ReduxProvider } from '@/lib/store/provider';
import { Toaster } from './ui/sonner';

const comfortaaSans = Comfortaa({
  variable: '--font-comfortaa-sans',
  subsets: ['latin'],
});

type Props = {
  children: ReactNode;
  locale: string;
};

export default async function BaseLayout({ children, locale }: Props) {
  const messages = await getMessages();

  return (
    <html className='h-screen' lang={locale} suppressHydrationWarning>
      <body
        className={`${comfortaaSans.variable} antialiased flex h-full flex-col overflow-hidden`}
      >
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
                  <div className='w-full h-full p-6 flex-1 overflow-hidden font-[family-name:var(--font-comfortaa-sans)]'>
                    {children}
                  </div>
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
