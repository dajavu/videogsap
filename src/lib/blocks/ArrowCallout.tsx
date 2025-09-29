import type { ReactNode } from 'react';
import { StoryElement } from '../story/StoryElement';

interface ArrowCalloutProps {
  id: string;
  label?: ReactNode;
  direction?: 'right' | 'left' | 'up' | 'down';
  className?: string;
}

const arrowSymbols: Record<Required<ArrowCalloutProps>['direction'], string> = {
  right: '→',
  left: '←',
  up: '↑',
  down: '↓',
};

export const ArrowCallout = ({ id, label, direction = 'right', className }: ArrowCalloutProps) => {
  return (
    <StoryElement id={id} className={`arrow-callout ${direction} ${className ?? ''}`.trim()}>
      <span className="arrow-callout__icon" aria-hidden>
        {arrowSymbols[direction]}
      </span>
      {label && <span className="arrow-callout__label">{label}</span>}
    </StoryElement>
  );
};

