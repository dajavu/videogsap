import type { AnimationPreset } from './types';

type PresetMap = Record<AnimationPreset, { from?: Record<string, unknown>; to?: Record<string, unknown> }>;

export const animationPresets: PresetMap = {
  'fade-in-up': {
    from: { y: 32, autoAlpha: 0 },
    to: { y: 0, autoAlpha: 1 },
  },
  'fade-in-right': {
    from: { x: -32, autoAlpha: 0 },
    to: { x: 0, autoAlpha: 1 },
  },
  'fade-in': {
    from: { autoAlpha: 0 },
    to: { autoAlpha: 1 },
  },
  'scale-in': {
    from: { scale: 0.86, autoAlpha: 0 },
    to: { scale: 1, autoAlpha: 1 },
  },
  highlight: {
    to: { backgroundColor: '#fff2c6' },
  },
};

