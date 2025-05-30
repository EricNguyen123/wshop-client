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

export interface MultiCommandSelectorProps {
  options: Option[];
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  searchable?: boolean;
  emptyMessage?: string;
  placeholderSearch?: string;
  maxSelected?: number;
  showCount?: boolean;
}

export function MultiCommandSelector({
  options,
  value = [],
  onChange,
  placeholder = 'Select options',
  placeholderSearch = 'Search...',
  disabled = false,
  className,
  searchable = true,
  emptyMessage = 'No options found.',
  maxSelected,
  showCount = true,
}: MultiCommandSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const containerRef = React.useRef<HTMLDivElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const selectedOptions = React.useMemo(
    () => options.filter((option) => value.includes(option.value)),
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
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : maxSelected && value.length >= maxSelected
      ? value
      : [...value, optionValue];

    onChange?.(newValue);
  };

  const handleRemove = (optionValue: string, e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    const newValue = value.filter((v) => v !== optionValue);
    onChange?.(newValue);
  };

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm('');
    }
  };

  const handleClearAll = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    onChange?.([]);
  };

  const getLevelIndentation = (level = 0) => {
    if (level === 0) return '';
    if (level === 1) return 'pl-6';
    if (level === 2) return 'pl-10';
    if (level >= 3) return `pl-${Math.min(14 + (level - 3) * 2, 20)}`;
    return '';
  };

  const renderSelectedContent = () => {
    if (selectedOptions.length === 0) {
      return <span className='text-muted-foreground'>{placeholder}</span>;
    }

    if (selectedOptions.length === 1) {
      const option = selectedOptions[0];
      const Icon = option.icon;
      return (
        <div className='flex items-center gap-2'>
          {Icon && <Icon className='h-4 w-4' />}
          <span className='truncate'>{option.label}</span>
        </div>
      );
    }

    return (
      <div className='flex items-center gap-1 flex-wrap'>
        <Badge variant='secondary' className='text-xs'>
          {selectedOptions.length} selected
        </Badge>
        {selectedOptions.slice(0, 2).map((option) => {
          const Icon = option.icon;
          return (
            <Badge key={option.value} variant='outline' className='text-xs gap-1 max-w-[120px]'>
              {Icon && <Icon className='h-3 w-3' />}
              <span className='truncate'>{option.label}</span>
              <div
                onClick={(e) => handleRemove(option.value, e)}
                className='ml-1 hover:bg-destructive/20 rounded-full p-0.5 cursor-pointer'
                role='button'
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleRemove(option.value, e);
                  }
                }}
                aria-label={`Remove ${option.label}`}
              >
                <X className='h-2.5 w-2.5' />
              </div>
            </Badge>
          );
        })}
        {selectedOptions.length > 2 && (
          <Badge variant='secondary' className='text-xs'>
            +{selectedOptions.length - 2} more
          </Badge>
        )}
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
          'w-full justify-between border-input dark:border-input text-left text-accent-foreground hover:text-accent-foreground font-normal transition-all duration-200 min-h-[40px] h-auto !px-3 !py-1',
          !selectedOptions.length && 'text-muted-foreground',
          isOpen && 'ring-2 ring-ring ring-offset-2',
          className
        )}
      >
        <div className='flex-1 py-1'>{renderSelectedContent()}</div>
        <div className='flex items-center gap-1 ml-2'>
          {selectedOptions.length > 0 && (
            <div
              onClick={handleClearAll}
              className='hover:bg-destructive/20 rounded-full p-1 cursor-pointer'
              role='button'
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleClearAll(e);
                }
              }}
              aria-label='Clear all selections'
            >
              <X className='h-3 w-3' />
            </div>
          )}
          <ChevronDown
            className={cn(
              'h-4 w-4 shrink-0 opacity-50 transition-transform duration-200',
              isOpen && 'rotate-180'
            )}
          />
        </div>
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
                }}
                onClick={(e) => e.stopPropagation()}
                onFocus={(e) => e.stopPropagation()}
              />
              {searchTerm && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchTerm('');
                    searchInputRef.current?.focus();
                  }}
                  className='ml-2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors cursor-pointer'
                  role='button'
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      setSearchTerm('');
                      searchInputRef.current?.focus();
                    }
                  }}
                  aria-label='Clear search'
                >
                  <X className='h-3 w-3' />
                </div>
              )}
            </div>
          )}

          <div className='h-max p-2 overflow-hidden rounded-b-lg'>
            {showCount && selectedOptions.length > 0 && (
              <div className='px-3 py-2 text-xs text-muted-foreground dark:text-gray-400 border-b border-border/30 dark:border-gray-800/30 mb-2'>
                {selectedOptions.length} of {options.length} selected
                {maxSelected && ` (max: ${maxSelected})`}
              </div>
            )}

            <div className='max-h-[220px] overflow-y-auto'>
              {filteredOptions.length === 0 ? (
                <div className='py-8 text-center text-sm text-muted-foreground dark:text-gray-400 font-medium'>
                  {emptyMessage}
                </div>
              ) : (
                <div className='p-1 space-y-0.5'>
                  {filteredOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = value.includes(option.value);
                    const level = option.level || 0;
                    const isDisabled = maxSelected && !isSelected && value.length >= maxSelected;

                    return (
                      <div
                        key={option.value}
                        className={cn(
                          'relative flex cursor-pointer select-none items-center rounded-md px-3 py-2.5 text-sm outline-none transition-all duration-150',
                          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-gray-800 dark:hover:text-gray-100',
                          isSelected &&
                            'bg-accent text-accent-foreground dark:bg-gray-800 dark:text-gray-100 font-medium',
                          isDisabled && 'opacity-50 cursor-not-allowed',
                          getLevelIndentation(level)
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isDisabled) {
                            handleSelect(option.value);
                          }
                        }}
                        role='option'
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            e.stopPropagation();
                            if (!isDisabled) {
                              handleSelect(option.value);
                            }
                          }
                        }}
                        aria-selected={isSelected}
                        aria-disabled={isDisabled ? 'true' : 'false'}
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
