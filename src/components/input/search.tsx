/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-expressions */
'use client';

import React, { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { useTranslations } from 'next-intl';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { Button } from '../ui/button';
import { useDebounce } from '@/utils/hooks/use-debounce';

const inputVariants = cva('w-full', {
  variants: {
    variant: {
      default: 'rounded-md border border-gray-300',
      search: 'rounded-full border border-gray-300 pl-4 pr-10',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const searchVariants = cva('w-full items-center relative flex', {
  variants: {
    size: {
      xs: 'lg:w-[260px]',
      sm: 'lg:w-[320px]',
      lg: 'lg:w-[380px]',
      auto: 'lg:w-full',
    },
  },
  defaultVariants: {
    size: 'lg',
  },
});

interface BaseSearchProps
  extends VariantProps<typeof searchVariants>,
    VariantProps<typeof inputVariants> {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  variant?: 'default' | 'search';
}

export default function BaseSearch({
  placeholder,
  value,
  onChange,
  className,
  variant = 'default',
  size,
}: BaseSearchProps) {
  const t = useTranslations('Component.Input.Search');
  const [newValue, setNewValue] = useState<string>(value ? value : '');
  const debouncedValue = useDebounce(newValue, 500);

  useEffect(() => {
    if (variant && variant === 'default' && onChange) {
      onChange(debouncedValue);
    }
  }, [debouncedValue]);

  return (
    <div className={cn(searchVariants({ size }))}>
      <Input
        placeholder={placeholder || t('placeholder')}
        value={newValue}
        onChange={(event) => setNewValue(event.target.value)}
        className={cn(inputVariants({ variant, className }))}
      />
      {variant === 'search' && (
        <Button
          variant={'ghost'}
          className='!size-9 !p-2 rounded-full absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:border hover:border-gray-300'
          onClick={() => {
            if (onChange) {
              onChange(debouncedValue);
            }
          }}
        >
          <Search />
        </Button>
      )}
    </div>
  );
}
