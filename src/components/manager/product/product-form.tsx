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
import { FileUpload } from '@/components/input/file-upload/file-upload';
import { convertFilesWithPreviewToFiles } from '@/utils/common';
import { productCreateSchema, productEditSchema } from '@/validations/product/product-schema';
import { createProductAsync, updateProductAsync } from '@/lib/store/features/product/thunk';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StatusProductEnum } from '@/common/enum';
import { StatusOption } from '@/components/select/status-selector';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Percent, X } from 'lucide-react';
import { useDebounce } from '@/utils/hooks/use-debounce';

type ProductFormValues = z.infer<typeof productCreateSchema> & {
  mediaIds?: string[];
};

export default function ProductForm({
  productId,
  closeDialog,
  data,
  variant = 'create',
}: {
  productId?: string;
  closeDialog?: () => void;
  data?: any;
  variant?: 'create' | 'edit';
}) {
  const t = useTranslations('Form.ProductCreate');
  const tMessage = useTranslations('Messages.error');
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileWithPreview[]>([]);
  const [files, setFiles] = useState<File[] | null>(null);
  const [rateInput, setRateInput] = useState<string>('');
  const debouncedRate = useDebounce(rateInput, 500);
  const [discountInput, setDiscountInput] = useState<string>('');
  const debouncedDiscount = useDebounce(discountInput, 500);

  const defaultCreateValues: z.infer<typeof productCreateSchema> = {
    name: EMPTY_STRING,
    code: EMPTY_STRING,
    price: 0,
    quantity: 0,
    quantityAlert: 0,
    orderUnit: 1,
    description: EMPTY_STRING,
    status: 0,
    multiplicationRate: 1,
    discount: 0,
  };

  const defaultEditValues: z.infer<typeof productEditSchema> = {
    name: data?.name || EMPTY_STRING,
    code: data?.code || EMPTY_STRING,
    price: data?.price || 0,
    quantity: data?.quantity || 0,
    quantityAlert: data?.quantityAlert || 0,
    orderUnit: data?.orderUnit || 1,
    description: data?.description || EMPTY_STRING,
    status: data?.status || 0,
    multiplicationRate: data?.multiplicationRate || 1,
    discount: data?.discount || 0,
    mediaIds: Array.isArray(data?.medias) ? data?.medias?.map((media: any) => media.id) : [],
  };

  const isEdit = variant === 'edit';

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(
      isEdit ? (productEditSchema as unknown as typeof productCreateSchema) : productCreateSchema
    ),
    defaultValues: isEdit ? (defaultEditValues as ProductFormValues) : defaultCreateValues,
  });

  function onSubmit(values: ProductFormValues) {
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
        if (productId) {
          const parsedValues = productEditSchema.parse(values);

          dispatch(
            updateProductAsync({
              data: {
                value: {
                  ...parsedValues,
                  files: files ?? undefined,
                },
                ...callbacks,
              },
              productId,
            })
          );
        }
        break;
      case 'create':
        if (files) {
          const parsedValues = productCreateSchema.parse(values);
          dispatch(
            createProductAsync({
              data: {
                value: {
                  ...parsedValues,
                  files,
                },
                ...callbacks,
              },
            })
          );
        }

        break;
    }
  }

  React.useEffect(() => {
    if (variant === 'edit' && data?.medias?.length > 0) {
      const mediaFiles: FileWithPreview[] = data.medias.map((media: any) => ({
        name: media.fileName || `Product-Image-${media.id}`,
        size: media.fileSize || 0,
        type: 'image/*',
        lastModified: Date.now(),
        preview: media.mediaUrl,
        id: media.id,
        progress: 100,
      }));

      setUploadedFiles(mediaFiles);
      form.setValue(
        'mediaIds',
        mediaFiles.map((file) => file.id)
      );
    }
  }, [variant, data?.medias]);

  React.useEffect(() => {
    if (debouncedRate !== '') {
      form.setValue('multiplicationRate', parseFloat(debouncedRate));
    }
  }, [debouncedRate]);

  React.useEffect(() => {
    if (debouncedDiscount !== '') {
      form.setValue('discount', parseFloat(debouncedDiscount));
    }
  }, [debouncedDiscount]);

  const handleFileChange = async (files: FileWithPreview[]) => {
    setUploadedFiles(files);
    console.log('files', files);
    const newFiles = files.filter((file) => !file.preview?.startsWith('http'));
    if (variant === 'edit') {
      const mediaIds = data?.medias?.map((media: any) => media.id) || [];
      const filteredFiles = files.filter((file) => mediaIds.includes(file.id));
      console.log('filteredFiles', filteredFiles);
      form.resetField('mediaIds');
      form.setValue(
        'mediaIds',
        filteredFiles.map((file) => file.id)
      );
    }

    if (newFiles.length > 0) {
      const convertedFiles = await convertFilesWithPreviewToFiles(newFiles);
      setFiles(convertedFiles);
    } else if (files.length === 0) {
      setFiles(null);
    }
  };

  const statusOptions: StatusOption[] = Object.values(StatusProductEnum)
    .filter((value) => typeof value === 'number')
    .map((status) => ({
      label: t(`status.${status}`),
      value: String(status),
    }));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-6'>
        <ScrollArea className='max-h-[576px]'>
          <div className='w-full sm:px-4 grid gap-6'>
            <FileUpload
              value={uploadedFiles}
              onChange={handleFileChange}
              maxFiles={10}
              maxSize={5 * 1024 * 1024} // 5MB
              accept={{ 'image/*': [] }}
              uploadText={t('placeholder.uploadImage')}
              uploadSubText={t('placeholder.uploadImageSubtext')}
              uploadNoteText={t('placeholder.uploadImageNote')}
              previewType='grid'
            />
            <Separator />
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
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='code'
                render={({ field }) => (
                  <FormItem className='grid gap-2 relative'>
                    <FormLabel>
                      {t('label.code')}
                      <span className='text-red-500 ml-0.5'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('placeholder.code')}
                        type='text'
                        id='code'
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
                name='price'
                render={({ field }) => (
                  <FormItem className='grid gap-2 relative'>
                    <FormLabel>
                      {t('label.price')}
                      <span className='text-red-500 ml-0.5'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('placeholder.price')}
                        type='text'
                        id='price'
                        required
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

              <FormField
                control={form.control}
                name='quantity'
                render={({ field }) => (
                  <FormItem className='grid gap-2 relative'>
                    <FormLabel>
                      {t('label.quantity')}
                      <span className='text-red-500 ml-0.5'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('placeholder.quantity')}
                        type='text'
                        id='quantity'
                        required
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

              <FormField
                control={form.control}
                name='quantityAlert'
                render={({ field }) => (
                  <FormItem className='grid gap-2 relative'>
                    <FormLabel>
                      {t('label.quantityAlert')}
                      <span className='text-red-500 ml-0.5'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('placeholder.quantityAlert')}
                        type='text'
                        id='quantityAlert'
                        required
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

              <FormField
                control={form.control}
                name='orderUnit'
                render={({ field }) => (
                  <FormItem className='grid gap-2 relative'>
                    <FormLabel>
                      {t('label.orderUnit')}
                      <span className='text-red-500 ml-0.5'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('placeholder.orderUnit')}
                        type='text'
                        id='orderUnit'
                        required
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

              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem className='grid gap-2 relative'>
                    <FormLabel>
                      {t('label.status')}
                      <span className='text-red-500 ml-0.5'>*</span>
                    </FormLabel>
                    <Select
                      value={
                        field.value !== undefined
                          ? String(field.value)
                          : `${StatusProductEnum.DRAFT}`
                      }
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder={t('placeholder.status')} />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectGroup>
                          {statusOptions.map((item, index) => (
                            <SelectItem key={index} value={`${item.value}`}>
                              <div className='flex items-center'>
                                <span className='ml-2'>{item.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage className='absolute -bottom-5' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='multiplicationRate'
                render={({ field }) => (
                  <FormItem className='grid gap-2 relative'>
                    <FormLabel>
                      {t('label.multiplicationRate')}
                      <span className='text-red-500 ml-0.5'>*</span>
                    </FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Input
                          type='number'
                          inputMode='decimal'
                          placeholder={t('placeholder.multiplicationRate')}
                          className='pr-8 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none appearance-none'
                          {...field}
                          value={rateInput || data?.multiplicationRate}
                          onChange={(e) => setRateInput(e.target.value)}
                        />
                        <span className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground'>
                          <X className='size-3' />
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage className='absolute -bottom-5' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='discount'
                render={({ field }) => (
                  <FormItem className='grid gap-2 relative'>
                    <FormLabel>{t('label.discount')}</FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Input
                          placeholder={t('placeholder.discount')}
                          type='number'
                          className='pr-8 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none appearance-none'
                          {...field}
                          value={discountInput || data?.discount}
                          onChange={(e) => setDiscountInput(e.target.value)}
                        />
                        <Percent className='h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground' />
                      </div>
                    </FormControl>
                    <FormMessage className='absolute -bottom-5' />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem className='grid gap-2 relative'>
                  <FormLabel>{t('label.description')}</FormLabel>
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
          </div>
        </ScrollArea>

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
