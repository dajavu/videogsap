import { useStoryContext } from './StoryStage';

export const useStoryControls = () => {
  const { currentStepIndex, totalSteps, steps, goTo, next, prev } = useStoryContext();
  return {
    currentStepIndex,
    totalSteps,
    currentStep: steps[currentStepIndex],
    goTo,
    next,
    prev,
  };
};

