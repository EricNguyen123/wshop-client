'use client';
import OtpForm from '../otp-form';
import EmailForm from '../email-form';
import BaseFlowEvent from '@/components/flow-event/base-flow-event';
import { useTranslations } from 'next-intl';
import config from '@/config';
import { useRouter } from '@/i18n/navigation';

export default function VerifyStoreFlow() {
  const t = useTranslations('Form.Flows');
  const router = useRouter();
  const resetSteps = [
    {
      id: 'email',
      label: t('label.email'),
      component: EmailForm,
    },
    {
      id: 'otp',
      label: t('label.verification'),
      component: <OtpForm isRestore={true} />,
    },
  ];

  const handleFlowComplete = () => {
    router.push(`${config.routes.public.login}`);
  };

  return (
    <div className='w-full h-full rounded-2xl lg:shadow-md'>
      <div className='h-full flex flex-col gap-4 md:p-auto lg:border lg:rounded-r-2xl overflow-hidden'>
        <div className='h-full overflow-auto scrollbar-hidden flex flex-1 items-start justify-center'>
          <div className='w-full max-w-md px-2 py-3.5 md:mx-auto md:py-5'>
            <BaseFlowEvent steps={resetSteps} initialStep='email' onComplete={handleFlowComplete} />
          </div>
        </div>
      </div>
    </div>
  );
}
