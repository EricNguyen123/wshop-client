/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from 'react';

// interfaces
export interface IProps {
  children: ReactNode;
  params: { locale: string };
}

export interface ITooltipProps {
  children: ReactNode;
  nameTooltip?: string;
  delayDuration?: number;
  disabled?: boolean;
}

export interface IBaseResponse {
  status: number;
  code: number;
  message: string;
  data?: any;
}

export interface IBaseGetListResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  data: any[];
}

// types
export type TLocale = 'en';

export type TProps = {
  children: ReactNode;
  params: { locale: string };
};

export type TLocaleProps = {
  children: ReactNode;
  defaultValue?: string;
  label: string;
  isPending?: boolean;
};

export type TStatusSlice = 'idle' | 'loading' | 'failed';
