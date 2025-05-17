'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Camera, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AvatarDropzoneProps } from '@/types/common';
import { formatFileSize } from '@/utils/common';
import { useTranslations } from 'next-intl';

export function AvatarDropzone({
  onFileSelected,
  maxSize = 5 * 1024 * 1024, // 5MB
  className,
}: AvatarDropzoneProps) {
  const t = useTranslations('Component.Input.Avatar');
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles?.length > 0) {
        onFileSelected(acceptedFiles[0]);
      }
    },
    [onFileSelected]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    maxSize,
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors',
        isDragActive && 'border-primary/50 bg-primary/5',
        isDragReject && 'border-destructive/50 bg-destructive/5',
        'cursor-pointer hover:bg-muted/50',
        className
      )}
    >
      <input {...getInputProps()} />

      <div className='flex flex-col items-center justify-center text-center'>
        <div className='mb-4 rounded-full bg-muted p-3'>
          {isDragActive ? (
            <Camera className='h-6 w-6 text-muted-foreground' />
          ) : (
            <Upload className='h-6 w-6 text-muted-foreground' />
          )}
        </div>

        <p className='mb-1 text-sm font-medium'>
          {isDragActive ? t('description1') : t('description2')}
        </p>

        <p className='text-xs text-muted-foreground'>{t('description3')}</p>

        <p className='mt-2 text-xs text-muted-foreground'>
          PNG, JPG, GIF or WEBP (max. {formatFileSize(maxSize)})
        </p>
      </div>
    </div>
  );
}
