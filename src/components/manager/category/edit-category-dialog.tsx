'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { cn, type Category } from '@/utils/common';
import CategoryForm from './category-form';
import { Plus } from 'lucide-react';

export default function EditCategoryDialog({
  categories,
  data,
  categoryId,
  label,
  title,
  className,
  variant,
}: {
  categories: Category[];
  data: Category;
  categoryId?: string;
  label?: string;
  title?: string;
  className?: string;
  variant?:
    | 'default'
    | 'destructive'
    | 'link'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | null
    | undefined;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const t = useTranslations('Form.CategoryCreate');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={cn(className)} variant={variant || 'default'}>
          <Plus />
          <span>{label || t('button.edit')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogTitle>{title || t('title.edit')}</DialogTitle>
        <CategoryForm
          variant='edit'
          closeDialog={() => setOpen(false)}
          categories={categories}
          data={data}
          categoryId={categoryId}
        />
      </DialogContent>
    </Dialog>
  );
}
