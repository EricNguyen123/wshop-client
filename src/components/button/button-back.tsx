import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { useRouter } from '@/i18n/navigation';

export default function ButtonBack() {
  const routes = useRouter();
  return (
    <Button
      variant={'ghost'}
      onClick={() => {
        routes.back();
      }}
    >
      <ChevronLeft />
    </Button>
  );
}
