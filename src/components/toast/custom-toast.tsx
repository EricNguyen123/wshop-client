'use client';

import React from 'react';
import { toast } from 'sonner';
import { IconButton } from '../button/button-icon';
import { CircleCheck, Info, ServerCrash, TriangleAlert, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

interface ICustomToastProps {
  title?: React.ReactNode;
  message?: React.ReactNode;
  action?: React.ReactNode | { label: string; onClick: () => void };
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  icon?: React.ElementType;
}

export function showCustomToast({
  title,
  message,
  action,
  variant = 'default',
  icon,
}: ICustomToastProps) {
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches;
  return toast.custom((t) => {
    const variantClasses = {
      default: {
        icon: 'text-foreground',
        container: 'bg-popover text-popover-foreground border-border',
        title: 'text-foreground',
        message: 'text-muted-foreground',
        button: 'bg-rose-600 text-white shadow-xs hover:bg-rose-600/90',
      },
      success: {
        icon: 'text-green-600 dark:text-green-500',
        container: 'bg-popover text-popover-foreground border-border',
        title: 'text-green-600 dark:text-green-500',
        message: 'text-muted-foreground',
        button:
          'bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600',
      },
      error: {
        icon: 'text-red-600 dark:text-red-500',
        container: 'bg-popover text-popover-foreground border-border',
        title: 'text-red-600 dark:text-red-500',
        message: 'text-muted-foreground',
        button: 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600',
      },
      warning: {
        icon: 'text-yellow-600 dark:text-yellow-500',
        container: 'bg-popover text-popover-foreground border-border',
        title: 'text-yellow-600 dark:text-yellow-500',
        message: 'text-muted-foreground',
        button:
          'bg-yellow-600 text-white hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-600',
      },
      info: {
        icon: 'text-blue-600 dark:text-blue-500',
        container: 'bg-popover text-popover-foreground border-border',
        title: 'text-blue-600 dark:text-blue-500',
        message: 'text-muted-foreground',
        button: 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600',
      },
    };

    const classes = variantClasses[variant];

    return (
      <div
        className={cn(
          'rounded-lg shadow-lg p-4 max-w-md w-full relative border',
          'animate-in fade-in-0 zoom-in-95 duration-300',
          isMobile ? 'mx-auto' : 'min-w-sm',
          classes.container
        )}
      >
        <div className='flex items-center '>
          {icon && React.createElement(icon, { className: cn('size-4 mr-2 mb-1', classes.icon) })}
          {title && <h3 className={cn('text-sm font-semibold mb-1', classes.title)}>{title}</h3>}
        </div>
        {message && <p className={cn('text-xs mb-3', classes.message)}>{message}</p>}

        <div
          className={cn('flex', isMobile ? 'flex-col space-y-2' : 'justify-between items-center')}
        >
          {action && (
            <div>
              {typeof action === 'object' && 'label' in action ? (
                <Button
                  onClick={action.onClick}
                  className={cn(
                    '!h-6 !px-3 !py-1 !rounded-full !text-xs !font-medium !transition-colors cursor-pointer',
                    isMobile ? 'w-full' : '',
                    classes.button
                  )}
                >
                  {action.label}
                </Button>
              ) : (
                action
              )}
            </div>
          )}
        </div>
        <IconButton
          icon={X}
          onClick={() => toast.dismiss(t)}
          className='absolute top-1.5 right-1.5 hover:bg-transparent dark:hover:bg-transparent text-muted-foreground hover:text-foreground'
          size='sm'
        />
      </div>
    );
  });
}

export const showSuccessToast = (
  message: React.ReactNode,
  action?: ICustomToastProps['action']
) => {
  return showCustomToast({
    icon: CircleCheck,
    title: 'Success',
    message,
    action,
    variant: 'success',
  });
};

export const showErrorToast = (message: React.ReactNode, action?: ICustomToastProps['action']) => {
  return showCustomToast({
    icon: ServerCrash,
    title: 'Error',
    message,
    action,
    variant: 'error',
  });
};

export const showWarningToast = (
  message: React.ReactNode,
  action?: ICustomToastProps['action']
) => {
  return showCustomToast({
    icon: TriangleAlert,
    title: 'Warning',
    message,
    action,
    variant: 'warning',
  });
};

export const showInfoToast = (message: React.ReactNode, action?: ICustomToastProps['action']) => {
  return showCustomToast({
    icon: Info,
    title: 'Info',
    message,
    action,
    variant: 'info',
  });
};
