import { gsap } from 'gsap';
import type { TimelineAction, StoryRuntimeContext, AnimationPreset } from './types';
import { animationPresets } from './presets';

type GsapTimeline = ReturnType<typeof gsap.timeline>;

interface ApplyActionArgs {
  action: TimelineAction;
  runtime: StoryRuntimeContext;
  timeline: GsapTimeline;
  mode: 'animated' | 'instant';
}

const resolvePreset = (preset?: AnimationPreset) => {
  if (!preset) return undefined;
  return animationPresets[preset];
};

export const applyAction = ({ action, runtime, timeline, mode }: ApplyActionArgs) => {
  switch (action.type) {
    case 'animate-in': {
      const target = runtime.elements.get(action.target);
      if (!target) return;
      const preset = resolvePreset(action.preset);
      const toVars = { autoAlpha: 1, ...preset?.to, ...action.vars };
      if (mode === 'instant') {
        gsap.set(target, toVars);
      } else {
        const fromVars = { autoAlpha: 0, ...preset?.from };
        timeline.fromTo(target, fromVars, toVars, '>-0.05');
      }
      break;
    }
    case 'animate-out': {
      const target = runtime.elements.get(action.target);
      if (!target) return;
      const preset = resolvePreset(action.preset);
      const toVars = { autoAlpha: 0, ...preset?.to, ...action.vars };
      if (mode === 'instant') {
        gsap.set(target, toVars);
      } else {
        timeline.to(target, toVars);
      }
      break;
    }
    case 'animate-to': {
      const target = runtime.elements.get(action.target);
      if (!target) return;
      const preset = resolvePreset(action.preset);
      const toVars = { ...preset?.to, ...action.vars };
      if (mode === 'instant') {
        gsap.set(target, toVars);
      } else {
        timeline.to(target, toVars, '>-0.05');
      }
      break;
    }
    case 'set-text': {
      const target = runtime.elements.get(action.target);
      if (!target) return;
      const updater = () => {
        target.textContent = action.text;
      };
      if (mode === 'instant') {
        updater();
      } else {
        timeline.add(updater);
      }
      break;
    }
    case 'counter': {
      const target = runtime.elements.get(action.target);
      if (!target) return;
      const { from = 0, to, duration = 1.2, prefix = '', suffix = '', precision = 0 } = action;
      const formatValue = (value: number) => `${prefix}${value.toFixed(precision)}${suffix}`;
      if (mode === 'instant') {
        target.textContent = formatValue(to);
      } else {
        const data = { value: from };
        timeline.to(data, {
          value: to,
          duration,
          ease: 'power1.out',
          onUpdate: () => {
            target.textContent = formatValue(data.value);
          },
        });
      }
      break;
    }
    case 'wait': {
      if (mode === 'animated') {
        timeline.to({}, { duration: action.duration });
      }
      break;
    }
    case 'call': {
      const runner = () => action.handler(runtime);
      if (mode === 'instant') {
        runner();
      } else {
        timeline.add(runner);
      }
      break;
    }
    default: {
      const exhaustiveCheck: never = action;
      return exhaustiveCheck;
    }
  }
};

