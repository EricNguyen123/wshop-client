/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  IAuthState,
  IForgotPasswordResponse,
  ILoginResponse,
  IRegisterResponse,
  IVerifyEmailResponse,
  IVerifyOtpResponse,
} from '@/types/common';
import { TStatusSlice } from '@/types';
import { RootState } from '@/lib/store/store';

const initialState: IAuthState = {
  currentAccount: undefined,
  value: undefined,
  status: 'idle',
  authenticated: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<ILoginResponse>) => {
      state.currentAccount = action.payload.data;
      state.status = 'idle';
      state.authenticated = true;
    },
    setStatus: (state, action: PayloadAction<TStatusSlice>) => {
      state.status = action.payload;
    },

    registerSuccess: (state, action: PayloadAction<IRegisterResponse>) => {
      state.value = action.payload.data;
      state.status = 'idle';
    },

    logoutSuccess: (state) => {
      state.value = undefined;
      state.status = 'idle';
      state.authenticated = false;
    },

    verifyEmailSuccess: (state, action: PayloadAction<IVerifyEmailResponse>) => {
      state.value = action.payload.data;
      state.status = 'idle';
    },

    verifyOtpSuccess: (state, action: PayloadAction<IVerifyOtpResponse>) => {
      state.value = action.payload.data;
      state.status = 'idle';
    },

    forgotPasswordSuccess: (state, action: PayloadAction<IForgotPasswordResponse>) => {
      state.value = action.payload.data;
      state.status = 'idle';
    },
  },
});

export const {
  loginSuccess,
  setStatus,
  registerSuccess,
  logoutSuccess,
  verifyEmailSuccess,
  verifyOtpSuccess,
  forgotPasswordSuccess,
} = authSlice.actions;

export const selectValue = (state: RootState) => state.auth.value;
export const selectStatus = (state: RootState) => state.auth.status;
export const selectAuthenticated = (state: RootState) => state.auth.authenticated;
export const selectCurrentAccount = (state: RootState) => state.auth.currentAccount;

export default authSlice.reducer;
