/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { FileList } from './file-list';
import { RejectedList } from './rejected-list';
import { FileUploadProps, FileWithPreview } from '@/types/common';
import { formatFileSize } from '@/utils/common';
import { showErrorToast } from '@/components/toast/custom-toast';
import { useTranslations } from 'next-intl';

export function FileUpload({
  value = [],
  onChange,
  onRemove,
  disabled = false,
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB
  accept = {
    'image/*': [],
    'application/pdf': [],
    'application/msword': [],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
  },
  className,
  showPreview = true,
  simulateProgress = true,
  dropzoneOptions = {},
  previewType = 'grid',
  showFileInfo = true,
  allowReplacement = false,
  uploadText = 'Drag & drop files here, or click to select files',
  uploadSubText,
  uploadNoteText,
}: FileUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [rejected, setRejected] = useState<any[]>([]);
  const progressIntervalsRef = useRef<NodeJS.Timeout[]>([]);
  const isInitialMount = useRef(true);
  const tMessage = useTranslations('Messages.error');

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;

      const initialFiles = value.map((file) => {
        return {
          ...file,
          name: file.name || `File-${crypto.randomUUID().slice(0, 8)}`,
          id: file.id || crypto.randomUUID(),
          preview: file.preview,
          progress: file.progress || 100,
          size: file.size || 0,
          type: file.type || '',
          lastModified: file.lastModified || Date.now(),
        };
      });

      setFiles(initialFiles);
    }
  }, [value]);

  useEffect(() => {
    return () => {
      progressIntervalsRef.current.forEach((interval) => clearInterval(interval));
      progressIntervalsRef.current = [];
    };
  }, []);

  const simulateFileUploadProgress = useCallback((newFiles: FileWithPreview[]) => {
    progressIntervalsRef.current.forEach((interval) => clearInterval(interval));
    progressIntervalsRef.current = [];

    const newIntervals = newFiles.map((file) => {
      return setInterval(() => {
        setFiles((currentFiles) => {
          const fileIndex = currentFiles.findIndex((f) => f.id === file.id);
          if (fileIndex === -1) return currentFiles;

          const updatedFiles = [...currentFiles];
          const currentProgress = updatedFiles[fileIndex].progress || 0;

          if (currentProgress >= 100) {
            clearInterval(
              progressIntervalsRef.current.find(
                (interval) => interval === progressIntervalsRef.current[fileIndex]
              )
            );
            return currentFiles;
          }

          const increment =
            currentProgress < 30 ? 3 : currentProgress < 70 ? 5 : currentProgress < 90 ? 2 : 1;

          updatedFiles[fileIndex] = {
            ...updatedFiles[fileIndex],
            progress: Math.min(currentProgress + increment, 100),
          };

          return updatedFiles;
        });
      }, 200);
    });

    progressIntervalsRef.current = [...progressIntervalsRef.current, ...newIntervals];
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      if (acceptedFiles?.length) {
        const newFiles = acceptedFiles.map((file) => {
          let preview: string | undefined = undefined;

          if (file.type && file.type.startsWith('image/')) {
            try {
              preview = URL.createObjectURL(file);
            } catch (error) {
              console.error('Failed to create object URL for preview:', error);
              showErrorToast(tMessage(`file.preview`));
            }
          }

          return {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
            slice: file.slice.bind(file),
            stream: file.stream?.bind(file),
            text: file.text?.bind(file),
            arrayBuffer: file.arrayBuffer?.bind(file),
            preview,
            id: crypto.randomUUID(),
            progress: 0,
          } as FileWithPreview;
        });

        let updatedFiles: FileWithPreview[];
        if (allowReplacement && files.length + newFiles.length > maxFiles) {
          const keepCount = Math.max(0, maxFiles - newFiles.length);
          updatedFiles = [...files.slice(0, keepCount), ...newFiles].slice(0, maxFiles);
        } else {
          updatedFiles = [...files, ...newFiles].slice(0, maxFiles);
        }

        setFiles(updatedFiles);
        if (simulateProgress) {
          simulateFileUploadProgress(newFiles);
        }
      }

      if (rejectedFiles?.length) {
        setRejected(rejectedFiles);
      }
    },
    [files, maxFiles, simulateProgress, allowReplacement, simulateFileUploadProgress]
  );

  useEffect(() => {
    if (!isInitialMount.current) {
      onChange?.(files);
    }
  }, [files, onChange]);

  const { getRootProps, getInputProps, isDragActive, isDragReject, isDragAccept } = useDropzone({
    onDrop,
    disabled,
    maxFiles: maxFiles - files.length,
    maxSize,
    accept,
    ...dropzoneOptions,
  });

  const removeFile = useCallback(
    (file: FileWithPreview) => {
      setFiles((currentFiles) => {
        return currentFiles.filter((f) => f.id !== file.id);
      });

      if (file.preview && typeof file.preview === 'string' && file.preview.startsWith('blob:')) {
        try {
          URL.revokeObjectURL(file.preview);
        } catch (error) {
          console.error('Failed to revoke object URL:', error);
          showErrorToast(tMessage(`file.revoke`));
        }
      }

      onRemove?.(file);
    },
    [onRemove]
  );

  const removeRejected = useCallback((index: number) => {
    setRejected((currentRejected) => currentRejected.filter((_, i) => i !== index));
  }, []);

  const remainingCount = maxFiles - files.length;
  const isMaxFilesReached = remainingCount <= 0;

  return (
    <div className={cn('space-y-4', className)}>
      <Card
        {...getRootProps()}
        className={cn(
          'border-dashed transition-colors',
          isDragActive && !isDragReject && 'border-primary/50 bg-primary/5',
          isDragReject && 'border-destructive/50 bg-destructive/5',
          isDragAccept && 'border-success/50 bg-success/5',
          isMaxFilesReached && 'opacity-60 cursor-not-allowed',
          disabled && 'opacity-60 cursor-not-allowed',
          !isMaxFilesReached && !disabled && 'cursor-pointer hover:bg-muted/50'
        )}
      >
        <CardContent className='h-[150px] flex flex-col items-center justify-center space-y-3 px-2 py-8 text-xs sm:text-sm'>
          <Input type='file' {...getInputProps()} />
          <div className='flex items-center justify-center'>
            <UploadCloud className='h-10 w-10 text-muted-foreground' />
          </div>
          <div className='flex flex-col items-center justify-center text-center'>
            <p className='font-medium'>{uploadText}</p>
            <p className='text-muted-foreground'>
              {files.length > 0
                ? `${files.length}/${maxFiles} ${tMessage('file.notification')}${
                    remainingCount > 0 ? ` (${remainingCount} ${tMessage('file.more')})` : ''
                  }`
                : uploadSubText || `${tMessage('file.note')} ${maxFiles} ${tMessage('file.files')}`}
            </p>
            <p className='text-xs text-muted-foreground mt-1'>
              {uploadNoteText ? uploadNoteText : tMessage('file.upload')} {formatFileSize(maxSize)}
            </p>
          </div>
        </CardContent>
      </Card>

      {rejected.length > 0 && <RejectedList rejected={rejected} onRemove={removeRejected} />}

      {showPreview && files.length > 0 && (
        <FileList
          files={files}
          onRemove={removeFile}
          type={previewType}
          showFileInfo={showFileInfo}
        />
      )}
    </div>
  );
}
