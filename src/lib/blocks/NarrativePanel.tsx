import type { PropsWithChildren } from 'react';
import { StoryElement } from '../story/StoryElement';

interface NarrativePanelProps extends PropsWithChildren {
  id: string;
  title?: string;
  className?: string;
}

export const NarrativePanel = ({ id, title, className, children }: NarrativePanelProps) => {
  return (
    <StoryElement id={id} className={`narrative-panel ${className ?? ''}`.trim()}>
      {title && <h3 className="narrative-panel__title">{title}</h3>}
      <div className="narrative-panel__body">{children}</div>
    </StoryElement>
  );
};

