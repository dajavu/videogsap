import { gsap } from 'gsap';
import type {
  StepDefinition,
  StoryRuntimeContext,
  TimelineAction,
} from '../lib';
import type { StoryDefinition } from './types';
import {
  StoryStage,
  StoryControls,
  SceneBubble,
  PersonaNode,
  FlowArc,
  StoreEmblem,
  MetricPill,
  FloatingElement,
  StoryElement,
} from '../lib';
import type { ReactNode } from 'react';

interface PositionConfig {
  x: number;
  y: number;
}

type LayoutElementConfig =
  | { type: 'StoryElement'; id: string; className?: string }
  | { type: 'SceneBubble'; id: string; position: PositionConfig; tone?: 'primary' | 'success' | 'neutral'; size?: 'sm' | 'md' | 'lg'; text: string }
  | { type: 'PersonaNode'; id: string; position: PositionConfig; name: string; label?: string; theme?: 'owner' | 'buyer' | 'neutral' }
  | { type: 'FlowArc'; id: string; position: PositionConfig; label?: string; width?: number; height?: number; gradient?: [string, string] }
  | { type: 'StoreEmblem'; id: string; position: PositionConfig; label: string }
  | { type: 'MetricPill'; id: string; position: PositionConfig; valueId: string; label: string; prefix?: string; suffix?: string; className?: string }
  | { type: 'FloatingElement'; id: string; position: PositionConfig; className?: string; text?: string; anchor?: 'center' | 'top-left'; zIndex?: number };

type JsonAction =
  | { type: 'animate-in'; target: string; preset?: string; vars?: Record<string, unknown> }
  | { type: 'animate-out'; target: string; preset?: string; vars?: Record<string, unknown> }
  | { type: 'set-text'; target: string; text: string }
  | { type: 'counter'; target: string; from?: number; to: number; duration?: number; prefix?: string; suffix?: string; precision?: number }
  | { type: 'wait'; duration: number }
  | { type: 'call'; handler: string; options?: Record<string, unknown> };

interface JsonStep {
  id: string;
  title?: string;
  description?: string;
  actions: JsonAction[];
}

interface StoryFile {
  id: string;
  title: string;
  summary: string;
  tags?: string[];
  stageTheme?: string;
  layout: LayoutElementConfig[];
  steps: JsonStep[];
}

interface ResolvedStory {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  stageTheme?: string;
  layout: LayoutElementConfig[];
  steps: StepDefinition[];
}

type CallHandler = (ctx: StoryRuntimeContext, options?: Record<string, unknown>) => void;

const callHandlers: Record<string, CallHandler> = {
  drawPath: (ctx, options = {}) => {
    const elementId = typeof options.elementId === 'string' ? options.elementId : undefined;
    const selector = typeof options.selector === 'string' ? options.selector : undefined;
    const duration = typeof options.duration === 'number' ? options.duration : 1;
    const ease = typeof options.ease === 'string' ? options.ease : 'power2.out';

    const root = elementId ? ctx.elements.get(elementId) ?? undefined : undefined;
    const node = selector ? root?.querySelector(selector) ?? null : root ?? null;
    if (!(node instanceof SVGPathElement)) return;
    const target = node;
    const length = target.getTotalLength();
    gsap.fromTo(
      target,
      { strokeDasharray: length, strokeDashoffset: length },
      { strokeDashoffset: 0, duration, ease },
    );
  },
  pulseScale: (ctx, options = {}) => {
    const elementId = typeof options.elementId === 'string' ? options.elementId : undefined;
    if (!elementId) return;
    const node = ctx.elements.get(elementId);
    if (!node) return;
    const fromScale = typeof options.from === 'number' ? options.from : 0.4;
    const toScale = typeof options.to === 'number' ? options.to : 1;
    const duration = typeof options.duration === 'number' ? options.duration : 0.8;
    const ease = typeof options.ease === 'string' ? options.ease : 'back.out(1.6)';
    const fromOpacity = typeof options.fromOpacity === 'number' ? options.fromOpacity : 0;
    gsap.fromTo(
      node,
      { scale: fromScale, opacity: fromOpacity },
      { scale: toScale, opacity: 1, duration, ease },
    );
  },
};

const toTimelineAction = (action: JsonAction): TimelineAction => {
  if (action.type === 'call') {
    const handler = callHandlers[action.handler];
    if (!handler) {
      throw new Error(`Unknown call handler: ${action.handler}`);
    }
    return {
      type: 'call',
      handler: (ctx) => handler(ctx, action.options),
    };
  }
  return action as TimelineAction;
};

const resolveSteps = (steps: JsonStep[]): StepDefinition[] =>
  steps.map((step) => ({
    id: step.id,
    title: step.title,
    description: step.description,
    actions: step.actions.map(toTimelineAction),
  }));

const renderLayoutElement = (config: LayoutElementConfig): ReactNode => {
  switch (config.type) {
    case 'StoryElement':
      return <StoryElement key={config.id} id={config.id} className={config.className} />;
    case 'SceneBubble':
      return (
        <SceneBubble
          key={config.id}
          id={config.id}
          position={config.position}
          tone={config.tone}
          size={config.size}
        >
          {config.text}
        </SceneBubble>
      );
    case 'PersonaNode':
      return (
        <PersonaNode
          key={config.id}
          id={config.id}
          position={config.position}
          name={config.name}
          label={config.label}
          theme={config.theme}
        />
      );
    case 'FlowArc':
      return (
        <FlowArc
          key={config.id}
          id={config.id}
          position={config.position}
          label={config.label}
          width={config.width}
          height={config.height}
          gradient={config.gradient}
        />
      );
    case 'StoreEmblem':
      return <StoreEmblem key={config.id} id={config.id} position={config.position} label={config.label} />;
    case 'MetricPill':
      return (
        <MetricPill
          key={config.id}
          id={config.id}
          valueId={config.valueId}
          label={config.label}
          position={config.position}
          prefix={config.prefix}
          suffix={config.suffix}
          className={config.className}
        />
      );
    case 'FloatingElement':
      return (
        <FloatingElement
          key={config.id}
          id={config.id}
          position={config.position}
          className={config.className}
          anchor={config.anchor}
          zIndex={config.zIndex}
        >
          {config.text}
        </FloatingElement>
      );
    default:
      return null;
  }
};

const toResolvedStory = (story: StoryFile): ResolvedStory => ({
  id: story.id,
  title: story.title,
  summary: story.summary,
  tags: story.tags ?? [],
  stageTheme: story.stageTheme,
  layout: story.layout,
  steps: resolveSteps(story.steps),
});

const JsonStoryExperience = ({ story, onBack }: { story: ResolvedStory; onBack: () => void }) => (
  <div className="story-shell story-shell--immersive">
    <div className="story-toolbar">
      <button type="button" className="ghost-button" onClick={onBack}>
        ← 返回案例列表
      </button>
      <div className="story-toolbar__meta">
        {story.tags.map((tag) => (
          <span key={tag} className="story-tag">
            {tag}
          </span>
        ))}
      </div>
    </div>

    <StoryStage steps={story.steps} className="story-stage story-stage--immersive">
      <div className={`interactive-stage ${story.stageTheme ?? ''}`}>
        {story.layout.map((item) => renderLayoutElement(item))}
      </div>

      <StoryControls className="story-controls" />
    </StoryStage>
  </div>
);

const storyModules = import.meta.glob('./data/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, StoryFile>;

export const stories: StoryDefinition[] = Object.values(storyModules)
  .map((storyFile) => {
    const resolved = toResolvedStory(storyFile);
    return {
      id: resolved.id,
      title: resolved.title,
      summary: resolved.summary,
      tags: resolved.tags,
      render: (options: { onBack: () => void }) => (
        <JsonStoryExperience story={resolved} onBack={options.onBack} />
      ),
    };
  })
  .sort((a, b) => a.title.localeCompare(b.title));

