import React from 'react';
import ProductFilter from '@/components/dropdown-menu/product-filter';

export default function ProductFeatures({
  handleStatusChange,
  currentStatus,
  handleAll,
  moreComponent,
}: {
  handleStatusChange: (value?: string) => void;
  currentStatus?: string;
  handleAll: () => void;
  moreComponent?: React.ReactNode;
}) {
  return (
    <div className='grid grid-flow-col gap-2'>
      {moreComponent}
      <ProductFilter
        handleStatusChange={handleStatusChange}
        currentStatus={currentStatus}
        handleAll={handleAll}
      />
    </div>
  );
}
