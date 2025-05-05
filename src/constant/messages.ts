import { objectToString } from '@/utils';
import { VALIDATION_CONFIG } from '.';
import { useTranslations } from 'next-intl';

export const MESSAGES = {
  ZOD: {
    AUTH: {
      REGISTER: {
        ID: { INVALID: 'auth.register.id.invalid' },
        NAME: { SHORT: 'auth.register.name.short' },
        EMAIL: { INVALID: 'auth.register.email.invalid' },
        PASSWORD: {
          SHORT: objectToString({
            key: 'auth.register.password.short',
            values: { length: VALIDATION_CONFIG.LENGTH_STRING },
          }),
          MIN_LENGTH_LOW_CASE: objectToString({
            key: 'auth.register.password.minLengthLowCase',
            values: { minLengthLowCase: VALIDATION_CONFIG.MIN_LENGTH_LOW_CASE },
          }),
          MIN_LENGTH_UP_CASE: objectToString({
            key: 'auth.register.password.minLengthUpCase',
            values: { minLengthUpCase: VALIDATION_CONFIG.MIN_LENGTH_UP_CASE },
          }),
          MIN_LENGTH_NUMBER: objectToString({
            key: 'auth.register.password.minLengthNumber',
            values: { minLengthNumber: VALIDATION_CONFIG.MIN_LENGTH_NUMBER },
          }),
          MIN_SYMBOL: objectToString({
            key: 'auth.register.password.minSymbol',
            values: { minSymbol: VALIDATION_CONFIG.MIN_SYMBOL },
          }),
        },
        CONFIRM_PASSWORD: { INVALID: 'auth.register.confirmPassword.invalid' },
      },
      LOGIN: {
        EMAIL: {
          REQUIRED: 'auth.login.email.required',
          INVALID: 'auth.login.email.invalid',
        },
        PASSWORD: {
          REQUIRED: 'auth.login.password.required',
        },
      },
    },
  },
};

export const DEFAULT_EMPTY_MESSAGE = ({ key }: { key: 'information' }) => {
  const t = useTranslations('Messages.empty');

  switch (key) {
    case 'information':
      return t('information');
  }
};
