import type { ReactNode } from 'react';

export interface StoryDefinition {
  id: string;
  title: string;
  summary: string;
  tags?: string[];
  render: (options: { onBack: () => void }) => ReactNode;
}

