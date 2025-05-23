'use client';

import * as React from 'react';
import { Check, ChevronDown, type LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export type StatusOption = {
  value: string;
  label: string;
  icon?: LucideIcon;
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  description?: string;
};

export interface StatusSelectorProps {
  options: StatusOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  showSelectedIcon?: boolean;
  showSelectedLabel?: boolean;
  displayMode?: 'badge' | 'text' | 'icon-only';
  size?: 'sm' | 'md' | 'lg';
  searchable?: boolean;
  emptyMessage?: string;
}

export function StatusSelector({
  options,
  value,
  onChange,
  placeholder = 'Select status',
  disabled = false,
  className,
  showSelectedIcon = true,
  showSelectedLabel = true,
  displayMode = 'badge',
  size = 'md',
  searchable = true,
  emptyMessage = 'No status found.',
}: StatusSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState<string | undefined>(value);
  const [inputValue, setInputValue] = React.useState('');

  React.useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const handleSelect = React.useCallback(
    (currentValue: string) => {
      const option = options.find((opt) => opt.value === currentValue);
      if (option) {
        setSelectedValue(option.value);
        onChange?.(option.value);
        setOpen(false);
        setInputValue('');
      }
    },
    [onChange, options]
  );

  const selectedOption = React.useMemo(
    () => options.find((option) => option.value === selectedValue),
    [options, selectedValue]
  );

  const getColorClass = (color: StatusOption['color'] = 'default') => {
    const colorMap = {
      default: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
      primary: 'bg-primary/10 text-primary hover:bg-primary/20',
      secondary: 'bg-secondary/10 text-secondary hover:bg-secondary/20',
      success: 'bg-green-100 text-green-800 hover:bg-green-200',
      warning: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
      danger: 'bg-red-100 text-red-800 hover:bg-red-200',
      info: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    };
    return colorMap[color];
  };

  const getSizeClass = (size: StatusSelectorProps['size'] = 'md') => {
    const sizeMap = {
      sm: 'text-xs py-0.5 px-2',
      md: 'text-sm py-1 px-2.5',
      lg: 'text-base py-1.5 px-3',
    };
    return sizeMap[size];
  };

  const renderSelectedStatus = () => {
    if (!selectedOption) {
      return <span className='text-muted-foreground'>{placeholder}</span>;
    }

    const Icon = selectedOption.icon;

    if (displayMode === 'badge') {
      return (
        <Badge
          variant='outline'
          className={cn(
            'font-normal gap-1.5 border',
            getColorClass(selectedOption.color),
            getSizeClass(size)
          )}
        >
          {showSelectedIcon && Icon && <Icon className='h-3.5 w-3.5' />}
          {showSelectedLabel && selectedOption.label}
        </Badge>
      );
    }

    if (displayMode === 'icon-only' && showSelectedIcon) {
      return Icon && <Icon className='h-4 w-4' />;
    }

    return (
      <div className='flex items-center gap-2'>
        {showSelectedIcon && Icon && <Icon className='h-4 w-4' />}
        {showSelectedLabel && <span>{selectedOption.label}</span>}
      </div>
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            'w-full justify-between border-input dark:border-input text-accent-foreground hover:text-accent-foreground',
            className
          )}
        >
          {selectedValue ? renderSelectedStatus() : placeholder}
          <ChevronDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-full p-0 pointer-events-auto' align='start'>
        <Command>
          {searchable && (
            <CommandInput
              placeholder='Search...'
              value={inputValue}
              onValueChange={setInputValue}
              className='h-9'
            />
          )}
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options
                .filter(
                  (option) =>
                    !inputValue ||
                    option.label.toLowerCase().includes(inputValue.toLowerCase()) ||
                    option.description?.toLowerCase().includes(inputValue.toLowerCase())
                )
                .map((option) => {
                  const Icon = option.icon;
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => {
                        handleSelect(option.value);
                      }}
                      className='flex items-center gap-2'
                    >
                      {Icon && <Icon className='h-4 w-4 shrink-0' />}
                      <span>{option.label}</span>
                      {option.description && (
                        <span className='text-xs text-muted-foreground ml-auto'>
                          {option.description}
                        </span>
                      )}
                      {option.value === selectedValue && <Check className='ml-auto h-4 w-4' />}
                    </CommandItem>
                  );
                })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
