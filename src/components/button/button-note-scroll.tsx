'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { ChevronDown } from 'lucide-react';

const ScrollNoteButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLElement | null>(null);

  const scrollDown = () => {
    if (!containerRef.current) return;

    const currentPosition = containerRef.current.scrollTop;
    const viewportHeight = containerRef.current.clientHeight;

    containerRef.current.scrollTo({
      top: currentPosition + viewportHeight * 0.8,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    containerRef.current = document.querySelector('#scrollable-container');

    const checkForHiddenContent = () => {
      const container = containerRef.current;
      if (!container) return;

      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      const scrollTop = container.scrollTop;

      const hasHiddenContent = scrollHeight > scrollTop + clientHeight + 20;

      setIsVisible(hasHiddenContent);
    };

    const container = containerRef.current;
    if (container) {
      checkForHiddenContent();

      container.addEventListener('scroll', checkForHiddenContent);
      window.addEventListener('resize', checkForHiddenContent);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', checkForHiddenContent);
        window.removeEventListener('resize', checkForHiddenContent);
      }
    };
  }, []);

  if (!isVisible) return null;

  return (
    <Button
      onClick={scrollDown}
      className='w-9 h-max fixed right-6 top-4/5 transform -translate-y-1/2 
      flex flex-col items-center gap-2 !p-3 cursor-pointer
      bg-white text-slate-800 dark:bg-slate-800 dark:text-white
      shadow-lg hover:shadow-xl transition-all duration-300
      hover:bg-rose-500 hover:text-white
      border border-slate-200 dark:border-slate-700
       backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80 rounded-full '
      aria-label='Scroll down for more content'
    >
      <span className='text-xs font-medium [writing-mode:vertical-rl] rotate-180'>
        Scroll for more
      </span>
      <ChevronDown className='animate-bounce mt-1' size={16} />
    </Button>
  );
};

export default ScrollNoteButton;
