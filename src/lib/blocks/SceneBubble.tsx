import type { CSSProperties, ReactNode } from 'react';
import { FloatingElement } from './FloatingElement';

interface SceneBubbleProps {
  id: string;
  position: { x: number; y: number };
  tone?: 'primary' | 'success' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  anchor?: 'center' | 'top-left';
  zIndex?: number;
  style?: CSSProperties;
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

const joinClassNames = (...tokens: Array<string | false | null | undefined>) => tokens.filter(Boolean).join(' ');

export const SceneBubble = ({
  id,
  position,
  tone = 'neutral',
  size = 'md',
  className,
  anchor,
  zIndex,
  style,
  children,
}: SceneBubbleProps) => (
  <FloatingElement
    id={id}
    position={position}
    anchor={anchor}
    zIndex={zIndex}
    style={style}
    className={joinClassNames('scene-bubble', toneClass[tone], sizeClass[size], className)}
  >
    {children}
  </FloatingElement>
);

