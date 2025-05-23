import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import React from 'react';

export type LoadingProps = { loading?: boolean; className?: string };

export default function Loading({ loading = false, className }: LoadingProps) {
  return (
    <>
      {loading && (
        <div className='w-screen h-screen fixed z-[999] inset-0 flex items-center justify-center'>
          <div className='absolute inset-0 bg-accent-foreground/50 opacity-60'></div>
          <span className={cn('w-12 h-12 text-rose-500 z-[1000]', className)}>
            <Loader2 className='w-full h-full animate-spin' />
          </span>
        </div>
      )}
    </>
  );
}
