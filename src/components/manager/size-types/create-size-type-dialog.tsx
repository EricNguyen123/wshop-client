'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import SizeTypeForm from './size-type-form';

export default function CreateSizeTypeDialog() {
  const [open, setOpen] = useState<boolean>(false);
  const t = useTranslations('Form.SizeTypeCreate');
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{t('button.create')}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{t('title.create')}</DialogTitle>
        <SizeTypeForm variant='create' closeDialog={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
