/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusEnum, ValidRolesEnum } from '@/common/enum';
import { IBaseGetListResponse, IBaseResponse, TStatusSlice } from '.';

//#region interfaces

export interface IAuthState {
  currentAccount: ILoginRes | undefined;
  value: ILoginRes | IUserRes | IVerifyOtpRes | IVerifyEmailRes | undefined;
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

export interface IRegister {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}

export interface IRegisterReq {
  value: IRegister;
  setToastSuccess: (status?: number) => void;
  setToastError: (status?: number) => void;
}

export interface IRegisterResponse extends IBaseResponse {
  data: IUserRes;
}

export interface IGetGoogleReq {
  setToastError: (status?: number) => void;
}

export interface ICallbackLoginGoogle {
  email: string;
}

export interface ICallbackLoginGoogleReq {
  value: ICallbackLoginGoogle;
  setToastSuccess: (status?: number) => void;
  setToastError: (status?: number) => void;
}

export interface ILogout {
  token: string;
}

export interface ILogoutReq {
  setToastSuccess: (status?: number) => void;
  setToastError: (status?: number) => void;
}

export interface IVerifyEmail {
  email: string;
}

export interface IVerifyOtp {
  email: string | undefined;
  otp: string;
}

export interface IForgotPassword {
  password: string;
  confirmPassword: string;
}

export interface IVerifyEmailRes {
  timeOut: number | undefined;
  timeLine: number | undefined;
  email: string;
}

export interface IVerifyOtpRes {
  userId: string;
}

export interface IVerifyEmailResponse extends IBaseResponse {
  data: IVerifyEmailRes;
}

export interface IVerifyOtpResponse extends IBaseResponse {
  data: IVerifyOtpRes;
}

export interface IForgotPasswordResponse extends IBaseResponse {
  data: IUserRes;
}

export interface IVerifyEmailReq {
  value: IVerifyEmail;
  setToastSuccess: (status?: number) => void;
  setToastError: (status?: number) => void;
}

export interface IVerifyOtpReq {
  value: IVerifyOtp;
  setToastSuccess: (status?: number) => void;
  setToastError: (status?: number) => void;
}

export interface IForgotPasswordReq {
  value: IForgotPassword;
  setToastSuccess: (status?: number) => void;
  setToastError: (status?: number) => void;
}

export interface IUserState {
  account: IUserRes | undefined;
  users: IGetListUsersRes | undefined;
  status: TStatusSlice;
}

export interface IGetListUsersRes extends IBaseGetListResponse {
  data: IUserRes[];
}
export interface IChangePassword {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IChangePasswordReq {
  value: IChangePassword;
  setToastSuccess: (status?: number) => void;
  setToastError: (status?: number) => void;
}

export interface IChangePasswordResponse extends IBaseResponse {
  data: IUserRes;
}

export interface IGetDetailUserResponse extends IBaseResponse {
  data: IUserRes;
}

export interface IGetListUsersResponse extends IBaseResponse {
  data: IGetListUsersRes;
}

export interface IUpdateUserResponse extends IBaseResponse {
  data: IUserRes;
}

export interface ICreateUserResponse extends IBaseResponse {
  data: IUserRes;
}

export interface IDeleteResponse {
  id: string;
}

export interface IGetListUsersReq {
  value: {
    page?: number;
    limit?: number;
    textSearch?: string;
  };
  setToastSuccess: (status?: number) => void;
  setToastError: (status?: number) => void;
}

export interface IGetListReq {
  page?: number;
  limit?: number;
  textSearch?: string;
}

export interface IGetDetailUserReq {
  value: {
    userId: string;
  };
  setToastSuccess: (status?: number) => void;
  setToastError: (status?: number) => void;
}

export interface IUpdateUserReq {
  value: IUpdateUser;
  setToastSuccess: (status?: number) => void;
  setToastError: (status?: number) => void;
}

export interface ICreateUserReq {
  value: ICreateUser;
  setToastSuccess: (status?: number) => void;
  setToastError: (status?: number) => void;
}

export interface IDeleteUserReq {
  value: {
    userId: string;
  };
  setToastSuccess: (status?: number) => void;
  setToastError: (status?: number) => void;
}

export interface IUpdateUser {
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

export interface ICreateUser {
  name: string;
  email: string;
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
