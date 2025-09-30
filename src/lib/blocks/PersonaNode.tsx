import type { CSSProperties } from 'react';
import { FloatingElement } from './FloatingElement';

interface PersonaNodeProps {
  id: string;
  name: string;
  label?: string;
  theme?: 'owner' | 'buyer' | 'neutral';
  position: { x: number; y: number };
  style?: CSSProperties;
  className?: string;
  anchor?: 'center' | 'top-left';
  zIndex?: number;
}

const THEME_CLASS: Record<NonNullable<PersonaNodeProps['theme']>, string> = {
  owner: 'persona-node--owner',
  buyer: 'persona-node--buyer',
  neutral: 'persona-node--neutral',
};

const joinClassNames = (...tokens: Array<string | false | null | undefined>) => tokens.filter(Boolean).join(' ');

export const PersonaNode = ({
  id,
  name,
  label,
  theme = 'neutral',
  position,
  style,
  className,
  anchor,
  zIndex,
}: PersonaNodeProps) => {
  return (
    <FloatingElement
      id={id}
      position={position}
      anchor={anchor}
      zIndex={zIndex}
      className={joinClassNames('persona-node', THEME_CLASS[theme], className)}
      style={style}
    >
      <div className="persona-node__badge" aria-hidden>
        {name.slice(0, 1)}
      </div>
      <div className="persona-node__name" aria-label={name}>
        {name}
      </div>
      {label && <div className="persona-node__label">{label}</div>}
    </FloatingElement>
  );
};

