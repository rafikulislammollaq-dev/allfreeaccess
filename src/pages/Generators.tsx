import { useState } from 'react';
import { Palette } from 'lucide-react';

export default function GeneratorsPage() {
  const [tab, setTab] = useState('lorem');
  const tabs = [
    { id: 'lorem', label: 'Lorem Ipsum' },
    { id: 'palette', label: 'Color Palette' },
    { id: 'gradient', label: 'CSS Gradient' },
    { id: 'shadow', label: 'Box Shadow' },
    { id: 'meta', label: 'Meta Tags' },
    { id: 'slug', label: 'Slug' },
    { id: 'case', label: 'Text Case' },
    { id: 'timestamp', label: 'Timestamp' },
    { id: 'json2ts', label: 'JSON→TS' },
    { id: 'cron', label: 'Cron' },
  ];
  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <h2 className="font-bold text-lg mb-3 flex items-center gap-2"><Palette size={18} /> Generators & Converters</h2>
        <div className="flex gap-2 flex-wrap mb-3">
          {tabs.map((t) => (
            <button key={t.id} className={`chip ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
        </div>
        {tab === 'lorem' && <LoremTool />}
        {tab === 'palette' && <PaletteTool />}
        {tab === 'gradient' && <GradientTool />}
        {tab === 'shadow' && <ShadowTool />}
        {tab === 'meta' && <MetaTool />}
        {tab === 'slug' && <SlugTool />}
        {tab === 'case' && <CaseTool />}
        {tab === 'timestamp' && <TimestampTool />}
        {tab === 'json2ts' && <Json2TsTool />}
        {tab === 'cron' && <CronTool />}
      </div>
    </div>
  );
}

function copy(t: string) { navigator.clipboard.writeText(t); }

function LoremTool() {
  const [n, setN] = useState(3);
  const [type, setType] = useState('paragraphs');
  const words = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum'.split(' ');
  const gen = () => {
    const out: string[] = [];
    if (type === 'paragraphs') {
      for (let i = 0; i < n; i++) {
        let p = '';
        const len = 40 + Math.floor(Math.random() * 40);
        for (let j = 0; j < len; j++) p += words[Math.floor(Math.random() * words.length)] + ' ';
        out.push(p.trim() + '.');
      }
      return out.join('\n\n');
    } else if (type === 'sentences') {
      for (let i = 0; i < n; i++) {
        let s = '';
        const len = 8 + Math.floor(Math.random() * 12);
        for (let j = 0; j < len; j++) s += words[Math.floor(Math.random() * words.length)] + ' ';
        out.push(s.trim().charAt(0).toUpperCase() + s.trim().slice(1) + '.');
      }
      return out.join(' ');
    } else {
      const arr: string[] = [];
      for (let i = 0; i < n; i++) arr.push(words[Math.floor(Math.random() * words.length)]);
      return arr.join(', ');
    }
  };
  const [result, setResult] = useState('');
  return (
    <div>
      <div className="flex gap-2 mb-3">
        <select className="select" style={{ width: 160 }} value={type} onChange={(e) => setType(e.target.value)}>
          <option value="paragraphs">Paragraphs</option>
          <option value="sentences">Sentences</option>
          <option value="words">Words</option>
        </select>
        <input className="input" type="number" style={{ width: 100 }} value={n} onChange={(e) => setN(Number(e.target.value))} />
        <button className="btn primary" onClick={() => setResult(gen())}>Generate</button>
        <button className="btn" onClick={() => copy(result)} disabled={!result}>Copy</button>
      </div>
      {result && <textarea className="textarea" rows={8} value={result} readOnly />}
    </div>
  );
}

function PaletteTool() {
  const [base, setBase] = useState('#6366f1');
  const [count, setCount] = useState(5);
  const gen = () => {
    const colors: string[] = [];
    for (let i = 0; i < count; i++) {
      const hue = (parseInt(base.slice(1), 16) + i * 30) % 360;
      colors.push(hslToHex(hue, 65, 55));
    }
    return colors;
  };
  const colors = gen();
  return (
    <div>
      <div className="flex gap-2 mb-3">
        <input type="color" value={base} onChange={(e) => setBase(e.target.value)} className="w-12 h-10 rounded cursor-pointer border border-[var(--border)]" />
        <input className="input" value={base} onChange={(e) => setBase(e.target.value)} style={{ width: 120 }} />
        <select className="select" style={{ width: 120 }} value={count} onChange={(e) => setCount(Number(e.target.value))}>
          {[3,5,7,9].map((c) => <option key={c} value={c}>{c} colors</option>)}
        </select>
      </div>
      <div className="flex gap-2 flex-wrap">
        {colors.map((c, i) => (
          <div key={i} className="flex flex-col items-center gap-1 cursor-pointer" onClick={() => copy(c)}>
            <div className="w-16 h-16 rounded-lg border border-[var(--border)]" style={{ background: c }} />
            <code className="text-xs">{c}</code>
          </div>
        ))}
      </div>
    </div>
  );
}
function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (x: number) => Math.round(x * 255).toString(16).padStart(2, '0');
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

function GradientTool() {
  const [c1, setC1] = useState('#6366f1');
  const [c2, setC2] = useState('#22d3ee');
  const [angle, setAngle] = useState(135);
  const [type, setType] = useState('linear');
  const css = type === 'linear'
    ? `linear-gradient(${angle}deg, ${c1}, ${c2})`
    : `radial-gradient(circle, ${c1}, ${c2})`;
  return (
    <div>
      <div className="grid-2 mb-3">
        <div><label className="text-xs text-[var(--muted)] block mb-1">Color 1</label><input type="color" value={c1} onChange={(e) => setC1(e.target.value)} className="w-full h-10 rounded cursor-pointer" /></div>
        <div><label className="text-xs text-[var(--muted)] block mb-1">Color 2</label><input type="color" value={c2} onChange={(e) => setC2(e.target.value)} className="w-full h-10 rounded cursor-pointer" /></div>
      </div>
      <div className="mb-3">
        <label className="text-xs text-[var(--muted)] block mb-1">Type</label>
        <div className="flex gap-2">
          <button className={`chip ${type === 'linear' ? 'active' : ''}`} onClick={() => setType('linear')}>Linear</button>
          <button className={`chip ${type === 'radial' ? 'active' : ''}`} onClick={() => setType('radial')}>Radial</button>
        </div>
      </div>
      {type === 'linear' && (
        <div className="mb-3">
          <label className="text-xs text-[var(--muted)] block mb-1">Angle {angle}°</label>
          <input type="range" min="0" max="360" value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="w-full" />
        </div>
      )}
      <div className="h-24 rounded-lg mb-3" style={{ background: css }} />
      <div className="flex gap-2">
        <code className="flex-1 p-2 rounded bg-[var(--panel-2)] text-xs font-mono break-all">background: {css};</code>
        <button className="btn text-xs" onClick={() => copy(`background: ${css};`)}>Copy</button>
      </div>
    </div>
  );
}

function ShadowTool() {
  const [x, setX] = useState(4); const [y, setY] = useState(4); const [blur, setBlur] = useState(10); const [spread, setSpread] = useState(0);
  const [color, setColor] = useState('#000000'); const [opacity, setOpacity] = useState(0.25);
  const hex = color + Math.round(opacity * 255).toString(16).padStart(2, '0');
  const css = `${x}px ${y}px ${blur}px ${spread}px ${hex}`;
  return (
    <div>
      <div className="grid-2 mb-3">
        {[['X', x, setX], ['Y', y, setY], ['Blur', blur, setBlur], ['Spread', spread, setSpread]].map(([l, v, s]: any) => (
          <div key={l}>
            <label className="text-xs text-[var(--muted)] block mb-1">{l} {v}</label>
            <input type="range" min="-50" max="50" value={v} onChange={(e) => s(Number(e.target.value))} className="w-full" />
          </div>
        ))}
      </div>
      <div className="grid-2 mb-3">
        <div><label className="text-xs text-[var(--muted)] block mb-1">Color</label><input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-10 rounded cursor-pointer" /></div>
        <div><label className="text-xs text-[var(--muted)] block mb-1">Opacity {opacity.toFixed(2)}</label><input type="range" min="0" max="1" step="0.01" value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full" /></div>
      </div>
      <div className="h-24 rounded-lg mb-3 flex items-center justify-center bg-[var(--panel-2)]">
        <div className="w-16 h-16 bg-[var(--accent)] rounded-lg" style={{ boxShadow: css }} />
      </div>
      <div className="flex gap-2">
        <code className="flex-1 p-2 rounded bg-[var(--panel-2)] text-xs font-mono break-all">box-shadow: {css};</code>
        <button className="btn text-xs" onClick={() => copy(`box-shadow: ${css};`)}>Copy</button>
      </div>
    </div>
  );
}

function MetaTool() {
  const [title, setTitle] = useState('My Website');
  const [desc, setDesc] = useState('A great website');
  const [url, setUrl] = useState('https://example.com');
  const [image, setImage] = useState('https://example.com/og.png');
  const [author, setAuthor] = useState('');
  const meta = `<title>${title}</title>
<meta name="description" content="${desc}" />
<meta name="author" content="${author}" />
<link rel="canonical" href="${url}" />

<!-- Open Graph -->
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${desc}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${image}" />
<meta property="og:type" content="website" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${desc}" />
<meta name="twitter:image" content="${image}" />`;
  return (
    <div>
      <div className="grid-2 mb-3">
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <input className="input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="URL" />
        <input className="input" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description" />
        <input className="input" value={image} onChange={(e) => setImage(e.target.value)} placeholder="OG Image URL" />
        <input className="input" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author" />
      </div>
      <pre className="p-3 rounded-lg bg-[var(--panel-2)] text-xs font-mono overflow-x-auto">{meta}</pre>
      <button className="btn text-xs mt-2" onClick={() => copy(meta)}>Copy</button>
    </div>
  );
}

function SlugTool() {
  const [text, setText] = useState('');
  const slug = text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return (
    <div>
      <input className="input" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text to slugify..." />
      <div className="mt-3 p-3 rounded-lg bg-[var(--panel-2)]">
        <div className="text-xs text-[var(--muted)]">Slug</div>
        <div className="font-mono">{slug || '—'}</div>
      </div>
      <button className="btn text-xs mt-2" onClick={() => copy(slug)} disabled={!slug}>Copy</button>
    </div>
  );
}

function CaseTool() {
  const [text, setText] = useState('');
  const cases = {
    'UPPER': text.toUpperCase(),
    'lower': text.toLowerCase(),
    'Title Case': text.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()),
    'camelCase': text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()),
    'snake_case': text.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '_'),
    'kebab-case': text.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-'),
    'PascalCase': text.replace(/(^|[^a-zA-Z0-9])(\w)/g, (_, __, c) => c.toUpperCase()).replace(/[^a-zA-Z0-9]/g, ''),
  };
  return (
    <div>
      <textarea className="textarea" rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text..." />
      <div className="grid-2 mt-3">
        {Object.entries(cases).map(([k, v]) => (
          <div key={k} className="p-2 rounded-lg bg-[var(--panel-2)]">
            <div className="text-xs text-[var(--muted)]">{k}</div>
            <div className="text-sm font-mono break-all">{v || '—'}</div>
            <button className="btn ghost text-xs mt-1" onClick={() => copy(v)} disabled={!v}>Copy</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function TimestampTool() {
  const [ts, setTs] = useState('');
  const [date, setDate] = useState('');
  const fromTs = ts ? new Date(Number(ts) * (ts.length > 10 ? 1 : 1000)).toISOString() : '';
  const fromDate = date ? Math.floor(new Date(date).getTime() / 1000) : '';
  const now = Math.floor(Date.now() / 1000);
  return (
    <div>
      <div className="grid-2">
        <div>
          <label className="text-xs text-[var(--muted)] block mb-1">Unix timestamp → date</label>
          <input className="input" value={ts} onChange={(e) => setTs(e.target.value)} placeholder="1700000000" />
          <div className="mt-2 p-2 rounded bg-[var(--panel-2)] text-sm font-mono">{fromTs || '—'}</div>
        </div>
        <div>
          <label className="text-xs text-[var(--muted)] block mb-1">Date → Unix timestamp</label>
          <input className="input" type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
          <div className="mt-2 p-2 rounded bg-[var(--panel-2)] text-sm font-mono">{fromDate || '—'}</div>
        </div>
      </div>
      <div className="mt-3 p-3 rounded-lg bg-[var(--panel-2)]">
        <div className="text-xs text-[var(--muted)]">Current timestamp</div>
        <div className="font-mono">{now}</div>
        <button className="btn text-xs mt-1" onClick={() => copy(String(now))}>Copy</button>
      </div>
    </div>
  );
}

function Json2TsTool() {
  const [input, setInput] = useState('{"name":"John","age":30,"active":true}');
  const [output, setOutput] = useState('');
  const convert = () => {
    try {
      const obj = JSON.parse(input);
      const gen = (o: any, indent = ''): string => {
        if (Array.isArray(o)) {
          if (o.length === 0) return 'any[]';
          return gen(o[0], indent) + '[]';
        }
        if (o === null) return 'null';
        if (typeof o === 'object') {
          const lines = Object.entries(o).map(([k, v]) => `${indent}  ${k}: ${gen(v, indent + '  ')};`);
          return `{\n${lines.join('\n')}\n${indent}}`;
        }
        return typeof o;
      };
      setOutput(`interface Root ${gen(obj)}`);
    } catch (e: any) { setOutput('Error: ' + e.message); }
  };
  return (
    <div>
      <textarea className="textarea" rows={6} value={input} onChange={(e) => setInput(e.target.value)} />
      <button className="btn primary mt-2" onClick={convert}>Convert</button>
      <button className="btn text-xs mt-2 ml-2" onClick={() => copy(output)} disabled={!output}>Copy</button>
      {output && <pre className="mt-3 p-3 rounded-lg bg-[var(--panel-2)] text-sm font-mono overflow-x-auto">{output}</pre>}
    </div>
  );
}

function CronTool() {
  const [expr, setExpr] = useState('*/5 * * * *');
  const parts = expr.trim().split(/\s+/);
  const desc = parts.length === 5
    ? `Minute: ${parts[0]}, Hour: ${parts[1]}, Day: ${parts[2]}, Month: ${parts[3]}, Weekday: ${parts[4]}`
    : 'Enter a 5-field cron expression';
  const presets = [
    { label: 'Every minute', v: '* * * * *' },
    { label: 'Every 5 min', v: '*/5 * * * *' },
    { label: 'Every hour', v: '0 * * * *' },
    { label: 'Daily midnight', v: '0 0 * * *' },
    { label: 'Weekly (Sun)', v: '0 0 * * 0' },
    { label: 'Monthly', v: '0 0 1 * *' },
  ];
  return (
    <div>
      <input className="input font-mono" value={expr} onChange={(e) => setExpr(e.target.value)} placeholder="* * * * *" />
      <div className="mt-3 p-3 rounded-lg bg-[var(--panel-2)]">
        <div className="text-xs text-[var(--muted)]">Description</div>
        <div className="text-sm">{desc}</div>
      </div>
      <div className="flex gap-2 flex-wrap mt-3">
        {presets.map((p) => (
          <button key={p.v} className="chip" onClick={() => setExpr(p.v)}>{p.label}</button>
        ))}
      </div>
    </div>
  );
}
