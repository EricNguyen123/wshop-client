/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { StatusEnum, ValidRolesEnum } from '@/common/enum';
import { UseTable } from '@/components/table/use-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { columnsKey, query, sort, symbols } from '@/constant/common';
import { IUserRes } from '@/types/common';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Copy, Eye, SquarePen, Trash } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { renderRoleBadge } from '../account/render-role';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { deleteUserAsync, getListUsersAsync } from '@/lib/store/features/user/thunk';
import { showErrorToast, showSuccessToast } from '@/components/toast/custom-toast';
import { selectUsers } from '@/lib/store/features/user/slice';
import { ActionButton } from '@/components/button/button-action';
import UserForm from './user-form';
import BasePagination from '@/components/pagination/base-pagination';
import CreateUserDialog from './create-user-dialog';
import { useRouter } from '@/i18n/navigation';
import config from '@/config';
import { selectCurrentAccount } from '@/lib/store/features/auth/slice';
import { DeleteConfirmation } from '@/components/delete/delete-confirmation';
import BaseTitle from '@/components/box/drop-box/base-title';

export default function ListUsers() {
  const t = useTranslations('Component.UserProfile');
  const [data, setData] = useState<IUserRes[]>([]);
  const dispatch = useAppDispatch();
  const tMessage = useTranslations('Messages.error');
  const getUsers = useAppSelector(selectUsers);
  const currentAccount = useAppSelector(selectCurrentAccount);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [keySearch, setKeySearch] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(query.page);
  const [totalPages, setTotalPages] = useState<number>(query.totalPages);
  const routes = useRouter();

  const columns: ColumnDef<IUserRes>[] = [
    {
      accessorKey: columnsKey.name,
      header: ({ column }) => {
        return (
          <Button
            className='w-full'
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === sort.asc)}
          >
            {t('fields.name')}
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className='w-full flex items-center justify-center'>
          <span className='w-max text-nowrap text-sm font-normal'>
            {row.getValue('name') ? row.getValue('name') : symbols.inValid}
          </span>
        </div>
      ),
    },
    {
      accessorKey: columnsKey.email,
      header: ({ column }) => {
        return (
          <Button
            className='w-full'
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === sort.asc)}
          >
            {t('fields.email')}
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className='w-full flex items-center justify-center'>
          <span className='w-max text-nowrap text-sm font-normal'>
            {row.getValue('email') ? row.getValue('email') : symbols.inValid}
          </span>
        </div>
      ),
    },
    {
      accessorKey: columnsKey.role,
      header: ({ column }) => {
        return (
          <Button
            className='w-full'
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === sort.asc)}
          >
            {t('fields.role')}
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className='w-full flex items-center justify-center'>
          <span className='w-max text-nowrap text-sm font-normal'>
            {row.getValue('role')
              ? renderRoleBadge(row.getValue('role') as ValidRolesEnum, t)
              : symbols.inValid}
          </span>
        </div>
      ),
    },
    {
      accessorKey: columnsKey.phone,
      header: ({ column }) => {
        return (
          <Button
            className='w-full'
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === sort.asc)}
          >
            {t('fields.phone')}
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className='w-full flex items-center justify-center'>
          <span className='w-max text-nowrap text-sm font-normal'>
            {row.getValue('phone') ? row.getValue('phone') : symbols.inValid}
          </span>
        </div>
      ),
    },
    {
      accessorKey: columnsKey.status,
      header: ({ column }) => {
        return (
          <Button
            className='w-full'
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === sort.asc)}
          >
            {t('fields.status')}
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        const s = row.getValue('status');
        // const status = s as keyof typeof StatusEnum;
        // const statusValue = StatusEnum[status];
        const isActive = Number(s) === StatusEnum.ACTIVE;
        return (
          <div className='w-full flex items-center justify-center'>
            <Badge
              variant={isActive ? 'default' : 'secondary'}
              className={`${
                isActive
                  ? 'bg-green-100 text-green-800 hover:bg-green-100'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-100'
              }`}
            >
              <span
                className={`mr-1.5 inline-block w-2 h-2 rounded-full ${
                  isActive ? 'bg-green-500' : 'bg-slate-500'
                }`}
              />
              {t(`active.${s}`)}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: columnsKey.prefecture,
      header: ({ column }) => {
        return (
          <Button
            className='w-full'
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === sort.asc)}
          >
            {t('fields.prefecture')}
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className='w-full flex items-center justify-center'>
          <span className='w-max text-nowrap text-sm font-normal'>
            {row.getValue('prefecture') ? row.getValue('prefecture') : symbols.inValid}
          </span>
        </div>
      ),
    },
    {
      accessorKey: columnsKey.city,
      header: ({ column }) => {
        return (
          <Button
            className='w-full'
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === sort.asc)}
          >
            {t('fields.city')}
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className='w-full flex items-center justify-center'>
          <span className='w-max text-nowrap text-sm font-normal'>
            {row.getValue('city') ? row.getValue('city') : symbols.inValid}
          </span>
        </div>
      ),
    },
    {
      accessorKey: columnsKey.street,
      header: ({ column }) => {
        return (
          <Button
            className='w-full'
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === sort.asc)}
          >
            {t('fields.street')}
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className='w-full flex items-center justify-center'>
          <span className='w-max text-nowrap text-sm font-normal'>
            {row.getValue('street') ? row.getValue('street') : symbols.inValid}
          </span>
        </div>
      ),
    },
    {
      accessorKey: columnsKey.building,
      header: ({ column }) => {
        return (
          <Button
            className='w-full'
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === sort.asc)}
          >
            {t('fields.building')}
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className='w-full flex items-center justify-center'>
          <span className='w-max text-nowrap text-sm font-normal'>
            {row.getValue('building') ? row.getValue('building') : symbols.inValid}
          </span>
        </div>
      ),
    },
    {
      accessorKey: columnsKey.zipcode,
      header: ({ column }) => {
        return (
          <Button
            className='w-full'
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === sort.asc)}
          >
            {t('fields.zipcode')}
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className='w-full flex items-center justify-center'>
          <span className='w-max text-nowrap text-sm font-normal'>
            {row.getValue('zipcode') ? row.getValue('zipcode') : symbols.inValid}
          </span>
        </div>
      ),
    },
    {
      id: columnsKey.actions,
      enableHiding: false,

      cell: ({ row }) => {
        const user = row.original;
        const handle = () => {
          if (user.id) {
            return navigator.clipboard.writeText(user.id);
          }
        };

        const handleDelete = () => {
          if (user.id) {
            dispatch(
              deleteUserAsync({
                data: {
                  value: { userId: user.id },
                  setToastSuccess: (status?: number) => {
                    showSuccessToast(tMessage(`toast.${status?.toString()}`));
                  },
                  setToastError: (status?: number) => {
                    showErrorToast(
                      tMessage(`toast.${status?.toString()}`) || tMessage('toast.error')
                    );
                  },
                },
              })
            );
          }
        };

        return (
          <div className='w-max' onClick={(e) => e.stopPropagation()}>
            <ActionButton
              currentRole={currentAccount?.user.role ?? ValidRolesEnum.USER}
              dropdownClassName='absolute right-[-36px]'
              variant='ghost'
              actionVariant='horizontal'
              options={[
                {
                  content: t('actions.copyId'),
                  icon: <Copy className='h-4 w-4' />,
                  onSelect: handle,
                  roles: [ValidRolesEnum.ADMIN, ValidRolesEnum.EDITOR],
                },
                {
                  content: t('actions.edit'),
                  icon: <SquarePen className='h-4 w-4' />,
                  dialog: {
                    title: t('actions.dialogs.edit.title'),
                    content: <UserForm userId={user.id} variant='edit' data={user} />,
                  },
                  roles: [ValidRolesEnum.ADMIN, ValidRolesEnum.EDITOR],
                },
                {
                  content: t('actions.detail'),
                  icon: <Eye className='h-4 w-4' />,
                  onSelect: () => routes.push(`${config.routes.private.users}/${user.id}`),
                  roles: [ValidRolesEnum.ADMIN, ValidRolesEnum.EDITOR],
                },
                {
                  content: t('actions.delete'),
                  icon: <Trash className='h-4 w-4 text-red-500 hover:text-red-600' />,
                  className: 'text-red-500 hover:!text-red-600',
                  dialog: {
                    content: (
                      <DeleteConfirmation
                        title={t('actions.dialogs.delete.title')}
                        onDelete={handleDelete}
                        itemName={user.name}
                      />
                    ),
                  },
                  roles: [ValidRolesEnum.ADMIN, ValidRolesEnum.EDITOR],
                },
              ]}
            />
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    dispatch(
      getListUsersAsync({
        data: {
          value: {
            page: query.page,
            limit: query.limit,
          },
          setToastSuccess: (status) => {
            if (isMounted) {
              showSuccessToast(tMessage(`toast.${status}`));
              setIsLoading(false);
            }
          },
          setToastError: (status) => {
            showErrorToast(tMessage(`toast.${status}`) || tMessage('toast.error'));
            setIsLoading(false);
          },
        },
      })
    );

    return () => {
      isMounted = false;
    };
  }, [dispatch, tMessage]);

  useEffect(() => {
    if (getUsers?.data) {
      setData(getUsers?.data);
      setTotalPages(getUsers?.totalPages);
      setIsLoading(false);
    }
  }, [getUsers]);

  const handleGetUsers = (payload: { page?: number; limit?: number; textSearch?: string }) => {
    const { page, limit, textSearch } = payload;
    setIsLoading(true);
    dispatch(
      getListUsersAsync({
        data: {
          value: {
            page: page || query.page,
            limit: limit || query.limit,
            textSearch,
          },
          setToastSuccess: () => {
            setIsLoading(false);
          },
          setToastError: (status) => {
            showErrorToast(tMessage(`toast.${status}`) || tMessage('toast.error'));
            setIsLoading(false);
          },
        },
      })
    );
  };

  const handleSearch = (value: string) => {
    setKeySearch(value);
    setCurrentPage(query.page);
    handleGetUsers({ page: query.page, textSearch: value });
  };

  const handlePageChange = (page: number) => {
    if (keySearch.trim() !== '') {
      handleGetUsers({ page, textSearch: keySearch });
    } else {
      handleGetUsers({ page });
    }
  };

  return (
    <div className='container  space-y-4'>
      <div className='flex justify-between items-center'>
        <BaseTitle title={t('titleListUser')} />
      </div>

      <UseTable
        onChange={handleSearch}
        columns={columns}
        data={data}
        isLoading={isLoading}
        onRowClick={(row) => {
          const user = row.original;
          if (
            user.id &&
            [ValidRolesEnum.ADMIN, ValidRolesEnum.EDITOR].includes(
              currentAccount?.user.role ?? ValidRolesEnum.USER
            )
          ) {
            routes.push(`${config.routes.private.users}/${user.id}`);
          }
        }}
        moreFeatures={<CreateUserDialog />}
      />
      {totalPages > 1 && (
        <BasePagination
          pages={totalPages}
          changeData={handlePageChange}
          currentPage={currentPage}
        />
      )}
    </div>
  );
}
