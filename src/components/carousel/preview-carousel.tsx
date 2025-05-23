/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ZoomIn, ZoomOut, X, Maximize2, Play, Pause, Volume2, VolumeX } from 'lucide-react';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';

export type MediaType = 'image' | 'video';

export interface MediaItem {
  id: string | number;
  type: MediaType;
  src: string;
  alt?: string;
  title?: string;
  description?: string;
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
}

interface MediaPreviewCarouselProps {
  items: MediaItem[];
  variant?: 'default' | 'product' | 'gallery' | 'feature';
  showThumbnails?: boolean;
  thumbnailPosition?: 'bottom' | 'left' | 'right';
  aspectRatio?: 'square' | 'video' | 'wide' | 'portrait' | 'auto' | 'custom';
  customAspectRatio?: string;
  enableZoom?: boolean;
  enableFullscreen?: boolean;
  className?: string;
  mediaClassName?: string;
  thumbnailClassName?: string;
  showArrows?: boolean;
  showDots?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  loop?: boolean;
}

export function PreviewCarousel({
  items,
  variant = 'default',
  showThumbnails = true,
  thumbnailPosition = 'bottom',
  aspectRatio = 'square',
  customAspectRatio,
  enableZoom = true,
  enableFullscreen = true,
  className,
  mediaClassName,
  thumbnailClassName,
  showArrows = true,
  showDots = false,
  autoPlay = false,
  autoPlayInterval = 5000,
  loop = true,
}: MediaPreviewCarouselProps) {
  const [mainApi, setMainApi] = React.useState<any>();
  const [thumbnailApi, setThumbnailApi] = React.useState<any>();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isZoomed, setIsZoomed] = React.useState(false);
  const [zoomLevel, setZoomLevel] = React.useState(1);
  const [dragPosition, setDragPosition] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const [prevTouchPos, setPrevTouchPos] = React.useState({ x: 0, y: 0 });
  const [isPlaying, setIsPlaying] = React.useState<Record<string | number, boolean>>({});
  const [isMuted, setIsMuted] = React.useState<Record<string | number, boolean>>({});
  const [videoProgress, setVideoProgress] = React.useState<Record<string | number, number>>({});

  const imageRef = React.useRef<HTMLDivElement>(null);
  const videoRefs = React.useRef<Record<string | number, HTMLVideoElement | null>>({});

  React.useEffect(() => {
    const initialPlayingState: Record<string | number, boolean> = {};
    const initialMutedState: Record<string | number, boolean> = {};
    const initialProgressState: Record<string | number, number> = {};

    items.forEach((item) => {
      if (item.type === 'video') {
        initialPlayingState[item.id] = item.autoPlay || false;
        initialMutedState[item.id] = item.muted !== false;
        initialProgressState[item.id] = 0;
      }
    });

    setIsPlaying(initialPlayingState);
    setIsMuted(initialMutedState);
    setVideoProgress(initialProgressState);
  }, [items]);

  React.useEffect(() => {
    if (!mainApi || !thumbnailApi) return;

    mainApi.on('select', () => {
      const currentSlide = mainApi.selectedScrollSnap();
      setCurrentIndex(currentSlide);
      thumbnailApi.scrollTo(currentSlide);

      items.forEach((item) => {
        if (item.type === 'video' && videoRefs.current[item.id]) {
          const videoRef = videoRefs.current[item.id];
          if (videoRef) {
            videoRef.pause();
            setIsPlaying((prev) => ({ ...prev, [item.id]: false }));
          }
        }
      });

      const currentItem = items[currentSlide];
      if (
        currentItem?.type === 'video' &&
        currentItem.autoPlay &&
        videoRefs.current[currentItem.id]
      ) {
        const videoRef = videoRefs.current[currentItem.id];
        if (videoRef) {
          videoRef.play().catch(() => {
            setIsPlaying((prev) => ({ ...prev, [currentItem.id]: false }));
          });
        }
      }
    });

    thumbnailApi.on('select', () => {
      const currentSlide = thumbnailApi.selectedScrollSnap();
      setCurrentIndex(currentSlide);
      mainApi.scrollTo(currentSlide);
    });
  }, [mainApi, thumbnailApi, items]);

  React.useEffect(() => {
    if (!mainApi || !autoPlay) return;

    const interval = setInterval(() => {
      mainApi.scrollNext();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [mainApi, autoPlay, autoPlayInterval]);

  const handleTimeUpdate = (id: string | number) => {
    const videoRef = videoRefs.current[id];
    if (videoRef) {
      const progress = (videoRef.currentTime / videoRef.duration) * 100;
      setVideoProgress((prev) => ({ ...prev, [id]: progress }));
    }
  };

  const togglePlay = (id: string | number) => {
    const videoRef = videoRefs.current[id];
    if (!videoRef) return;

    if (videoRef.paused) {
      videoRef
        .play()
        .then(() => {
          setIsPlaying((prev) => ({ ...prev, [id]: true }));
        })
        .catch(() => {
          setIsPlaying((prev) => ({ ...prev, [id]: false }));
        });
    } else {
      videoRef.pause();
      setIsPlaying((prev) => ({ ...prev, [id]: false }));
    }
  };

  const toggleMute = (id: string | number) => {
    const videoRef = videoRefs.current[id];
    if (!videoRef) return;

    videoRef.muted = !videoRef.muted;
    setIsMuted((prev) => ({ ...prev, [id]: videoRef.muted }));
  };

  const handleSeek = (id: string | number, value: number[]) => {
    const videoRef = videoRefs.current[id];
    if (!videoRef) return;

    const seekTime = (value[0] / 100) * videoRef.duration;
    videoRef.currentTime = seekTime;
    setVideoProgress((prev) => ({ ...prev, [id]: value[0] }));
  };

  const handleZoomIn = () => {
    if (zoomLevel < 3) {
      setZoomLevel((prev) => prev + 0.5);
      setIsZoomed(true);
    }
  };

  const handleZoomOut = () => {
    if (zoomLevel > 1) {
      setZoomLevel((prev) => prev - 0.5);
      if (zoomLevel <= 1.5) {
        setIsZoomed(false);
        setDragPosition({ x: 0, y: 0 });
      }
    }
  };

  const resetZoom = () => {
    setZoomLevel(1);
    setIsZoomed(false);
    setDragPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isZoomed) return;
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !isZoomed || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const containerWidth = rect.width;
    const containerHeight = rect.height;

    const maxDragX = (containerWidth * zoomLevel - containerWidth) / 2;
    const maxDragY = (containerHeight * zoomLevel - containerHeight) / 2;

    const newX = Math.max(-maxDragX, Math.min(maxDragX, dragPosition.x + e.movementX));
    const newY = Math.max(-maxDragY, Math.min(maxDragY, dragPosition.y + e.movementY));

    setDragPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isZoomed) return;
    setIsDragging(true);
    const touch = e.touches[0];
    setPrevTouchPos({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !isZoomed || !imageRef.current) return;
    e.preventDefault();

    const touch = e.touches[0];
    const movementX = touch.clientX - prevTouchPos.x;
    const movementY = touch.clientY - prevTouchPos.y;

    setPrevTouchPos({ x: touch.clientX, y: touch.clientY });

    const rect = imageRef.current.getBoundingClientRect();
    const containerWidth = rect.width;
    const containerHeight = rect.height;

    const maxDragX = (containerWidth * zoomLevel - containerWidth) / 2;
    const maxDragY = (containerHeight * zoomLevel - containerHeight) / 2;

    const newX = Math.max(-maxDragX, Math.min(maxDragX, dragPosition.x + movementX));
    const newY = Math.max(-maxDragY, Math.min(maxDragY, dragPosition.y + movementY));

    setDragPosition({ x: newX, y: newY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
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
      case 'product':
        return 'bg-background rounded-md overflow-hidden border';
      case 'gallery':
        return 'bg-muted rounded-md overflow-hidden shadow-sm';
      case 'feature':
        return 'bg-muted rounded-md overflow-hidden shadow-lg';
      default:
        return 'overflow-hidden rounded-md';
    }
  };

  const getThumbnailLayoutClasses = () => {
    switch (thumbnailPosition) {
      case 'left':
        return 'flex-row';
      case 'right':
        return 'flex-row-reverse';
      default:
        return 'flex-col';
    }
  };

  const renderMediaItem = (item: MediaItem, index: number) => {
    if (item.type === 'image') {
      return (
        <div
          ref={imageRef}
          className={cn(
            'overflow-hidden relative',
            getAspectRatioClasses(),
            isZoomed && isDragging ? 'cursor-grabbing' : isZoomed ? 'cursor-grab' : 'cursor-zoom-in'
          )}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={() => enableZoom && !isZoomed && handleZoomIn()}
        >
          <div
            className='w-full h-full transition-transform duration-200'
            style={{
              transform: isZoomed
                ? `scale(${zoomLevel}) translate(${dragPosition.x / zoomLevel}px, ${
                    dragPosition.y / zoomLevel
                  }px)`
                : 'none',
            }}
          >
            <Image
              src={item.src || '/placeholder.svg'}
              alt={item.alt || `Image ${index + 1}`}
              fill
              className={cn('object-cover transition-all duration-300', mediaClassName)}
            />
          </div>
        </div>
      );
    } else if (item.type === 'video') {
      return (
        <div className={cn('relative overflow-hidden', getAspectRatioClasses())}>
          <video
            ref={(el) => {
              videoRefs.current[item.id] = el;
            }}
            src={item.src}
            poster={item.poster}
            muted={isMuted[item.id]}
            loop={item.loop}
            playsInline
            className={cn('w-full h-full object-cover', mediaClassName)}
            onTimeUpdate={() => handleTimeUpdate(item.id)}
            onPlay={() => setIsPlaying((prev) => ({ ...prev, [item.id]: true }))}
            onPause={() => setIsPlaying((prev) => ({ ...prev, [item.id]: false }))}
            onEnded={() => {
              if (!item.loop) {
                setIsPlaying((prev) => ({ ...prev, [item.id]: false }));
              }
            }}
          />

          <div className='absolute inset-0 flex flex-col justify-between p-4 bg-black/0 hover:bg-black/30 transition-colors duration-300'>
            <div className='flex justify-end'>
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8 text-white bg-black/40 hover:bg-black/60'
                onClick={() => toggleMute(item.id)}
              >
                {isMuted[item.id] ? (
                  <VolumeX className='h-4 w-4' />
                ) : (
                  <Volume2 className='h-4 w-4' />
                )}
              </Button>
            </div>

            <div className='flex-1 flex items-center justify-center'>
              <Button
                variant='ghost'
                size='icon'
                className='h-16 w-16 text-white bg-black/40 hover:bg-black/60 rounded-full'
                onClick={() => togglePlay(item.id)}
              >
                {isPlaying[item.id] ? (
                  <Pause className='h-8 w-8' />
                ) : (
                  <Play className='h-8 w-8 ml-1' />
                )}
              </Button>
            </div>

            <div className='w-full'>
              <Slider
                value={[videoProgress[item.id] || 0]}
                min={0}
                max={100}
                step={0.1}
                onValueChange={(value) => handleSeek(item.id, value)}
                className='w-full'
              />
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={cn('w-full', className)}>
      <div className={cn('flex gap-4', getThumbnailLayoutClasses())}>
        <div className={cn('flex-1 relative', getVariantClasses())}>
          <Carousel
            setApi={setMainApi}
            className='w-full'
            opts={{
              align: 'start',
              loop,
            }}
          >
            <CarouselContent>
              {items.map((item, index) => (
                <CarouselItem key={item.id}>
                  <div className='relative overflow-hidden rounded-md'>
                    {renderMediaItem(item, index)}

                    {(item.title || item.description) && (
                      <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white'>
                        {item.title && <h3 className='text-lg font-semibold'>{item.title}</h3>}
                        {item.description && (
                          <p className='text-sm opacity-90'>{item.description}</p>
                        )}
                      </div>
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {showArrows && (
              <>
                <CarouselPrevious className='left-2 h-8 w-8 bg-background/80 hover:bg-background border shadow-sm' />
                <CarouselNext className='right-2 h-8 w-8 bg-background/80 hover:bg-background border shadow-sm' />
              </>
            )}
          </Carousel>

          {(enableZoom || enableFullscreen) && items[currentIndex]?.type === 'image' && (
            <div className='absolute top-2 right-2 flex gap-2 z-10'>
              {enableZoom && (
                <>
                  <Button
                    variant='secondary'
                    size='icon'
                    className='h-8 w-8 bg-background/80 hover:bg-background border shadow-sm'
                    onClick={handleZoomIn}
                    disabled={zoomLevel >= 3}
                  >
                    <ZoomIn className='h-4 w-4' />
                  </Button>
                  <Button
                    variant='secondary'
                    size='icon'
                    className='h-8 w-8 bg-background/80 hover:bg-background border shadow-sm'
                    onClick={handleZoomOut}
                    disabled={zoomLevel <= 1}
                  >
                    <ZoomOut className='h-4 w-4' />
                  </Button>
                </>
              )}

              {enableFullscreen && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant='secondary'
                      size='icon'
                      className='h-8 w-8 bg-background/80 hover:bg-background border shadow-sm'
                      onClick={resetZoom}
                    >
                      <Maximize2 className='h-4 w-4' />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className='max-w-screen-lg w-[90vw] p-0'>
                    <DialogHeader>
                      <DialogTitle></DialogTitle>
                    </DialogHeader>

                    <div className='relative'>
                      {items[currentIndex]?.type === 'image' ? (
                        <Image
                          src={items[currentIndex]?.src || ''}
                          alt={items[currentIndex]?.alt || 'Fullscreen image'}
                          width={1200}
                          height={800}
                          className='w-full h-auto object-contain'
                        />
                      ) : (
                        <video
                          src={items[currentIndex]?.src || ''}
                          poster={items[currentIndex]?.poster}
                          controls
                          className='w-full h-auto'
                        />
                      )}
                    </div>
                    <DialogFooter></DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          )}

          {showDots && (
            <div className='flex justify-center gap-1 mt-2'>
              {items.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    'h-2 rounded-full transition-all',
                    currentIndex === index
                      ? 'w-4 bg-primary'
                      : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  )}
                  onClick={() => mainApi?.scrollTo(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {showThumbnails && (
          <div className={cn(thumbnailPosition === 'bottom' ? 'w-full mt-2' : 'w-24', 'relative')}>
            <Carousel
              setApi={setThumbnailApi}
              className='w-full'
              opts={{
                align: 'start',
                loop,
                dragFree: true,
              }}
              orientation={thumbnailPosition === 'bottom' ? 'horizontal' : 'vertical'}
            >
              <CarouselContent
                className={cn(
                  thumbnailPosition === 'bottom' ? '-ml-2' : '-mt-2',
                  thumbnailPosition === 'bottom' ? 'flex-row' : 'flex-col'
                )}
              >
                {items.map((item, index) => (
                  <CarouselItem
                    key={item.id}
                    className={cn(
                      thumbnailPosition === 'bottom' ? 'basis-1/5 pl-2' : 'pt-2',
                      'min-w-0'
                    )}
                  >
                    <div
                      className={cn(
                        'relative aspect-square overflow-hidden rounded border cursor-pointer transition-all',
                        currentIndex === index ? '' : 'opacity-70 hover:opacity-100'
                      )}
                      onClick={() => {
                        mainApi?.scrollTo(index);
                        resetZoom();
                      }}
                    >
                      {item.type === 'image' ? (
                        <Image
                          src={item.src || '/placeholder.svg'}
                          alt={item.alt || `Thumbnail ${index + 1}`}
                          fill
                          className={cn('object-cover', thumbnailClassName)}
                        />
                      ) : (
                        <>
                          <Image
                            src={item.poster || '/placeholder.svg?height=100&width=100'}
                            alt={item.alt || `Video thumbnail ${index + 1}`}
                            fill
                            className={cn('object-cover', thumbnailClassName)}
                          />
                          <div className='absolute inset-0 flex items-center justify-center bg-black/30'>
                            <Play className='h-6 w-6 text-white' />
                          </div>
                        </>
                      )}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {thumbnailPosition !== 'bottom' && items.length > 5 && (
                <>
                  <CarouselPrevious className='left-1/2 -translate-x-1/2 top-0 h-6 w-6' />
                  <CarouselNext className='left-1/2 -translate-x-1/2 bottom-0 h-6 w-6' />
                </>
              )}

              {thumbnailPosition === 'bottom' && items.length > 5 && (
                <>
                  <CarouselPrevious className='left-0 h-6 w-6' />
                  <CarouselNext className='right-0 h-6 w-6' />
                </>
              )}
            </Carousel>
          </div>
        )}
      </div>
    </div>
  );
}
