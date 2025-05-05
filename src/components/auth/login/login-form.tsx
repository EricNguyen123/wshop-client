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
import config from '@/config';
import { EMPTY_STRING } from '@/constant';
import { Link, useRouter } from '@/i18n/navigation';
import { selectAuthenticated } from '@/lib/store/features/auth/slice';
import { loginAsync } from '@/lib/store/features/auth/thunk';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { loginSchema } from '@/validations/login/login-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import ThirdParty from './third-party';

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectAuthenticated);
  const router = useRouter();
  const t = useTranslations('Form.Login');
  const tMessage = useTranslations('Messages.error');
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: EMPTY_STRING,
      password: EMPTY_STRING,
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push(`${config.routes.public.home}`);
    }
  }, [isAuthenticated, router]);

  function onSubmit(values: z.infer<typeof loginSchema>) {
    dispatch(
      loginAsync({
        data: {
          value: values,
          setToastSuccess: (status) => {
            showSuccessToast(tMessage(`toast.${status}`));
          },
          setToastError: (status) => {
            showErrorToast(tMessage(`toast.${status}`) || tMessage('toast.error'));
          },
        },
      })
    );
  }

  return (
    <Form {...form}>
      <div className='flex flex-col items-center gap-2 text-center mb-6'>
        <h1 className='text-2xl font-bold'>{t('title.login')}</h1>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-6'>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem className='grid gap-2 relative'>
              <FormLabel>
                {t('label.email')}
                <span className='text-red-500 ml-0.5'>*</span>
              </FormLabel>
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

        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='grid gap-2 relative'>
              <div className='flex items-center'>
                <FormLabel>
                  {t('label.password')}
                  <span className='text-red-500 ml-0.5'>*</span>
                </FormLabel>
                <Link
                  href={`/${config.routes.public.forgotPassword}`}
                  className='ml-auto text-sm hover:text-rose-600 underline-offset-4 '
                >
                  {t('link.forgot')}
                </Link>
              </div>
              <FormControl>
                <Input
                  placeholder={t('placeholder.password')}
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

        <Button type='submit' className='w-full cursor-pointer'>
          {t('button.login')}
        </Button>
        <div className='relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border'>
          <span className='relative z-10 bg-background px-2 text-muted-foreground'>
            {t('title.or')}
          </span>
        </div>
        <ThirdParty />
      </form>
      <div className='text-start text-sm mt-6'>
        {t('title.noAccount')}
        <Link
          href={`/${config.routes.public.register}`}
          className='text-rose-500 hover:text-rose-600 ml-2'
        >
          {t('link.register')}
        </Link>
      </div>
    </Form>
  );
}
