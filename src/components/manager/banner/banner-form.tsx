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
import { Textarea } from '@/components/ui/textarea';
import type { FileWithPreview } from '@/types/common';
import type { DateRange } from 'react-day-picker';
import { FileUpload } from '@/components/input/file-upload/file-upload';
import { bannerCreateSchema, bannerEditSchema } from '@/validations/banner/banner-schema';
import { createBannerAsync, updateBannerAsync } from '@/lib/store/features/banner/thunk';
import { convertFileWithPreviewToFile, toSQLDateTime } from '@/utils/common';
import DateRangePicker from '@/components/date-picker/date-range-picker';
import { BannerImage } from './banner-image';

type BannerFormValues = z.infer<typeof bannerCreateSchema> | z.infer<typeof bannerEditSchema>;

export default function BannerForm({
  bannerId,
  closeDialog,
  data,
  variant = 'create',
}: {
  bannerId?: string;
  closeDialog?: () => void;
  data?: any;
  variant?: 'create' | 'edit';
}) {
  const t = useTranslations('Form.BannerCreate');
  const tMessage = useTranslations('Messages.error');
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileWithPreview[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: data?.startDate ? new Date(data.startDate) : undefined,
    to: data?.endDate ? new Date(data.endDate) : undefined,
  });
  const [file, setFile] = useState<File | null>(null);

  const defaultCreateValues: z.infer<typeof bannerCreateSchema> = {
    url: data?.url || EMPTY_STRING,
    descriptions: data?.descriptions || EMPTY_STRING,
    startDate: data?.startDate ? new Date(data.startDate) : new Date(),
    endDate: data?.endDate ? new Date(data.endDate) : new Date(),
    numberOrder: data?.numberOrder || 0,
  };

  const defaultEditValues: z.infer<typeof bannerEditSchema> = {
    descriptions: data?.descriptions || EMPTY_STRING,
    startDate: data?.startDate ? new Date(data.startDate) : new Date(),
    endDate: data?.endDate ? new Date(data.endDate) : new Date(),
    numberOrder: data?.numberOrder || 0,
  };

  const form = useForm<BannerFormValues>({
    resolver: zodResolver(variant === 'edit' ? bannerEditSchema : bannerCreateSchema),
    defaultValues: variant === 'edit' ? defaultEditValues : defaultCreateValues,
  });

  React.useEffect(() => {
    if (dateRange?.from) {
      form.setValue('startDate', dateRange.from);
    }
    if (dateRange?.to) {
      form.setValue('endDate', dateRange.to);
    }
  }, [dateRange, form]);

  function onSubmit(values: BannerFormValues) {
    setIsLoading(true);

    if (uploadedFiles.length > 0) {
      values.url = uploadedFiles[0].preview || '';
    }

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
        if (bannerId) {
          const parsedValues = bannerEditSchema.parse(values);
          console.log({
            descriptions: parsedValues.descriptions,
            startDate: parsedValues.startDate ? toSQLDateTime(parsedValues.startDate) : undefined,
            endDate: parsedValues.endDate ? toSQLDateTime(parsedValues.endDate) : undefined,
            numberOrder: parsedValues.numberOrder,
          });
          dispatch(
            updateBannerAsync({
              data: {
                value: {
                  descriptions: parsedValues.descriptions,
                  startDate: parsedValues.startDate
                    ? toSQLDateTime(parsedValues.startDate)
                    : undefined,
                  endDate: parsedValues.endDate ? toSQLDateTime(parsedValues.endDate) : undefined,
                  numberOrder: parsedValues.numberOrder,
                },
                ...callbacks,
              },
              bannerId,
            })
          );
        }
        break;
      case 'create':
        if (file) {
          const parsedValues = bannerCreateSchema.parse(values);
          dispatch(
            createBannerAsync({
              data: {
                value: {
                  descriptions: parsedValues.descriptions,
                  startDate: toSQLDateTime(parsedValues.startDate),
                  endDate: toSQLDateTime(parsedValues.endDate),
                  numberOrder: parsedValues.numberOrder,
                  file,
                },
                ...callbacks,
              },
            })
          );
        }

        break;
    }
  }

  const handleFileChange = async (files: FileWithPreview[]) => {
    setUploadedFiles(files);
    if (files.length > 0 && files[0].preview) {
      form.setValue('url', files[0].preview);
      setFile(await convertFileWithPreviewToFile(files[0]));
    } else {
      form.setValue('url', '');
    }
  };

  const handleDateSelect = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-6'>
        {variant === 'create' && (
          <div className='space-y-2'>
            <FileUpload
              value={uploadedFiles}
              onChange={handleFileChange}
              maxFiles={1}
              maxSize={5 * 1024 * 1024} // 5MB
              accept={{ 'image/*': [] }}
              uploadText={t('placeholder.uploadImage')}
              uploadSubText={t('placeholder.uploadImageSubtext')}
              uploadNoteText={t('placeholder.uploadImageNote')}
              previewType='list'
            />
          </div>
        )}
        {variant === 'edit' && (
          <BannerImage
            src={data?.url}
            alt={data?.url}
            className='!w-full !h-40 rounded-md border border-border bg-muted/30'
            fallbackText='No Image'
          />
        )}

        <FormField
          control={form.control}
          name='descriptions'
          render={({ field }) => (
            <FormItem className='grid gap-2 relative'>
              <FormLabel>
                {t('label.description')}
                <span className='text-red-500 ml-0.5'>*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('placeholder.description')}
                  className='resize-none h-[100px] overflow-y-auto'
                  {...field}
                />
              </FormControl>
              <FormMessage className='absolute -bottom-5' />
            </FormItem>
          )}
        />

        <div className='grid sm:grid-cols-2 gap-4'>
          <div className='grid gap-2'>
            <FormLabel>
              {t('label.dateRange')}
              <span className='text-red-500 ml-0.5'>*</span>
            </FormLabel>
            <DateRangePicker
              from={dateRange?.from}
              to={dateRange?.to}
              onChange={handleDateSelect}
            />
            {form.formState.errors.startDate || form.formState.errors.endDate ? (
              <p className='text-sm font-medium text-destructive'>{t('error.dateRangeRequired')}</p>
            ) : null}
          </div>
          <FormField
            control={form.control}
            name='numberOrder'
            render={({ field }) => (
              <FormItem className='grid gap-2 relative'>
                <FormLabel>
                  {t('label.numberOrder')}
                  <span className='text-red-500 ml-0.5'>*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder={t('placeholder.numberOrder')}
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value === '' ? '0' : e.target.value;
                      field.onChange(Number.parseInt(value, 10));
                    }}
                  />
                </FormControl>
                <FormMessage className='absolute -bottom-5' />
              </FormItem>
            )}
          />
        </div>

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
