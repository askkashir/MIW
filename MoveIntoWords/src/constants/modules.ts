/**
 * Centralised module content definitions.
 * Each module has an id, title, description, estimated time, and step prompts.
 * The client will replace placeholder content with real copy later.
 */

export interface ModuleStep {
  stepNumber: number;
  prompt: string;
}

export interface ModuleDefinition {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  icon: string;
  color: string;
  bg: string;
  category: string;
  steps: ModuleStep[];
}

export const MODULES: ModuleDefinition[] = [
  {
    id: 'growth-resilience',
    title: 'Growth & Resilience',
    description: 'Build inner strength and bounce back from challenges through guided self-reflection.',
    estimatedMinutes: 15,
    icon: 'flash',
    color: '#FFD700',
    bg: '#FFFFE0',
    category: 'Growth',
    steps: [
      { stepNumber: 1, prompt: 'Reflect on a recent setback or failure. What did it teach you about your own strength?' },
      { stepNumber: 2, prompt: 'Think of other ways this situation has brought out your strength in the past. How does it add value to your life?' },
      { stepNumber: 3, prompt: 'Write about one action you can take this week to apply what you have learned from this experience.' },
    ],
  },
  {
    id: 'love-relationships',
    title: 'Love & Relationships',
    description: 'Explore your feelings about connections, boundaries, and the love you give and receive.',
    estimatedMinutes: 20,
    icon: 'heart',
    color: '#FFB6C1',
    bg: '#FFF0F5',
    category: 'Emotional',
    steps: [
      { stepNumber: 1, prompt: 'Describe a relationship that has shaped who you are today. What made it significant?' },
      { stepNumber: 2, prompt: 'What boundaries do you struggle to maintain in your closest relationships? Why do you think that is?' },
      { stepNumber: 3, prompt: 'Write a letter to someone you love — but have never fully expressed your feelings to.' },
    ],
  },
  {
    id: 'anxiety-stress',
    title: 'Anxiety & Stress',
    description: 'Ground yourself and build coping skills through intentional writing exercises.',
    estimatedMinutes: 12,
    icon: 'cloud',
    color: '#87CEFA',
    bg: '#F0F8FF',
    category: 'Emotional',
    steps: [
      { stepNumber: 1, prompt: 'What is causing you the most anxiety right now? Write it all out without filtering.' },
      { stepNumber: 2, prompt: 'Imagine your anxiety as a physical object. What does it look like, feel like, weigh?' },
      { stepNumber: 3, prompt: 'List three things that are within your control right now. Focus on what you can do today.' },
    ],
  },
];
