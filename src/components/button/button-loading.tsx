import React from 'react';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';

export default function ButtonLoading({
  type = 'submit',
  isLoading,
  label,
  onClick,
}: {
  type?: 'submit' | 'button';
  isLoading: boolean;
  label: string;
  onClick?: () => void;
}) {
  return (
    <Button type={type} className='w-full cursor-pointer' onClick={onClick}>
      {isLoading ? <Loader2 className='w-full h-full animate-spin' /> : label}
    </Button>
  );
}
