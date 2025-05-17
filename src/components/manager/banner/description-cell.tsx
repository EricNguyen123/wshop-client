'use client';

import type React from 'react';

import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';
import { ExpandableText } from '@/components/text/expandable-text';
import { TruncatedText } from '@/components/text/truncated-text';
import BaseTooltip from '@/components/tooltip/base-tooltip';

interface DescriptionCellProps {
  description: string | null | undefined;
  fallback?: React.ReactNode;
  maxLength?: number;
  className?: string;
  variant?: 'tooltip' | 'expandable' | 'info-icon';
}

export function DescriptionCell({
  description,
  fallback = 'N/A',
  maxLength = 50,
  className,
  variant = 'tooltip',
}: DescriptionCellProps) {
  if (!description) {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <span className='text-sm text-muted-foreground'>{fallback}</span>
      </div>
    );
  }

  if (variant === 'expandable') {
    return (
      <div className={cn('w-full', className)}>
        <ExpandableText text={description} maxLength={maxLength} fallback={fallback} />
      </div>
    );
  }

  if (variant === 'info-icon') {
    return (
      <div className={cn('flex w-full items-center justify-center gap-1', className)}>
        <div className='flex max-w-full items-center gap-1'>
          <span className='truncate text-sm'>
            {description.length > maxLength
              ? `${description.substring(0, maxLength)}...`
              : description}
          </span>
          {description.length > maxLength && (
            <BaseTooltip nameTooltip={description}>
              <Info className='h-4 w-4 min-w-4 flex-shrink-0 cursor-help text-muted-foreground hover:text-foreground' />
            </BaseTooltip>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <TruncatedText text={description} maxLength={maxLength} fallback={fallback} />
    </div>
  );
}
