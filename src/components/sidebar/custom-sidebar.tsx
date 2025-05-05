'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import BaseSidebar from './base-sidebar';

interface CustomSidebarProps {
  currentTitle?: string;
}

export default function CustomSidebar({ currentTitle = 'Menu' }: CustomSidebarProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={'outline'} className='flex items-center gap-2'>
          <Menu className='h-5 w-5' />
          <span className='sr-only md:not-sr-only'>{currentTitle}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='!p-0' align='start' sideOffset={4}>
        <DropdownMenuItem className='hover:!bg-transparent !p-0'>
          <BaseSidebar />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
