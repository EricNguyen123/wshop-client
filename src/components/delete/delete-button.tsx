'use client';

import type React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { ComponentPropsWithoutRef } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { DeleteConfirmation } from './delete-confirmation';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type ButtonProps = ComponentPropsWithoutRef<typeof Button>;

export interface DeleteButtonProps extends Omit<ButtonProps, 'onClick'> {
  /**
   * Function to handle the delete action
   * @returns Promise<void> or void
   */
  onDelete?: () => Promise<void> | void;
  /**
   * Name or description of the item being deleted
   */
  itemName?: React.ReactNode;
  /**
   * Custom title for the confirmation dialog
   */
  confirmTitle?: React.ReactNode;
  /**
   * Custom description for the confirmation dialog
   */
  confirmDescription?: React.ReactNode;
  /**
   * Whether to show a tooltip on hover
   * @default false
   */
  showTooltip?: boolean;
  /**
   * Custom tooltip text (defaults to "Delete")
   */
  tooltipText?: string;
  /**
   * Whether to use an icon-only button
   * @default false
   */
  iconOnly?: boolean;
  /**
   * Custom button content (overrides default)
   */
  children?: React.ReactNode;
}

export function DeleteButton({
  onDelete,
  itemName,
  confirmTitle,
  confirmDescription,
  showTooltip = false,
  tooltipText,
  iconOnly = false,
  children,
  className,
  variant = 'destructive',
  size = iconOnly ? 'icon' : 'default',
  ...props
}: DeleteButtonProps) {
  const t = useTranslations('Delete');
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!onDelete) {
      setOpen(false);
      return;
    }

    try {
      setIsDeleting(true);
      await onDelete();
      setOpen(false);
    } catch (error) {
      console.error('Delete operation failed:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const buttonContent = children || (
    <>
      {iconOnly ? (
        <Trash2 className='size-4' />
      ) : (
        <>
          <Trash2 className='size-4 mr-2' />
          {t('delete')}
        </>
      )}
    </>
  );

  const button = (
    <Button
      variant={variant}
      size={size}
      className={cn(iconOnly && 'rounded-full', className)}
      disabled={isDeleting || props.disabled}
      {...props}
    >
      {isDeleting && !open ? (
        <span className='flex items-center gap-2'>
          <span className='size-4 border-2 border-current border-r-transparent rounded-full animate-spin' />
          {!iconOnly && t('deleting')}
        </span>
      ) : (
        buttonContent
      )}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {showTooltip ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>{button}</TooltipTrigger>
              <TooltipContent>{tooltipText || t('delete')}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          button
        )}
      </DialogTrigger>
      <DialogContent>
        <DeleteConfirmation
          closeDialog={() => setOpen(false)}
          onDelete={handleDelete}
          title={confirmTitle}
          itemName={itemName}
          description={confirmDescription}
          isDeleting={isDeleting}
        />
      </DialogContent>
    </Dialog>
  );
}
