import { useState } from 'react';
import { Palette } from 'lucide-react';

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}
function luminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}
function contrastRatio(hex1: string, hex2: string): number {
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);
  const l1 = luminance(r1, g1, b1);
  const l2 = luminance(r2, g2, b2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export default function ColorToolsPage() {
  const [tab, setTab] = useState('convert');
  const tabs = [
    { id: 'convert', label: 'Converter' },
    { id: 'contrast', label: 'Contrast' },
    { id: 'palette', label: 'Palette from Image' },
  ];
  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <h2 className="font-bold text-lg mb-3 flex items-center gap-2"><Palette size={18} /> Color Tools</h2>
        <div className="flex gap-2 flex-wrap mb-3">
          {tabs.map((t) => (
            <button key={t.id} className={`chip ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
        </div>
        {tab === 'convert' && <ColorConvert />}
        {tab === 'contrast' && <ContrastChecker />}
        {tab === 'palette' && <PaletteFromImage />}
      </div>
    </div>
  );
}

function ColorConvert() {
  const [hex, setHex] = useState('#6366f1');
  const [r, g, b] = hexToRgb(hex);
  const [h, s, l] = rgbToHsl(r, g, b);
  const copy = (t: string) => navigator.clipboard.writeText(t);
  return (
    <div>
      <div className="flex gap-3 items-center mb-3">
        <input type="color" value={hex} onChange={(e) => setHex(e.target.value)} className="w-16 h-12 rounded cursor-pointer border border-[var(--border)]" />
        <input className="input" value={hex} onChange={(e) => setHex(e.target.value)} />
      </div>
      <div className="grid-2">
        {[
          ['HEX', hex],
          ['RGB', `rgb(${r}, ${g}, ${b})`],
          ['HSL', `hsl(${h}, ${s}%, ${l}%)`],
          ['CSS Var', `--color: ${hex};`],
        ].map(([label, val]) => (
          <div key={label} className="p-3 rounded-lg bg-[var(--panel-2)] flex items-center justify-between">
            <div>
              <div className="text-xs text-[var(--muted)]">{label}</div>
              <code className="text-sm">{val}</code>
            </div>
            <button className="btn ghost sm" onClick={() => copy(String(val))}>Copy</button>
          </div>
        ))}
      </div>
      <div className="mt-3 h-20 rounded-lg" style={{ background: hex }} />
    </div>
  );
}

function ContrastChecker() {
  const [fg, setFg] = useState('#ffffff');
  const [bg, setBg] = useState('#6366f1');
  const ratio = contrastRatio(fg, bg);
  const aa = ratio >= 4.5;
  const aaa = ratio >= 7;
  const aaLarge = ratio >= 3;
  return (
    <div>
      <div className="grid-2 mb-3">
        <div>
          <label className="text-xs text-[var(--muted)] block mb-1">Foreground</label>
          <div className="flex gap-2">
            <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="w-12 h-10 rounded cursor-pointer" />
            <input className="input" value={fg} onChange={(e) => setFg(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="text-xs text-[var(--muted)] block mb-1">Background</label>
          <div className="flex gap-2">
            <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="w-12 h-10 rounded cursor-pointer" />
            <input className="input" value={bg} onChange={(e) => setBg(e.target.value)} />
          </div>
        </div>
      </div>
      <div className="p-6 rounded-lg mb-3 flex items-center justify-center" style={{ background: bg, color: fg }}>
        <span className="text-2xl font-bold">Sample Text</span>
      </div>
      <div className="p-3 rounded-lg bg-[var(--panel-2)] mb-3">
        <div className="text-xs text-[var(--muted)]">Contrast Ratio</div>
        <div className="text-2xl font-bold">{ratio.toFixed(2)}:1</div>
      </div>
      <div className="grid-2">
        {[
          ['AA (normal text)', aa],
          ['AA (large text)', aaLarge],
          ['AAA (normal text)', aaa],
          ['AAA (large text)', ratio >= 4.5],
        ].map(([label, pass]) => (
          <div key={String(label)} className="p-2 rounded-lg bg-[var(--panel-2)] flex items-center gap-2">
            <span style={{ color: pass ? 'var(--good)' : 'var(--bad)' }}>{pass ? '✓' : '✗'}</span>
            <span className="text-sm">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PaletteFromImage() {
  const [colors, setColors] = useState<string[]>([]);
  const onFile = (f: File) => {
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const w = 100, h = 100;
      canvas.width = w; canvas.height = h;
      ctx.drawImage(img, 0, 0, w, h);
      const data = ctx.getImageData(0, 0, w, h).data;
      const buckets: Record<string, number> = {};
      for (let i = 0; i < data.length; i += 4) {
        const r = Math.round(data[i] / 32) * 32;
        const g = Math.round(data[i + 1] / 32) * 32;
        const b = Math.round(data[i + 2] / 32) * 32;
        const key = `${r},${g},${b}`;
        buckets[key] = (buckets[key] || 0) + 1;
      }
      const sorted = Object.entries(buckets).sort((a, b) => b[1] - a[1]).slice(0, 8);
      setColors(sorted.map(([k]) => {
        const [r, g, b] = k.split(',').map(Number);
        return '#' + [r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('');
      }));
    };
    img.src = url;
  };
  return (
    <div>
      <div className="border-2 border-dashed border-[var(--border)] rounded-xl p-4 text-center cursor-pointer hover:border-[var(--accent)] mb-3"
        onClick={() => document.getElementById('palette-file')?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) onFile(f); }}>
        <Palette size={20} className="mx-auto mb-1 text-[var(--muted)]" />
        <div className="text-sm text-[var(--muted)]">Click or drop an image to extract palette</div>
        <input id="palette-file" type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
      </div>
      {colors.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {colors.map((c, i) => (
            <div key={i} className="flex flex-col items-center gap-1 cursor-pointer" onClick={() => navigator.clipboard.writeText(c)}>
              <div className="w-16 h-16 rounded-lg border border-[var(--border)]" style={{ background: c }} />
              <code className="text-xs">{c}</code>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
