import type { ReactNode } from 'react';
import { FloatingElement } from './FloatingElement';

interface SceneBubbleProps {
  id: string;
  position: { x: number; y: number };
  tone?: 'primary' | 'success' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const toneClass: Record<NonNullable<SceneBubbleProps['tone']>, string> = {
  primary: 'scene-bubble--primary',
  success: 'scene-bubble--success',
  neutral: 'scene-bubble--neutral',
};

const sizeClass: Record<NonNullable<SceneBubbleProps['size']>, string> = {
  sm: 'scene-bubble--sm',
  md: 'scene-bubble--md',
  lg: 'scene-bubble--lg',
};

export const SceneBubble = ({ id, position, tone = 'neutral', size = 'md', children }: SceneBubbleProps) => (
  <FloatingElement id={id} position={position} className={`scene-bubble ${toneClass[tone]} ${sizeClass[size]}`}>
    {children}
  </FloatingElement>
);

