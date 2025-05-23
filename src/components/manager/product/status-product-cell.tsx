import { StatusProductEnum } from '@/common/enum';
import { Badge } from '@/components/ui/badge';
import { symbols } from '@/constant/common';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import React from 'react';

export default function StatusProductCell({
  status,
  className,
}: {
  status: number | undefined;
  className?: string;
}) {
  const tStatus = useTranslations('Form.ProductCreate');
  const statusOptions = Object.values(StatusProductEnum)
    .filter((value) => typeof value === 'number')
    .map((status) => {
      let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default';

      switch (status) {
        case StatusProductEnum.DRAFT:
        case StatusProductEnum.INACTIVE:
          variant = 'secondary';
          break;
        case StatusProductEnum.PENDING:
        case StatusProductEnum.DISCONTINUED:
          variant = 'outline';
          break;
        case StatusProductEnum.OUT_OF_STOCK:
          variant = 'destructive';
          break;
        case StatusProductEnum.ACTIVE:
        default:
          variant = 'default';
      }

      return {
        label: tStatus(`status.${status}`),
        value: String(status),
        variant,
      };
    });

  const option = statusOptions.find((opt) => opt.value === String(status));

  return (
    <div className={cn('flex items-center justify-center', className)}>
      {option ? (
        <Badge variant={option.variant}>{option.label}</Badge>
      ) : (
        <span className='text-muted-foreground'>{symbols.inValid}</span>
      )}
    </div>
  );
}
