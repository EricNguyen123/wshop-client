import { FileListProps } from '@/types/common';
import { FilePreview } from './file-preview';
import { cn } from '@/lib/utils';

export function FileList({ files, onRemove, type = 'grid', showFileInfo = true }: FileListProps) {
  if (files.length === 0) return null;

  return (
    <div
      className={cn(
        type === 'grid' ? 'grid gap-2 sm:grid-cols-2 lg:grid-cols-3' : 'flex flex-col gap-2'
      )}
    >
      {files.map((file) => (
        <FilePreview
          key={file.id}
          file={file}
          onRemove={() => onRemove(file)}
          showFileInfo={showFileInfo}
        />
      ))}
    </div>
  );
}
