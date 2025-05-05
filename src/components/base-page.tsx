'use client';
import config from '@/config';
import { useRouter } from '@/i18n/navigation';
import { callbackLoginGoogleAsync } from '@/lib/store/features/auth/thunk';
import { useAppDispatch } from '@/lib/store/hooks';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { showErrorToast, showSuccessToast } from './toast/custom-toast';
import { useTranslations } from 'next-intl';
import { ErrorNumberEnum } from '@/common/enum';

export default function BasePage({ children }: { children: React.ReactNode }) {
  const t = useTranslations('Form.Login');
  const tError = useTranslations('Messages.error');
  const dispatch = useAppDispatch();
  const routes = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get('token');

  useEffect(() => {
    if (tokenFromUrl) {
      const emailFromUrl = searchParams.get('email') as string;
      dispatch(
        callbackLoginGoogleAsync({
          data: {
            value: { email: emailFromUrl },
            setToastSuccess: (status) => {
              if (status === 200) {
                showSuccessToast(tError(`toast.${status}`));
              }
            },
            setToastError: (status) => {
              if (status && status >= ErrorNumberEnum.ErrorCode) {
                showErrorToast(tError(`toast.${status}`) || t('toast.error'));
              }
            },
          },
        })
      );
      routes.push(config.routes.public.home);
    }
  }, [tokenFromUrl]);
  return <div>{children}</div>;
}
