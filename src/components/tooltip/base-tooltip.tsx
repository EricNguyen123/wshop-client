import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { ITooltipProps } from '@/types';

export default function BaseTooltip({ children, nameTooltip }: ITooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      {nameTooltip && (
        <TooltipContent>
          <p>{nameTooltip}</p>
        </TooltipContent>
      )}
    </Tooltip>
  );
}
