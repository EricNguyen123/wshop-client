'use client';

import React, { useEffect, useState } from 'react';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '../ui/input-otp';
import { REGEX_PATTERN } from '@/constant/regex-pattern';
import { DEFAULT_LENGTH_OTP } from '@/constant';
import { useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  verifyEmailAsync,
  verifyOtpAsync,
  verifyOtpRestoreAsync,
} from '@/lib/store/features/auth/thunk';
import { showErrorToast, showSuccessToast } from '../toast/custom-toast';
import { selectValue } from '@/lib/store/features/auth/slice';
import { Button } from '../ui/button';
import { formatTime } from '@/utils/common';
import { CircleCheck } from 'lucide-react';

interface OtpFormProps {
  onComplete?: () => void;
  isRestore?: boolean;
}

export default function OtpForm({ onComplete, isRestore }: OtpFormProps) {
  const [value, setValue] = useState('');
  const t = useTranslations('Form.OTP');
  const tMessage = useTranslations('Messages.error');
  const dispatch = useAppDispatch();
  const getValue = useAppSelector(selectValue);
  const email = getValue && 'email' in getValue ? getValue.email : undefined;
  const timeOut = getValue && 'timeOut' in getValue ? getValue.timeOut : undefined;
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [otpSuccess, setOtpSuccess] = useState<boolean>(false);

  useEffect(() => {
    const expirationTime = localStorage.getItem('otpExpirationTime');
    const currentTime = Math.floor(Date.now() / 1000);

    if (expirationTime) {
      const remainingTime = Number(expirationTime) - currentTime;
      if (remainingTime > 0) {
        setTimeLeft(remainingTime);
      } else {
        setTimeLeft(0);
      }
    } else if (timeOut) {
      const newExpirationTime = currentTime + timeOut;
      localStorage.setItem('otpExpirationTime', newExpirationTime.toString());
      setTimeLeft(timeOut);
    }
  }, [timeOut]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      localStorage.removeItem('otpExpirationTime');
    }
  }, [timeLeft]);

  const handleDispatch = (email: string) => {
    dispatch(
      verifyEmailAsync({
        data: {
          value: {
            email,
          },
          setToastSuccess: (status?: number) => {
            showSuccessToast(tMessage(`toast.${status}`));
          },
          setToastError: (status?: number) => {
            showErrorToast(tMessage(`toast.${status}`) || t('toast.error'));
          },
        },
      })
    );
  };

  useEffect(() => {
    if (value.length === DEFAULT_LENGTH_OTP && email) {
      const data = {
        data: {
          value: {
            email: email,
            otp: value,
          },
          setToastSuccess: (status?: number) => {
            setOtpSuccess(true);
            if (!isRestore && onComplete) {
              onComplete();
            }
            showSuccessToast(tMessage(`toast.${status}`));
          },
          setToastError: (status?: number) => {
            showErrorToast(tMessage(`toast.${status}`) || t('toast.error'));
          },
        },
      };
      if (isRestore) {
        dispatch(verifyOtpRestoreAsync(data));
      } else {
        dispatch(verifyOtpAsync(data));
      }
    }
  }, [value, onComplete, email, isRestore, t, dispatch, tMessage]);

  return (
    <div className='w-full flex flex-col items-center p-1.5 justify-center '>
      <div className='w-full flex flex-col items-center gap-2 text-center mb-6'>
        <h1 className='text-2xl font-bold'>{t('title.otp')}</h1>
      </div>
      {otpSuccess ? (
        <div className='w-full flex flex-col items-center gap-2 text-center mb-6'>
          <CircleCheck className='text-green-500 size-11' />
          <h1 className='text-2xl font-bold text-green-500'>{t('title.success')}</h1>
        </div>
      ) : (
        <>
          <InputOTP
            maxLength={DEFAULT_LENGTH_OTP}
            value={value}
            onChange={(value) => setValue(value)}
            pattern={REGEX_PATTERN.numericOnly.source}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <div className='w-full flex items-center justify-between mt-4'>
            <span className='text-rose-500'>
              {t('label.timeRemaining')}: {formatTime(timeLeft)}
            </span>
            {email && (
              <Button
                variant={'link'}
                onClick={() => {
                  setValue('');
                  handleDispatch(email);
                }}
                className='text-rose-500 cursor-pointer'
              >
                {t('label.resend')}
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
