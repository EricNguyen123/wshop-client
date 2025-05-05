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
import { useAppDispatch } from '@/lib/store/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { updateUserAsync } from '@/lib/store/features/user/thunk';
import ButtonLoading from '@/components/button/button-loading';
import { userAddressSchema } from '@/validations/user/user-address-schema';
import { EMPTY_STRING } from '@/constant';

export default function UserAddressForm({
  userId,
  onclickCancel,
  variant = 'create',
  data,
}: {
  userId?: string;
  onclickCancel?: () => void;
  variant?: 'create' | 'edit';
  data?: any;
}) {
  const t = useTranslations('Form.UserAddress');
  const tMessage = useTranslations('Messages.error');
  const dispatch = useAppDispatch();
  const form = useForm<z.infer<typeof userAddressSchema>>({
    resolver: zodResolver(userAddressSchema),
    defaultValues:
      variant === 'create'
        ? {
            prefecture: EMPTY_STRING,
            city: EMPTY_STRING,
            street: EMPTY_STRING,
            building: EMPTY_STRING,
            zipcode: EMPTY_STRING,
          }
        : {
            prefecture: data?.prefecture || EMPTY_STRING,
            city: data?.city || EMPTY_STRING,
            street: data?.street || EMPTY_STRING,
            building: data?.building || EMPTY_STRING,
            zipcode: data?.zipcode || EMPTY_STRING,
          },
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  function onSubmit(values: z.infer<typeof userAddressSchema>) {
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
          name='prefecture'
          render={({ field }) => (
            <FormItem className='grid gap-2 relative'>
              <FormLabel>{t('label.prefecture')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('placeholder.prefecture')}
                  type='text'
                  id='prefecture'
                  {...field}
                />
              </FormControl>
              <FormMessage className='absolute -bottom-5' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='city'
          render={({ field }) => (
            <FormItem className='grid gap-2 relative'>
              <FormLabel>{t('label.city')}</FormLabel>
              <FormControl>
                <Input placeholder={t('placeholder.city')} type='text' id='city' {...field} />
              </FormControl>
              <FormMessage className='absolute -bottom-5' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='street'
          render={({ field }) => (
            <FormItem className='grid gap-2 relative'>
              <FormLabel>{t('label.street')}</FormLabel>
              <FormControl>
                <Input placeholder={t('placeholder.street')} type='text' id='street' {...field} />
              </FormControl>
              <FormMessage className='absolute -bottom-5' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='building'
          render={({ field }) => (
            <FormItem className='grid gap-2 relative'>
              <FormLabel>{t('label.building')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('placeholder.building')}
                  type='text'
                  id='building'
                  {...field}
                />
              </FormControl>
              <FormMessage className='absolute -bottom-5' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='zipcode'
          render={({ field }) => (
            <FormItem className='grid gap-2 relative'>
              <FormLabel>{t('label.zipcode')}</FormLabel>
              <FormControl>
                <Input placeholder={t('placeholder.zipcode')} type='text' id='zipcode' {...field} />
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
