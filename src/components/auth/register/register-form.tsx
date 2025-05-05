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
import { registerAsync } from '@/lib/store/features/auth/thunk';
import { useAppDispatch } from '@/lib/store/hooks';
import { registerSchema } from '@/validations/register/register-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import ThirdParty from '../login/third-party';

export default function RegisterForm() {
  const t = useTranslations('Form.Register');
  const tMessage = useTranslations('Messages.error');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: EMPTY_STRING,
      name: EMPTY_STRING,
      password: EMPTY_STRING,
      confirmPassword: EMPTY_STRING,
    },
  });

  function onSubmit(values: z.infer<typeof registerSchema>) {
    dispatch(
      registerAsync({
        data: {
          value: values,
          setToastSuccess: (status) => {
            router.push(`${config.routes.public.login}`);
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
        <h1 className='text-2xl font-bold'>{t('title.register')}</h1>
      </div>
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
              <FormLabel>
                {t('label.password')}
                <span className='text-red-500 ml-0.5'>*</span>
              </FormLabel>
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

        <Button type='submit' className='w-full cursor-pointer'>
          {t('button.register')}
        </Button>
        <div className='relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border'>
          <span className='relative z-10 bg-background px-2 text-muted-foreground'>
            {t('title.or')}
          </span>
        </div>
        <ThirdParty />
      </form>
      <div className='flex flex-col items-start space-y-2 mt-6'>
        <Link
          href={`/${config.routes.public.forgotPassword}`}
          className='text-start text-sm hover:text-rose-600 underline-offset-4 '
        >
          {t('link.forgot')}
        </Link>
        <Link
          href={`/${config.routes.public.verifyRestore}`}
          className='text-start text-sm hover:text-rose-600 underline-offset-4 '
        >
          {t('link.verifyRestore')}
        </Link>
        <div className='text-start text-sm'>
          {t('title.yesAccount')}
          <Link
            href={`/${config.routes.public.login}`}
            className='text-rose-500 hover:text-rose-600 ml-2'
          >
            {t('link.login')}
          </Link>
        </div>
      </div>
    </Form>
  );
}
