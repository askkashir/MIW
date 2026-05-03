/**
 * AI Configuration for "Move Into Words"
 *
 * This file centralizes all AI-related settings for both Anthropic and Gemini.
 * API keys are pulled from environment variables.
 */

export type AIProvider = 'anthropic' | 'gemini';

export const AI_CONFIG = {
  /**
   * The active provider is determined by which API keys are available.
   * Priority: Anthropic > Gemini
   */
  get activeProvider(): AIProvider {
    if (process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY && process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY !== 'your_key_here') {
      return 'anthropic';
    }
    return 'gemini';
  },

  /** Common settings */
  maxTokens: 300,
  systemPrompt: `You are a warm, empathetic journaling assistant for the app "Move Into Words".
Your sole task is to provide a single, open-ended journaling prompt that encourages deep emotional reflection.

Constraints:
- Return ONLY the prompt text.
- No lists, no explanations, no introductory text (e.g., "Here is your prompt:").
- No conversational filler.
- The prompt should feel personal and inviting.`,

  /** Anthropic Specifics */
  anthropic: {
    endpoint: 'https://api.anthropic.com/v1/messages',
    model: 'claude-sonnet-4-20250514',
    version: '2023-06-01',
    apiKey: process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY,
  },

  /** Gemini Specifics */
  gemini: {
    // Note: API key is usually appended to the URL for Gemini
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
    model: 'gemini-1.5-flash',
    apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY,
  },
};
