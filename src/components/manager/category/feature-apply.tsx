/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState } from 'react';
import ApplyDialog from './apply-dialog';
import { IProductRes } from '@/types/common';
import { useAppDispatch } from '@/lib/store/hooks';
import { useTranslations } from 'next-intl';
import { applyProductsFromCategory } from '@/lib/store/features/category/thunk';
import {
  showErrorToast,
  showSuccessToast,
  showWarningToast,
} from '@/components/toast/custom-toast';
import { useRouter } from '@/i18n/navigation';
import config from '@/config';
export interface FeatureApplyProps {
  handle?: (i?: any) => void;
  result?: (i?: any, e?: (x?: any) => void) => void;
  data: IProductRes[];
  categoryId: string;
}

export default function FeatureApply({ handle, result, data, categoryId }: FeatureApplyProps) {
  const dispatch = useAppDispatch();
  const tMessage = useTranslations('Messages.error');
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const route = useRouter();

  const handleApply = (i: any) => {
    const ids = Object.keys(i)
      .map((key) => data[Number(key)].id)
      .filter(Boolean) as string[];

    if (ids.length === 0) {
      showWarningToast(tMessage('toast.selectProduct'));
      setIsLoading(false);
      return;
    }

    if (ids.length > 0) {
      const callbacks = {
        setToastSuccess: (status?: number) => {
          showSuccessToast(tMessage(`toast.${status?.toString()}`));
          setIsLoading(false);
          route.push(`${config.routes.private.categories}/${categoryId}`);
        },
        setToastError: (status?: number) => {
          showErrorToast(tMessage(`toast.${status?.toString()}`) || tMessage('toast.error'));
        },
      };
      dispatch(
        applyProductsFromCategory({
          data: {
            value: { categoryId, productIds: ids },
            ...callbacks,
          },
        })
      );
    }
  };

  const handleConfirmApply = () => {
    setOpenConfirm(false);
    setIsLoading(true);
    if (result) {
      result({}, handleApply);
    }
  };

  return (
    <ApplyDialog
      handleApply={handleConfirmApply}
      openDialog={openConfirm}
      setOpenDialog={setOpenConfirm}
      isLoading={isLoading}
    />
  );
}
