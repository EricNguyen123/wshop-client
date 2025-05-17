/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MoreHorizontal, Plus, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { ComponentPropsWithoutRef } from 'react';

export type ActionVariant = 'plus' | 'horizontal' | 'custom';

export interface WithCloseDialog {
  closeDialog?: () => void;
}

export interface ActionOption<T = unknown> {
  icon?: React.ReactNode;
  content: React.ReactNode;
  tooltip?: string;
  onSelect?: () => void;
  dialog?: {
    title?: React.ReactNode;
    content: React.ReactNode | React.ComponentType<WithCloseDialog>;
    description?: React.ReactNode;
  };
  className?: string;
  data?: T;
  disabled?: boolean;
  roles?: string[];
}

export interface ActionButtonProps<T = unknown>
  extends Omit<ComponentPropsWithoutRef<typeof Button>, 'onClick'> {
  options: ActionOption<T>[];
  actionVariant?: ActionVariant;
  icon?: LucideIcon;
  onOptionSelect?: (data: T) => void;
  tooltip?: string;
  dropdownClassName?: string;
  alignEnd?: boolean;
  currentRole?: string;
}

export function ActionButton<T = unknown>({
  options,
  className,
  onOptionSelect,
  actionVariant = 'plus',
  icon: CustomIcon,
  tooltip,
  dropdownClassName,
  alignEnd = false,
  variant: buttonVariant = 'outline',
  size,
  currentRole,
  ...props
}: ActionButtonProps<T>) {
  const [dialogState, setDialogState] = useState<{
    open: boolean;
    content?: React.ReactNode | React.ComponentType<WithCloseDialog>;
    title?: React.ReactNode;
    description?: React.ReactNode;
  }>({
    open: false,
  });

  const handleOptionClick = (option: ActionOption<T>) => {
    if (option.dialog) {
      setDialogState({
        open: true,
        content: option.dialog.content,
        title: option.dialog.title,
        description: option.dialog.description,
      });
    }

    if (option.onSelect) {
      option.onSelect();
    }

    if (onOptionSelect && option.data !== undefined) {
      onOptionSelect(option.data);
    }
  };

  const closeDialog = () => {
    setDialogState((prev) => ({ ...prev, open: false }));
  };

  const getButtonContent = () => {
    switch (actionVariant) {
      case 'plus':
        return <Plus className='h-4 w-4' />;
      case 'horizontal':
        return <MoreHorizontal className='h-4 w-4' />;
      case 'custom':
        return CustomIcon ? (
          <CustomIcon className='h-4 w-4' />
        ) : (
          <MoreHorizontal className='h-4 w-4' />
        );
    }
  };

  const getButtonStyles = () => {
    switch (actionVariant) {
      case 'plus':
        return cn(
          'transition-colors duration-200',
          buttonVariant === 'outline' && 'hover:bg-primary hover:text-primary-foreground',
          size === 'icon' ? 'h-9 w-9' : ''
        );
      case 'horizontal':
        return cn(buttonVariant === 'ghost' ? 'h-8 w-8 p-0' : '');
      case 'custom':
        return '';
    }
  };

  const button = (
    <Button
      variant={buttonVariant}
      size={size || (actionVariant === 'plus' ? 'icon' : 'sm')}
      className={cn(getButtonStyles(), className)}
      {...props}
    >
      {getButtonContent()}
    </Button>
  );

  const renderDialogContent = () => {
    const { content } = dialogState;
    if (!content) return null;

    if (typeof content === 'function') {
      const DialogComponent = content as React.ComponentType<WithCloseDialog>;
      return <DialogComponent closeDialog={closeDialog} />;
    }

    if (React.isValidElement(content)) {
      return React.cloneElement(content as React.ReactElement<any>, {
        closeDialog,
      });
    }

    return content;
  };

  const filteredOptions = options.filter(
    (option) => !option.roles || (currentRole && option.roles.includes(currentRole))
  );

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className='relative'>
          {tooltip ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>{button}</TooltipTrigger>
                <TooltipContent>{tooltip}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            button
          )}
        </DropdownMenuTrigger>
        {filteredOptions.length > 0 && (
          <DropdownMenuContent align={alignEnd ? 'end' : 'start'} className={cn(dropdownClassName)}>
            {filteredOptions.map((option, index) => (
              <React.Fragment key={index}>
                {option.tooltip ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DropdownMenuItem
                          className={cn('gap-2 cursor-pointer', option.className)}
                          onClick={() => handleOptionClick(option)}
                          disabled={option.disabled}
                        >
                          {option.icon}
                          <span>{option.content}</span>
                        </DropdownMenuItem>
                      </TooltipTrigger>
                      <TooltipContent>{option.tooltip}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <DropdownMenuItem
                    className={cn('gap-2 cursor-pointer', option.className)}
                    onClick={() => handleOptionClick(option)}
                    disabled={option.disabled}
                  >
                    {option.icon}
                    <span>{option.content}</span>
                  </DropdownMenuItem>
                )}
              </React.Fragment>
            ))}
          </DropdownMenuContent>
        )}
      </DropdownMenu>

      <Dialog
        open={dialogState.open}
        onOpenChange={(open) => setDialogState((prev) => ({ ...prev, open }))}
      >
        <DialogContent>
          {dialogState.title && (
            <DialogHeader>
              <DialogTitle>{dialogState.title}</DialogTitle>
            </DialogHeader>
          )}
          {renderDialogContent()}
        </DialogContent>
      </Dialog>
    </>
  );
}
