import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { symbols } from '@/constant/common';
import React from 'react';
import { DEFAULT_EMPTY_MESSAGE } from '@/constant/messages';
import BaseTitle from './base-title';

type BoxInfoItemProps = {
  options: {
    name: React.ReactNode;
    content: React.ReactNode;
    highlight?: boolean;
    contentClassName?: string;
    nameClassName?: string;
  }[];
  title?: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  emptyMessage?: string;
  layout?: 'horizontal' | 'vertical';
  nameWidth?: string;
  contentWidth?: string;
  moreComponent?: React.ReactNode;
};

export default function BoxInfoItem({
  options,
  title,
  className,
  isLoading = false,
  emptyMessage = DEFAULT_EMPTY_MESSAGE({ key: 'information' }),
  layout = 'horizontal',
  nameWidth = 'w-1/3',
  contentWidth = 'w-2/3',
  moreComponent,
}: BoxInfoItemProps) {
  const MoreComponent = moreComponent;
  if (isLoading) {
    return (
      <div className={cn('w-full space-y-4 animate-pulse', className)}>
        {title && (
          <div>
            <Skeleton className='h-6 w-40' />
            <Separator className='mt-3' />
          </div>
        )}
        <div className={cn('space-y-4')}>
          {[...Array(4)].map((_, index) => (
            <div key={index} className='flex items-center space-x-6'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-4 w-36' />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!options || options.length === 0) {
    return (
      <div className={cn('w-full p-6 text-center text-muted-foreground text-sm', className)}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      {title && (
        <div className='mb-6'>
          <div className='w-full flex items-center justify-between'>
            <BaseTitle title={title} />
            {React.isValidElement(MoreComponent) ? MoreComponent : <div></div>}
          </div>
          <Separator className='mt-3' />
        </div>
      )}

      {layout === 'horizontal' ? (
        <div className='flex flex-col space-y-2'>
          {options.map((item, index) => (
            <div
              key={index}
              className={cn(
                'flex items-center px-3 py-1.5 rounded-lg',
                item.highlight && 'bg-primary/10'
              )}
            >
              <div
                className={cn(
                  'text-sm font-medium text-muted-foreground truncate',
                  nameWidth,
                  item.nameClassName
                )}
              >
                {item.name ?? symbols.inValid}
              </div>
              <div
                className={cn(
                  'text-base font-semibold truncate',
                  contentWidth,
                  item.highlight && 'text-primary',
                  item.contentClassName
                )}
              >
                {item.content ?? symbols.inValid}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='flex flex-col space-y-2'>
          {options.map((item, index) => (
            <div
              key={index}
              className={cn(
                'flex flex-col space-y-2 px-3 py-1.5 rounded-lg',
                item.highlight && 'bg-primary/10'
              )}
            >
              <div
                className={cn(
                  'text-xs font-semibold text-muted-foreground uppercase tracking-wider',
                  item.nameClassName
                )}
              >
                {item.name ?? symbols.inValid}
              </div>
              <div
                className={cn(
                  'text-base font-medium',
                  item.highlight && 'text-primary',
                  item.contentClassName
                )}
              >
                {item.content ?? symbols.inValid}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
