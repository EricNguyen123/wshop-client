'use client';

import ButtonLoading from '@/components/button/button-loading';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';

export default function ApplyDialog({
  handleApply,
  openDialog,
  setOpenDialog,
  isLoading,
}: {
  handleApply: () => void;
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading?: boolean;
}) {
  const t = useTranslations('Component.Categories');

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          <span className='hidden sm:inline'>{t('button.apply')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{t('actions.dialogs.apply.title')}</DialogTitle>
        </DialogHeader>
        <Label>{t('actions.dialogs.apply.description')}</Label>
        <DialogFooter>
          <div className='w-full grid grid-cols-2 gap-4 pt-2'>
            <Button
              type='button'
              variant={'outline'}
              className='w-full cursor-pointer'
              onClick={() => setOpenDialog(false)}
            >
              {t('actions.dialogs.apply.cancel')}
            </Button>
            <ButtonLoading
              isLoading={!!isLoading}
              label={t('actions.dialogs.apply.save')}
              onClick={() => {
                handleApply();
                setOpenDialog(false);
              }}
            />
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
