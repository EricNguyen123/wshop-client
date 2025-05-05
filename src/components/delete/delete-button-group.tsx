'use client';

import type React from 'react';
import { Button } from '@/components/ui/button';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2, Trash2, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

export type DeleteButtonVariant = 'default' | 'circle';

type ButtonProps = ComponentPropsWithoutRef<typeof Button>;

export interface DeleteButtonGroupProps {
  /**
   * Handler for cancel action
   */
  onCancel?: () => void;
  /**
   * Handler for delete action
   */
  onDelete?: () => void;
  /**
   * Size of the buttons
   * @default "default"
   */
  size?: ButtonProps['size'];
  /**
   * Visual variant of the button group
   * @default "default"
   */
  variant?: DeleteButtonVariant;
  /**
   * Additional class name for both buttons
   */
  className?: string;
  /**
   * Additional class name for cancel button only
   */
  cancelClassName?: string;
  /**
   * Additional class name for delete button only
   */
  deleteClassName?: string;
  /**
   * Custom label for cancel button (overrides translation)
   */
  cancelLabel?: React.ReactNode;
  /**
   * Custom label for delete button (overrides translation)
   */
  deleteLabel?: React.ReactNode;
  /**
   * Whether the delete action is in progress
   * @default false
   */
  isDeleting?: boolean;
  /**
   * Whether the buttons should be disabled
   * @default false
   */
  disabled?: boolean;
}

export function DeleteButtonGroup({
  onCancel,
  onDelete,
  variant = 'default',
  size = 'default',
  className,
  cancelClassName,
  deleteClassName,
  cancelLabel,
  deleteLabel,
  isDeleting = false,
  disabled = false,
}: DeleteButtonGroupProps) {
  const t = useTranslations('Delete');

  const isCircle = variant === 'circle';

  return (
    <div
      className={cn(
        'flex gap-3',
        isCircle ? 'flex-row items-center' : 'w-full grid grid-cols-2 gap-4'
      )}
    >
      <Button
        variant='outline'
        size={size}
        className={cn(isCircle ? 'rounded-full size-9 p-0' : 'w-full', cancelClassName, className)}
        onClick={onCancel}
        disabled={disabled || isDeleting}
        aria-label={typeof cancelLabel === 'string' ? cancelLabel : t('cancel')}
      >
        {isCircle ? <X className='size-4' /> : cancelLabel || t('cancel')}
      </Button>

      <Button
        variant='destructive'
        size={size}
        className={cn(isCircle ? 'rounded-full size-9 p-0' : 'w-full', deleteClassName, className)}
        onClick={onDelete}
        disabled={disabled || isDeleting}
        aria-label={typeof deleteLabel === 'string' ? deleteLabel : t('delete')}
        data-testid='delete-button'
      >
        {isDeleting ? (
          <span className='flex items-center gap-2'>
            <span className='size-4 border-2 border-current border-r-transparent rounded-full animate-spin' />
            {!isCircle && (deleteLabel || <Loader2 className='w-full h-full animate-spin' />)}
          </span>
        ) : isCircle ? (
          <Trash2 className='size-4' />
        ) : (
          deleteLabel || t('delete')
        )}
      </Button>
    </div>
  );
}
