import ItemMenu from '@/components/dropdown-menu/item-menu';
import { showErrorToast, showSuccessToast } from '@/components/toast/custom-toast';
import config from '@/config';
import { useRouter } from '@/i18n/navigation';
import { logoutAsync } from '@/lib/store/features/auth/thunk';
import { useAppDispatch } from '@/lib/store/hooks';
import { LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';

export default function ItemLogout() {
  const dispatch = useAppDispatch();
  const t = useTranslations('Form.Logout');
  const tMessage = useTranslations('Messages.error');
  const router = useRouter();

  const handleLogout = () => {
    dispatch(
      logoutAsync({
        data: {
          setToastSuccess: (status) => {
            router.push(`${config.routes.public.home}`);
            showSuccessToast(tMessage(`toast.${status}`));
          },
          setToastError: (status) => {
            showErrorToast(tMessage(`toast.${status}`) || tMessage('toast.error'));
          },
        },
      })
    );
  };
  return (
    <ItemMenu
      icon={<LogOut className='size-4 text-rose-500' />}
      onClick={handleLogout}
      className=' text-rose-500 hover:!text-rose-500 cursor-pointer'
    >
      {t('button')}
    </ItemMenu>
  );
}
