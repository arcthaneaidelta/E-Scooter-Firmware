import React from 'react';
import { Check } from 'lucide-react';
import { WizardStepId } from '../../store/wizardStore';

interface Step {
  id: WizardStepId;
  label: string;
  sublabel?: string;
}

const STEPS: Step[] = [
  { id: 1, label: 'License' },
  { id: 2, label: 'Consent' },
  { id: 3, label: 'Identify' },
  { id: 4, label: 'Backup' },
  { id: 5, label: 'Configure & Write' },
  { id: 6, label: 'Verify' },
];

interface StepperProps {
  currentStep: WizardStepId;
  onStepClick?: (step: WizardStepId) => void;
}

export const Stepper: React.FC<StepperProps> = ({ currentStep, onStepClick }) => {
  return (
    <div className="w-full bg-surface border border-border rounded-[14px] p-3 sm:p-4">
      <div className="flex items-center justify-between">
        {STEPS.map((step, idx) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isClickable = Boolean(onStepClick && step.id < currentStep);

          return (
            <React.Fragment key={step.id}>
              <div
                onClick={() => isClickable && onStepClick?.(step.id)}
                className={`flex items-center gap-2.5 ${isClickable ? 'cursor-pointer group' : ''}`}
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-mono font-medium transition-all duration-200 shrink-0 ${
                    isCompleted
                      ? 'bg-success text-white'
                      : isCurrent
                      ? 'bg-primary text-white ring-4 ring-primary/15'
                      : 'bg-secondary text-text-muted border border-border'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : step.id}
                </div>
                <div className="hidden md:block text-left">
                  <div
                    className={`text-xs font-medium uppercase tracking-[0.06em] ${
                      isCurrent ? 'text-ink font-semibold' : isCompleted ? 'text-text-secondary' : 'text-text-muted'
                    }`}
                  >
                    {step.label}
                  </div>
                </div>
              </div>

              {idx < STEPS.length - 1 && (
                <div
                  className={`flex-1 mx-2 sm:mx-3 h-[2px] transition-colors duration-200 ${
                    currentStep > step.id ? 'bg-success' : 'bg-border'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
