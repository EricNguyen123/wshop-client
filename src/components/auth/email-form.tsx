'use client';

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
import { verifyEmailAsync } from '@/lib/store/features/auth/thunk';
import { useAppDispatch } from '@/lib/store/hooks';
import { otpSchema } from '@/validations/login/otp-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { showErrorToast, showSuccessToast } from '../toast/custom-toast';

interface EmailFormProps {
  onComplete?: () => void;
}

export default function EmailForm({ onComplete }: EmailFormProps) {
  const t = useTranslations('Form.EmailOTP');
  const tMessage = useTranslations('Messages.error');
  const dispatch = useAppDispatch();
  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      email: EMPTY_STRING,
    },
  });

  function onSubmit(values: z.infer<typeof otpSchema>) {
    dispatch(
      verifyEmailAsync({
        data: {
          value: values,
          setToastSuccess: (status?: number) => {
            onComplete?.();
            showSuccessToast(tMessage(`toast.${status}`));
          },
          setToastError: (status?: number) => {
            showErrorToast(tMessage(`toast.${status}`) || tMessage('toast.error'));
          },
        },
      })
    );
  }
  return (
    <Form {...form}>
      <div className='flex flex-col items-center gap-2 text-center mb-6'>
        <h1 className='text-2xl font-bold'>{t('title.email')}</h1>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-6'>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem className='grid gap-2 relative'>
              <FormLabel>{t('label.email')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('placeholder.email')}
                  type='email'
                  id='email'
                  required
                  {...field}
                />
              </FormControl>
              <FormMessage className='absolute -bottom-5' />
            </FormItem>
          )}
        />

        <Button type='submit' className='w-full cursor-pointer'>
          {t('button.next')}
        </Button>
      </form>
    </Form>
  );
}
