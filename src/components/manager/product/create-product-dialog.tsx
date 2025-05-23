'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import ProductForm from './product-form';

export default function CreateProductDialog() {
  const [open, setOpen] = useState<boolean>(false);
  const t = useTranslations('Form.ProductCreate');
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{t('button.create')}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{t('title.create')}</DialogTitle>
        <ProductForm variant='create' closeDialog={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
