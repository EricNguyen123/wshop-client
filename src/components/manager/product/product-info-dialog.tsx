import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PenSquare } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { IUserRes } from '@/types/common';
import ProductForm from './product-form';
import BaseTooltip from '@/components/tooltip/base-tooltip';

const ProductInfoDialog = ({ product }: { product: IUserRes }) => {
  const t = useTranslations('Component.Products');
  const [open, setOpen] = useState(false);

  const handleCloseDialog = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <BaseTooltip nameTooltip={t('tooltip.edit')}>
        <DialogTrigger asChild>
          <Button variant='ghost' size='icon' className='h-8 w-8 cursor-pointer'>
            <PenSquare className='h-4 w-4 text-slate-500' />
          </Button>
        </DialogTrigger>
      </BaseTooltip>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('actions.dialogs.edit.title')}</DialogTitle>
        </DialogHeader>

        <ProductForm
          data={product}
          variant='edit'
          productId={product.id}
          closeDialog={handleCloseDialog}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProductInfoDialog;
