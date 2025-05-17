import { Loader2 } from 'lucide-react';
import React from 'react';
import { LoadingProps } from './loading';
import { cn } from '@/lib/utils';

export default function LoadingItem({ loading = false, className }: LoadingProps) {
  return (
    <>
      {loading && (
        <div
          className={cn(
            'absolute inset-0 z-10 flex items-center justify-center text-rose-500',
            className
          )}
        >
          <Loader2 className='size-5 animate-spin' />
        </div>
      )}
    </>
  );
}
