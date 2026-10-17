export type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

export interface ChatOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  system?: string;
}

export const TEXT_MODELS = [
  { id: 'openai', name: 'GPT (OpenAI)' },
  { id: 'openai-fast', name: 'GPT Fast' },
  { id: 'mistral', name: 'Mistral' },
  { id: 'llama', name: 'Llama' },
  { id: 'deepseek', name: 'DeepSeek' },
  { id: 'gemini', name: 'Gemini' },
  { id: 'claude', name: 'Claude' },
  { id: 'qwen', name: 'Qwen' },
];

export const IMAGE_MODELS = [
  { id: 'flux', name: 'Flux (default)' },
  { id: 'turbo', name: 'Turbo' },
  { id: 'gptimage', name: 'GPT Image' },
  { id: 'seedream', name: 'Seedream' },
  { id: 'kontext', name: 'Kontext' },
];

export async function chatComplete(messages: ChatMessage[], opts: ChatOptions = {}): Promise<string> {
  const model = opts.model || 'openai';
  const body = {
    model,
    messages: opts.system
      ? [{ role: 'system', content: opts.system }, ...messages]
      : messages,
    temperature: opts.temperature ?? 0.7,
    max_tokens: opts.maxTokens ?? 1024,
    stream: false,
  };
  const res = await fetch('https://text.pollinations.ai/openai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Chat failed: ' + res.status);
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error('Empty response');
  return content;
}

export async function chatStream(
  messages: ChatMessage[],
  opts: ChatOptions,
  onChunk: (t: string) => void,
  signal?: AbortSignal
): Promise<void> {
  const model = opts.model || 'openai';
  const body = {
    model,
    messages: opts.system
      ? [{ role: 'system', content: opts.system }, ...messages]
      : messages,
    temperature: opts.temperature ?? 0.7,
    max_tokens: opts.maxTokens ?? 1024,
    stream: true,
  };
  const res = await fetch('https://text.pollinations.ai/openai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  });
  if (!res.ok || !res.body) throw new Error('Chat failed: ' + res.status);
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const lines = buf.split('\n');
    buf = lines.pop() || '';
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;
      const payload = trimmed.slice(5).trim();
      if (payload === '[DONE]') return;
      try {
        const json = JSON.parse(payload);
        const delta = json?.choices?.[0]?.delta?.content;
        if (delta) onChunk(delta);
      } catch {
        /* ignore */
      }
    }
  }
}

export function imageUrl(prompt: string, opts: { width?: number; height?: number; model?: string; seed?: number; nologo?: boolean } = {}): string {
  const w = opts.width || 1024;
  const h = opts.height || 1024;
  const params = new URLSearchParams();
  params.set('width', String(w));
  params.set('height', String(h));
  if (opts.model) params.set('model', opts.model);
  if (opts.seed !== undefined) params.set('seed', String(opts.seed));
  if (opts.nologo !== false) params.set('nologo', 'true');
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params.toString()}`;
}

export async function fetchImageBlob(url: string): Promise<Blob> {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Image fetch failed');
  return res.blob();
}
