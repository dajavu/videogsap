import type { PropsWithChildren } from 'react';
import { StoryElement } from '../story/StoryElement';

export interface MetricItem {
  label: string;
  value: string;
  hint?: string;
}

interface MetricListProps extends PropsWithChildren {
  id: string;
  title?: string;
  items: MetricItem[];
  className?: string;
}

export const MetricList = ({ id, title, items, className, children }: MetricListProps) => {
  return (
    <StoryElement id={id} className={`metric-list ${className ?? ''}`.trim()}>
      {title && <h4 className="metric-list__title">{title}</h4>}
      <dl className="metric-list__items">
        {items.map((item) => (
          <div key={item.label} className="metric-list__item">
            <dt>{item.label}</dt>
            <dd>
              <span className="metric-list__value">{item.value}</span>
              {item.hint && <span className="metric-list__hint">{item.hint}</span>}
            </dd>
          </div>
        ))}
      </dl>
      {children}
    </StoryElement>
  );
};

