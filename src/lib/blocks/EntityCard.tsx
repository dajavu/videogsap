import type { PropsWithChildren, ReactNode } from 'react';
import { StoryElement } from '../story/StoryElement';

interface EntityCardProps extends PropsWithChildren {
  id: string;
  name: string;
  description?: string;
  accent?: ReactNode;
  className?: string;
}

export const EntityCard = ({ id, name, description, accent, className, children }: EntityCardProps) => {
  return (
    <StoryElement id={id} className={`entity-card ${className ?? ''}`.trim()}>
      <div className="entity-card__header">
        <h3 className="entity-card__title">{name}</h3>
        {accent && <div className="entity-card__accent">{accent}</div>}
      </div>
      {description && <p className="entity-card__description">{description}</p>}
      {children}
    </StoryElement>
  );
};

