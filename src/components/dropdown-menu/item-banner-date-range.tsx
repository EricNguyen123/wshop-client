import React, { useState } from 'react';
import DateRangePicker from '../date-picker/date-range-picker';
import { DateRange } from 'react-day-picker';
import { useAppDispatch } from '@/lib/store/hooks';
import { getListBannersAsync } from '@/lib/store/features/banner/thunk';
import { query } from '@/constant/common';

export default function ItemBannerDateRange() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const dispatch = useAppDispatch();

  const handleDateSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    dispatch(
      getListBannersAsync({
        data: {
          value: {
            page: query.page,
            limit: query.limit,
            startDate: range?.from ? range.from.toISOString() : undefined,
            endDate: range?.to ? range.to.toISOString() : undefined,
          },
          setToastSuccess: () => {},
          setToastError: () => {},
        },
      })
    );
  };

  return <DateRangePicker from={dateRange?.from} to={dateRange?.to} onChange={handleDateSelect} />;
}
