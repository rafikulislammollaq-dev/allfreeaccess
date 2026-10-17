import { useState } from 'react';
import { Copy, Check, Play, Terminal, Zap } from 'lucide-react';
import { chatComplete, TEXT_MODELS } from '../lib/pollinations';

const ENDPOINTS = [
  { name: 'Aurora Free (no key)', base: 'https://text.pollinations.ai/openai', key: 'none', models: 'openai, mistral, llama, deepseek, gemini, claude, qwen', note: '100% free, no signup. OpenAI-compatible.' },
  { name: 'OpenRouter (free models)', base: 'https://openrouter.ai/api/v1', key: 'free account key', models: 'meta-llama/llama-3.3-70b-instruct:free, google/gemini-2.0-flash-exp:free', note: 'Free tier with account. Many free models.' },
  { name: 'Hugging Face Inference', base: 'https://api-inference.huggingface.co/v1', key: 'free token', models: 'meta-llama/Llama-3.3-70B-Instruct, mistralai/Mistral-7B-Instruct-v0.3', note: 'Free tier, generous limits.' },
  { name: 'Groq (free tier)', base: 'https://api.groq.com/openai/v1', key: 'free account key', models: 'llama-3.3-70b-versatile, mixtral-8x7b-32768', note: 'Very fast, free tier.' },
];

const INTEGRATIONS = [
  {
    tool: 'OpenCode',
    env: `# ~/.config/opencode/config.json or env
export OPENAI_API_BASE="https://text.pollinations.ai/openai"
export OPENAI_API_KEY="not-needed"
# model: openai`,
    note: 'OpenCode supports any OpenAI-compatible base URL. Set provider to openai with custom base.',
  },
  {
    tool: 'Claude Code',
    env: `# Use a proxy (see Cloudflare Worker below) that exposes Anthropic-compatible API,
# or use an OpenAI-compatible shim. Easiest: point to OpenRouter free models:
export ANTHROPIC_BASE_URL="https://openrouter.ai/api"
export ANTHROPIC_API_KEY="your-openrouter-key"
# model: anthropic/claude-3.5-sonnet (paid) or use free: openrouter free models via openai base`,
    note: 'Claude Code expects Anthropic API. For fully free, use an OpenAI-compatible coding tool instead (Aider/Cline/OpenCode).',
  },
  {
    tool: 'Cursor',
    env: `Settings → Models → OpenAI API Key: any string
Override OpenAI Base URL: https://text.pollinations.ai/openai
Model: openai`,
    note: 'Cursor allows custom base URL in settings.',
  },
  {
    tool: 'VS Code (Continue)',
    env: `# ~/.continue/config.json
{
  "models": [{
    "title": "Pollinations",
    "provider": "openai",
    "model": "openai",
    "apiBase": "https://text.pollinations.ai/openai",
    "apiKey": "not-needed"
  }]
}`,
    note: 'Continue.dev supports custom OpenAI base.',
  },
  {
    tool: 'VS Code (Cline)',
    env: `Cline settings → API Provider: OpenAI Compatible
Base URL: https://text.pollinations.ai/openai
API Key: not-needed
Model ID: openai`,
    note: 'Cline works with any OpenAI-compatible endpoint.',
  },
  {
    tool: 'Aider',
    env: `aider --openai-api-base https://text.pollinations.ai/openai \\
      --openai-api-key not-needed \\
      --model openai`,
    note: 'Aider supports custom base URL via flags or env.',
  },
  {
    tool: 'Hermes (Nous)',
    env: `# Hermes agent config
model:
  provider: openai
  base_url: https://text.pollinations.ai/openai
  api_key: not-needed
  default: openai`,
    note: 'Hermes supports OpenAI-compatible providers.',
  },
];

export default function ApiPage() {
  const [copied, setCopied] = useState<string | null>(null);
  const [playModel, setPlayModel] = useState('openai');
  const [playInput, setPlayInput] = useState('Write a hello world in Python.');
  const [playOut, setPlayOut] = useState('');
  const [playLoading, setPlayLoading] = useState(false);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key); setTimeout(() => setCopied(null), 1200);
  };

  const runPlayground = async () => {
    setPlayLoading(true); setPlayOut('');
    try {
      const res = await chatComplete([{ role: 'user', content: playInput }], { model: playModel });
      setPlayOut(res);
    } catch (e: any) {
      setPlayOut('Error: ' + (e?.message || 'failed'));
    } finally { setPlayLoading(false); }
  };

  const curlExample = `curl https://text.pollinations.ai/openai \\
  -H "Content-Type: application/json" \\
  -d '{"model":"openai","messages":[{"role":"user","content":"Hello"}]}'`;

  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <h2 className="font-bold text-lg mb-2 flex items-center gap-2"><Zap size={18} /> Free API Access</h2>
        <p className="text-sm text-[var(--muted)]">
          Aurora provides free, OpenAI-compatible API access through public providers. No payment, no API keys required
          for Pollinations. Use these endpoints in Claude Code, OpenCode, Cursor, VS Code, Aider, Hermes, and any
          OpenAI-compatible client.
        </p>
      </div>

      <div className="card">
        <h3 className="font-semibold mb-3">Free Endpoints</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--muted)] border-b border-[var(--border)]">
                <th className="py-2 pr-3">Provider</th>
                <th className="py-2 pr-3">Base URL</th>
                <th className="py-2 pr-3">Key</th>
                <th className="py-2 pr-3">Models</th>
              </tr>
            </thead>
            <tbody>
              {ENDPOINTS.map((e) => (
                <tr key={e.name} className="border-b border-[var(--border)]">
                  <td className="py-2 pr-3 font-medium">{e.name}</td>
                  <td className="py-2 pr-3 font-mono text-xs break-all">{e.base}</td>
                  <td className="py-2 pr-3">{e.key}</td>
                  <td className="py-2 pr-3 text-xs text-[var(--muted)]">{e.models}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {ENDPOINTS.map((e) => <p key={e.name} className="text-xs text-[var(--muted)] mt-1">{e.name}: {e.note}</p>)}
      </div>

      <div className="card">
        <h3 className="font-semibold mb-3">Quick Start (curl)</h3>
        <pre className="p-3 rounded-lg bg-[var(--panel-2)] text-sm font-mono overflow-x-auto">{curlExample}</pre>
        <button className="btn text-xs mt-2" onClick={() => copy(curlExample, 'curl')}>
          {copied === 'curl' ? <Check size={12} /> : <Copy size={12} />} Copy
        </button>
      </div>

      <div className="card">
        <h3 className="font-semibold mb-3">API Playground</h3>
        <div className="flex gap-2 mb-3">
          <select className="select" style={{ width: 180 }} value={playModel} onChange={(e) => setPlayModel(e.target.value)}>
            {TEXT_MODELS.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
        <textarea className="textarea" rows={3} value={playInput} onChange={(e) => setPlayInput(e.target.value)} />
        <button className="btn primary mt-2" onClick={runPlayground} disabled={playLoading}>
          {playLoading ? 'Running...' : <><Play size={14} /> Run</>}
        </button>
        {playOut && <pre className="mt-3 p-3 rounded-lg bg-[var(--panel-2)] text-sm whitespace-pre-wrap">{playOut}</pre>}
      </div>

      <div className="card">
        <h3 className="font-semibold mb-3">Integration Guides</h3>
        <div className="flex flex-col gap-4">
          {INTEGRATIONS.map((it) => (
            <div key={it.tool} className="p-3 rounded-lg bg-[var(--panel-2)]">
              <div className="font-semibold mb-1">{it.tool}</div>
              <pre className="p-2 rounded bg-[var(--bg-soft)] text-xs font-mono overflow-x-auto">{it.env}</pre>
              <button className="btn ghost text-xs mt-2" onClick={() => copy(it.env, it.tool)}>
                {copied === it.tool ? <Check size={12} /> : <Copy size={12} />} Copy config
              </button>
              <p className="text-xs text-[var(--muted)] mt-2">{it.note}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold mb-3 flex items-center gap-2"><Terminal size={16} /> Free Cloudflare Worker Proxy (optional)</h3>
        <p className="text-sm text-[var(--muted)] mb-3">
          Deploy a free OpenAI-compatible proxy on Cloudflare Workers to get a stable URL, add CORS, rate-limit, and route
          between multiple free providers. Free tier: 100k requests/day.
        </p>
        <pre className="p-3 rounded-lg bg-[var(--panel-2)] text-xs font-mono overflow-x-auto">{`// worker.js
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/v1/chat/completions' && request.method === 'POST') {
      const body = await request.json();
      const r = await fetch('https://text.pollinations.ai/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      return new Response(r.body, { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
    }
    if (request.method === 'OPTIONS') return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*' } });
    return new Response('Aurora Free API Proxy', { status: 200 });
  }
};`}</pre>
        <p className="text-xs text-[var(--muted)] mt-2">
          Deploy: <code>wrangler deploy</code> or paste into Cloudflare dashboard. Then point your tools to
          <code> https://your-worker.workers.dev/v1</code>.
        </p>
      </div>
    </div>
  );
}
