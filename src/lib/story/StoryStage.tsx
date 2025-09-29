import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import type { StoryContextValue, StoryStageProps, StoryRuntimeContext, TimelineAction } from './types';
import { applyAction } from './actions';

const StoryContext = createContext<StoryContextValue | null>(null);

export const useStoryContext = (): StoryContextValue => {
  const ctx = useContext(StoryContext);
  if (!ctx) {
    throw new Error('useStoryContext must be used within a <StoryStage>');
  }
  return ctx;
};

const clampIndex = (index: number, total: number) => {
  if (index < 0) return 0;
  if (index >= total) return total - 1;
  return index;
};

export const StoryStage = ({ steps, initialStep = 0, className, children, autoAdvance = false, autoAdvanceDelay }: StoryStageProps) => {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(() => clampIndex(initialStep, steps.length));
  const elementRegistry = useRef(new Map<string, HTMLElement>());
  const advanceTimeoutRef = useRef<number | null>(null);

  const clearAdvanceTimeout = useCallback(() => {
    if (advanceTimeoutRef.current !== null) {
      window.clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }
  }, []);

  const registerElement = useCallback((id: string, node: HTMLElement | null) => {
    const registry = elementRegistry.current;
    if (node) {
      registry.set(id, node);
    } else {
      registry.delete(id);
    }
  }, []);

  const goTo = useCallback(
    (index: number) => {
      setCurrentStepIndex((prev) => {
        if (index === prev) {
          return prev;
        }
        return clampIndex(index, steps.length);
      });
    },
    [steps.length],
  );

  const next = useCallback(() => {
    setCurrentStepIndex((prev) => clampIndex(prev + 1, steps.length));
  }, [steps.length]);

  const prev = useCallback(() => {
    setCurrentStepIndex((prev) => clampIndex(prev - 1, steps.length));
  }, [steps.length]);

  const value = useMemo<StoryContextValue>(() => {
    return {
      currentStepIndex,
      totalSteps: steps.length,
      steps,
      goTo,
      next,
      prev,
      registerElement,
    };
  }, [currentStepIndex, steps, goTo, next, prev, registerElement]);


  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage || steps.length === 0) return;

    const ctx = gsap.context(() => {
      clearAdvanceTimeout();
      const timeline = gsap.timeline({ defaults: { ease: 'power2.out' } });
      const runtime: StoryRuntimeContext = {
        actionIndex: 0,
        currentStep: steps[currentStepIndex],
        elements: elementRegistry.current,
      };

      const runStep = (step: StoryRuntimeContext['currentStep'], mode: 'animated' | 'instant') => {
        runtime.currentStep = step;
        step.actions.forEach((action: TimelineAction, index) => {
          runtime.actionIndex = index;
          applyAction({ action, runtime, timeline, mode });
        });
      };

      for (let i = 0; i < currentStepIndex; i += 1) {
        runStep(steps[i], 'instant');
      }

      runStep(steps[currentStepIndex], 'animated');

      timeline.eventCallback('onComplete', () => {
        if (!autoAdvance) return;
        if (currentStepIndex >= steps.length - 1) return;
        const delay = steps[currentStepIndex].autoAdvanceDelay ?? autoAdvanceDelay ?? 0;
        if (delay <= 0) {
          next();
        } else {
          advanceTimeoutRef.current = window.setTimeout(() => {
            next();
            advanceTimeoutRef.current = null;
          }, delay * 1000);
        }
      });
    }, stage);

    return () => {
      clearAdvanceTimeout();
      ctx.revert();
    };
  }, [autoAdvance, autoAdvanceDelay, clearAdvanceTimeout, currentStepIndex, next, steps]);

  return (
    <StoryContext.Provider value={value}>
      <div ref={stageRef} className={className} data-current-step={steps[currentStepIndex]?.id}>
        {children}
      </div>
    </StoryContext.Provider>
  );
};

