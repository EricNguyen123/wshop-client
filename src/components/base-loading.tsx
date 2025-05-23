/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import Loading from './skeleton/loading';
import { useAppSelector } from '@/lib/store/hooks';
import { selectStatus as selectAuthStatus } from '@/lib/store/features/auth/slice';
import { selectStatus as selectUserStatus } from '@/lib/store/features/user/slice';
import { selectStatus as selectBannerStatus } from '@/lib/store/features/banner/slice';

export default function BaseLoading() {
  const isLoading = useAppSelector((state) =>
    [selectAuthStatus(state), selectUserStatus(state), selectBannerStatus(state)].includes(
      'loading'
    )
  );

  return <Loading loading={isLoading} />;
}
