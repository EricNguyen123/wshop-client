'use client';
import React, { useState, useEffect, type ReactElement } from 'react';
import ItemSidebar from './item-sidebar';
import { useRouter, usePathname } from '@/i18n/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface ItemProps {
  title: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }> | ReactElement;
  url?: string;
  items?: ItemProps[];
  id?: string | number;
  roles?: string[];
}

interface GroupSidebarProps {
  options?: ItemProps[];
  currentRole: string;
}

const Item = ({
  icon,
  title,
  items,
  url,
  id,
  currentRole,
}: ItemProps & { currentRole: string }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [isChoose, setIsChoose] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  const checkEvent = items && items.length > 0;

  useEffect(() => {
    if (url) {
      setIsChoose(pathname === url);
    }

    if (items && items.length > 0) {
      const isAnyChildActive = items.some(
        (item) =>
          item.url === pathname ||
          (item.items && item.items.some((subItem) => subItem.url === pathname))
      );

      if (isAnyChildActive) {
        setOpen(true);
      }
    }
  }, [pathname, url, items]);

  const handleClick = (e: React.MouseEvent) => {
    if (checkEvent) {
      e.stopPropagation();
      setOpen(!open);
    }
    if (url && !checkEvent) {
      router.push(url);
    }
  };

  return (
    <motion.div
      className='w-full h-max flex flex-col items-start justify-center gap-1'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.1 }}
        className='w-full h-max'
      >
        <ItemSidebar
          icon={icon}
          title={title}
          onClick={handleClick}
          option={checkEvent}
          active={open}
          choose={isChoose}
        />
      </motion.div>

      <AnimatePresence>
        {items && open && (
          <motion.div
            className='w-full h-max pl-2 flex flex-col items-start justify-center'
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className='w-full h-max translate-x-px pl-2 border-l gap-1 flex flex-col items-start justify-center'>
              {items
                .filter((item) => !item.roles || item.roles.includes(currentRole))
                .map((item, index) => (
                  <motion.div
                    key={`${id}-${index}`}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{
                      duration: 0.2,
                      delay: index * 0.05,
                      ease: 'easeOut',
                    }}
                    className='w-full h-max'
                  >
                    <Item
                      icon={item.icon}
                      title={item.title}
                      url={item.url}
                      items={item.items}
                      id={`${id}-${index}`}
                      currentRole={currentRole}
                    />
                  </motion.div>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function GroupSidebar({ options, currentRole }: GroupSidebarProps) {
  return (
    <motion.div
      className='w-max h-full overflow-hidden'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className='min-w-60 min-h-0 h-full overflow-auto scrollbar-hidden p-2 gap-1 flex flex-col items-start justify-start'>
        {options &&
          options.length > 0 &&
          options
            .filter((item) => !item.roles || item.roles.includes(currentRole))
            .map((item, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  type: 'spring',
                  stiffness: 100,
                }}
                className='w-full h-max'
              >
                <Item
                  icon={item.icon}
                  title={item.title}
                  url={item.url}
                  items={item.items}
                  id={index.toString()}
                  currentRole={currentRole}
                />
              </motion.div>
            ))}
      </div>
    </motion.div>
  );
}
