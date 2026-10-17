import { useState } from 'react';
import { Download, Sparkles, RefreshCw, Copy } from 'lucide-react';
import { imageUrl, IMAGE_MODELS, fetchImageBlob } from '../lib/aurora';
import { load, save, uid } from '../lib/storage';
import AdSlot from '../components/AdSlot';

interface SavedImage { id: string; prompt: string; url: string; model: string; createdAt: number; }

const SIZES = [
  { label: 'Square 1:1', w: 1024, h: 1024 },
  { label: 'Portrait 9:16', w: 768, h: 1344 },
  { label: 'Landscape 16:9', w: 1344, h: 768 },
  { label: 'Wide 3:2', w: 1280, h: 854 },
];

export default function ImagePage() {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('flux');
  const [size, setSize] = useState(0);
  const [seed, setSeed] = useState('');
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState<SavedImage[]>(() => load('aurora.images', []));

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true); setError('');
    const s = SIZES[size];
    const seedNum = seed.trim() ? Number(seed) : Math.floor(Math.random() * 1000000);
    const url = imageUrl(prompt.trim(), { width: s.w, height: s.h, model, seed: seedNum });
    // preload to catch errors
    try {
      await fetchImageBlob(url);
      setCurrent(url);
      const item: SavedImage = { id: uid(), prompt: prompt.trim(), url, model, createdAt: Date.now() };
      setSaved((prev) => [item, ...prev].slice(0, 60));
      save('aurora.images', [item, ...saved].slice(0, 60));
    } catch (e: any) {
      setError(e?.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const download = async (url: string, name = 'aurora-image.jpg') => {
    try {
      const blob = await fetchImageBlob(url);
      const u = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = u; a.download = name; a.click();
      URL.revokeObjectURL(u);
    } catch {
      window.open(url, '_blank');
    }
  };

  const removeSaved = (id: string) => {
    const next = saved.filter((s) => s.id !== id);
    setSaved(next); save('aurora.images', next);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={18} className="text-[var(--accent)]" />
          <h2 className="font-bold text-lg">Image Generation</h2>
          <span className="text-xs text-[var(--muted)]">Free, no API key</span>
        </div>
        <textarea className="textarea" rows={3} placeholder="Describe the image you want..." value={prompt} onChange={(e) => setPrompt(e.target.value)} />
        <div className="grid-2 mt-3">
          <div>
            <label className="text-xs text-[var(--muted)]">Model</label>
            <select className="select mt-1" value={model} onChange={(e) => setModel(e.target.value)}>
              {IMAGE_MODELS.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-[var(--muted)]">Size</label>
            <select className="select mt-1" value={size} onChange={(e) => setSize(Number(e.target.value))}>
              {SIZES.map((s, i) => <option key={i} value={i}>{s.label}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-3">
          <label className="text-xs text-[var(--muted)]">Seed (optional, for reproducibility)</label>
          <input className="input mt-1" value={seed} onChange={(e) => setSeed(e.target.value)} placeholder="random" />
        </div>
        <div className="flex gap-2 mt-4">
          <button className="btn primary" onClick={generate} disabled={loading || !prompt.trim()}>
            {loading ? <><span className="spinner" /> Generating...</> : <><Sparkles size={16} /> Generate</>}
          </button>
          {current && <button className="btn" onClick={() => setSeed(String(Math.floor(Math.random() * 1000000)))}><RefreshCw size={14} /> New seed</button>}
        </div>
        {error && <div className="text-[var(--bad)] text-sm mt-2">{error}</div>}
      </div>

      {current && (
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold">Result</div>
            <div className="flex gap-2">
              <button className="btn text-xs" onClick={() => navigator.clipboard.writeText(current)}><Copy size={12} /> Copy URL</button>
              <button className="btn primary text-xs" onClick={() => download(current)}><Download size={12} /> Download</button>
            </div>
          </div>
          <img src={current} alt="generated" className="w-full rounded-xl" />
          <div className="text-xs text-[var(--muted)] mt-2 break-all">{current}</div>
        </div>
      )}

      <AdSlot slot="3333333333" />

      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Saved gallery ({saved.length})</h3>
        </div>
        {saved.length === 0 ? (
          <div className="text-sm text-[var(--muted)] text-center py-6">No saved images yet.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {saved.map((s) => (
              <div key={s.id} className="relative group">
                <img src={s.url} alt={s.prompt} className="w-full aspect-square object-cover rounded-lg cursor-pointer" onClick={() => setCurrent(s.url)} />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-end p-2 rounded-lg">
                  <div className="text-xs text-white truncate flex-1">{s.prompt}</div>
                  <button className="btn ghost text-xs" onClick={() => download(s.url)}><Download size={12} /></button>
                  <button className="btn danger text-xs" onClick={() => removeSaved(s.id)}>×</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
