'use client';

import { DialogFooter } from '@/components/ui/dialog';

import type React from 'react';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IColorType } from '@/types/common';
import ButtonLoading from '@/components/button/button-loading';
import { useTranslations } from 'next-intl';
import ColorPicker from './color-picker';

interface ColorTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  colorType?: IColorType | null;
  onSubmit: (colorType: Omit<IColorType, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export function ColorTypeDialog({ open, onOpenChange, colorType, onSubmit }: ColorTypeDialogProps) {
  const t = useTranslations('Form.ColorTypesCreate');
  const [name, setName] = useState('');
  const [colorCode, setColorCode] = useState('#3B82F6');
  const [errors, setErrors] = useState<{ name?: string; colorCode?: string }>({});

  useEffect(() => {
    if (colorType) {
      setName(colorType.name);
      setColorCode(colorType.colorCode);
    } else {
      setName('');
      setColorCode('#3B82F6');
    }
    setErrors({});
  }, [colorType, open]);

  const validateForm = () => {
    const newErrors: { name?: string; colorCode?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!colorCode) {
      newErrors.colorCode = 'Color code is required';
    } else if (!/^#[0-9A-F]{6}$/i.test(colorCode)) {
      newErrors.colorCode = 'Invalid color code format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({
      name: name.trim(),
      colorCode: colorCode.toUpperCase(),
    });

    setName('');
    setColorCode('#3B82F6');
    setErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px] rounded-2xl'>
        <DialogHeader className='space-y-4'>
          <div className='flex items-center gap-4'>
            <div>
              <DialogTitle className='text-2xl'>
                {colorType ? t('title.edit') : t('title.create')}
              </DialogTitle>
              <DialogDescription className='text-base'>
                {colorType ? t('description.edit') : t('description.create')}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-6 pt-4'>
          <div className='space-y-3'>
            <Label htmlFor='name' className='text-base font-medium'>
              {t('label.name')}
            </Label>
            <Input
              id='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('placeholder.name')}
              className={`text-base ${errors.name ? 'border-destructive' : ''}`}
            />
            {errors.name && <p className='text-sm text-destructive'>{errors.name}</p>}
          </div>

          <div className='space-y-3'>
            <Label htmlFor='color' className='text-base font-medium'>
              {t('label.code')}
            </Label>
            <ColorPicker color={colorCode} onChange={setColorCode} />
            {errors.colorCode && <p className='text-sm text-destructive'>{errors.colorCode}</p>}
          </div>

          <DialogFooter>
            <div className='w-full grid grid-cols-2 gap-4 pt-2'>
              <Button
                type='button'
                variant='outline'
                className='w-full'
                onClick={() => onOpenChange(false)}
              >
                {t('button.cancel')}
              </Button>
              <ButtonLoading isLoading={false} label={t('button.save')} />
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
