import React from 'react';
import CreateBannerDialog from './create-banner-dialog';
import BannerFilter from '@/components/dropdown-menu/banner-filter';

export default function BannerFeatures() {
  return (
    <div className='grid grid-flow-col gap-2'>
      <CreateBannerDialog />
      <BannerFilter />
    </div>
  );
}
