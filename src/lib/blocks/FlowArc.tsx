import type { CSSProperties } from 'react';
import { FloatingElement } from './FloatingElement';

interface FlowArcProps {
  id: string;
  position: { x: number; y: number };
  width?: number;
  height?: number;
  label?: string;
  gradient?: [string, string];
  className?: string;
  anchor?: 'center' | 'top-left';
  zIndex?: number;
  style?: CSSProperties;
}

const joinClassNames = (...tokens: Array<string | false | null | undefined>) => tokens.filter(Boolean).join(' ');

export const FlowArc = ({
  id,
  position,
  width = 260,
  height = 140,
  label,
  gradient = ['#60a5fa', '#34d399'],
  className,
  anchor,
  zIndex,
  style,
}: FlowArcProps) => {
  const viewBoxWidth = 260;
  const viewBoxHeight = 140;

  return (
    <FloatingElement
      id={id}
      position={position}
      anchor={anchor}
      zIndex={zIndex}
      style={style}
      className={joinClassNames('flow-arc', className)}
    >
      <svg
        className="flow-arc__svg"
        width={width}
        height={height}
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id={`${id}-gradient`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={gradient[0]} />
            <stop offset="100%" stopColor={gradient[1]} />
          </linearGradient>
        </defs>
        <path
          className="flow-arc__shadow"
          d="M20 90 C90 20, 170 20, 240 90"
          fill="none"
          stroke="rgba(15, 23, 42, 0.08)"
          strokeWidth="18"
          strokeLinecap="round"
        />
        <path
          id={`${id}-path`}
          d="M20 90 C90 20, 170 20, 240 90"
          fill="none"
          stroke={`url(#${id}-gradient)`}
          strokeWidth="10"
          strokeLinecap="round"
        />
        <polygon points="220,76 240,90 220,104" fill={gradient[1]} opacity="0.72" />
      </svg>
      {label && <div className="flow-arc__label">{label}</div>}
    </FloatingElement>
  );
};

