'use client';

import BasePage from '@/components/base-page';
import { CarouselSlide, CustomCarousel } from '@/components/carousel/custom-carousel';
import { selectBanners } from '@/lib/store/features/banner/slice';
import { useAppSelector } from '@/lib/store/hooks';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const getBanners = useAppSelector(selectBanners);
  const [slides, setSlides] = useState<CarouselSlide[]>([]);

  useEffect(() => {
    if (getBanners && getBanners.data) {
      setSlides(
        getBanners.data.map((item) => ({
          id: item.id as string | number,
          image: item.url as string,
        }))
      );
    }
  }, [getBanners]);
  return (
    <BasePage>
      <CustomCarousel
        slides={slides}
        size='full'
        variant='banner'
        showDots={true}
        showArrows={true}
        autoPlay={true}
        arrowStyle={{
          variant: 'minimal',
          size: 'lg',
          icon: 'chevron',
          position: 'inside',
        }}
        dotStyle={{
          variant: 'pill',
          size: 'sm',
          position: 'overlap',
          activeColor: 'bg-primary',
          inactiveColor: 'bg-muted-foreground/20',
        }}
        contentStyle={{
          position: 'bottom',
          alignment: 'center',
          background: 'gradient',
          padding: 'md',
          textColor: 'text-white',
        }}
        aspectRatio='custom'
      />

      <div className='h-[1000px]'>a</div>
    </BasePage>
  );
}
