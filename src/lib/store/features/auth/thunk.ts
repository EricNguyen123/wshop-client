/* eslint-disable @typescript-eslint/no-explicit-any */
import { ILoginReq } from '@/types/common';
import { login, loginFailed, loginSuccess } from './slice';
import { loginApi } from './api';
import { AppDispatch } from '@/lib/store/store';

export const loginAsync = (payload: { data: ILoginReq }) => async (dispatch: AppDispatch) => {
  const { data } = payload;
  dispatch(login(data.value));
  try {
    const response = await loginApi({ data: data.value });
    if (response.data.status === 200) {
      dispatch(loginSuccess(response.data));
      data.setToastSuccess(response.data.status);
    }
  } catch (error: any) {
    dispatch(loginFailed('failed'));
    if (error) {
      data.setToastError(error.status);
    }
  }
};
