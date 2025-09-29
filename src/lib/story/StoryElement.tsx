import { createElement, forwardRef, useEffect, useRef } from 'react';
import type { MutableRefObject } from 'react';
import { useStoryContext } from './StoryStage';
import type { StoryElementProps } from './types';

const joinClassNames = (...tokens: Array<string | false | undefined>) => tokens.filter(Boolean).join(' ');

export const StoryElement = forwardRef<HTMLElement, StoryElementProps>(function StoryElement(
  { id, as = 'div', className, hidden = false, children, ...rest },
  forwardedRef,
) {
  const { registerElement } = useStoryContext();
  const localRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = (forwardedRef as MutableRefObject<HTMLElement | null>)?.current ?? localRef.current;
    registerElement(id, node ?? null);
    return () => registerElement(id, null);
  }, [id, registerElement, forwardedRef]);

  const setRef = (node: HTMLElement | null) => {
    localRef.current = node;
    if (typeof forwardedRef === 'function') {
      forwardedRef(node);
    } else if (forwardedRef) {
      (forwardedRef as MutableRefObject<HTMLElement | null>).current = node;
    }
  };

  return createElement(
    as as string,
    {
      ref: setRef,
      'data-story-element': id,
      className: joinClassNames('story-element', className, hidden && 'story-element-hidden'),
      ...rest,
    },
    children,
  );
});

