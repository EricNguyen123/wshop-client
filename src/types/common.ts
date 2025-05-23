/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusEnum, ValidRolesEnum } from '@/common/enum';
import { IBaseGetListResponse, IBaseResponse, TStatusSlice } from '.';
import { DropzoneOptions } from 'react-dropzone';

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
  avatarUrl?: string;
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
  [key: string]: string | number | undefined;
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

export interface IUploadAvatarResponse extends IBaseResponse {
  data: IUploadAvatarRes;
}

export interface IUploadAvatarReq {
  value: {
    file: File;
    userId: string;
  };
  setToastSuccess: (status?: number) => void;
  setToastError: (status?: number) => void;
}

export interface IUploadAvatarRes {
  id: string;
  avatarUrl: string;
  userId: string;
}

export interface IBannerState {
  detail: IBannerRes | undefined;
  banners: IGetListBannersRes | undefined;
  status: TStatusSlice;
}

export interface IBannerRes {
  id?: string;
  descriptions?: string;
  url?: string;
  startDate?: string;
  endDate?: string;
  numberOrder?: number;
}

export interface IGetListBannersRes extends IBaseGetListResponse {
  data: IBannerRes[];
}

export interface IGetListBannersResponse extends IBaseResponse {
  data: IGetListBannersRes;
}

export interface IGetListBannersParams extends IGetListReq {
  startDate?: string;
  endDate?: string;
}

export interface IGetListBannersReq {
  value: IGetListBannersParams;
  setToastSuccess: (status?: number) => void;
  setToastError: (status?: number) => void;
}

export interface ICreateBannerResponse extends IBaseResponse {
  data: IBannerRes;
}

export interface IUpdateBannerResponse extends IBaseResponse {
  data: IBannerRes;
}

export interface IUploadBannerReq {
  value: {
    file: File;
    descriptions: string;
    startDate: string;
    endDate: string;
    numberOrder: number;
  };
  setToastSuccess: (status?: number) => void;
  setToastError: (status?: number) => void;
}

export interface IUpdateBanner {
  descriptions?: string;
  startDate?: string;
  endDate?: string;
  numberOrder?: number;
}

export interface IUpdateBannerReq {
  value: {
    descriptions?: string;
    startDate?: string;
    endDate?: string;
    numberOrder?: number;
  };
  setToastSuccess: (status?: number) => void;
  setToastError: (status?: number) => void;
}

export interface IDeleteBannerReq {
  value: {
    bannerId: string;
  };
  setToastSuccess: (status?: number) => void;
  setToastError: (status?: number) => void;
}

export interface IGetDetailBannerResponse extends IBaseResponse {
  data: IBannerRes;
}

export interface IGetDetailBannerReq {
  value: {
    bannerId: string;
  };
  setToastSuccess: (status?: number) => void;
  setToastError: (status?: number) => void;
}

export interface IProductState {
  detail: IProductRes | undefined;
  products: IGetListProductsRes | undefined;
  status: TStatusSlice;
}

export interface IGetListProductsResponse extends IBaseResponse {
  data: IGetListProductsRes;
}

export interface IGetListProductsRes extends IBaseGetListResponse {
  data: IProductRes[];
}

export interface IProductRes extends IProduct {
  medias?: IMedia[];
}

export interface IProduct {
  id?: string;
  name?: string;
  code?: string;
  price?: number;
  quantity?: number;
  quantityAlert?: number;
  orderUnit?: number;
  description?: string;
  status?: number;
  multiplicationRate?: number;
  discount?: number;
}

export interface IMedia {
  id?: string;
  mediaUrl?: string;
  fileName?: string;
  fileSize?: number;
}

export interface ICreateProductResponse extends IBaseResponse {
  data: {
    product: IProduct;
    medias: IMedia[];
  };
}

export interface IGetListProductsReq {
  value: IGetListReq;
  setToastSuccess: (status?: number) => void;
  setToastError: (status?: number) => void;
}

export interface ICreateProductReq {
  value: {
    files: File[];
    name?: string;
    code?: string;
    price?: number;
    quantity?: number;
    quantityAlert?: number;
    orderUnit?: number;
    description?: string;
    status?: number;
    multiplicationRate?: number;
    discount?: number;
  };
  setToastSuccess: (status?: number) => void;
  setToastError: (status?: number) => void;
}

export interface IUpdateProductResponse extends IBaseResponse {
  data: IProductRes;
}

export interface IUpdateProduct {
  name?: string;
  code?: string;
  price?: number;
  quantity?: number;
  quantityAlert?: number;
  orderUnit?: number;
  description?: string;
  status?: number;
  multiplicationRate?: number;
  discount?: number;
  mediaIds?: string[];
  files?: File[];
}

export interface IUpdateProductReq {
  value: IUpdateProduct;
  setToastSuccess: (status?: number) => void;
  setToastError: (status?: number) => void;
}

export interface IDeleteProductReq {
  value: {
    productId: string;
  };
  setToastSuccess: (status?: number) => void;
  setToastError: (status?: number) => void;
}

export interface IGetDetailProductResponse extends IBaseResponse {
  data: IProductRes;
}

export interface IGetDetailProductReq {
  value: {
    productId: string;
  };
  setToastSuccess: (status?: number) => void;
  setToastError: (status?: number) => void;
}
//#endregion interfaces

//#region types

//#endregion types

//#region files
export interface FileWithPreview {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  slice?: (start?: number, end?: number, contentType?: string) => Blob;
  stream?: () => ReadableStream;
  text?: () => Promise<string>;
  arrayBuffer?: () => Promise<ArrayBuffer>;
  preview?: string;
  progress?: number;
  id: string;
  error?: string;
}

export interface FileUploadProps {
  value?: FileWithPreview[];
  onChange?: (files: FileWithPreview[]) => void;
  onRemove?: (file: FileWithPreview) => void;
  disabled?: boolean;
  maxFiles?: number;
  maxSize?: number;
  accept?: Record<string, string[]>;
  className?: string;
  showPreview?: boolean;
  simulateProgress?: boolean;
  dropzoneOptions?: Partial<DropzoneOptions>;
  previewType?: 'grid' | 'list';
  showFileInfo?: boolean;
  allowReplacement?: boolean;
  uploadText?: string;
  uploadSubText?: string;
  uploadNoteText?: string;
}

export interface FilePreviewProps {
  file: FileWithPreview;
  onRemove: () => void;
  showFileInfo?: boolean;
}

export interface FileListProps {
  files: FileWithPreview[];
  onRemove: (file: FileWithPreview) => void;
  type?: 'grid' | 'list';
  showFileInfo?: boolean;
}

export interface RejectedListProps {
  rejected: any[];
  onRemove: (index: number) => void;
}
//#endregion files

//#region avatar
export interface AvatarUploadProps {
  value?: string | null;
  /**
   * Callback when avatar changes
   * @param url The new avatar URL (blob URL) or null if removed
   * @param file The new avatar file or null if removed
   */
  onChange?: (url: string | null, file: File | null) => void;
  className?: string;
  /**
   * Size of the avatar
   * @default "lg"
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /**
   * Whether the avatar upload is disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * Maximum file size in bytes
   * @default 5242880 (5MB)
   */
  maxSize?: number;
  /**
   * Aspect ratio for cropping
   * @default 1 (square)
   */
  aspectRatio?: number;
  /**
   * Whether to show the remove button
   * @default true
   */
  showRemoveButton?: boolean;
  placeholder?: string;
  /**
   * Alt text for the avatar
   * @default "Avatar"
   */
  alt?: string;
  onError?: (error: string) => void;
}

export interface AvatarPreviewProps {
  src: string | null;
  placeholder?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  isHovering?: boolean;
}

export interface AvatarDropzoneProps {
  onFileSelected: (file: File) => void;
  maxSize?: number;
  className?: string;
}

export interface AvatarCropProps {
  file: File;
  onCrop: (blob: Blob) => void;
  aspectRatio?: number;
}

//#endregion avatar
