/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { showErrorToast, showSuccessToast } from '@/components/toast/custom-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { EMPTY_STRING } from '@/constant';
import { useAppDispatch } from '@/lib/store/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { userInfoSchema } from '@/validations/user/user-info-schema';
import { updateUserAsync } from '@/lib/store/features/user/thunk';
import ButtonLoading from '@/components/button/button-loading';

export default function UserInfoForm({
  userId,
  onclickCancel,
  data,
  variant,
}: {
  userId?: string;
  onclickCancel?: () => void;
  data?: any;
  variant?: 'create' | 'edit';
}) {
  const t = useTranslations('Form.UserInformation');
  const tMessage = useTranslations('Messages.error');
  const dispatch = useAppDispatch();
  const form = useForm<z.infer<typeof userInfoSchema>>({
    resolver: zodResolver(userInfoSchema),
    defaultValues:
      variant === 'create'
        ? {
            name: EMPTY_STRING,
            phone: EMPTY_STRING,
          }
        : {
            name: data?.name || EMPTY_STRING,
            phone: data?.phone || EMPTY_STRING,
          },
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  function onSubmit(values: z.infer<typeof userInfoSchema>) {
    setIsLoading(true);
    if (userId) {
      dispatch(
        updateUserAsync({
          data: {
            value: values,
            setToastSuccess: (status) => {
              onclickCancel?.();
              showSuccessToast(tMessage(`toast.${status}`));
            },
            setToastError: (status) => {
              showErrorToast(tMessage(`toast.${status}`) || tMessage('toast.error'));
            },
          },
          userId,
        })
      );
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-6'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem className='grid gap-2 relative'>
              <FormLabel>
                {t('label.name')}
                <span className='text-red-500 ml-0.5'>*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t('placeholder.name')}
                  type='text'
                  id='name'
                  required
                  {...field}
                />
              </FormControl>
              <FormMessage className='absolute -bottom-5' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='phone'
          render={({ field }) => (
            <FormItem className='grid gap-2 relative'>
              <FormLabel>{t('label.phone')}</FormLabel>
              <FormControl>
                <Input placeholder={t('placeholder.phone')} type='text' id='phone' {...field} />
              </FormControl>
              <FormMessage className='absolute -bottom-5' />
            </FormItem>
          )}
        />

        <div className='grid grid-cols-2 gap-4'>
          <Button
            type='button'
            variant={'outline'}
            className='w-full cursor-pointer'
            onClick={onclickCancel}
          >
            {t('button.cancel')}
          </Button>
          <ButtonLoading isLoading={isLoading} label={t('button.save')} />
        </div>
      </form>
    </Form>
  );
}
