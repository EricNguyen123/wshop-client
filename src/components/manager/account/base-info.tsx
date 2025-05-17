'use client';

import BoxInfoItem from '@/components/box/drop-box/base-info';
import { showErrorToast, showSuccessToast } from '@/components/toast/custom-toast';
import { selectAccount } from '@/lib/store/features/user/slice';
import { getDetailUserAsync } from '@/lib/store/features/user/thunk';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { useTranslations } from 'next-intl';
import type React from 'react';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { symbols } from '@/constant/common';
import RenderStatus from './render-status';
import { StatusEnum } from '@/common/enum';
import RenderRole from './render-role';
import UserInfoDialog from './user-info-dialog';
import UserAddressDialog from './user-address-dialog';

export default function BaseInfo({ userId }: { userId?: string }) {
  const dispatch = useAppDispatch();
  const selectUser = useAppSelector(selectAccount);
  const tMessage = useTranslations('Messages.error');
  const t = useTranslations('Component.UserProfile');
  const [userInfo, setUserInfo] = useState<{ name: string; content: string | React.ReactNode }[]>(
    []
  );
  const [addressInfo, setAddressInfo] = useState<
    { name: string; content: string | React.ReactNode }[]
  >([]);
  const [loginInfo, setLoginInfo] = useState<{ name: string; content: string | React.ReactNode }[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    if (userId) {
      if (!isLoading) {
        setIsLoading(true);
        dispatch(
          getDetailUserAsync({
            data: {
              value: {
                userId: userId,
              },
              setToastSuccess: (status?: number) => {
                setIsLoading(false);
                if (isMounted) {
                  showSuccessToast(tMessage(`toast.${status}`));
                }
              },
              setToastError: (status?: number) => {
                if (isMounted) {
                  showErrorToast(tMessage(`toast.${status}`) || tMessage('toast.error'));
                }
              },
            },
          })
        );
      }
    }

    return () => {
      isMounted = false;
    };
  }, [dispatch, userId, tMessage, isLoading]);

  useEffect(() => {
    if (selectUser) {
      setUserInfo([
        { name: t('fields.id'), content: selectUser.id || symbols.inValid },
        { name: t('fields.name'), content: selectUser.name || symbols.inValid },
        { name: t('fields.email'), content: selectUser.email || symbols.inValid },
        { name: t('fields.role'), content: <RenderRole user={selectUser} /> },
        {
          name: t('fields.status'),
          content: (
            <RenderStatus
              inStatus={selectUser.status ? selectUser.status : StatusEnum.NOT_ACTIVE}
              statusText={t(`active.${selectUser.status}`)}
              userId={selectUser.id}
            />
          ),
        },
        { name: t('fields.phone'), content: selectUser.phone || symbols.inValid },
      ]);

      setAddressInfo([
        { name: t('fields.zipcode'), content: selectUser.zipcode || symbols.inValid },
        { name: t('fields.prefecture'), content: selectUser.prefecture || symbols.inValid },
        { name: t('fields.city'), content: selectUser.city || symbols.inValid },
        { name: t('fields.street'), content: selectUser.street || symbols.inValid },
        { name: t('fields.building'), content: selectUser.building || symbols.inValid },
      ]);

      setLoginInfo([
        {
          name: t('fields.currentSignInAt'),
          content: selectUser.currentSignInAt
            ? format(new Date(selectUser.currentSignInAt), 'PPpp')
            : symbols.inValid,
        },
        {
          name: t('fields.lastSignInAt'),
          content: selectUser.lastSignInAt
            ? format(new Date(selectUser.lastSignInAt), 'PPpp')
            : symbols.inValid,
        },
      ]);

      setIsLoading(false);
    }
  }, [selectUser, t]);

  return (
    <div className='w-full max-w-xl sm:min-w-md flex flex-col items-start justify-center gap-8'>
      <BoxInfoItem
        title={t('sections.userInfo')}
        options={userInfo}
        isLoading={isLoading}
        className='w-full'
        moreComponent={selectUser && <UserInfoDialog user={selectUser} />}
      />

      <BoxInfoItem
        title={t('sections.addressInfo')}
        options={addressInfo}
        isLoading={isLoading}
        className='w-full'
        moreComponent={selectUser && <UserAddressDialog user={selectUser} />}
      />

      <BoxInfoItem
        title={t('sections.loginInfo')}
        options={loginInfo}
        isLoading={isLoading}
        className='w-full'
      />
    </div>
  );
}
