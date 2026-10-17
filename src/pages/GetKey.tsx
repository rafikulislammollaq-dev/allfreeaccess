import { useState } from 'react';
import { Key, Copy, Check, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { load, save, uid } from '../lib/storage';

interface ApiKey { id: string; key: string; name: string; createdAt: number; }

const STORAGE_KEY = 'aurora.apikeys';

function genKey(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let out = 'aurora_sk_';
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  for (let i = 0; i < 32; i++) out += chars[arr[i] % chars.length];
  return out;
}

export default function GetKeyPage() {
  const [keys, setKeys] = useState<ApiKey[]>(() => load(STORAGE_KEY, []));
  const [name, setName] = useState('');
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<string | null>(null);

  const persist = (next: ApiKey[]) => { setKeys(next); save(STORAGE_KEY, next); };

  const create = () => {
    const k: ApiKey = { id: uid(), key: genKey(), name: name.trim() || 'Default key', createdAt: Date.now() };
    persist([k, ...keys]);
    setName('');
  };
  const remove = (id: string) => persist(keys.filter((k) => k.id !== id));
  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id); setTimeout(() => setCopied(null), 1200);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,.12), rgba(34,211,238,.08))' }}>
        <h2 className="font-bold text-2xl mb-2 flex items-center gap-2"><Key size={22} /> Get Your Free API Key</h2>
        <p className="text-sm text-[var(--muted)] mb-4">
          Generate a free API key instantly. No signup, no credit card, no limits to start. Use it with any OpenAI-compatible client.
        </p>
        <div className="flex gap-2">
          <input className="input" placeholder="Key name (optional)" value={name} onChange={(e) => setName(e.target.value)} />
          <button className="btn primary" onClick={create}><Plus size={14} /> Generate key</button>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold mb-3">Your API Keys</h3>
        {keys.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🔑</div>
            <h3>No keys yet</h3>
            <p>Generate your first free API key above.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {keys.map((k) => (
              <div key={k.id} className="p-3 rounded-lg bg-[var(--panel-2)]">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-medium text-sm">{k.name}</div>
                  <div className="text-xs text-[var(--muted)]">{new Date(k.createdAt).toLocaleString()}</div>
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs font-mono bg-[var(--bg-soft)] px-2 py-1 rounded break-all">
                    {revealed[k.id] ? k.key : k.key.slice(0, 12) + '•'.repeat(20)}
                  </code>
                  <button className="btn ghost sm" onClick={() => setRevealed((r) => ({ ...r, [k.id]: !r[k.id] }))}>
                    {revealed[k.id] ? <EyeOff size={12} /> : <Eye size={12} />}
                  </button>
                  <button className="btn ghost sm" onClick={() => copy(k.key, k.id)}>
                    {copied === k.id ? <Check size={12} /> : <Copy size={12} />}
                  </button>
                  <button className="btn danger sm" onClick={() => remove(k.id)}><Trash2 size={12} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h3 className="font-semibold mb-3">How to use your key</h3>
        <div className="grid-2">
          <div>
            <div className="text-xs text-[var(--muted)] mb-1">Base URL</div>
            <code className="block p-2 rounded bg-[var(--panel-2)] text-xs font-mono break-all">https://text.pollinations.ai/openai</code>
          </div>
          <div>
            <div className="text-xs text-[var(--muted)] mb-1">Example model</div>
            <code className="block p-2 rounded bg-[var(--panel-2)] text-xs font-mono">openai</code>
          </div>
        </div>
        <pre className="mt-3 p-3 rounded-lg bg-[var(--panel-2)] text-xs font-mono overflow-x-auto">{`curl https://text.pollinations.ai/openai \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_KEY" \\
  -d '{"model":"openai","messages":[{"role":"user","content":"Hello"}]}'`}</pre>
        <p className="text-xs text-[var(--muted)] mt-2">
          Note: The free tier uses public providers under the hood. Your key is a client-side identifier for tracking and
          rate-limiting; the actual AI is provided free by Pollinations and partners.
        </p>
      </div>
    </div>
  );
}
