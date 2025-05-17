'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { FileIcon, ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatFileSize } from '@/utils/common';
import { FilePreviewProps } from '@/types/common';
import Image from 'next/image';
import { unknownFile } from '@/constant/common';
import images from '@/assets/images';

export function FilePreview({ file, onRemove, showFileInfo = true }: FilePreviewProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  const isImage = file.type?.startsWith('image/');
  const isUploading = typeof file.progress === 'number' && file.progress < 100;
  const fileSize = file.size ? formatFileSize(file.size) : unknownFile.size;
  const fileName = file.name || unknownFile.name;
  const hasError = !file.type || !file.size;
  const errorMessage = !file.type ? unknownFile.type : !file.size ? unknownFile.error : '';

  useEffect(() => {
    if (isImage && file.preview) {
      setImgSrc(file.preview);
      setImgError(false);
    } else if (isImage && file instanceof Blob) {
      try {
        const url = URL.createObjectURL(file);
        setImgSrc(url);
        setImgError(false);

        return () => {
          URL.revokeObjectURL(url);
        };
      } catch (error) {
        console.error('Failed to create preview:', error);
        setImgError(true);
      }
    }
  }, [file, isImage]);

  return (
    <div
      className={cn(
        'relative flex items-center gap-2 rounded-md border p-2',
        hasError && 'border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800'
      )}
    >
      <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-md border bg-muted/30 overflow-hidden'>
        {isImage && imgSrc && !imgError ? (
          <Image
            src={imgSrc || images.noImage}
            alt={fileName}
            className='h-full w-full rounded-md object-cover'
            onError={() => {
              setImgError(true);
              console.log('Image failed to load:', fileName);
            }}
            width={48}
            height={48}
          />
        ) : isImage ? (
          <ImageIcon className='h-6 w-6 text-muted-foreground' />
        ) : (
          <FileIcon className='h-6 w-6 text-muted-foreground' />
        )}
      </div>

      <div className='flex flex-1 flex-col overflow-hidden'>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className='text-xs font-medium truncate max-w-[180px]'>{fileName}</p>
            </TooltipTrigger>
            <TooltipContent side='top' className='max-w-[300px] break-all'>
              {fileName}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {showFileInfo && (
          <>
            <div className='flex items-center gap-2'>
              <p className='text-xs text-muted-foreground'>{fileSize}</p>
              {hasError && (
                <span className='text-xs text-amber-600 dark:text-amber-400'>{errorMessage}</span>
              )}
            </div>
            {isUploading && <Progress value={file.progress} className='h-1 mt-1' />}
          </>
        )}
      </div>

      <Button
        variant='ghost'
        size='icon'
        className='h-6 w-6 shrink-0 rounded-full'
        onClick={onRemove}
        disabled={isUploading}
      >
        <X className='h-4 w-4' />
      </Button>
    </div>
  );
}
