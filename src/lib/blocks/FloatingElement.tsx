import { forwardRef } from 'react';
import type { CSSProperties } from 'react';
import { StoryElement } from '../story/StoryElement';
import type { StoryElementProps } from '../story/types';

interface FloatingElementProps extends Omit<StoryElementProps, 'as'> {
  position: { x: number; y: number };
  anchor?: 'center' | 'top-left';
  zIndex?: number;
  style?: CSSProperties;
}

export const FloatingElement = forwardRef<HTMLElement, FloatingElementProps>(function FloatingElement(
  { position, anchor = 'center', zIndex, style, className, ...rest },
  ref,
) {
  const baseStyle: CSSProperties =
    anchor === 'center'
      ? {
          left: `${position.x}%`,
          top: `${position.y}%`,
          transform: 'translate(-50%, -50%)',
        }
      : {
          left: `${position.x}%`,
          top: `${position.y}%`,
        };

  return (
    <StoryElement
      ref={ref}
      className={`floating-element ${className ?? ''}`.trim()}
      style={{ position: 'absolute', zIndex, ...baseStyle, ...style }}
      {...rest}
    />
  );
});

