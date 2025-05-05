'use client';

import React, { useState, type ReactElement } from 'react';
import { CheckIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface CompletableProps {
  onComplete: () => void;
}

interface FlowStep {
  id: string;
  label: string;
  component: React.ComponentType<CompletableProps> | ReactElement;
}

interface BaseFlowEventProps {
  steps: FlowStep[];
  initialStep?: string;
  onComplete?: () => void;
}

export default function BaseFlowEvent({ steps, initialStep, onComplete }: BaseFlowEventProps) {
  const t = useTranslations('Form.Flows');
  const initialStepIndex = initialStep ? steps.findIndex((step) => step.id === initialStep) : 0;

  const [currentStepIndex, setCurrentStepIndex] = useState(
    initialStepIndex >= 0 ? initialStepIndex : 0
  );

  const currentStep = steps[currentStepIndex];

  const handleStepComplete = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      onComplete?.();
    }
  };

  if (!steps.length || !currentStep) {
    return null;
  }

  const StepComponent = currentStep.component;

  return (
    <div className='w-full'>
      <div className='px-4 pt-6'>
        <div className='relative flex items-center justify-between mb-8'>
          {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <div key={step.id} className='flex flex-col items-center relative z-10'>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    isCompleted
                      ? 'bg-rose-500'
                      : isCurrent
                      ? 'border-2 border-rose-500 bg-popover'
                      : 'border-2 border-gray-200 bg-popover'
                  }`}
                >
                  {isCompleted ? (
                    <CheckIcon className='h-5 w-5 text-white' />
                  ) : (
                    <span
                      className={`text-sm font-medium ${
                        isCurrent ? 'text-rose-500' : 'text-gray-400'
                      }`}
                    >
                      {index + 1}
                    </span>
                  )}
                </div>

                <span
                  className={`mt-2 text-xs font-medium ${
                    !isCurrent && !isCompleted ? 'text-gray-400' : 'text-gray-900'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}

          <div className='absolute top-4 left-0 right-0 h-0.5 -z-10'>
            {steps.map((_, index) => {
              if (index === steps.length - 1) return null;

              const width = `${100 / (steps.length - 1)}%`;
              const left = `${(index * 100) / (steps.length - 1)}%`;
              const isCompleted = index < currentStepIndex;

              return (
                <div
                  key={`connector-${index}`}
                  className={`absolute h-0.5 ${isCompleted ? 'bg-rose-500' : 'bg-gray-200'}`}
                  style={{
                    left,
                    width,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className='mt-4'>
        {React.isValidElement(StepComponent) ? (
          <div>
            {StepComponent}
            <button
              onClick={handleStepComplete}
              className='mt-4 w-full bg-rose-500 text-white py-2 rounded-md hover:bg-rose-700 transition'
            >
              {t('button.continue')}
            </button>
          </div>
        ) : (
          <StepComponent onComplete={handleStepComplete} />
        )}
      </div>
    </div>
  );
}
