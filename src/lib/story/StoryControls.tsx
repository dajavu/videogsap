import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { useStoryControls } from './useStoryControls';

interface StoryControlsProps {
  onNext?: () => void;
  onPrev?: () => void;
  renderButton?: (args: { label: string; disabled: boolean; onClick: () => void; direction: 'prev' | 'next' }) => ReactNode;
  className?: string;
}

const defaultButton = (
  { label, disabled, onClick }: { label: string; disabled: boolean; onClick: ButtonHTMLAttributes<HTMLButtonElement>['onClick'] },
) => (
  <button type="button" onClick={onClick} disabled={disabled}>
    {label}
  </button>
);

export const StoryControls = ({ onNext, onPrev, renderButton = defaultButton, className }: StoryControlsProps) => {
  const { currentStepIndex, totalSteps, next, prev, currentStep } = useStoryControls();

  const handlePrev = () => {
    prev();
    onPrev?.();
  };

  const handleNext = () => {
    next();
    onNext?.();
  };

  return (
    <div className={className} data-story-controls>
      {renderButton({ label: '上一步', disabled: currentStepIndex === 0, onClick: handlePrev, direction: 'prev' })}
      <div className="story-controls__status">
        <span className="story-controls__step">步骤 {currentStepIndex + 1} / {totalSteps}</span>
        {currentStep?.title && <span className="story-controls__title">{currentStep.title}</span>}
      </div>
      {renderButton({ label: '下一步', disabled: currentStepIndex >= totalSteps - 1, onClick: handleNext, direction: 'next' })}
    </div>
  );
};

