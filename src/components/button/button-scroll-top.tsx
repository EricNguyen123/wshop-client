'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { ChevronUp } from 'lucide-react';

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLElement | null>(null);

  const scrollToTop = () => {
    containerRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    containerRef.current = document.querySelector('#scrollable-container');

    const handleScroll = () => {
      const scrollTop = containerRef.current?.scrollTop || 0;
      if (scrollTop > 120) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <Button
      onClick={scrollToTop}
      className={`h-9 w-9 fixed bottom-6 right-6 !p-3 rounded-full cursor-pointer transform
        shadow-lg hover:shadow-xl backdrop-filter backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80
        transition-opacity duration-300 hover:!bg-rose-500 hover:!text-white ${
          isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      aria-label='Scroll to top'
      variant={'outline'}
    >
      <ChevronUp />
    </Button>
  );
};

export default ScrollToTopButton;
