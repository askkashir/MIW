/**
 * modules.ts — Canonical module content definitions for Move Into Words.
 *
 * Each module has an id, title, description, category, estimated time,
 * and 3 steps with real therapeutic writing prompts.
 */

export interface ModuleStep {
  stepNumber: number;
  title: string;
  prompt: string;
  placeholder: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  category: string;
  estimatedMinutes: number;
  steps: ModuleStep[];
}

export const MODULES: Module[] = [
  {
    id: 'anxiety-relief',
    title: 'Working Through Anxiety',
    description: 'Explore the roots of your anxiety and develop tools to move through it with clarity and calm.',
    category: 'Wellbeing',
    estimatedMinutes: 10,
    steps: [
      {
        stepNumber: 1,
        title: 'Name It',
        prompt: 'Describe what anxiety feels like in your body right now, or in a recent moment when you felt it strongly. Where do you feel it — your chest, stomach, shoulders? What does it feel like physically?',
        placeholder: 'I notice anxiety in my body as...',
      },
      {
        stepNumber: 2,
        title: 'Trace It',
        prompt: 'What do you think is underneath this anxiety? If the feeling could speak, what would it be trying to protect you from? What does it believe might happen?',
        placeholder: 'I think this anxiety is trying to tell me...',
      },
      {
        stepNumber: 3,
        title: 'Reframe It',
        prompt: "What is one small, true thing you can remind yourself of right now? It doesn't need to fix everything — just something real that gives you a little ground to stand on.",
        placeholder: 'One thing I know to be true right now is...',
      },
    ],
  },
  {
    id: 'self-worth',
    title: 'Rebuilding Self-Worth',
    description: 'Reconnect with your inherent value and challenge the stories that have kept you feeling small.',
    category: 'Growth',
    estimatedMinutes: 12,
    steps: [
      {
        stepNumber: 1,
        title: 'The Story',
        prompt: "What is a belief you hold about yourself that limits you? It might sound like 'I am too much', 'I am not enough', or 'I always mess things up.' Write it out plainly, without judgment.",
        placeholder: 'A story I tell myself is...',
      },
      {
        stepNumber: 2,
        title: 'The Evidence',
        prompt: 'Where did this belief come from? Think back — was there a moment, a person, or a pattern that taught you to believe this? Describe it as honestly as you can.',
        placeholder: 'I think I learned this because...',
      },
      {
        stepNumber: 3,
        title: 'The Counter',
        prompt: 'Write three specific moments — however small — where you showed up with courage, kindness, or capability. Let yourself remember them in detail.',
        placeholder: 'Three moments that show a different truth about me...',
      },
    ],
  },
  {
    id: 'grief-loss',
    title: 'Sitting With Grief',
    description: 'A gentle space to honor what you have lost and find words for what is hard to say.',
    category: 'Healing',
    estimatedMinutes: 15,
    steps: [
      {
        stepNumber: 1,
        title: 'What Was Lost',
        prompt: "What are you grieving? It doesn't have to be a death — it can be a relationship, a version of yourself, a dream, or a time in your life. Describe what it was and what it meant to you.",
        placeholder: 'What I am grieving is...',
      },
      {
        stepNumber: 2,
        title: 'What Remains',
        prompt: 'Grief often lives alongside love. What did you love most about what you lost? What do you carry with you still — a memory, a lesson, a feeling that hasn\'t left?',
        placeholder: 'What I carry with me still is...',
      },
      {
        stepNumber: 3,
        title: 'Permission',
        prompt: "What do you need permission to feel or do right now that you haven't let yourself? Write yourself a small permission slip — as kind as you would be to a close friend.",
        placeholder: 'I give myself permission to...',
      },
    ],
  },
  {
    id: 'purpose-direction',
    title: 'Finding Direction',
    description: 'Clarify what matters most to you and take one step toward a life that feels more intentional.',
    category: 'Growth',
    estimatedMinutes: 10,
    steps: [
      {
        stepNumber: 1,
        title: 'The Drift',
        prompt: 'Describe an area of your life where you feel like you are just going through the motions — not really choosing, just drifting. What does that feel like day to day?',
        placeholder: 'The area where I feel most adrift is...',
      },
      {
        stepNumber: 2,
        title: 'The Pull',
        prompt: 'Think of a moment in your life — even a brief one — when you felt genuinely alive and purposeful. What were you doing? What made it feel meaningful?',
        placeholder: 'A time I felt truly alive was...',
      },
      {
        stepNumber: 3,
        title: 'One Step',
        prompt: 'Based on what you have written, what is one small, concrete action you could take this week that moves toward what matters to you? Make it specific and achievable.',
        placeholder: 'One step I can take this week is...',
      },
    ],
  },
];

export const getModuleById = (id: string): Module | undefined =>
  MODULES.find((m) => m.id === id);
