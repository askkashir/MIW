/**
 * AI Related Types for "Move Into Words"
 */

export type AIContext =
  | { type: 'free-form' }
  | { type: 'module'; moduleName: string };

/**
 * Custom error class for AI service failures
 */
export class AIError extends Error {
  type: string;
  
  constructor(message: string, type: string = 'API_ERROR') {
    super(message);
    this.name = 'AIError';
    this.type = type;
  }
}
