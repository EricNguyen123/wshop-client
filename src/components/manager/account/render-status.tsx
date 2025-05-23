'use client';

import { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { StatusEnum, ValidRolesEnum } from '@/common/enum';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { updateUserAsync } from '@/lib/store/features/user/thunk';
import { showErrorToast, showSuccessToast } from '@/components/toast/custom-toast';
import { useTranslations } from 'next-intl';
import { selectCurrentAccount } from '@/lib/store/features/auth/slice';

const RenderStatus = ({
  inStatus,
  statusText,
  userId,
}: {
  inStatus: StatusEnum;
  statusText: string;
  userId?: string;
}) => {
  const [status, setStatus] = useState(inStatus);
  const dispatch = useAppDispatch();
  const tMessage = useTranslations('Messages.error');
  const selectCurrent = useAppSelector(selectCurrentAccount);
  const [currentAccount, setCurrentAccount] = useState(selectCurrent?.user);

  useEffect(() => {
    setCurrentAccount(selectCurrent?.user);
  }, [selectCurrent]);

  const toggleStatus = () => {
    const newStatus = status === StatusEnum.NOT_ACTIVE ? StatusEnum.ACTIVE : StatusEnum.NOT_ACTIVE;
    setStatus(newStatus);
    if (userId) {
      dispatch(
        updateUserAsync({
          data: {
            value: { status: newStatus },
            setToastSuccess: (status?: number) => {
              showSuccessToast(tMessage(`toast.${status}`));
            },
            setToastError: (status?: number) => {
              showErrorToast(tMessage(`toast.${status}`) || tMessage('toast.error'));
            },
          },
          userId,
        })
      );
    }
  };

  useEffect(() => {
    setStatus(inStatus);
  }, [inStatus]);

  const isActive = status === StatusEnum.ACTIVE;

  return (
    <div className='flex flex-col space-y-4 w-fit'>
      <div className='flex items-center justify-between gap-6'>
        <Badge
          variant={isActive ? 'default' : 'secondary'}
          className={`${
            isActive
              ? 'bg-green-100 text-green-800 hover:bg-green-100'
              : 'bg-slate-100 text-slate-800 hover:bg-slate-100'
          }`}
        >
          <span
            className={`mr-1.5 inline-block w-2 h-2 rounded-full ${
              isActive ? 'bg-green-500' : 'bg-slate-500'
            }`}
          />
          {statusText}
        </Badge>

        {[ValidRolesEnum.ADMIN, ValidRolesEnum.EDITOR].includes(
          currentAccount?.role ?? ValidRolesEnum.USER
        ) && (
          <Switch
            checked={isActive}
            onCheckedChange={toggleStatus}
            className='data-[state=checked]:bg-green-500 data-[state=checked]:text-green-foreground'
          />
        )}
      </div>
    </div>
  );
};

export default RenderStatus;
