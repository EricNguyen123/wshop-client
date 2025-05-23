/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, User, Pencil, PenSquare, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ValidRolesEnum } from '@/common/enum';
import { IUserRes } from '@/types/common';
import { symbols } from '@/constant/common';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { updateUserAsync } from '@/lib/store/features/user/thunk';
import { showErrorToast, showSuccessToast } from '@/components/toast/custom-toast';
import { selectCurrentAccount } from '@/lib/store/features/auth/slice';

export const getRoleIcon = (role: ValidRolesEnum) => {
  switch (role) {
    case ValidRolesEnum.ADMIN:
      return <Shield className='h-4 w-4' />;
    case ValidRolesEnum.EDITOR:
      return <Pencil className='h-4 w-4' />;
    case ValidRolesEnum.USER:
    default:
      return <User className='h-4 w-4' />;
  }
};

export const getRoleBadgeStyle = (role: ValidRolesEnum) => {
  switch (role) {
    case ValidRolesEnum.ADMIN:
      return 'bg-red-100 text-red-800 hover:bg-red-100';
    case ValidRolesEnum.EDITOR:
      return 'bg-amber-100 text-amber-800 hover:bg-amber-100';
    case ValidRolesEnum.USER:
    default:
      return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
  }
};

export const renderRoleBadge = (role: ValidRolesEnum, t: any) => (
  <Badge variant='outline' className={getRoleBadgeStyle(role ?? ValidRolesEnum.USER)}>
    {getRoleIcon(role ?? ValidRolesEnum.USER)}
    <span className='ml-1'>{role ? t(`role.${role}`) : t('role.UNKNOWN')}</span>
  </Badge>
);

const RenderRole = ({
  user,
  onRoleChange,
}: {
  user: IUserRes;
  onRoleChange?: (role: ValidRolesEnum) => void;
}) => {
  const t = useTranslations('Component.UserProfile');
  const tMessage = useTranslations('Messages.error');
  const selectCurrent = useAppSelector(selectCurrentAccount);

  const dispatch = useAppDispatch();
  const [selectUser, setSelectUser] = useState(user);
  const [open, setOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(selectCurrent?.user);

  useEffect(() => {
    setCurrentAccount(selectCurrent?.user);
  }, [selectCurrent]);

  useEffect(() => {
    setSelectUser(user);
  }, [user]);

  const handleRoleChange = (newRole: ValidRolesEnum) => {
    setSelectUser({
      ...selectUser,
      role: newRole,
    });
  };

  const saveRoleChange = () => {
    setIsUpdating(true);

    if (selectUser.id) {
      dispatch(
        updateUserAsync({
          data: {
            value: { role: selectUser.role },
            setToastSuccess: (status?: number) => {
              if (onRoleChange) {
                onRoleChange(selectUser.role ?? ValidRolesEnum.USER);
              }
              setOpen(false);
              setIsUpdating(false);
              showSuccessToast(tMessage(`toast.${status}`));
            },
            setToastError: (status?: number) => {
              showErrorToast(tMessage(`toast.${status}`) || tMessage('toast.error'));
            },
          },
          userId: selectUser.id,
        })
      );
    }
  };

  return (
    <div className='flex items-center gap-6'>
      {selectUser?.role ? renderRoleBadge(selectUser.role, t) : symbols.inValid}

      {[ValidRolesEnum.ADMIN, ValidRolesEnum.EDITOR].includes(
        currentAccount?.role ?? ValidRolesEnum.USER
      ) && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant='ghost' size='icon' className='h-8 w-8 cursor-pointer'>
              <PenSquare className='h-4 w-4 text-slate-500' />
            </Button>
          </DialogTrigger>

          <DialogContent className='max-w-[350px] sm:!max-w-md  !rounded-2xl'>
            <DialogHeader>
              <DialogTitle>{t('role.dialogs.changeRole')}</DialogTitle>
              <DialogDescription>{t('role.dialogs.changeRoleDescription')}</DialogDescription>
            </DialogHeader>

            <div className='space-y-4 py-4'>
              <div className='flex items-center justify-start space-x-3'>
                <div className='font-medium text-sm'>{t('role.dialogs.currentRole')}:</div>
                {renderRoleBadge(selectUser?.role ?? ValidRolesEnum.USER, t)}
              </div>

              <div className='pt-0.5'>
                <div className='font-medium text-sm mb-2'>{t('role.dialogs.selectNewRole')}:</div>
                <Select
                  value={selectUser?.role ?? ValidRolesEnum.USER}
                  onValueChange={handleRoleChange}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder={t('role.dialogs.selectRole')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Object.values(ValidRolesEnum).map((role) => (
                        <SelectItem key={role} value={role}>
                          <div className='flex items-center'>
                            {getRoleIcon(role)}
                            <span className='ml-2'>{t(`role.${role}`)}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className='sm:justify-end w-full'>
              <div className='w-full flex gap-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => {
                    setOpen(false);
                    setSelectUser(user);
                  }}
                  className='flex-1'
                  disabled={isUpdating}
                >
                  {t('role.dialogs.cancel')}
                </Button>
                <Button
                  type='button'
                  onClick={saveRoleChange}
                  disabled={isUpdating}
                  className='bg-rose-500 hover:bg-rose-600 flex-1'
                >
                  {isUpdating ? (
                    <Loader2 className='size-4 animate-spin text-white' />
                  ) : (
                    t('role.dialogs.save')
                  )}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default RenderRole;
