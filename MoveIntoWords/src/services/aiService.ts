/**
 * AI Service — Move Into Words
 *
 * Handles communication with both Anthropic and Gemini APIs to generate journaling prompts.
 */

import { AI_CONFIG } from '../config/aiConfig';
import { AIContext, AIError } from '../types/ai';

const FALLBACK_PROMPT = "What are you feeling right now?";

/**
 * Main entry point for fetching a suggested journaling prompt.
 * Automatically delegates to the active provider based on configuration.
 */
export async function getSuggestedPrompt(context: AIContext): Promise<string> {
  const provider = AI_CONFIG.activeProvider;

  if (provider === 'anthropic') {
    return fetchAnthropicPrompt(context);
  } else {
    return fetchGeminiPrompt(context);
  }
}

/**
 * Specific implementation for Anthropic Claude
 */
async function fetchAnthropicPrompt(context: AIContext): Promise<string> {
  const userMessage = buildUserMessage(context);
  const { anthropic, systemPrompt, maxTokens } = AI_CONFIG;

  if (!anthropic.apiKey || anthropic.apiKey === 'your_key_here') {
    throw new AIError('Anthropic API Key is missing or invalid.', 'CONFIG_ERROR');
  }

  try {
    const response = await fetch(anthropic.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropic.apiKey,
        'anthropic-version': anthropic.version,
        'dangerously-allow-browser': 'true',
      },
      body: JSON.stringify({
        model: anthropic.model,
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    return handleResponse(response, (data) => data.content?.[0]?.text);
  } catch (error) {
    return handleError(error, 'Anthropic');
  }
}

/**
 * Specific implementation for Google Gemini
 */
async function fetchGeminiPrompt(context: AIContext): Promise<string> {
  const userMessage = buildUserMessage(context);
  const { gemini, systemPrompt, maxTokens } = AI_CONFIG;

  if (!gemini.apiKey || gemini.apiKey === 'your_key_here') {
    throw new AIError('Gemini API Key is missing or invalid.', 'CONFIG_ERROR');
  }

  // Gemini includes system instructions differently in v1beta
  const endpoint = `${gemini.baseUrl}/${gemini.model}:generateContent?key=${gemini.apiKey}`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              { text: `${systemPrompt}\n\nUser Context: ${userMessage}` }
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature: 0.7,
        },
      }),
    });

    return handleResponse(response, (data) => data.candidates?.[0]?.content?.parts?.[0]?.text);
  } catch (error) {
    return handleError(error, 'Gemini');
  }
}

/**
 * Shared logic for building the user message
 */
function buildUserMessage(context: AIContext): string {
  return context.type === 'free-form'
    ? "Suggest a journaling prompt for emotional reflection."
    : `Suggest a journaling prompt for someone working through the module: "${context.moduleName}".`;
}

/**
 * Shared logic for handling fetch responses
 */
async function handleResponse(response: Response, extractor: (data: any) => string | undefined): Promise<string> {
  if (!response.ok) {
    let errorMessage = `API failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData?.error?.message || errorMessage;
    } catch { /* ignore */ }
    throw new AIError(errorMessage, 'API_RESPONSE_ERROR');
  }

  const data = await response.json();
  const prompt = extractor(data);

  if (!prompt) {
    throw new AIError('Invalid AI response format: content missing.', 'PARSING_ERROR');
  }

  return prompt.trim();
}

/**
 * Shared error handling
 */
function handleError(error: any, providerName: string): never {
  console.error(`[aiService] ${providerName} Error:`, error);
  if (error instanceof AIError) throw error;
  throw new AIError(
    error instanceof Error ? error.message : `An unexpected error occurred with ${providerName}.`,
    'UNKNOWN_ERROR'
  );
}

/**
 * Helper to get a prompt with a guaranteed fallback if it fails.
 */
export async function getSuggestedPromptWithFallback(context: AIContext): Promise<string> {
  try {
    return await getSuggestedPrompt(context);
  } catch {
    return FALLBACK_PROMPT;
  }
}
