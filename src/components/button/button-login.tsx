import React from 'react';
import { Button } from '../ui/button';
import { CircleUser } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';

const buttonVariants = cva('flex items-center cursor-pointer rounded-full');

interface ButtonLoginProps
  extends React.ComponentPropsWithoutRef<'button'>,
    VariantProps<typeof buttonVariants> {
  handleClick?: () => void;
}

export const ButtonLogin = React.forwardRef<HTMLButtonElement, ButtonLoginProps>(
  ({ className, handleClick, ...props }, ref) => {
    const t = useTranslations('Button.Login');
    return (
      <Button
        ref={ref}
        variant={'ghost'}
        onClick={handleClick}
        className={cn(buttonVariants(), className)}
        {...props}
      >
        <CircleUser className={cn('size-4')} />
        <span>{t('label')}</span>
      </Button>
    );
  }
);

ButtonLogin.displayName = 'ButtonLogin';
