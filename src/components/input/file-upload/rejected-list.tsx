/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatFileSize } from '@/utils/common';
import { RejectedListProps } from '@/types/common';

export function RejectedList({ rejected, onRemove }: RejectedListProps) {
  if (rejected.length === 0) return null;

  return (
    <div className='space-y-2'>
      {rejected.map((rejection, index) => {
        const errorMessages = rejection.errors.map((error: any) => {
          if (error.code === 'file-too-large') {
            return `File is too large (max: ${formatFileSize(error.maxSize)})`;
          }
          if (error.code === 'file-invalid-type') {
            return 'File type not supported';
          }
          if (error.code === 'too-many-files') {
            return 'Too many files';
          }
          return error.message;
        });

        return (
          <div
            key={index}
            className='flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-2 text-xs text-destructive'
          >
            <div className='flex-1 overflow-hidden'>
              <p className='font-medium truncate'>{rejection.file.name || 'Unknown file'}</p>
              <ul className='list-disc list-inside mt-1 space-y-1'>
                {errorMessages.map((message: string, i: number) => (
                  <li key={i} className='text-xs'>
                    {message}
                  </li>
                ))}
              </ul>
            </div>
            <Button variant='ghost' size='icon' className='h-6 w-6' onClick={() => onRemove(index)}>
              <X className='h-4 w-4' />
              <span className='sr-only'>Remove</span>
            </Button>
          </div>
        );
      })}
    </div>
  );
}
