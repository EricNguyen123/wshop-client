'use client';

import type React from 'react';

import { useState, useRef, useEffect } from 'react';
import BaseTooltip from '../tooltip/base-tooltip';

interface TruncatedTextProps {
  text: string;
  maxLength?: number;
  className?: string;
  tooltipClassName?: string;
  fallback?: React.ReactNode;
}

export function TruncatedText({ text, maxLength = 100, fallback = 'N/A' }: TruncatedTextProps) {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (textRef.current) {
      const isTextOverflowing = textRef.current.scrollWidth > textRef.current.clientWidth;
      setIsOverflowing(isTextOverflowing || text?.length > maxLength);
    }
  }, [text, maxLength]);

  if (!text) {
    return <span className='text-sm text-muted-foreground'>{fallback}</span>;
  }

  return (
    <BaseTooltip nameTooltip={text}>
      <span className='block truncate text-sm' title={isOverflowing ? text : undefined}>
        {text}
      </span>
    </BaseTooltip>
  );
}
