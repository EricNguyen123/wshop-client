'use client';

import { IconButton } from '@/components/button/button-icon';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import BaseTitle from './base-title';

interface BaseDropBoxProps {
  children?: React.ReactNode;
  title?: string;
  icon?: React.ElementType;
  defaultOpen?: boolean;
  description?: string;
}

export default function BaseDropBox({
  children,
  title,
  icon,
  defaultOpen = true,
  description,
}: BaseDropBoxProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const contentVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      marginTop: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    visible: {
      opacity: 1,
      height: 'auto',
      marginTop: '0.5rem',
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const iconVariants = {
    open: { rotate: 270, transition: { duration: 0.3 } },
    closed: { rotate: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className='w-full max-w-xl sm:min-w-md flex flex-col items-start justify-center gap-3'>
      <div className='w-full flex flex-col'>
        <div className='w-full flex items-center justify-between'>
          <BaseTitle title={title} />
          <motion.div animate={isOpen ? 'open' : 'closed'} variants={iconVariants}>
            <IconButton
              icon={icon || ChevronDown}
              iconClassName='text-rose-500'
              onClick={toggleOpen}
              aria-label={isOpen ? 'Collapse' : 'Expand'}
            />
          </motion.div>
        </div>
        <Separator />
      </div>
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            className='w-full flex flex-col gap-2 overflow-hidden'
            initial='hidden'
            animate='visible'
            exit='hidden'
            variants={contentVariants}
          >
            {children}
          </motion.div>
        ) : (
          <span className='text-muted-foreground text-sm'>{description}</span>
        )}
      </AnimatePresence>
    </div>
  );
}
