'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useTranslations } from 'next-intl';
import { Switch } from '../ui/switch';

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations('Button.ModeToggle');
  const [checked, setChecked] = React.useState(theme === 'dark');

  const handleToggle = () => {
    const newTheme = !checked ? 'dark' : 'light';
    setTheme(newTheme);
    setChecked(!checked);
  };

  React.useEffect(() => {
    setChecked(theme === 'dark');
  }, [theme]);

  return (
    <DropdownMenuItem>
      <div className='flex items-center justify-between w-full'>
        <span>{t('label')}</span>
        <div className='flex items-center'>
          <Switch checked={checked} onCheckedChange={handleToggle} isTheme={true} />
        </div>
      </div>
    </DropdownMenuItem>
  );
}
