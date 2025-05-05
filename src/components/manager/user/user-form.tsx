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
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createUserAsync, updateUserAsync } from '@/lib/store/features/user/thunk';
import ButtonLoading from '@/components/button/button-loading';
import { userEditSchema } from '@/validations/user/user-edit-schema';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StatusEnum, ValidRolesEnum } from '@/common/enum';
import { getRoleIcon } from '../account/render-role';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { userCreateSchema } from '@/validations/user/user-create-schema';

type UserFormValues = z.infer<typeof userEditSchema> | z.infer<typeof userCreateSchema>;

export default function UserForm({
  userId,
  closeDialog,
  data,
  variant,
}: {
  userId?: string;
  closeDialog?: () => void;
  data?: any;
  variant?: 'create' | 'edit';
}) {
  const t = useTranslations('Form.UserEdit');
  const tMessage = useTranslations('Messages.error');
  const dispatch = useAppDispatch();

  const defaultCreateValues: z.infer<typeof userCreateSchema> = {
    name: EMPTY_STRING,
    email: EMPTY_STRING,
    phone: EMPTY_STRING,
    role: ValidRolesEnum.USER,
    status: StatusEnum.NOT_ACTIVE,
    prefecture: EMPTY_STRING,
    city: EMPTY_STRING,
    street: EMPTY_STRING,
    building: EMPTY_STRING,
    zipcode: EMPTY_STRING,
  };

  const defaultEditValues: z.infer<typeof userEditSchema> = {
    name: data?.name || EMPTY_STRING,
    phone: data?.phone || EMPTY_STRING,
    role: data?.role || ValidRolesEnum.USER,
    status: data?.status || StatusEnum.NOT_ACTIVE,
    prefecture: data?.prefecture || EMPTY_STRING,
    city: data?.city || EMPTY_STRING,
    street: data?.street || EMPTY_STRING,
    building: data?.building || EMPTY_STRING,
    zipcode: data?.zipcode || EMPTY_STRING,
  };
  const form = useForm<UserFormValues>({
    resolver: zodResolver(variant === 'edit' ? userEditSchema : userCreateSchema),
    defaultValues: variant === 'edit' ? defaultEditValues : defaultCreateValues,
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  function onSubmit(values: UserFormValues) {
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
        if (userId) {
          const parsedValues = userEditSchema.parse(values);
          dispatch(
            updateUserAsync({
              data: {
                value: parsedValues,
                ...callbacks,
              },
              userId,
            })
          );
        }
        break;
      case 'create':
        const parsedValues = userCreateSchema.parse(values);
        dispatch(
          createUserAsync({
            data: {
              value: parsedValues,
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

        {variant === 'create' && (
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
                    type='text'
                    id='email'
                    required
                    {...field}
                  />
                </FormControl>
                <FormMessage className='absolute -bottom-5' />
              </FormItem>
            )}
          />
        )}

        <div className='grid sm:grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='role'
            render={({ field }) => (
              <FormItem className='grid gap-2 relative'>
                <FormLabel>{t('label.role')}</FormLabel>
                <Select value={field.value ?? ValidRolesEnum.USER} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder={t('placeholder.selectRole')} />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    <SelectGroup>
                      {Object.values(ValidRolesEnum).map((role) => (
                        <SelectItem key={role} value={role}>
                          <div className='flex items-center'>
                            {getRoleIcon(role)}
                            <span className='ml-2'>{t(`role.${role}`)}</span>
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
            name='status'
            render={({ field }) => (
              <FormItem className='grid gap-2 relative'>
                <FormLabel>{t('label.status')}</FormLabel>
                <div className='flex items-center justify-start space-x-2 h-9'>
                  <Badge
                    variant={field.value === StatusEnum.ACTIVE ? 'default' : 'secondary'}
                    className={`${
                      field.value === StatusEnum.ACTIVE
                        ? 'bg-green-100 text-green-800 hover:bg-green-100'
                        : 'bg-slate-100 text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <span
                      className={`mr-1.5 inline-block w-2 h-2 rounded-full ${
                        field.value === StatusEnum.ACTIVE ? 'bg-green-500' : 'bg-slate-500'
                      }`}
                    />
                    {t(`active.${field.value}`)}
                  </Badge>
                  <FormControl>
                    <Switch
                      checked={field.value === StatusEnum.ACTIVE}
                      onCheckedChange={(checked) =>
                        field.onChange(checked ? StatusEnum.ACTIVE : StatusEnum.NOT_ACTIVE)
                      }
                      className='data-[state=checked]:bg-green-500 data-[state=checked]:text-green-foreground'
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
        </div>
        <Separator />
        <div className='grid grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='phone'
            render={({ field }) => (
              <FormItem className='grid gap-2 relative'>
                <FormLabel>{t('label.phone')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('placeholder.phone')} type='text' id='phone' {...field} />
                </FormControl>
                <FormMessage className='absolute -bottom-5' />
              </FormItem>
            )}
          />

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
                  <Input
                    placeholder={t('placeholder.zipcode')}
                    type='text'
                    id='zipcode'
                    {...field}
                  />
                </FormControl>
                <FormMessage className='absolute -bottom-5' />
              </FormItem>
            )}
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
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
