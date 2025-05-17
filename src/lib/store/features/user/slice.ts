/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  IChangePasswordResponse,
  ICreateUserResponse,
  IDeleteResponse,
  IGetDetailUserResponse,
  IGetListUsersResponse,
  IUpdateUserResponse,
  IUploadAvatarResponse,
  IUserState,
} from '@/types/common';
import { TStatusSlice } from '@/types';
import { RootState } from '@/lib/store/store';
import { query } from '@/constant/common';

const initialState: IUserState = {
  account: undefined,
  users: undefined,
  status: 'idle',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    changePasswordSuccess: (state, action: PayloadAction<IChangePasswordResponse>) => {
      state.account = action.payload.data;
      state.status = 'idle';
    },

    getDetailUserSuccess: (state, action: PayloadAction<IGetDetailUserResponse>) => {
      state.account = action.payload.data;
      state.status = 'idle';
    },

    updateUserSuccess: (state, action: PayloadAction<IUpdateUserResponse>) => {
      state.account =
        state.account?.id === action.payload.data.id ? action.payload.data : state.account;
      state.users = {
        ...state.users,
        data: (state.users?.data ?? []).map((item) => {
          if (item.id === action.payload.data.id) {
            return action.payload.data;
          }
          return item;
        }),
        total: state.users?.total ?? query.total,
        page: state.users?.page ?? query.page,
        limit: state.users?.limit ?? query.limit,
        totalPages: state.users?.totalPages ?? query.totalPages,
      };
      state.status = 'idle';
    },

    createUserSuccess: (state, action: PayloadAction<ICreateUserResponse>) => {
      const newUser = action.payload.data;
      const currentData = state.users?.data ?? [];
      const currentTotal = state.users?.total ?? query.total;
      const currentLimit = state.users?.limit ?? query.limit;

      const updatedTotal = currentTotal + 1;
      const updatedTotalPages = Math.ceil(updatedTotal / currentLimit);

      state.users = {
        ...state.users,
        data: [newUser, ...currentData],
        total: updatedTotal,
        page: state.users?.page ?? query.page,
        limit: currentLimit,
        totalPages: updatedTotalPages,
      };
      state.status = 'idle';
    },

    deleteUserSuccess: (state, action: PayloadAction<IDeleteResponse>) => {
      const currentTotal = state.users?.total ?? query.total;
      const currentLimit = state.users?.limit ?? query.limit;

      const updatedTotal = currentTotal - 1;
      const updatedTotalPages = Math.ceil(updatedTotal / currentLimit);

      state.users = {
        ...state.users,
        data: (state.users?.data ?? []).filter((item) => item.id !== action.payload.id),
        total: updatedTotal,
        page: state.users?.page ?? query.page,
        limit: currentLimit,
        totalPages: updatedTotalPages,
      };
      state.status = 'idle';
    },

    getListUsersSuccess: (state, action: PayloadAction<IGetListUsersResponse>) => {
      state.users = action.payload.data;
      state.status = 'idle';
    },

    uploadAvatarSuccess: (state, action: PayloadAction<IUploadAvatarResponse>) => {
      state.account =
        state.account?.id === action.payload.data.userId
          ? {
              ...state.account,
              avatarUrl: action.payload.data.avatarUrl,
            }
          : state.account;
      state.status = 'idle';
    },

    deleteAvatarSuccess: (state) => {
      state.account = {
        ...state.account,
        avatarUrl: undefined,
      };
      state.status = 'idle';
    },

    setStatus: (state, action: PayloadAction<TStatusSlice>) => {
      state.status = action.payload;
    },
  },
});

export const {
  changePasswordSuccess,
  setStatus,
  getDetailUserSuccess,
  updateUserSuccess,
  getListUsersSuccess,
  createUserSuccess,
  deleteUserSuccess,
  uploadAvatarSuccess,
  deleteAvatarSuccess,
} = userSlice.actions;

export const selectAccount = (state: RootState) => state.user.account;
export const selectStatus = (state: RootState) => state.user.status;
export const selectUsers = (state: RootState) => state.user.users;

export default userSlice.reducer;
