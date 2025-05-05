'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import React, { useState } from 'react';
import UserForm from './user-form';
import { useTranslations } from 'next-intl';

export default function CreateUserDialog() {
  const [open, setOpen] = useState<boolean>(false);
  const t = useTranslations('Form.UserEdit');
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{t('button.create')}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{t('title.create')}</DialogTitle>
        <UserForm variant='create' closeDialog={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
