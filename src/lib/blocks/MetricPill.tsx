import { FloatingElement } from './FloatingElement';
import { StoryElement } from '../story/StoryElement';

interface MetricPillProps {
  id: string;
  valueId: string;
  label: string;
  position: { x: number; y: number };
  prefix?: string;
  suffix?: string;
  className?: string;
}

const joinClassNames = (...tokens: Array<string | false | undefined>) => tokens.filter(Boolean).join(' ');

export const MetricPill = ({ id, valueId, label, position, prefix = '', suffix = '', className }: MetricPillProps) => (
  <FloatingElement id={id} position={position} className={joinClassNames('metric-pill', className)}>
    <span className="metric-pill__label">{label}</span>
    <StoryElement id={valueId} as="span" className="metric-pill__value story-element-inline">
      {prefix}0{suffix}
    </StoryElement>
  </FloatingElement>
);

