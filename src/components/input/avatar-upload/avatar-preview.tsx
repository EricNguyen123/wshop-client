'use client';

import { User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AvatarPreviewProps } from '@/types/common';

const sizeClasses = {
  sm: 'h-12 w-12',
  md: 'h-16 w-16',
  lg: 'h-24 w-24',
  xl: 'h-32 w-32',
  '2xl': 'h-40 w-40',
};

export function AvatarPreview({
  src,
  placeholder,
  alt = 'Avatar',
  size = 'lg',
  isHovering = false,
}: AvatarPreviewProps) {
  const sizeClass = sizeClasses[size] || sizeClasses.lg;

  return (
    <Avatar
      className={cn(
        sizeClass,
        'border-2 border-muted',
        isHovering && 'opacity-80',
        'transition-all duration-200'
      )}
    >
      <AvatarImage src={src || placeholder || undefined} alt={alt} className='object-cover' />
      <AvatarFallback className='bg-muted'>
        <User
          className={cn(
            size === 'sm' && 'h-6 w-6',
            size === 'md' && 'h-8 w-8',
            size === 'lg' && 'h-10 w-10',
            size === 'xl' && 'h-12 w-12',
            size === '2xl' && 'h-16 w-16'
          )}
        />
      </AvatarFallback>
    </Avatar>
  );
}
