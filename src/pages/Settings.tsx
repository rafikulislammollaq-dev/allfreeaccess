import { useEffect, useState } from 'react';
import { Moon, Sun, Save } from 'lucide-react';
import { load, save } from '../lib/storage';

interface Settings {
  theme: 'dark' | 'light';
  defaultModel: string;
  systemPrompt: string;
  adClient: string;
}

const DEFAULTS: Settings = { theme: 'dark', defaultModel: 'openai', systemPrompt: 'You are Aurora, a helpful AI assistant.', adClient: '' };

export default function SettingsPage({ onTheme }: { onTheme: (t: 'dark' | 'light') => void }) {
  const [s, setS] = useState<Settings>(() => load('aurora.settings', DEFAULTS));
  const [saved, setSaved] = useState(false);

  useEffect(() => { onTheme(s.theme); }, []);

  const update = (patch: Partial<Settings>) => setS((prev) => ({ ...prev, ...patch }));

  const saveSettings = () => {
    save('aurora.settings', s);
    onTheme(s.theme);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <h2 className="font-bold text-lg mb-3">Appearance</h2>
        <div className="flex gap-2">
          <button className={`btn ${s.theme === 'dark' ? 'primary' : ''}`} onClick={() => update({ theme: 'dark' })}><Moon size={14} /> Dark</button>
          <button className={`btn ${s.theme === 'light' ? 'primary' : ''}`} onClick={() => update({ theme: 'light' })}><Sun size={14} /> Light</button>
        </div>
      </div>
      <div className="card">
        <h2 className="font-bold text-lg mb-3">AI Defaults</h2>
        <label className="text-xs text-[var(--muted)]">Default model</label>
        <select className="select mt-1" value={s.defaultModel} onChange={(e) => update({ defaultModel: e.target.value })}>
          {['openai','openai-fast','mistral','llama','deepseek','gemini','claude','qwen'].map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <label className="text-xs text-[var(--muted)] mt-3 block">Default system prompt</label>
        <textarea className="textarea mt-1" rows={3} value={s.systemPrompt} onChange={(e) => update({ systemPrompt: e.target.value })} />
      </div>
      <div className="card">
        <h2 className="font-bold text-lg mb-3">Monetization (Ads)</h2>
        <p className="text-sm text-[var(--muted)] mb-2">
          Paste your Google AdSense publisher ID (ca-pub-...) to enable ads. Leave empty to keep placeholder slots.
        </p>
        <input className="input" placeholder="ca-pub-xxxxxxxxxxxxxxxx" value={s.adClient} onChange={(e) => update({ adClient: e.target.value })} />
        <div className="text-xs text-[var(--muted)] mt-2">Note: AdSense requires site approval. Slots are already placed throughout the app.</div>
      </div>
      <div className="flex items-center gap-3">
        <button className="btn primary" onClick={saveSettings}><Save size={14} /> Save settings</button>
        {saved && <span className="text-[var(--good)] text-sm">Saved!</span>}
      </div>
    </div>
  );
}
