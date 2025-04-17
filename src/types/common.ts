/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusEnum, ValidRolesEnum } from '@/common/enum';
import { IBaseResponse, TStatusSlice } from '.';

//#region interfaces

export interface IAuthState {
  value: ILogin | ILoginRes | undefined;
  status: TStatusSlice;
  authenticated?: boolean;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface ILoginReq {
  value: ILogin;
  setToastSuccess: (status?: number) => void;
  setToastError: (status?: number) => void;
}

export interface ILoginRes {
  user: IUserRes;
  token: string;
}

export interface ILoginResponse extends IBaseResponse {
  data: ILoginRes;
}

export interface IUserRes {
  id?: string;
  name?: string;
  email?: string;
  role?: ValidRolesEnum;
  status?: StatusEnum;
  zipcode?: string;
  phone?: string;
  prefecture?: string;
  city?: string;
  street?: string;
  building?: string;
  currentSignInAt?: Date;
  lastSignInAt?: Date;
}
//#endregion interfaces

//#region types

//#endregion types
