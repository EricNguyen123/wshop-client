import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '../ui/button';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import type { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface DateRangeProps {
  from: Date | undefined;
  to?: Date | undefined;
  onChange?: (range: DateRange | undefined) => void;
}

export default function DateRangePicker({ from, to, onChange }: DateRangeProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from,
    to,
  });
  const [calendarOpen, setCalendarOpen] = useState(false);
  const t = useTranslations('Component.DatePicker.DateRangePicker');

  const handleDateSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    onChange?.(range);
    if (range?.from && range?.to) {
      setTimeout(() => setCalendarOpen(false), 1000);
    }
  };

  return (
    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
      <PopoverTrigger asChild>
        <Button
          id='date'
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal border-input dark:border-input text-accent-foreground hover:text-accent-foreground',
            !dateRange && 'text-muted-foreground'
          )}
        >
          <Calendar className='h-4 w-4' />
          {dateRange?.from ? (
            dateRange.to ? (
              <>
                {format(dateRange.from, 'LLL dd, y')} - {format(dateRange.to, 'LLL dd, y')}
              </>
            ) : (
              format(dateRange.from, 'LLL dd, y')
            )
          ) : (
            <span>{t('placeholder')}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0 pointer-events-auto' align='start'>
        <CalendarComponent
          initialFocus
          mode='range'
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={handleDateSelect}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}
