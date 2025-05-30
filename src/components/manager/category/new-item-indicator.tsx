'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { isWithinThreshold } from '@/utils/common';
import { Sparkles, Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

interface NewItemIndicatorProps {
  isNew?: boolean;
  newThreshold?: number; // hours
  createdAt?: string | Date;
  variant?: 'badge' | 'glow' | 'pulse' | 'sparkle';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  selectable?: boolean;
  onSelect?: () => void;
  selected?: boolean;
}

export function NewItemIndicator({
  isNew = false,
  newThreshold = 24,
  createdAt,
  variant = 'badge',
  size = 'sm',
  className,
  selectable = false,
  onSelect,
  selected = false,
}: NewItemIndicatorProps) {
  const t = useTranslations('Messages.title');
  const [isItemNew, setIsItemNew] = useState<boolean>(
    Boolean(isNew || (createdAt && isWithinThreshold(createdAt, newThreshold)))
  );

  useEffect(() => {
    if (createdAt || newThreshold) {
      const timeout = setTimeout(() => {
        setIsItemNew(false);
      }, newThreshold * 60 * 60 * 1000);

      return () => clearTimeout(timeout);
    }
  }, [createdAt, newThreshold]);

  if (!isItemNew) return null;

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  const getVariantClasses = () => {
    const baseClasses = cn(
      'font-medium select-text cursor-text',
      selectable && 'cursor-pointer',
      selected && 'ring-2',
      sizeClasses[size],
      className
    );

    switch (variant) {
      case 'glow':
        return cn(
          baseClasses,
          'bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/25',
          selected && 'ring-emerald-300'
        );
      case 'pulse':
        return cn(
          baseClasses,
          'bg-blue-100 text-blue-700 border-blue-200 animate-pulse',
          'dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
          selected && 'ring-blue-500'
        );
      case 'sparkle':
        return cn(
          baseClasses,
          'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0',
          selected && 'ring-pink-300'
        );
      default: // badge
        return cn(
          baseClasses,
          'bg-emerald-100 text-emerald-700 border-emerald-200',
          'dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
          selectable && 'hover:bg-emerald-200 dark:hover:bg-emerald-800/50',
          selected && 'ring-emerald-500 bg-emerald-200 dark:bg-emerald-800'
        );
    }
  };

  const getIcon = () => {
    switch (variant) {
      case 'pulse':
        return <Clock className='w-3 h-3 mr-1' />;
      case 'sparkle':
        return <Sparkles className='w-3 h-3 mr-1 animate-spin' />;
      default:
        return <Sparkles className='w-3 h-3 mr-1' />;
    }
  };

  return (
    <Badge
      variant='secondary'
      className={getVariantClasses()}
      onClick={selectable ? onSelect : undefined}
    >
      {getIcon()}
      {t('new')}
    </Badge>
  );
}
