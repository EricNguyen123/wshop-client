import React from 'react';
import CreateProductDialog from './create-product-dialog';
import ProductFilter from '@/components/dropdown-menu/product-filter';

export default function ProductFeatures({
  handleStatusChange,
  currentStatus,
  handleAll,
}: {
  handleStatusChange: (value?: string) => void;
  currentStatus?: string;
  handleAll: () => void;
}) {
  return (
    <div className='grid grid-flow-col gap-2'>
      <CreateProductDialog />
      <ProductFilter
        handleStatusChange={handleStatusChange}
        currentStatus={currentStatus}
        handleAll={handleAll}
      />
    </div>
  );
}
