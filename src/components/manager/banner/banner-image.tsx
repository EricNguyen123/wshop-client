'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageViewer } from './image-viewer';
import LoadingItem from '@/components/skeleton/loading-item';
import images from '@/assets/images';

interface BannerImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallbackText?: string;
  viewerWidth?: number;
  viewerHeight?: number;
}

export function BannerImage({
  src,
  alt,
  width = 128,
  height = 64,
  className,
  fallbackText = 'No Image',
  viewerWidth = 800,
  viewerHeight = 600,
}: BannerImageProps) {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setIsError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (!src || isError) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-md border border-border bg-muted/30',
          className
        )}
        style={{ width, height }}
      >
        <span className='text-xs text-muted-foreground'>{fallbackText}</span>
      </div>
    );
  }

  return (
    <Dialog>
      <div
        className={cn(
          'group relative overflow-hidden rounded-md border border-border shadow-sm',
          isLoading && 'bg-muted/50',
          className
        )}
        style={{ width, height }}
      >
        <Image
          src={src || images.noImage}
          alt={alt}
          fill
          sizes={`(max-width: 768px) 100vw, ${width}px`}
          className={cn(
            'object-cover transition-all duration-300',
            isLoading ? 'scale-110 blur-sm' : 'scale-100 blur-0',
            'group-hover:scale-105'
          )}
          onError={handleError}
          onLoad={handleLoad}
        />

        {isLoading && <LoadingItem loading={isLoading} />}

        <DialogTrigger asChild>
          <Button
            variant='ghost'
            size='icon'
            className='absolute right-2 top-2 opacity-100 sm:opacity-0 transition-opacity sm:group-hover:opacity-100'
          >
            <Maximize2 className='h-4 w-4' />
          </Button>
        </DialogTrigger>
      </div>
      <DialogContent className='max-w-[90vw] p-6 sm:max-w-[850px]'>
        <DialogTitle></DialogTitle>
        <ImageViewer
          src={src || `${images.noImage}`}
          alt={alt}
          initialWidth={viewerWidth}
          initialHeight={viewerHeight}
          fallbackText={fallbackText}
        />
      </DialogContent>
    </Dialog>
  );
}
