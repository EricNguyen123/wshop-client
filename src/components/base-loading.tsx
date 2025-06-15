/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import Loading from './skeleton/loading';
import { useAppSelector } from '@/lib/store/hooks';
import { selectStatus as selectAuthStatus } from '@/lib/store/features/auth/slice';
import { selectStatus as selectUserStatus } from '@/lib/store/features/user/slice';
import { selectStatus as selectBannerStatus } from '@/lib/store/features/banner/slice';
import { selectStatus as selectCategoryStatus } from '@/lib/store/features/category/slice';
import { selectStatus as selectColorTypeStatus } from '@/lib/store/features/color-type/slice';

export default function BaseLoading() {
  const isLoading = useAppSelector((state) =>
    [
      selectAuthStatus(state),
      selectUserStatus(state),
      selectBannerStatus(state),
      selectCategoryStatus(state),
      selectColorTypeStatus(state),
    ].includes('loading')
  );

  return <Loading loading={isLoading} />;
}
