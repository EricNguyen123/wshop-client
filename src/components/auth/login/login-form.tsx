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
import config from '@/config';
import { EMPTY_STRING } from '@/constant';
import { Link } from '@/i18n/navigation';
import { loginSchema } from '@/validations/login-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export default function LoginForm() {
  const t = useTranslations('Form.Login');
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: EMPTY_STRING,
      password: EMPTY_STRING,
    },
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    console.log(values);
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
            <FormItem className='grid gap-2'>
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
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='grid gap-2'>
              <div className='flex items-center'>
                <FormLabel>{t('label.password')}</FormLabel>
                <Link
                  href={`#`}
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
              <FormMessage />
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
        <Button variant='outline' className='w-full cursor-pointer'>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
            <path
              d='M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z'
              fill='currentColor'
            />
          </svg>
          {t('button.google')}
        </Button>
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
