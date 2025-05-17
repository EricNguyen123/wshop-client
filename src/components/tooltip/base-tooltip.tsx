import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { ITooltipProps } from '@/types';

export default function BaseTooltip({
  children,
  nameTooltip,
  delayDuration = 300,
  disabled = false,
}: ITooltipProps) {
  if (disabled) {
    return <>{children}</>;
  }
  return (
    <Tooltip delayDuration={delayDuration}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      {nameTooltip && (
        <TooltipContent side='top' align='center' className='max-w-xs whitespace-normal'>
          <p className='break-words'>{nameTooltip}</p>
        </TooltipContent>
      )}
    </Tooltip>
  );
}
