/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import type React from 'react';

import { useCallback, useEffect, useRef, useState } from 'react';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Slider } from '@/components/ui/slider';
import { ZoomIn, ZoomOut } from 'lucide-react';
import Image from 'next/image';
import { AvatarCropProps } from '@/types/common';
import images from '@/assets/images';

export function AvatarCrop({ file, onCrop, aspectRatio = 1 }: AvatarCropProps) {
  const [crop, setCrop] = useState<Crop>();
  const [zoom, setZoom] = useState(1);
  const [imgSrc, setImgSrc] = useState<string>('');
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 });
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setImgSrc(reader.result as string);
    });
    reader.readAsDataURL(file);

    return () => {
      reader.abort();
    };
  }, [file]);

  useEffect(() => {
    if (imgSrc) {
      const img = new window.Image();
      img.onload = () => {
        setImgDimensions({
          width: img.width,
          height: img.height,
        });
      };
      img.src = imgSrc;
    }
  }, [imgSrc]);

  const onImageLoad = useCallback(
    (img: HTMLImageElement) => {
      const { width, height } = img;

      const crop = centerCrop(
        makeAspectCrop(
          {
            unit: '%',
            width: 90,
          },
          aspectRatio,
          width,
          height
        ),
        width,
        height
      );

      setCrop(crop);
    },
    [aspectRatio]
  );

  // Handle crop submission
  const handleCropSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!imgRef.current || !crop) return;

      const image = imgRef.current;
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      // const scaledScaleX = scaleX / zoom
      // const scaledScaleY = scaleY / zoom

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('No 2d context');
      }

      const pixelCrop = {
        x: (crop.x * image.width * scaleX) / 100,
        y: (crop.y * image.height * scaleY) / 100,
        width: (crop.width * image.width * scaleX) / 100,
        height: (crop.height * image.height * scaleY) / 100,
      };

      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error('Canvas is empty');
        }

        onCrop(blob);
      }, file.type || 'image/jpeg');
    },
    [crop, file, onCrop, zoom]
  );

  const handleZoomChange = useCallback((value: number[]) => {
    setZoom(value[0]);
  }, []);

  return (
    <form id='crop-form' onSubmit={handleCropSubmit} className='space-y-4'>
      <div className='overflow-hidden rounded-lg'>
        {imgSrc && (
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            keepSelection
            aspect={aspectRatio}
            circularCrop
            className='mx-auto max-h-[300px] max-w-full object-contain'
          >
            <div
              style={{
                position: 'relative',
                maxHeight: '300px',
                maxWidth: '100%',
                overflow: 'hidden',
                transform: `scale(${zoom})`,
                transformOrigin: 'center',
                transition: 'transform 200ms',
              }}
            >
              <Image
                ref={imgRef as any}
                src={imgSrc || images.noImage}
                alt='Crop preview'
                width={imgDimensions.width || 300}
                height={imgDimensions.height || 300}
                className='max-h-[300px] max-w-full'
                style={{
                  height: 'auto',
                  width: 'auto',
                  maxHeight: '300px',
                  maxWidth: '100%',
                  objectFit: 'contain',
                }}
                onLoadingComplete={(img) => onImageLoad(img)}
                unoptimized
              />
            </div>
          </ReactCrop>
        )}
      </div>

      <div className='flex items-center gap-2'>
        <ZoomOut className='h-4 w-4 text-muted-foreground' />
        <Slider
          value={[zoom]}
          min={0.5}
          max={3}
          step={0.1}
          onValueChange={handleZoomChange}
          className='flex-1'
        />
        <ZoomIn className='h-4 w-4 text-muted-foreground' />
      </div>
    </form>
  );
}
