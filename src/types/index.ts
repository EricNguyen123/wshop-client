import { ReactNode } from 'react';

// interfaces
export interface IProps {
  children: ReactNode;
  params: { locale: string };
}

export interface ITooltipProps {
  children: ReactNode;
  nameTooltip?: string;
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
