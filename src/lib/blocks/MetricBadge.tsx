import { StoryElement } from '../story/StoryElement';

interface MetricBadgeProps {
  id?: string;
  valueId: string;
  label: string;
  value?: string;
  helper?: string;
  className?: string;
}

export const MetricBadge = ({ id, valueId, label, value = '--', helper, className }: MetricBadgeProps) => {
  return (
    <StoryElement id={id ?? `${valueId}-container`} className={`metric-badge ${className ?? ''}`.trim()}>
      <span className="metric-badge__label">{label}</span>
      <StoryElement id={valueId} as="span" className="metric-badge__value">
        {value}
      </StoryElement>
      {helper && <span className="metric-badge__helper">{helper}</span>}
    </StoryElement>
  );
};

