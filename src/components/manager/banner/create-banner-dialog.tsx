'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import BannerForm from './banner-form';

export default function CreateBannerDialog() {
  const [open, setOpen] = useState<boolean>(false);
  const t = useTranslations('Form.BannerCreate');
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{t('button.create')}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{t('title.create')}</DialogTitle>
        <BannerForm variant='create' closeDialog={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
