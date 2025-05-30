'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { Category } from '@/utils/common';
import CategoryForm from './category-form';
import { Plus } from 'lucide-react';

export default function CreateCategoryDialog({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState<boolean>(false);
  const t = useTranslations('Form.CategoryCreate');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className='sm:hidden' />
          <span className='hidden sm:inline'>{t('button.create')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogTitle>{t('title.create')}</DialogTitle>
        <CategoryForm variant='create' closeDialog={() => setOpen(false)} categories={categories} />
      </DialogContent>
    </Dialog>
  );
}
