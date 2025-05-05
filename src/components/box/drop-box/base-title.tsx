import React from 'react';

export default function BaseTitle({ title }: { title: React.ReactNode }) {
  return (
    <div className='w-full flex items-center justify-start text-xl font-semibold'>{title}</div>
  );
}
