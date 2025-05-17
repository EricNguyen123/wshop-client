'use client';

import type React from 'react';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

interface ExpandableTextProps {
  text: string;
  maxLength?: number;
  className?: string;
  expandButtonClassName?: string;
  fallback?: React.ReactNode;
}

export function ExpandableText({
  text,
  maxLength = 100,
  className,
  expandButtonClassName,
  fallback = 'N/A',
}: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const tButton = useTranslations('Component.Buttons');

  if (!text) {
    return <span className='text-sm text-muted-foreground'>{fallback}</span>;
  }

  const shouldTruncate = text.length > maxLength;
  const displayText = shouldTruncate && !isExpanded ? `${text.substring(0, maxLength)}...` : text;

  return (
    <div className={cn('space-y-1', className)}>
      <p className={cn('text-sm', isExpanded ? 'whitespace-pre-wrap' : '')}>{displayText}</p>

      {shouldTruncate && (
        <Button
          variant='ghost'
          size='sm'
          className={cn('h-6 px-2 text-xs', expandButtonClassName)}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>
              <ChevronUp className='mr-1 h-3 w-3' />
              {tButton('showLess')}
            </>
          ) : (
            <>
              <ChevronDown className='mr-1 h-3 w-3' />
              {tButton('showMore')}
            </>
          )}
        </Button>
      )}
    </div>
  );
}
