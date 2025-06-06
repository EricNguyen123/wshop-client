/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Pipette } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function ColorPicker({
  color,
  onChange,
}: {
  color: string;
  onChange: (color: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const handleEyedropper = async () => {
    if (!('EyeDropper' in window)) {
      return;
    }
    try {
      const eyeDropper = new (window as any).EyeDropper();
      const result = await eyeDropper.open();
      onChange(result.sRGBHex);
    } catch (error) {}
  };

  return (
    <div className='flex items-center justify-between grid-cols-2 gap-2'>
      <Input
        id='colorCode'
        placeholder='#000000'
        value={color}
        onChange={(e) => onChange(e.target.value)}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button className='p-1 size-9' style={{ backgroundColor: color }} />
        </PopoverTrigger>
        <PopoverContent className='w-[220px] flex flex-col items-center space-y-2 pointer-events-auto'>
          <HexColorPicker color={color} onChange={onChange} />
          <p className='text-sm font-medium'>{color.toUpperCase()}</p>
          <Button variant='outline' className='flex items-center w-full' onClick={handleEyedropper}>
            <Pipette className='w-4 h-4' />
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
