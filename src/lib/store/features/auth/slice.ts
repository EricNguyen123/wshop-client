/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { IAuthState, ILogin, ILoginResponse } from '@/types/common';
import { TStatusSlice } from '@/types';
import { RootState } from '@/lib/store/store';

const initialState: IAuthState = {
  value: undefined,
  status: 'idle',
  authenticated: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<ILogin>) => {
      state.value = action.payload;
      state.status = 'loading';
    },
    loginSuccess: (state, action: PayloadAction<ILoginResponse>) => {
      state.value = action.payload.data;
      state.status = 'idle';
      state.authenticated = true;
    },
    loginFailed: (state, action: PayloadAction<TStatusSlice>) => {
      state.status = action.payload;
    },
  },
});

export const { login, loginSuccess, loginFailed } = authSlice.actions;

export const selectLogin = (state: RootState) => state.auth.value;
export const selectStatus = (state: RootState) => state.auth.status;
export const selectAuthenticated = (state: RootState) => state.auth.authenticated;

export default authSlice.reducer;
