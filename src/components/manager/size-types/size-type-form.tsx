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
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import ButtonLoading from '@/components/button/button-loading';
import { createSizeTypeAsync, updateSizeTypeAsync } from '@/lib/store/features/size-type/thunk';
import { sizeTypeSchema } from '@/validations/size-type/banner-schema';

type SizeTypeFormValues = z.infer<typeof sizeTypeSchema>;

export default function SizeTypeForm({
  sizeTypeId,
  closeDialog,
  data,
  variant = 'create',
}: {
  sizeTypeId?: string;
  closeDialog?: () => void;
  data?: any;
  variant?: 'create' | 'edit';
}) {
  const t = useTranslations('Form.SizeTypeCreate');
  const tMessage = useTranslations('Messages.error');
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const defaultCreateValues: SizeTypeFormValues = {
    name: EMPTY_STRING,
    sizeCode: EMPTY_STRING,
    sizeType: EMPTY_STRING,
  };

  const defaultEditValues: SizeTypeFormValues = {
    name: data?.name || EMPTY_STRING,
    sizeCode: data?.sizeCode || EMPTY_STRING,
    sizeType: data?.sizeType || EMPTY_STRING,
  };

  const form = useForm<SizeTypeFormValues>({
    resolver: zodResolver(sizeTypeSchema),
    defaultValues: variant === 'edit' ? defaultEditValues : defaultCreateValues,
  });

  function onSubmit(values: SizeTypeFormValues) {
    setIsLoading(true);

    const callbacks = {
      setToastSuccess: (status?: number) => {
        closeDialog?.();
        showSuccessToast(tMessage(`toast.${status?.toString()}`));
      },
      setToastError: (status?: number) => {
        setIsLoading(false);
        showErrorToast(tMessage(`toast.${status?.toString()}`) || tMessage('toast.error'));
      },
    };

    switch (variant) {
      case 'edit':
        if (sizeTypeId) {
          const parsedValues = sizeTypeSchema.parse(values);
          dispatch(
            updateSizeTypeAsync({
              data: {
                value: {
                  name: parsedValues.name,
                  sizeCode: parsedValues.sizeCode,
                  sizeType: parsedValues.sizeType,
                },
                ...callbacks,
              },
              sizeTypeId,
            })
          );
        }
        break;
      case 'create':
        const parsedValues = sizeTypeSchema.parse(values);
        dispatch(
          createSizeTypeAsync({
            data: {
              value: {
                name: parsedValues.name,
                sizeCode: parsedValues.sizeCode,
                sizeType: parsedValues.sizeType,
              },
              ...callbacks,
            },
          })
        );

        break;
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
                <Input placeholder={t('placeholder.name')} {...field} required />
              </FormControl>
              <FormMessage className='absolute -bottom-5' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='sizeCode'
          render={({ field }) => (
            <FormItem className='grid gap-2 relative'>
              <FormLabel>
                {t('label.sizeCode')}
                <span className='text-red-500 ml-0.5'>*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder={t('placeholder.sizeCode')} {...field} required />
              </FormControl>
              <FormMessage className='absolute -bottom-5' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='sizeType'
          render={({ field }) => (
            <FormItem className='grid gap-2 relative'>
              <FormLabel>
                {t('label.sizeType')}
                <span className='text-red-500 ml-0.5'>*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder={t('placeholder.sizeType')} {...field} required />
              </FormControl>
              <FormMessage className='absolute -bottom-5' />
            </FormItem>
          )}
        />

        <div className='grid grid-cols-2 gap-4 pt-2'>
          <Button
            type='button'
            variant={'outline'}
            className='w-full cursor-pointer'
            onClick={closeDialog}
          >
            {t('button.cancel')}
          </Button>
          <ButtonLoading isLoading={isLoading} label={t('button.save')} />
        </div>
      </form>
    </Form>
  );
}
