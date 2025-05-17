/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import type React from 'react';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ZoomIn, ZoomOut, RotateCw, Maximize, Minimize, RefreshCw, X, Grid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import BaseTooltip from '@/components/tooltip/base-tooltip';
import LoadingItem from '@/components/skeleton/loading-item';
import { useMobile } from '@/utils/hooks/use-mobile';
import { IconButton } from '@/components/button/button-icon';
import images from '@/assets/images';

interface ImageViewerProps {
  src: string;
  alt: string;
  className?: string;
  fallbackText?: string;
  initialWidth?: number;
  initialHeight?: number;
  maxZoom?: number;
  minZoom?: number;
  onClose?: () => void;
  showControls?: boolean;
  showInfo?: boolean;
  quality?: number;
}

export function ImageViewer({
  src,
  alt,
  className,
  fallbackText = 'No Image',
  initialWidth = 600,
  initialHeight = 400,
  maxZoom = 3,
  minZoom = 0.5,
  onClose,
  showControls = true,
  showInfo = true,
  quality = 90,
}: ImageViewerProps) {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [lastTouchDistance, setLastTouchDistance] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const startPosRef = useRef({ x: 0, y: 0, scrollX: 0, scrollY: 0 });
  const isMobile = useMobile();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-') {
        handleZoomOut();
      } else if (e.key === 'r') {
        handleRotate();
      } else if (e.key === '0') {
        handleReset();
      } else if (e.key === 'f') {
        handleFullscreen();
      } else if (e.key === 'g') {
        setShowGrid((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  const handleError = useCallback(() => {
    setIsError(true);
    setIsLoading(false);
  }, []);

  const handleLoad = useCallback(() => {
    setIsLoading(false);

    if (imageRef.current) {
      const img = imageRef.current;
      const naturalWidth = img.naturalWidth || initialWidth;
      const naturalHeight = img.naturalHeight || initialHeight;
      setImageDimensions({ width: naturalWidth, height: naturalHeight });
    }
  }, [initialWidth, initialHeight]);

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 0.1, maxZoom));
  }, [maxZoom]);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 0.1, minZoom));
  }, [minZoom]);

  const handleRotate = useCallback(() => {
    setRotation((prev) => (prev + 90) % 360);
  }, []);

  const handleReset = useCallback(() => {
    setZoom(1);
    setRotation(0);

    if (containerRef.current) {
      containerRef.current.scrollTo(0, 0);
    }
  }, []);

  const handleFullscreen = useCallback(() => {
    if (containerRef.current) {
      if (!isFullscreen) {
        if (containerRef.current.requestFullscreen) {
          containerRef.current.requestFullscreen().catch(() => {});
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
      }
    }
  }, [isFullscreen]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (containerRef.current && (zoom > 1 || rotation !== 0)) {
        setIsDragging(true);
        startPosRef.current = {
          x: e.clientX,
          y: e.clientY,
          scrollX: containerRef.current.scrollLeft,
          scrollY: containerRef.current.scrollTop,
        };

        e.preventDefault();
      }
    },
    [zoom, rotation]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const dx = e.clientX - startPosRef.current.x;
      const dy = e.clientY - startPosRef.current.y;

      containerRef.current.scrollLeft = startPosRef.current.scrollX - dx;
      containerRef.current.scrollTop = startPosRef.current.scrollY - dy;
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (containerRef.current) {
        if (e.touches.length === 1 && (zoom > 1 || rotation !== 0)) {
          setIsDragging(true);
          startPosRef.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
            scrollX: containerRef.current.scrollLeft,
            scrollY: containerRef.current.scrollTop,
          };
        } else if (e.touches.length === 2) {
          const touch1 = e.touches[0];
          const touch2 = e.touches[1];
          const distance = Math.hypot(
            touch2.clientX - touch1.clientX,
            touch2.clientY - touch1.clientY
          );
          setLastTouchDistance(distance);
        }
      }
    },
    [zoom, rotation]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 1 && isDragging && containerRef.current) {
        const dx = e.touches[0].clientX - startPosRef.current.x;
        const dy = e.touches[0].clientY - startPosRef.current.y;

        containerRef.current.scrollLeft = startPosRef.current.scrollX - dx;
        containerRef.current.scrollTop = startPosRef.current.scrollY - dy;

        e.preventDefault();
      } else if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );

        if (lastTouchDistance > 0) {
          const delta = distance - lastTouchDistance;
          const zoomDelta = delta * 0.01;
          setZoom((prev) => Math.min(Math.max(prev + zoomDelta, minZoom), maxZoom));
        }

        setLastTouchDistance(distance);
        e.preventDefault();
      }
    },
    [isDragging, lastTouchDistance, maxZoom, minZoom]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    setLastTouchDistance(0);
  }, []);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY * -0.01;
        setZoom((prev) => Math.min(Math.max(prev + delta, minZoom), maxZoom));
      }
    },
    [maxZoom, minZoom]
  );

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (isMobile && imageDimensions.width > 0 && imageDimensions.height > 0) {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;

        const widthRatio = containerWidth / imageDimensions.width;
        const heightRatio = containerHeight / imageDimensions.height;

        const fitZoom = Math.min(widthRatio, heightRatio, 1);

        if (fitZoom < 1) {
          setZoom(fitZoom);
        }
      }
    }
  }, [isMobile, imageDimensions, isLoading]);

  if (!src || isError) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-md border border-border bg-muted/30',
          className
        )}
        style={{
          width: isMobile ? '100%' : initialWidth,
          height: isMobile ? '70vh' : initialHeight,
        }}
        role='alert'
        aria-live='assertive'
      >
        <span className='text-sm text-muted-foreground'>{fallbackText}</span>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col space-y-2 w-full', className)}>
      <div
        ref={containerRef}
        className={cn(
          'relative overflow-auto rounded-md border border-border bg-background shadow-sm',
          isDragging && 'cursor-grabbing',
          !isDragging && zoom > 1 && 'cursor-grab',
          isLoading && 'bg-muted/50',
          showGrid && 'bg-grid'
        )}
        style={{
          width: isMobile ? '100%' : initialWidth,
          height: isMobile ? '70vh' : initialHeight,
          maxWidth: '100%',
          backgroundSize: `${40 * zoom}px ${40 * zoom}px, ${8 * zoom}px ${8 * zoom}px`,
          backgroundPosition: `center center`,
          backgroundImage: showGrid
            ? `
            linear-gradient(to right, rgba(100, 100, 100, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(100, 100, 100, 0.1) 1px, transparent 1px),
            linear-gradient(to right, rgba(100, 100, 100, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(100, 100, 100, 0.05) 1px, transparent 1px)
          `
            : 'none',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        tabIndex={0}
        role='application'
        aria-label={`Image viewer: ${alt}`}
      >
        <div
          className='relative flex items-center justify-center min-h-full min-w-full'
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
            transformOrigin: 'center',
            transition: isDragging ? 'none' : 'transform 0.2s ease-out',
            width: '100%',
            height: '100%',
          }}
        >
          <Image
            ref={imageRef as any}
            src={src || images.noImage}
            alt={alt}
            sizes={`(max-width: 768px) 100vw, ${initialWidth}px`}
            className={cn(
              'object-contain transition-opacity duration-300',
              isLoading ? 'opacity-0' : 'opacity-100'
            )}
            onError={handleError}
            onLoad={handleLoad}
            width={initialWidth}
            height={initialHeight}
            quality={quality}
            priority={true}
            draggable={false}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
            }}
          />
        </div>

        {isLoading && <LoadingItem loading={isLoading} />}

        {onClose && (
          <Button
            variant='ghost'
            size='icon'
            className='absolute right-2 top-2 bg-background/80 hover:bg-background z-10'
            onClick={onClose}
            aria-label='Close image viewer'
          >
            <X className='h-4 w-4' />
          </Button>
        )}

        {!isLoading && showInfo && (
          <div className='absolute bottom-2 left-2 text-xs bg-background/80 px-2 py-1 rounded-md text-muted-foreground'>
            {Math.round(zoom * 100)}% • {imageDimensions.width}×{imageDimensions.height}
          </div>
        )}
      </div>

      {showControls && (
        <div
          className={cn(
            'flex items-center justify-between gap-2 rounded-full p-2',
            isMobile && 'flex-col'
          )}
        >
          <div className={cn('flex items-center gap-2', isMobile && 'w-full justify-center')}>
            <BaseTooltip nameTooltip='Zoom Out (-)' disabled={isMobile}>
              <IconButton
                variant='outline'
                onClick={handleZoomOut}
                disabled={zoom <= minZoom}
                aria-label='Zoom out'
                icon={ZoomOut}
              />
            </BaseTooltip>

            <div className={cn('w-24', isMobile && 'w-full max-w-[150px]')}>
              <Slider
                value={[zoom]}
                min={minZoom}
                max={maxZoom}
                step={0.1}
                onValueChange={(value) => setZoom(value[0])}
                aria-label='Zoom level'
              />
            </div>

            <BaseTooltip nameTooltip='Zoom In (+)' disabled={isMobile}>
              <IconButton
                variant='outline'
                onClick={handleZoomIn}
                disabled={zoom >= maxZoom}
                aria-label='Zoom in'
                icon={ZoomIn}
              />
            </BaseTooltip>
          </div>

          <div className={cn('flex items-center gap-2', isMobile && 'w-full justify-center mt-2')}>
            <BaseTooltip nameTooltip='Rotate (R)' disabled={isMobile}>
              <IconButton
                variant='outline'
                onClick={handleRotate}
                aria-label='Rotate image'
                icon={RotateCw}
              />
            </BaseTooltip>

            <BaseTooltip nameTooltip='Reset (0)' disabled={isMobile}>
              <IconButton
                variant='outline'
                icon={RefreshCw}
                onClick={handleReset}
                aria-label='Reset view'
              />
            </BaseTooltip>

            <BaseTooltip nameTooltip='Toggle Grid (G)' disabled={isMobile}>
              <IconButton
                variant={showGrid ? 'default' : 'outline'}
                icon={Grid}
                onClick={() => setShowGrid((prev) => !prev)}
                aria-label='Toggle grid'
                className={showGrid ? 'bg-rose-500 text-primary-foreground' : ''}
              />
            </BaseTooltip>

            <BaseTooltip
              nameTooltip={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
              disabled={isMobile}
            >
              <IconButton
                variant='outline'
                icon={isFullscreen ? Minimize : Maximize}
                onClick={handleFullscreen}
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              />
            </BaseTooltip>
          </div>
        </div>
      )}
    </div>
  );
}
