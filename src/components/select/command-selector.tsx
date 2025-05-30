'use client';

import * as React from 'react';
import { Check, ChevronDown, Search, X, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export type Option = {
  value: string;
  label: string;
  icon?: LucideIcon;
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  description?: string;
  level?: number;
};

export interface SelectorProps {
  options: Option[];
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
  allowClear?: boolean;
  placeholderSearch?: string;
}

export function CommandSelector({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  placeholderSearch = 'Search...',
  disabled = false,
  className,
  showSelectedIcon = true,
  showSelectedLabel = true,
  displayMode = 'text',
  size = 'md',
  searchable = true,
  emptyMessage = 'No options found.',
  allowClear = false,
}: SelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const containerRef = React.useRef<HTMLDivElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const selectedOption = React.useMemo(
    () => options.find((option) => option.value === value),
    [options, value]
  );

  const filteredOptions = React.useMemo(() => {
    if (!searchTerm.trim()) return options;
    const term = searchTerm.toLowerCase();
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(term) ||
        option.description?.toLowerCase().includes(term)
    );
  }, [options, searchTerm]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, searchable]);

  const handleSelect = (optionValue: string) => {
    if (optionValue === value && allowClear) {
      onChange?.('');
    } else {
      onChange?.(optionValue);
    }
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm('');
    }
  };

  const getColorClass = (color: Option['color'] = 'default') => {
    const colorMap = {
      default:
        'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700',
      primary:
        'bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:text-primary dark:hover:bg-primary/30',
      secondary:
        'bg-secondary/10 text-secondary hover:bg-secondary/20 dark:bg-secondary/20 dark:text-secondary dark:hover:bg-secondary/30',
      success:
        'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50',
      warning:
        'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:hover:bg-yellow-900/50',
      danger:
        'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50',
      info: 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50',
    };
    return colorMap[color];
  };

  const getSizeClass = (size: SelectorProps['size'] = 'md') => {
    const sizeMap = {
      sm: 'text-xs py-0.5 px-2',
      md: 'text-sm py-1 px-2.5',
      lg: 'text-base py-1.5 px-3',
    };
    return sizeMap[size];
  };

  const getLevelIndentation = (level = 0) => {
    if (level === 0) return '';
    if (level === 1) return 'pl-6';
    if (level === 2) return 'pl-10';
    if (level >= 3) return `pl-${Math.min(14 + (level - 3) * 2, 20)}`;
    return '';
  };

  const renderSelectedStatus = () => {
    if (!selectedOption) {
      return <span className='text-muted-foreground'>{placeholder}</span>;
    }

    const Icon = selectedOption.icon;
    const displayLabel = selectedOption.label.trim();

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
          {showSelectedLabel && displayLabel}
        </Badge>
      );
    }

    if (displayMode === 'icon-only' && showSelectedIcon) {
      return Icon && <Icon className='h-4 w-4' />;
    }

    return (
      <div className='flex items-center gap-2'>
        {showSelectedIcon && Icon && <Icon className='h-4 w-4' />}
        {showSelectedLabel && <span className='truncate'>{displayLabel}</span>}
      </div>
    );
  };

  return (
    <div className='relative w-full' ref={containerRef}>
      <Button
        type='button'
        variant='outline'
        role='combobox'
        aria-expanded={isOpen}
        disabled={disabled}
        onClick={handleToggle}
        className={cn(
          'w-full justify-between border-input dark:border-input text-left text-accent-foreground hover:text-accent-foreground font-normal transition-all duration-200 min-h-[40px] h-auto  !px-3 !py-1',
          !selectedOption && 'text-muted-foreground',
          isOpen && 'ring-2 ring-ring ring-offset-2',
          className
        )}
      >
        <div className='flex-1 truncate'>{renderSelectedStatus()}</div>
        <ChevronDown
          className={cn(
            'ml-2 h-4 w-4 shrink-0 opacity-50 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </Button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className='absolute top-full left-0 right-0 z-[10000] mt-2 bg-popover text-popover-foreground border border-border dark:border-gray-800 rounded-lg shadow-xl dark:shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200'
          style={{
            position: 'absolute',
            zIndex: 10000,
          }}
        >
          {searchable && (
            <div className='flex items-center border-b border-border/50 dark:border-gray-800/50 rounded-t-lg px-3 py-3 bg-transparent'>
              <Search className='mr-2 h-4 w-4 shrink-0 opacity-50 dark:opacity-40' />
              <input
                ref={searchInputRef}
                type='text'
                placeholder={placeholderSearch}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='placeholder:text-muted-foreground flex w-full rounded-md bg-transparent text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50'
                onKeyDown={(e) => {
                  e.stopPropagation();
                  if (e.key === 'Escape') {
                    setIsOpen(false);
                    setSearchTerm('');
                  }
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (filteredOptions.length > 0) {
                      handleSelect(filteredOptions[0].value);
                    }
                  }
                }}
                onClick={(e) => e.stopPropagation()}
                onFocus={(e) => e.stopPropagation()}
              />
              {searchTerm && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchTerm('');
                    searchInputRef.current?.focus();
                  }}
                  className='ml-2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors'
                >
                  <X className='h-3 w-3' />
                </button>
              )}
            </div>
          )}

          <div className='h-max p-2 overflow-hidden rounded-b-lg'>
            <div className='max-h-[220px] overflow-y-auto'>
              {filteredOptions.length === 0 ? (
                <div className='py-8 text-center text-sm text-muted-foreground dark:text-gray-400 font-medium'>
                  {emptyMessage}
                </div>
              ) : (
                <div className='p-1 space-y-0.5'>
                  {filteredOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = option.value === value;
                    const level = option.level || 0;

                    return (
                      <div
                        key={option.value}
                        className={cn(
                          'relative flex cursor-pointer select-none items-center rounded-md px-3 py-2.5 text-sm outline-none transition-all duration-150',
                          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-gray-800 dark:hover:text-gray-100',
                          isSelected &&
                            'bg-accent text-accent-foreground dark:bg-gray-800 dark:text-gray-100 font-medium',
                          getLevelIndentation(level)
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect(option.value);
                        }}
                      >
                        {level >= 3 && (
                          <div className='absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-rose-300 to-rose-400 dark:from-rose-400 dark:to-rose-500 rounded-l-md' />
                        )}

                        <div className='flex items-center gap-2 flex-1 min-w-0'>
                          {Icon && (
                            <Icon
                              className={cn(
                                'shrink-0 transition-colors',
                                level >= 3 ? 'h-3.5 w-3.5' : 'h-4 w-4',
                                level >= 3 && 'text-slate-600 dark:text-slate-400'
                              )}
                            />
                          )}
                          <span
                            className={cn(
                              'truncate block',
                              level >= 3 && 'text-xs font-medium text-slate-700 dark:text-slate-300'
                            )}
                          >
                            {option.label.trim()}
                          </span>
                          {option.description && (
                            <span
                              className={cn(
                                'text-xs text-muted-foreground dark:text-gray-400 ml-auto shrink-0',
                                level >= 3 && 'text-slate-500 dark:text-slate-400'
                              )}
                            >
                              {option.description}
                            </span>
                          )}
                        </div>

                        {isSelected && (
                          <Check
                            className={cn(
                              'shrink-0 ml-2 text-primary dark:text-primary',
                              level >= 3 ? 'h-3.5 w-3.5' : 'h-4 w-4'
                            )}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
