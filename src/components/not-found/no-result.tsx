'use client';
import { cn } from '@/lib/utils';
import { FileX } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';

export default function NoResult({ className }: { className?: string }) {
  const tTables = useTranslations('Component.Tables');
  return (
    <div className={cn('h-[400px] text-center', className)}>
      <div className='flex flex-col items-center justify-center h-full space-y-3 text-muted-foreground'>
        <FileX className='h-12 w-12 opacity-30' />
        <p className='text-lg font-medium'>{tTables('noResults')}</p>
        <p className='text-sm max-w-md'>{tTables('tryAdjustingFilters')}</p>
      </div>
    </div>
  );
}
