'use client';

import { useCallback, useEffect, useState } from 'react';
import { Pencil, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { AvatarCrop } from './avatar-crop';
import { AvatarDropzone } from './avatar-dropzone';
import { AvatarPreview } from './avatar-preview';
import { AvatarUploadProps } from '@/types/common';
import { useTranslations } from 'next-intl';

export function AvatarUpload({
  value,
  onChange,
  className,
  size = 'lg',
  disabled = false,
  maxSize = 5 * 1024 * 1024, // 5MB
  aspectRatio = 1,
  showRemoveButton = true,
  placeholder,
  alt = 'Avatar',
  onError,
}: AvatarUploadProps) {
  const [avatarSrc, setAvatarSrc] = useState<string | null>(value || null);
  const [tempFile, setTempFile] = useState<File | null>(null);
  const [cropOpen, setCropOpen] = useState(false);
  const [dropzoneOpen, setDropzoneOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations('Component.Input.Avatar');

  useEffect(() => {
    setAvatarSrc(value || null);
  }, [value]);

  const handleFileSelected = useCallback(
    (file: File) => {
      setError(null);

      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        onError?.('Please upload an image file');
        return;
      }

      if (file.size > maxSize) {
        const maxSizeMB = Math.round(maxSize / 1024 / 1024);
        setError(`File size exceeds ${maxSizeMB}MB limit`);
        onError?.(`File size exceeds ${maxSizeMB}MB limit`);
        return;
      }

      setTempFile(file);
      setCropOpen(true);
      setDropzoneOpen(false);
    },
    [maxSize, onError]
  );

  const handleCrop = useCallback(
    (croppedImageBlob: Blob) => {
      const url = URL.createObjectURL(croppedImageBlob);
      setAvatarSrc(url);
      setCropOpen(false);

      const file = new File([croppedImageBlob], tempFile?.name || 'avatar.jpg', {
        type: croppedImageBlob.type,
      });

      onChange?.(url, file);
      setTempFile(null);
    },
    [onChange, tempFile]
  );

  const handleRemove = useCallback(() => {
    if (avatarSrc) {
      if (avatarSrc.startsWith('blob:')) {
        URL.revokeObjectURL(avatarSrc);
      }

      setAvatarSrc(null);
      onChange?.(null, null);
    }
  }, [avatarSrc, onChange]);

  const handleCancelCrop = useCallback(() => {
    setCropOpen(false);
    setTempFile(null);
  }, []);

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      <div
        className='relative'
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <AvatarPreview
          src={avatarSrc}
          placeholder={placeholder}
          alt={alt}
          size={size}
          isHovering={isHovering && !disabled}
        />

        {isHovering && !disabled && (
          <div className='absolute inset-0 flex items-center justify-center bg-black/40 rounded-full'>
            <div className='flex gap-2'>
              <Button
                size='icon'
                variant='secondary'
                className='h-8 w-8 rounded-full'
                onClick={() => setDropzoneOpen(true)}
              >
                <Pencil className='h-4 w-4' />
                <span className='sr-only'>Change avatar</span>
              </Button>

              {showRemoveButton && avatarSrc && (
                <Button
                  size='icon'
                  variant='destructive'
                  className='h-8 w-8 rounded-full'
                  onClick={handleRemove}
                >
                  <Trash2 className='h-4 w-4' />
                  <span className='sr-only'>Remove avatar</span>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {error && <p className='text-sm text-destructive mt-1'>{error}</p>}

      {!avatarSrc && !disabled && (
        <Button variant='outline' size='sm' onClick={() => setDropzoneOpen(true)} className='mt-2'>
          <Upload className='h-4 w-4 mr-2' />
          {t('title1')}
        </Button>
      )}

      <Dialog open={dropzoneOpen} onOpenChange={setDropzoneOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>{t('title1')}</DialogTitle>
          </DialogHeader>

          <AvatarDropzone onFileSelected={handleFileSelected} maxSize={maxSize} />

          <DialogFooter className='grid grid-cols-1 gap-4'>
            <Button variant='outline' onClick={() => setDropzoneOpen(false)}>
              {t('cancel')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={cropOpen} onOpenChange={setCropOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>{t('title2')}</DialogTitle>
          </DialogHeader>

          {tempFile && <AvatarCrop file={tempFile} onCrop={handleCrop} aspectRatio={aspectRatio} />}

          <DialogFooter className='grid grid-cols-2 gap-4 w-full'>
            <Button variant='outline' onClick={handleCancelCrop} className='w-full'>
              {t('cancel')}
            </Button>
            <Button type='submit' form='crop-form' className='w-full'>
              {t('save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
