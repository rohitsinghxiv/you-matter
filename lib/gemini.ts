import { GoogleGenAI } from '@google/genai';

export const MODEL = process.env.GEMINI_MODEL || 'gemini-3.7-flash';

export function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

/** Strip control chars, collapse whitespace, hard-cap length. */
export function clean(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, max);
}

/** Wrap untrusted text so the model treats it as data, not instructions. */
export function fence(label: string, text: string): string {
  const safe = text.replace(/<\/?untrusted[^>]*>/gi, '');
  return `<untrusted name="${label}">\n${safe}\n</untrusted>`;
}
