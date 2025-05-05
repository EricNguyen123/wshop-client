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
import { changePasswordAsync } from '@/lib/store/features/user/thunk';
import { useAppDispatch } from '@/lib/store/hooks';
import { changePasswordSchema } from '@/validations/user/change-password-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export default function ChangePasswordForm({ userId }: { userId?: string }) {
  const t = useTranslations('Form.ChangePassword');
  const tMessage = useTranslations('Messages.error');
  const dispatch = useAppDispatch();
  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: EMPTY_STRING,
      newPassword: EMPTY_STRING,
      confirmPassword: EMPTY_STRING,
    },
  });

  function onSubmit(values: z.infer<typeof changePasswordSchema>) {
    if (userId) {
      dispatch(
        changePasswordAsync({
          data: {
            value: values,
            setToastSuccess: (status?: number) => {
              showSuccessToast(tMessage(`toast.${status}`));
              form.reset();
            },
            setToastError: (status?: number) => {
              showErrorToast(tMessage(`toast.${status}`) || tMessage('toast.error'));
            },
          },
          userId,
        })
      );
    }
  }

  const handleCancel = () => {
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-6'>
        <FormField
          control={form.control}
          name='currentPassword'
          render={({ field }) => (
            <FormItem className='grid gap-2 relative'>
              <div className='flex items-center'>
                <FormLabel>
                  {t('label.currentPassword')}
                  <span className='text-red-500 ml-0.5'>*</span>
                </FormLabel>
              </div>
              <FormControl>
                <Input
                  placeholder={t('placeholder.currentPassword')}
                  type='password'
                  id='currentPassword'
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
          name='newPassword'
          render={({ field }) => (
            <FormItem className='grid gap-2 relative'>
              <div className='flex items-center'>
                <FormLabel>
                  {t('label.newPassword')}
                  <span className='text-red-500 ml-0.5'>*</span>
                </FormLabel>
              </div>
              <FormControl>
                <Input
                  placeholder={t('placeholder.newPassword')}
                  type='password'
                  id='newPassword'
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
          name='confirmPassword'
          render={({ field }) => (
            <FormItem className='grid gap-2 relative'>
              <FormLabel>
                {t('label.confirmPassword')}
                <span className='text-red-500 ml-0.5'>*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t('placeholder.confirmPassword')}
                  type='password'
                  id='confirmPassword'
                  required
                  {...field}
                />
              </FormControl>
              <FormMessage className='absolute -bottom-5' />
            </FormItem>
          )}
        />
        <div className='w-full grid gap-2 sm:grid-cols-2 grid-cols-1'>
          <Button
            type='button'
            variant={'outline'}
            className='w-full cursor-pointer'
            onClick={handleCancel}
          >
            {t('button.cancel')}
          </Button>
          <Button type='submit' className='w-full cursor-pointer'>
            {t('button.save')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
