/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, ArrowLeft, ArrowRight } from 'lucide-react';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import images from '@/assets/images';

export interface ArrowStyle {
  variant: 'default' | 'circle' | 'square' | 'minimal' | 'custom';
  size?: 'sm' | 'md' | 'lg';
  icon?: 'chevron' | 'arrow';
  position?: 'inside' | 'outside' | 'overlap';
}

export interface DotStyle {
  variant: 'default' | 'line' | 'square' | 'pill' | 'custom';
  size?: 'sm' | 'md' | 'lg';
  position?: 'inside' | 'outside' | 'overlap';
  activeColor?: string;
  inactiveColor?: string;
}

export interface ContentStyle {
  position: 'bottom' | 'top' | 'center' | 'overlay' | 'side' | 'none';
  alignment?: 'left' | 'center' | 'right';
  background?: 'gradient' | 'solid' | 'transparent' | 'blur';
  padding?: 'sm' | 'md' | 'lg';
  textColor?: string;
}

export interface CarouselSlide {
  id: string | number;
  image: string;
  title?: string;
  description?: string;
  alt?: string;
  overlay?: boolean;
  overlayColor?: string;
  overlayOpacity?: number;
  contentPosition?: 'bottom' | 'top' | 'center' | 'overlay' | 'side' | 'none';
  imageEffect?: 'zoom' | 'fade' | 'slide' | 'none';
}

interface CustomCarouselProps {
  slides: CarouselSlide[];
  variant?: 'default' | 'feature' | 'testimonial' | 'product' | 'hero' | 'banner';
  size?: 'sm' | 'md' | 'lg' | 'full';
  showDots?: boolean;
  showArrows?: boolean;
  showContent?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  loop?: boolean;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'wide' | 'portrait' | 'auto' | 'default' | 'custom';
  imageClassName?: string;
  contentClassName?: string;
  orientation?: 'horizontal' | 'vertical';
  arrowStyle?: ArrowStyle;
  dotStyle?: DotStyle;
  contentStyle?: ContentStyle;
  gap?: 'none' | 'sm' | 'md' | 'lg';
  slideClassName?: string;
  customAspectRatio?: string;
}

export function CustomCarousel({
  slides,
  variant = 'default',
  size = 'md',
  showDots = true,
  showArrows = true,
  showContent = true,
  autoPlay = false,
  autoPlayInterval = 5000,
  loop = true,
  className,
  aspectRatio = 'wide',
  imageClassName,
  contentClassName,
  orientation = 'horizontal',
  arrowStyle = { variant: 'default', size: 'md', icon: 'chevron', position: 'inside' },
  dotStyle = { variant: 'default', size: 'md', position: 'outside' },
  contentStyle = { position: 'bottom', alignment: 'left', background: 'gradient', padding: 'md' },
  gap = 'md',
  slideClassName,
  customAspectRatio,
}: CustomCarouselProps) {
  const [api, setApi] = React.useState<any>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api || !autoPlay) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [api, autoPlay, autoPlayInterval]);

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'max-w-md';
      case 'md':
        return 'max-w-2xl';
      case 'lg':
        return 'max-w-4xl';
      case 'full':
        return 'w-full';
      default:
        return 'max-w-2xl';
    }
  };

  const getAspectRatioClasses = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square';
      case 'video':
        return 'aspect-video';
      case 'wide':
        return 'aspect-[16/9]';
      case 'portrait':
        return 'aspect-[3/4]';
      case 'auto':
        return '';
      case 'custom':
        return customAspectRatio ? `aspect-[${customAspectRatio}]` : 'aspect-[16/5]';
      default:
        return 'aspect-square';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'feature':
        return 'bg-muted rounded-md overflow-hidden shadow-lg';
      case 'testimonial':
        return 'bg-card rounded-md overflow-hidden shadow-md';
      case 'product':
        return 'bg-background rounded-md overflow-hidden border';
      case 'hero':
        return 'overflow-hidden rounded-none';
      case 'banner':
        return 'overflow-hidden rounded-md bg-primary/5';
      default:
        return 'overflow-hidden rounded-md';
    }
  };

  const getGapClasses = () => {
    switch (gap) {
      case 'none':
        return '-ml-0 md:-ml-0';
      case 'sm':
        return '-ml-1 md:-ml-2';
      case 'lg':
        return '-ml-3 md:-ml-6';
      default:
        return '-ml-2 md:-ml-4';
    }
  };

  const getArrowClasses = () => {
    const baseClasses = 'z-10 flex items-center justify-center';
    const sizeClasses = {
      sm: 'h-7 w-7 md:h-8 md:w-8',
      md: 'h-9 w-9 md:h-10 md:w-10',
      lg: 'h-11 w-11 md:h-12 md:w-12',
    }[arrowStyle.size || 'md'];

    const variantClasses = {
      default: 'bg-background/80 hover:bg-background border shadow-sm',
      circle: 'rounded-full bg-background/80 hover:bg-background border shadow-sm',
      square: 'rounded-md bg-background/80 hover:bg-background border shadow-sm',
      minimal: 'bg-background/20 text-foreground hover:bg-background/80 border-none',
      custom: 'bg-primary text-primary-foreground hover:bg-primary/90 rounded-full',
    }[arrowStyle.variant];

    const positionClasses = {
      inside: '',
      outside: arrowStyle.icon === 'chevron' ? '-mx-12 md:-mx-14' : '-mx-14 md:-mx-16',
      overlap: arrowStyle.icon === 'chevron' ? '-mx-5 md:-mx-6' : '-mx-6 md:-mx-8',
    }[arrowStyle.position || 'inside'];

    return cn(baseClasses, sizeClasses, variantClasses, positionClasses);
  };

  const getDotContainerClasses = () => {
    const positionClasses = {
      inside: '-mt-8 relative z-10 pb-4',
      outside: 'mt-4',
      overlap: '-mt-4 relative z-10 pb-2',
    }[dotStyle.position || 'outside'];

    return cn('flex justify-center gap-1', positionClasses);
  };

  const getDotClasses = (isActive: boolean) => {
    const baseClasses = 'transition-all cursor-pointer';

    const sizeClasses = {
      sm: isActive ? 'h-1.5 w-1.5' : 'h-1.5 w-1.5',
      md: isActive ? 'h-2 w-2' : 'h-2 w-2',
      lg: isActive ? 'h-3 w-3' : 'h-3 w-3',
    }[dotStyle.size || 'md'];

    const variantClasses = {
      default: isActive
        ? `${dotStyle.activeColor || 'bg-primary'} w-4`
        : `${dotStyle.inactiveColor || 'bg-muted-foreground/30'} hover:bg-muted-foreground/50`,
      line: isActive
        ? `${dotStyle.activeColor || 'bg-primary'} w-6 h-1`
        : `${
            dotStyle.inactiveColor || 'bg-muted-foreground/30'
          } w-3 h-1 hover:bg-muted-foreground/50`,
      square: isActive
        ? `${dotStyle.activeColor || 'bg-primary'} rounded-sm`
        : `${
            dotStyle.inactiveColor || 'bg-muted-foreground/30'
          } rounded-sm hover:bg-muted-foreground/50`,
      pill: isActive
        ? `${dotStyle.activeColor || 'bg-primary'} rounded-full w-6`
        : `${
            dotStyle.inactiveColor || 'bg-muted-foreground/30'
          } rounded-full hover:bg-muted-foreground/50`,
      custom: isActive
        ? `${
            dotStyle.activeColor || 'bg-primary'
          } rounded-full ring-2 ring-background ring-offset-1`
        : `${
            dotStyle.inactiveColor || 'bg-muted-foreground/30'
          } rounded-full hover:bg-muted-foreground/50`,
    }[dotStyle.variant];

    return cn(baseClasses, sizeClasses, variantClasses);
  };

  const getContentClasses = () => {
    const positionClasses = {
      bottom: 'absolute bottom-0 left-0 right-0',
      top: 'absolute top-0 left-0 right-0',
      center: 'absolute inset-0 flex items-center justify-center',
      overlay: 'absolute inset-0 flex items-center justify-center',
      side: 'absolute inset-y-0 right-0 w-1/3 flex items-center',
      none: 'hidden',
    }[contentStyle.position];

    const alignmentClasses = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    }[contentStyle.alignment || 'left'];

    const backgroundClasses = {
      gradient: 'bg-gradient-to-t from-black/70 to-transparent',
      solid: 'bg-background/90',
      transparent: 'bg-transparent',
      blur: 'backdrop-blur-md bg-background/30',
    }[contentStyle.background || 'gradient'];

    const paddingClasses = {
      sm: 'p-2',
      md: 'p-4',
      lg: 'p-6',
    }[contentStyle.padding || 'md'];

    const textColorClass = contentStyle.textColor || 'text-white';

    return cn(positionClasses, alignmentClasses, backgroundClasses, paddingClasses, textColorClass);
  };

  const PreviousIcon = arrowStyle.icon === 'arrow' ? ArrowLeft : ChevronLeft;
  const NextIcon = arrowStyle.icon === 'arrow' ? ArrowRight : ChevronRight;

  const CustomPrevious = React.forwardRef<
    HTMLButtonElement,
    React.ComponentPropsWithoutRef<typeof CarouselPrevious>
  >(({ className, ...props }, ref) => {
    return (
      <CarouselPrevious ref={ref} className={cn(getArrowClasses(), className)} {...props}>
        <PreviousIcon
          size={arrowStyle.size === 'sm' ? 16 : arrowStyle.size === 'lg' ? 24 : 20}
          strokeWidth={2}
        />
      </CarouselPrevious>
    );
  });
  CustomPrevious.displayName = 'CustomPrevious';

  const CustomNext = React.forwardRef<
    HTMLButtonElement,
    React.ComponentPropsWithoutRef<typeof CarouselNext>
  >(({ className, ...props }, ref) => {
    return (
      <CarouselNext ref={ref} className={cn(getArrowClasses(), className)} {...props}>
        <NextIcon
          size={arrowStyle.size === 'sm' ? 16 : arrowStyle.size === 'lg' ? 24 : 20}
          strokeWidth={2}
        />
      </CarouselNext>
    );
  });
  CustomNext.displayName = 'CustomNext';

  return (
    <div className={cn('w-full', getSizeClasses(), className)}>
      <Carousel
        setApi={setApi}
        className={cn('w-full', getVariantClasses())}
        opts={{
          align: 'start',
          loop,
        }}
        orientation={orientation}
      >
        <CarouselContent className={getGapClasses()}>
          {slides.map((slide, index) => (
            <CarouselItem key={slide.id} className={cn('pl-2 md:pl-4', slideClassName)}>
              <div className='relative overflow-hidden rounded-md'>
                <div className={cn('overflow-hidden', getAspectRatioClasses())}>
                  <Image
                    src={slide.image || images.noImage}
                    alt={slide.alt || `Slide ${index + 1}`}
                    fill
                    className={cn(
                      'object-cover transition-all duration-300',
                      slide.imageEffect === 'zoom' && 'hover:scale-105',
                      imageClassName
                    )}
                  />

                  {slide.overlay && (
                    <div
                      className='absolute inset-0'
                      style={{
                        backgroundColor: slide.overlayColor || 'rgba(0,0,0,0.3)',
                        opacity: slide.overlayOpacity || 0.3,
                      }}
                    />
                  )}
                </div>

                {showContent && slide.title && (
                  <div className={cn(getContentClasses(), contentClassName)}>
                    <div
                      className={
                        slide.contentPosition === 'center' || slide.contentPosition === 'overlay'
                          ? 'text-center w-full'
                          : ''
                      }
                    >
                      <h3 className='text-lg font-semibold md:text-xl'>{slide.title}</h3>
                      {slide.description && (
                        <p className='mt-1 text-sm md:text-base opacity-90'>{slide.description}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {showArrows && (
          <>
            <CustomPrevious className='absolute left-4' />
            <CustomNext className='absolute right-4' />
          </>
        )}
      </Carousel>

      {showDots && (
        <div className={getDotContainerClasses()}>
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              className={getDotClasses(current === index)}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
