import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Ellipsis } from 'lucide-react';
import { ModeToggle } from '../theme/mode-toggle';
import BaseLocale from '../locale-menu/base-locale';
import { IconButton } from '../button/button-icon';
import BaseTooltip from '../tooltip/base-tooltip';
import { useTranslations } from 'next-intl';

export function OptionMenu() {
  const t = useTranslations('Button.DropdownMenu.Option');
  return (
    <DropdownMenu>
      <BaseTooltip nameTooltip={t('tooltip')}>
        <DropdownMenuTrigger asChild className='relative'>
          <IconButton icon={Ellipsis} />
        </DropdownMenuTrigger>
      </BaseTooltip>
      <DropdownMenuContent className='w-56 absolute -right-6'>
        <DropdownMenuGroup>
          <BaseLocale />
          <ModeToggle />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
