'use client';

import React from 'react';
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DeleteButtonGroup } from './delete-button-group';
import { useTranslations } from 'next-intl';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DeleteConfirmationProps {
  /**
   * Function to close the dialog
   */
  closeDialog?: () => void;
  /**
   * Function to handle the delete action
   * @returns Promise<void> or void
   */
  onDelete?: () => Promise<void> | void;
  /**
   * Title of the confirmation dialog
   */
  title?: React.ReactNode;
  /**
   * Name or description of the item being deleted
   */
  itemName?: React.ReactNode;
  /**
   * Custom description (overrides the default)
   */
  description?: React.ReactNode;
  /**
   * Whether the delete action is in progress
   */
  isDeleting?: boolean;
  /**
   * Additional class name for the content
   */
  className?: string;
}

/**
 * A confirmation component for delete actions
 */
export function DeleteConfirmation({
  closeDialog,
  onDelete,
  title,
  itemName,
  description,
  isDeleting: externalIsDeleting,
  className,
}: DeleteConfirmationProps) {
  const t = useTranslations('Delete');
  const [isDeleting, setIsDeleting] = React.useState(false);

  const deleteInProgress = externalIsDeleting !== undefined ? externalIsDeleting : isDeleting;

  const handleDelete = async () => {
    if (!onDelete) {
      closeDialog?.();
      return;
    }

    try {
      setIsDeleting(true);
      await onDelete();
      closeDialog?.();
    } catch (error) {
      console.error('Delete operation failed:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <DialogHeader className='space-y-2 text-center sm:text-left'>
        <DialogTitle className='flex items-center gap-2 text-destructive'>
          <AlertTriangle className='size-5' />
          {title || t('confirmTitle')}
        </DialogTitle>
        <DialogDescription>
          {description || (
            <>
              {t('description')}
              {itemName && <span className='font-medium text-foreground'> {itemName} </span>}
              {t('description_1')}
            </>
          )}
        </DialogDescription>
      </DialogHeader>

      <div className={cn('py-4', className)}>
        <DialogFooter className='sm:justify-end'>
          <DeleteButtonGroup
            onCancel={closeDialog}
            onDelete={handleDelete}
            isDeleting={deleteInProgress}
          />
        </DialogFooter>
      </div>
    </>
  );
}
