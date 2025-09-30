import type { PropsWithChildren, HTMLAttributes } from 'react';

export type AnimationPreset =
  | 'fade-in-up'
  | 'fade-in-right'
  | 'fade-in'
  | 'scale-in'
  | 'highlight';

export type TimelineAction =
  | { type: 'animate-in'; target: string; preset?: AnimationPreset; vars?: Record<string, unknown> }
  | { type: 'animate-out'; target: string; preset?: AnimationPreset; vars?: Record<string, unknown> }
  | { type: 'animate-to'; target: string; preset?: AnimationPreset; vars?: Record<string, unknown> }
  | { type: 'set-text'; target: string; text: string }
  | { type: 'counter'; target: string; from?: number; to: number; duration?: number; prefix?: string; suffix?: string; precision?: number }
  | { type: 'wait'; duration: number }
  | { type: 'call'; handler: (ctx: StoryRuntimeContext) => void };

export interface StepDefinition {
  id: string;
  title?: string;
  description?: string;
  actions: TimelineAction[];
  autoAdvanceDelay?: number;
}

export interface StoryStageProps extends PropsWithChildren {
  steps: StepDefinition[];
  initialStep?: number;
  className?: string;
  autoAdvance?: boolean;
  autoAdvanceDelay?: number;
}

export interface StoryRuntimeContext {
  actionIndex: number;
  currentStep: StepDefinition;
  elements: Map<string, HTMLElement>;
}

export interface StoryContextValue {
  currentStepIndex: number;
  totalSteps: number;
  steps: StepDefinition[];
  goTo: (index: number) => void;
  next: () => void;
  prev: () => void;
  registerElement: (id: string, node: HTMLElement | null) => void;
}

export type StoryElementProps = PropsWithChildren<
  HTMLAttributes<HTMLElement> & {
    id: string;
    as?: keyof HTMLElementTagNameMap;
    hidden?: boolean;
  }
>;

