import type { CSSProperties } from 'react';
import { FloatingElement } from './FloatingElement';

interface PersonaNodeProps {
  id: string;
  name: string;
  label?: string;
  theme?: 'owner' | 'buyer' | 'neutral';
  position: { x: number; y: number };
  style?: CSSProperties;
}

const THEME_CLASS: Record<NonNullable<PersonaNodeProps['theme']>, string> = {
  owner: 'persona-node--owner',
  buyer: 'persona-node--buyer',
  neutral: 'persona-node--neutral',
};

export const PersonaNode = ({ id, name, label, theme = 'neutral', position, style }: PersonaNodeProps) => {
  return (
    <FloatingElement id={id} position={position} className={`persona-node ${THEME_CLASS[theme]}`} style={style}>
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

