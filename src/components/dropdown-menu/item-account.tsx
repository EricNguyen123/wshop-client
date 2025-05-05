import React from 'react';
import ItemMenu from './item-menu';
import { User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import config from '@/config';

export default function ItemAccount() {
  const t = useTranslations('Component.ManageMenu');
  const router = useRouter();

  const handleAccount = () => {
    router.push(`/${config.routes.private.account}`);
  };
  return (
    <ItemMenu
      icon={<User className='size-4' />}
      onClick={handleAccount}
      className=' cursor-pointer'
    >
      {t('account')}
    </ItemMenu>
  );
}
