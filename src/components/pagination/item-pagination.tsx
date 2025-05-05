'use client';

import type React from 'react';
import { PaginationItem } from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ItemPaginationProps = {
  index: number;
  onClick: (i: number) => void;
  active?: boolean;
  children?: React.ReactNode;
  className?: string;
  'aria-label'?: string;
  'aria-current'?: 'page' | 'step' | 'location' | 'date' | 'time' | true | false;
};

export default function ItemPagination({
  index,
  onClick,
  active = false,
  children,
  className,
  'aria-label': ariaLabel,
  'aria-current': ariaCurrent,
  ...props
}: ItemPaginationProps) {
  return (
    <PaginationItem>
      <Button
        variant={active ? 'outline' : 'ghost'}
        size='icon'
        onClick={() => onClick(index)}
        className={cn(
          'h-9 w-9 rounded-md transition-all duration-200',
          active && 'shadow-sm',
          className
        )}
        aria-label={ariaLabel || `Go to page ${index}`}
        aria-current={ariaCurrent}
        {...props}
      >
        {children ? children : index}
      </Button>
    </PaginationItem>
  );
}
