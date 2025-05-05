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
import { selectValue } from '@/lib/store/features/auth/slice';
import { forgotPasswordAsync } from '@/lib/store/features/auth/thunk';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { forgotPasswordSchema } from '@/validations/login/forgot-password-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface ForgotPasswordFormProps {
  onComplete?: () => void;
}

export default function ForgotPasswordForm({ onComplete }: ForgotPasswordFormProps) {
  const t = useTranslations('Form.ForgotPassword');
  const tMessage = useTranslations('Messages.error');
  const dispatch = useAppDispatch();
  const getValue = useAppSelector(selectValue);
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      password: EMPTY_STRING,
      confirmPassword: EMPTY_STRING,
    },
  });
  const userId = getValue && 'userId' in getValue ? getValue.userId : undefined;
  const [submitDisabled, setSubmitDisabled] = React.useState(false);

  function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    if (userId) {
      dispatch(
        forgotPasswordAsync({
          data: {
            value: values,
            setToastSuccess: (status?: number) => {
              onComplete?.();
              setSubmitDisabled(true);
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
  }
  return (
    <Form {...form}>
      <div className='flex flex-col items-center gap-2 text-center mb-6'>
        <h1 className='text-2xl font-bold'>{t('title.forgotPassword')}</h1>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-6'>
        <FormField
          control={form.control}
          name='password'
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
                  id='password'
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

        <Button type='submit' className='w-full cursor-pointer' disabled={submitDisabled}>
          {t('button.save')}
        </Button>
      </form>
    </Form>
  );
}
