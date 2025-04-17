'use client';

import { useMediaQuery } from '@/utils/hooks/use-media-query';
import { useTheme } from 'next-themes';
import { Toaster as Sonner, ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1024px)');

  const position = isMobile ? 'bottom-center' : isTablet ? 'top-right' : 'bottom-right';
  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className='toaster group w-full'
      position={position as ToasterProps['position']}
      expand={isMobile}
      gap={isMobile ? 8 : 12}
      offset={isMobile ? 16 : isTablet ? 20 : 32}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
