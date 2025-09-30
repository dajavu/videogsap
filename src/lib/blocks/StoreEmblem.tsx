import type { CSSProperties } from 'react';
import { FloatingElement } from './FloatingElement';

interface StoreEmblemProps {
  id: string;
  position: { x: number; y: number };
  label: string;
  className?: string;
  anchor?: 'center' | 'top-left';
  zIndex?: number;
  style?: CSSProperties;
}

const joinClassNames = (...tokens: Array<string | false | null | undefined>) => tokens.filter(Boolean).join(' ');

export const StoreEmblem = ({ id, position, label, className, anchor, zIndex, style }: StoreEmblemProps) => (
  <FloatingElement
    id={id}
    position={position}
    anchor={anchor}
    zIndex={zIndex}
    style={style}
    className={joinClassNames('store-emblem', className)}
  >
    <div className="store-emblem__roof" />
    <div className="store-emblem__body">
      <div className="store-emblem__panel store-emblem__panel--left" />
      <div className="store-emblem__panel store-emblem__panel--right" />
    </div>
    <div className="store-emblem__label">{label}</div>
  </FloatingElement>
);

