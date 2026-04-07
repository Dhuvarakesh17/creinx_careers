"use client";

import {
  Children,
  Fragment,
  type HTMLAttributes,
  type ReactNode,
  useMemo,
  useState,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";

type StepperProps = {
  children: ReactNode;
  initialStep?: number;
  onStepChange?: (step: number) => void;
  onFinalStepCompleted?: () => void | Promise<void>;
  validateStep?: (step: number) => boolean;
  onValidationFail?: (step: number) => void;
  stepCircleContainerClassName?: string;
  stepContainerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  backButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  nextButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  backButtonText?: string;
  nextButtonText?: string;
  finalButtonText?: string;
  disableStepIndicators?: boolean;
  renderStepIndicator?: (params: {
    step: number;
    currentStep: number;
    onStepClick: (step: number) => void;
  }) => ReactNode;
  className?: string;
};

type StepProps = {
  children: ReactNode;
};

export default function Stepper({
  children,
  initialStep = 1,
  onStepChange = () => {},
  onFinalStepCompleted = () => {},
  validateStep,
  onValidationFail,
  stepCircleContainerClassName = "",
  stepContainerClassName = "",
  contentClassName = "",
  footerClassName = "",
  backButtonProps = {},
  nextButtonProps = {},
  backButtonText = "Back",
  nextButtonText = "Continue",
  finalButtonText = "Complete",
  disableStepIndicators = false,
  renderStepIndicator,
  className = "",
  ...rest
}: StepperProps & HTMLAttributes<HTMLDivElement>) {
  const stepsArray = useMemo(() => Children.toArray(children), [children]);
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [direction, setDirection] = useState(0);
  const { className: backButtonClassName, ...backButtonRest } = backButtonProps;
  const { className: nextButtonClassName, ...nextButtonRest } = nextButtonProps;
  const totalSteps = stepsArray.length;
  const isLastStep = currentStep === totalSteps;

  const updateStep = (nextStep: number) => {
    setCurrentStep(nextStep);
    onStepChange(nextStep);
  };

  const handleBack = () => {
    if (currentStep <= 1) {
      return;
    }

    setDirection(-1);
    updateStep(currentStep - 1);
  };

  const handleNext = () => {
    if (validateStep && !validateStep(currentStep)) {
      onValidationFail?.(currentStep);
      return;
    }

    if (isLastStep) {
      void onFinalStepCompleted();
      return;
    }

    setDirection(1);
    updateStep(currentStep + 1);
  };

  const stepContent = stepsArray[currentStep - 1] ?? null;

  return (
    <div className={`flex flex-col gap-5 ${className}`} {...rest}>
      <div
        className={`flex w-full flex-wrap items-center justify-center gap-3 ${stepCircleContainerClassName}`}
      >
        {stepsArray.map((_, index) => {
          const step = index + 1;
          const status =
            currentStep === step
              ? "active"
              : currentStep > step
                ? "complete"
                : "inactive";

          const indicator = renderStepIndicator ? (
            renderStepIndicator({
              step,
              currentStep,
              onStepClick: (clicked) => {
                if (
                  clicked > currentStep &&
                  validateStep &&
                  !validateStep(currentStep)
                ) {
                  onValidationFail?.(currentStep);
                  return;
                }

                setDirection(clicked > currentStep ? 1 : -1);
                updateStep(clicked);
              },
            })
          ) : (
            <button
              type="button"
              disabled={disableStepIndicators}
              onClick={() => {
                if (disableStepIndicators || step === currentStep) {
                  return;
                }

                if (
                  step > currentStep &&
                  validateStep &&
                  !validateStep(currentStep)
                ) {
                  onValidationFail?.(currentStep);
                  return;
                }

                setDirection(step > currentStep ? 1 : -1);
                updateStep(step);
              }}
              className={[
                "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition",
                status === "active"
                  ? "bg-[#2563EB] text-white shadow-[0_0_0_4px_rgba(37,99,235,0.14)]"
                  : status === "complete"
                    ? "bg-[#18365b] text-[#93C5FD]"
                    : "border border-[#1E3A5F] bg-[#0A1628] text-[#6B7FA3]",
                disableStepIndicators ? "cursor-default" : "cursor-pointer",
              ].join(" ")}
            >
              {status === "complete" ? <Check size={16} /> : step}
            </button>
          );

          return (
            <Fragment key={step}>
              {indicator}
              {index < totalSteps - 1 ? (
                <div className="h-px w-8 bg-[#1E3A5F] sm:w-12" />
              ) : null}
            </Fragment>
          );
        })}
      </div>

      <StepContentWrapper
        className={contentClassName}
        direction={direction}
        stepKey={currentStep}
      >
        {stepContent}
      </StepContentWrapper>

      <div
        className={`flex items-center justify-between gap-3 ${stepContainerClassName} ${footerClassName}`}
      >
        <button
          type="button"
          onClick={handleBack}
          disabled={currentStep === 1 || Boolean(backButtonRest.disabled)}
          className={[
            "rounded-full border border-[#1E3A5F] px-4 py-2 text-sm font-medium text-[#F0F4FF] transition hover:border-[#2563EB] hover:text-white disabled:cursor-not-allowed disabled:opacity-40",
            backButtonClassName ?? "",
          ].join(" ")}
          {...backButtonRest}
        >
          {backButtonText}
        </button>

        <button
          type="button"
          onClick={handleNext}
          className={[
            "rounded-full bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-60",
            nextButtonClassName ?? "",
          ].join(" ")}
          {...nextButtonRest}
        >
          {isLastStep ? finalButtonText : nextButtonText}
        </button>
      </div>
    </div>
  );
}

function StepContentWrapper({
  children,
  direction,
  stepKey,
  className = "",
}: {
  children: ReactNode;
  direction: number;
  stepKey: number;
  className?: string;
}) {
  return (
    <motion.div className={`relative overflow-visible ${className}`} layout>
      <AnimatePresence initial={false} mode="wait" custom={direction}>
        <motion.div
          key={stepKey}
          custom={direction}
          initial={{ x: direction >= 0 ? 40 : -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction >= 0 ? -30 : 30, opacity: 0 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="w-full"
          layout
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

export function Step({ children }: StepProps) {
  return <div className="space-y-4">{children}</div>;
}
