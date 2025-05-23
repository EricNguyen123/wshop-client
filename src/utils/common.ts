import { cn } from '@/lib/utils';
import { FileWithPreview } from '@/types/common';

export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getFileTypeColor(fileType: string | undefined): string {
  if (!fileType) return 'text-gray-400';

  if (fileType.startsWith('image/')) return 'text-blue-500';
  if (fileType.startsWith('video/')) return 'text-purple-500';
  if (fileType.startsWith('audio/')) return 'text-pink-500';
  if (fileType.includes('pdf')) return 'text-red-500';
  if (fileType.includes('word') || fileType.includes('document')) return 'text-blue-600';
  if (fileType.includes('excel') || fileType.includes('sheet')) return 'text-green-600';
  if (fileType.includes('powerpoint') || fileType.includes('presentation'))
    return 'text-orange-500';

  return 'text-gray-500';
}

export function createSafeObjectURL(file: File): string | undefined {
  try {
    return URL.createObjectURL(file);
  } catch (error) {
    console.error('Failed to create object URL:', error);
    return undefined;
  }
}

export { cn };

export function createBlobUrl(file: File): string {
  return URL.createObjectURL(file);
}

export function revokeBlobUrl(url: string): void {
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}

export const formatColumnName = (str: string) =>
  str.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/^./, (c) => c.toUpperCase());

export async function convertFileWithPreviewToFile(file: FileWithPreview): Promise<File> {
  const buffer =
    typeof file.arrayBuffer === 'function'
      ? await file.arrayBuffer()
      : await new Blob([file as unknown as Blob]).arrayBuffer();

  const newFile = new File([buffer], file.name, {
    type: file.type,
    lastModified: file.lastModified,
  });

  return newFile;
}

export async function convertFilesWithPreviewToFiles(files: FileWithPreview[]): Promise<File[]> {
  const convertedFiles: File[] = [];
  for (const file of files) {
    const convertedFile = await convertFileWithPreviewToFile(file);
    convertedFiles.push(convertedFile);
  }
  return convertedFiles;
}
