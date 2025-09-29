import { FloatingElement } from './FloatingElement';

interface StoreEmblemProps {
  id: string;
  position: { x: number; y: number };
  label: string;
}

export const StoreEmblem = ({ id, position, label }: StoreEmblemProps) => (
  <FloatingElement id={id} position={position} className="store-emblem">
    <div className="store-emblem__roof" />
    <div className="store-emblem__body">
      <div className="store-emblem__panel store-emblem__panel--left" />
      <div className="store-emblem__panel store-emblem__panel--right" />
    </div>
    <div className="store-emblem__label">{label}</div>
  </FloatingElement>
);

