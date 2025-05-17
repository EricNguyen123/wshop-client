'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to detect if the current device is a mobile device
 * @param breakpoint The max-width in pixels to consider as mobile (default: 768)
 * @returns Boolean indicating if the current device is mobile
 */
export function useMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= breakpoint);
    };
    checkIfMobile();

    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, [breakpoint]);

  return isMobile;
}
