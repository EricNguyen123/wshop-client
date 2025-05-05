/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import React, { type ReactElement } from 'react';

export const Options = () => {
  return (
    <div className='transition-all transform rotate-0'>
      <ChevronRight className='w-4 h-4' />
    </div>
  );
};

export const OptionsActive = () => {
  return (
    <div className='transition-all transform rotate-90'>
      <ChevronRight className='w-4 h-4' />
    </div>
  );
};

export default function ItemSidebar({
  icon,
  title,
  option,
  active,
  choose,
  onClick,
}: {
  icon?: React.ComponentType<{ className?: string }> | ReactElement;
  title: React.ReactNode;
  option?: boolean;
  active?: boolean;
  choose?: boolean;
  onClick?: (e?: any) => void;
}) {
  return (
    <div
      className={cn(
        'w-full flex items-center cursor-pointer justify-between gap-2 rounded-md p-2 text-left text-sm h-8',
        'outline-none ring-sidebar-ring transition-[width,height,padding]',
        !choose && 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        'focus-visible:ring-2',
        'active:bg-sidebar-accent active:text-sidebar-accent-foreground',
        'disabled:pointer-events-none disabled:opacity-50',
        'aria-disabled:pointer-events-none aria-disabled:opacity-50',
        active && 'bg-sidebar-accent font-medium text-sidebar-accent-foreground',
        choose && 'bg-rose-500/5 text-rose-500 hover:bg-rose-500/10 '
      )}
      onClick={onClick}
    >
      <div className='flex items-center justify-start space-x-2'>
        <div className='flex items-center justify-center'>
          {React.isValidElement(icon)
            ? icon
            : icon
            ? React.createElement(icon as React.ComponentType<{ className?: string }>, {
                className: 'size-4',
              })
            : null}
        </div>
        <div className='flex items-center justify-start text-base font-medium'>{title}</div>
      </div>
      <div className='flex items-center justify-center'>
        {option && (active ? <OptionsActive /> : <Options />)}
      </div>
    </div>
  );
}
