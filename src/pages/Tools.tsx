import { useState, useMemo } from 'react';
import { Copy, Check } from 'lucide-react';

function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = (t: string) => { navigator.clipboard.writeText(t); setCopied(true); setTimeout(() => setCopied(false), 1200); };
  return { copied, copy };
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="card"><h3 className="font-semibold mb-3">{title}</h3>{children}</div>;
}

export default function ToolsPage() {
  const [tool, setTool] = useState('json');
  const tools = [
    { id: 'json', label: 'JSON' },
    { id: 'base64', label: 'Base64' },
    { id: 'jwt', label: 'JWT' },
    { id: 'regex', label: 'Regex' },
    { id: 'color', label: 'Color' },
    { id: 'md', label: 'Markdown' },
    { id: 'hash', label: 'Hash' },
    { id: 'text', label: 'Text' },
    { id: 'url', label: 'URL' },
    { id: 'password', label: 'Password' },
    { id: 'qr', label: 'QR Code' },
    { id: 'units', label: 'Units' },
    { id: 'base', label: 'Base Conv' },
    { id: 'diff', label: 'Diff' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="tabbar">
        {tools.map((t) => (
          <button key={t.id} className={`tab ${tool === t.id ? 'active' : ''}`} onClick={() => setTool(t.id)}>{t.label}</button>
        ))}
      </div>
      {tool === 'json' && <JsonTool />}
      {tool === 'base64' && <Base64Tool />}
      {tool === 'jwt' && <JwtTool />}
      {tool === 'regex' && <RegexTool />}
      {tool === 'color' && <ColorTool />}
      {tool === 'md' && <MdTool />}
      {tool === 'hash' && <HashTool />}
      {tool === 'text' && <TextTool />}
      {tool === 'url' && <UrlTool />}
      {tool === 'password' && <PasswordTool />}
      {tool === 'qr' && <QrTool />}
      {tool === 'units' && <UnitsTool />}
      {tool === 'base' && <BaseTool />}
      {tool === 'diff' && <DiffTool />}
    </div>
  );
}

function JsonTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [err, setErr] = useState('');
  const { copied, copy } = useCopy();
  const format = () => {
    try { setOutput(JSON.stringify(JSON.parse(input), null, 2)); setErr(''); }
    catch (e: any) { setErr(e.message); setOutput(''); }
  };
  const minify = () => {
    try { setOutput(JSON.stringify(JSON.parse(input))); setErr(''); }
    catch (e: any) { setErr(e.message); setOutput(''); }
  };
  return (
    <Panel title="JSON Formatter / Validator">
      <textarea className="textarea" rows={8} value={input} onChange={(e) => setInput(e.target.value)} placeholder='{"a":1}' />
      <div className="flex gap-2 mt-3">
        <button className="btn primary" onClick={format}>Format</button>
        <button className="btn" onClick={minify}>Minify</button>
        <button className="btn" onClick={() => copy(output)} disabled={!output}>{copied ? <Check size={14} /> : <Copy size={14} />} Copy</button>
      </div>
      {err && <div className="text-[var(--bad)] text-sm mt-2">{err}</div>}
      {output && <pre className="mt-3 p-3 rounded-lg bg-[var(--panel-2)] overflow-auto text-sm">{output}</pre>}
    </Panel>
  );
}

function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const { copied, copy } = useCopy();
  return (
    <Panel title="Base64 Encode / Decode">
      <textarea className="textarea" rows={6} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Text..." />
      <div className="flex gap-2 mt-3">
        <button className="btn primary" onClick={() => { try { setOutput(btoa(unescape(encodeURIComponent(input)))); } catch (e: any) { setOutput('Error'); } }}>Encode</button>
        <button className="btn" onClick={() => { try { setOutput(decodeURIComponent(escape(atob(input)))); } catch (e: any) { setOutput('Error'); } }}>Decode</button>
        <button className="btn" onClick={() => copy(output)} disabled={!output}>{copied ? <Check size={14} /> : <Copy size={14} />} Copy</button>
      </div>
      {output && <pre className="mt-3 p-3 rounded-lg bg-[var(--panel-2)] overflow-auto text-sm break-all">{output}</pre>}
    </Panel>
  );
}

function JwtTool() {
  const [input, setInput] = useState('');
  const decoded = useMemo(() => {
    if (!input.trim()) return null;
    try {
      const parts = input.split('.');
      if (parts.length < 2) throw new Error('Invalid JWT');
      const dec = (s: string) => JSON.parse(decodeURIComponent(escape(atob(s.replace(/-/g, '+').replace(/_/g, '/')))));
      return { header: dec(parts[0]), payload: dec(parts[1]) };
    } catch (e: any) {
      return { error: e.message };
    }
  }, [input]);
  return (
    <Panel title="JWT Decoder">
      <textarea className="textarea" rows={4} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste JWT..." />
      {decoded && 'error' in decoded && <div className="text-[var(--bad)] text-sm mt-2">{decoded.error}</div>}
      {decoded && 'header' in decoded && (
        <div className="grid-2 mt-3">
          <div>
            <div className="text-xs text-[var(--muted)] mb-1">Header</div>
            <pre className="p-3 rounded-lg bg-[var(--panel-2)] text-sm overflow-auto">{JSON.stringify(decoded.header, null, 2)}</pre>
          </div>
          <div>
            <div className="text-xs text-[var(--muted)] mb-1">Payload</div>
            <pre className="p-3 rounded-lg bg-[var(--panel-2)] text-sm overflow-auto">{JSON.stringify(decoded.payload, null, 2)}</pre>
          </div>
        </div>
      )}
    </Panel>
  );
}

function RegexTool() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('');
  const matches = useMemo(() => {
    if (!pattern) return [];
    try {
      const re = new RegExp(pattern, flags);
      const out: string[] = [];
      let m;
      if (flags.includes('g')) {
        while ((m = re.exec(text)) !== null) { out.push(m[0]); if (!re.global) break; }
      } else {
        m = re.exec(text); if (m) out.push(m[0]);
      }
      return out;
    } catch { return []; }
  }, [pattern, flags, text]);
  return (
    <Panel title="Regex Tester">
      <div className="grid-2">
        <input className="input" value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="pattern" />
        <input className="input" value={flags} onChange={(e) => setFlags(e.target.value)} placeholder="flags (gim)" />
      </div>
      <textarea className="textarea mt-3" rows={6} value={text} onChange={(e) => setText(e.target.value)} placeholder="Test text..." />
      <div className="mt-3 text-sm">
        <span className="text-[var(--muted)]">Matches: </span>
        <span className="font-semibold">{matches.length}</span>
        {matches.length > 0 && <div className="flex flex-wrap gap-1 mt-2">{matches.map((m, i) => <span key={i} className="chip">{m}</span>)}</div>}
      </div>
    </Panel>
  );
}

function ColorTool() {
  const [hex, setHex] = useState('#7c5cff');
  const toRgb = (h: string) => {
    const r = parseInt(h.slice(1, 3), 16), g = parseInt(h.slice(3, 5), 16), b = parseInt(h.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
  };
  return (
    <Panel title="Color Converter">
      <div className="flex gap-3 items-center">
        <input type="color" value={hex} onChange={(e) => setHex(e.target.value)} className="w-16 h-12 rounded cursor-pointer border border-[var(--border)]" />
        <input className="input" value={hex} onChange={(e) => setHex(e.target.value)} />
      </div>
      <div className="grid-2 mt-3">
        <div className="p-3 rounded-lg bg-[var(--panel-2)]">
          <div className="text-xs text-[var(--muted)]">HEX</div>
          <div className="font-mono">{hex}</div>
        </div>
        <div className="p-3 rounded-lg bg-[var(--panel-2)]">
          <div className="text-xs text-[var(--muted)]">RGB</div>
          <div className="font-mono">rgb({toRgb(hex)})</div>
        </div>
      </div>
      <div className="mt-3 h-20 rounded-lg" style={{ background: hex }} />
    </Panel>
  );
}

function MdTool() {
  const [input, setInput] = useState('# Hello\n\n**Bold** and *italic*\n\n- item 1\n- item 2');
  return (
    <Panel title="Markdown Preview">
      <div className="grid-2">
        <textarea className="textarea" rows={12} value={input} onChange={(e) => setInput(e.target.value)} />
        <div className="p-3 rounded-lg bg-[var(--panel-2)] overflow-auto prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: simpleMd(input) }} />
      </div>
    </Panel>
  );
}

function simpleMd(s: string): string {
  return s
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/^### (.*)$/gm, '<h3>$1</h3>')
    .replace(/^## (.*)$/gm, '<h2>$1</h2>')
    .replace(/^# (.*)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/^- (.*)$/gm, '<li>$1</li>')
    .replace(/\n/g, '<br/>');
}

function HashTool() {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState<{ algo: string; value: string }[]>([]);
  const run = async () => {
    const enc = new TextEncoder().encode(input);
    const algos = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];
    const res = await Promise.all(algos.map(async (a) => {
      const buf = await crypto.subtle.digest(a, enc);
      const hex = Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
      return { algo: a, value: hex };
    }));
    setHashes(res);
  };
  const { copied, copy } = useCopy();
  return (
    <Panel title="Hash Generator">
      <textarea className="textarea" rows={4} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Text to hash..." />
      <button className="btn primary mt-3" onClick={run}>Generate</button>
      <div className="mt-3 flex flex-col gap-2">
        {hashes.map((h) => (
          <div key={h.algo} className="p-2 rounded-lg bg-[var(--panel-2)] flex items-center gap-2">
            <span className="text-xs text-[var(--muted)] w-20">{h.algo}</span>
            <code className="text-xs flex-1 break-all">{h.value}</code>
            <button className="btn ghost text-xs" onClick={() => copy(h.value)}>{copied ? <Check size={12} /> : <Copy size={12} />}</button>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function TextTool() {
  const [input, setInput] = useState('');
  const words = input.trim() ? input.trim().split(/\s+/).length : 0;
  const chars = input.length;
  const lines = input ? input.split('\n').length : 0;
  const sentences = input.trim() ? (input.match(/[.!?]+/g) || []).length : 0;
  return (
    <Panel title="Text Stats">
      <textarea className="textarea" rows={8} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste text..." />
      <div className="grid-2 mt-3">
        <Stat label="Words" value={words} />
        <Stat label="Characters" value={chars} />
        <Stat label="Lines" value={lines} />
        <Stat label="Sentences" value={sentences} />
      </div>
    </Panel>
  );
}
function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-3 rounded-lg bg-[var(--panel-2)]">
      <div className="text-xs text-[var(--muted)]">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}

function UrlTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const { copied, copy } = useCopy();
  return (
    <Panel title="URL Encode / Decode">
      <textarea className="textarea" rows={4} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Text or URL..." />
      <div className="flex gap-2 mt-3">
        <button className="btn primary" onClick={() => setOutput(encodeURIComponent(input))}>Encode</button>
        <button className="btn" onClick={() => { try { setOutput(decodeURIComponent(input)); } catch { setOutput('Error'); } }}>Decode</button>
        <button className="btn" onClick={() => copy(output)} disabled={!output}>{copied ? <Check size={14} /> : <Copy size={14} />} Copy</button>
      </div>
      {output && <pre className="mt-3 p-3 rounded-lg bg-[var(--panel-2)] overflow-auto text-sm break-all">{output}</pre>}
    </Panel>
  );
}
function PasswordTool() {
  const [len, setLen] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [nums, setNums] = useState(true);
  const [syms, setSyms] = useState(true);
  const [out, setOut] = useState('');
  const gen = () => {
    let chars = '';
    if (upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (nums) chars += '0123456789';
    if (syms) chars += '!@#$%^&*()_+-=[]{};:,.?';
    if (!chars) { setOut(''); return; }
    let r = '';
    const arr = new Uint32Array(len);
    crypto.getRandomValues(arr);
    for (let i = 0; i < len; i++) r += chars[arr[i] % chars.length];
    setOut(r);
  };
  const { copied, copy } = useCopy();
  return (
    <Panel title="Password Generator">
      <div className="flex items-center gap-3 mb-3">
        <label className="text-xs text-[var(--muted)]">Length {len}</label>
        <input type="range" min="4" max="64" value={len} onChange={(e) => setLen(Number(e.target.value))} className="flex-1" />
      </div>
      <div className="flex flex-wrap gap-3 mb-3">
        {[
          ['Uppercase', upper, setUpper],
          ['Lowercase', lower, setLower],
          ['Numbers', nums, setNums],
          ['Symbols', syms, setSyms],
        ].map(([label, val, set]: any) => (
          <label key={label} className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={val} onChange={(e) => set(e.target.checked)} /> {label}
          </label>
        ))}
      </div>
      <div className="flex gap-2">
        <button className="btn primary" onClick={gen}>Generate</button>
        <button className="btn" onClick={() => copy(out)} disabled={!out}>{copied ? <Check size={14} /> : <Copy size={14} />} Copy</button>
      </div>
      {out && <pre className="mt-3 p-3 rounded-lg bg-[var(--panel-2)] font-mono break-all">{out}</pre>}
    </Panel>
  );
}

function QrTool() {
  const [text, setText] = useState('https://github.com/myrajibgit/allfreeaccess');
  const [size, setSize] = useState(256);
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`;
  return (
    <Panel title="QR Code Generator">
      <input className="input" value={text} onChange={(e) => setText(e.target.value)} placeholder="Text or URL..." />
      <div className="flex items-center gap-3 mt-3">
        <label className="text-xs text-[var(--muted)]">Size {size}px</label>
        <input type="range" min="128" max="512" step="32" value={size} onChange={(e) => setSize(Number(e.target.value))} className="flex-1" />
      </div>
      {text && (
        <div className="mt-4 flex flex-col items-center gap-2">
          <img src={url} alt="qr" className="rounded-lg border border-[var(--border)]" />
          <a className="btn text-xs" href={url} download="qr.png" target="_blank" rel="noreferrer">Download</a>
        </div>
      )}
    </Panel>
  );
}

function UnitsTool() {
  const [val, setVal] = useState('1');
  const [from, setFrom] = useState('km');
  const [to, setTo] = useState('mi');
  const factors: Record<string, number> = { km: 1000, mi: 1609.34, m: 1, ft: 0.3048, cm: 0.01, in: 0.0254, kg: 1, lb: 0.453592, g: 0.001, oz: 0.0283495, l: 1, gal: 3.78541, ml: 0.001 };
  const groups: Record<string, string[]> = {
    length: ['km', 'mi', 'm', 'ft', 'cm', 'in'],
    weight: ['kg', 'lb', 'g', 'oz'],
    volume: ['l', 'gal', 'ml'],
  };
  const groupOf = (u: string) => Object.keys(groups).find((g) => groups[g].includes(u))!;
  const result = (() => {
    const n = Number(val);
    if (isNaN(n)) return '';
    if (groupOf(from) !== groupOf(to)) return 'Incompatible units';
    return String((n * factors[from]) / factors[to]);
  })();
  const allUnits = Object.values(groups).flat();
  return (
    <Panel title="Unit Converter">
      <div className="grid-2">
        <input className="input" type="number" value={val} onChange={(e) => setVal(e.target.value)} />
        <div className="flex gap-2">
          <select className="select" value={from} onChange={(e) => setFrom(e.target.value)}>
            {allUnits.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
          <span className="self-center">?</span>
          <select className="select" value={to} onChange={(e) => setTo(e.target.value)}>
            {allUnits.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      </div>
      <div className="mt-3 p-3 rounded-lg bg-[var(--panel-2)]">
        <div className="text-xs text-[var(--muted)]">Result</div>
        <div className="text-xl font-bold">{result}</div>
      </div>
    </Panel>
  );
}

function BaseTool() {
  const [val, setVal] = useState('255');
  const [from, setFrom] = useState(10);
  const [to, setTo] = useState(16);
  const result = (() => {
    try {
      const n = parseInt(val, from);
      if (isNaN(n)) return 'Invalid';
      return n.toString(to).toUpperCase();
    } catch { return 'Error'; }
  })();
  return (
    <Panel title="Number Base Converter">
      <div className="grid-2">
        <input className="input font-mono" value={val} onChange={(e) => setVal(e.target.value)} placeholder="value" />
        <div className="flex gap-2">
          <select className="select" value={from} onChange={(e) => setFrom(Number(e.target.value))}>
            {[2, 8, 10, 16].map((b) => <option key={b} value={b}>Base {b}</option>)}
          </select>
          <span className="self-center">?</span>
          <select className="select" value={to} onChange={(e) => setTo(Number(e.target.value))}>
            {[2, 8, 10, 16].map((b) => <option key={b} value={b}>Base {b}</option>)}
          </select>
        </div>
      </div>
      <div className="mt-3 p-3 rounded-lg bg-[var(--panel-2)]">
        <div className="text-xs text-[var(--muted)]">Result</div>
        <div className="text-xl font-mono font-bold">{result}</div>
      </div>
    </Panel>
  );
}

function DiffTool() {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const diff = useMemo(() => {
    const la = a.split('\n');
    const lb = b.split('\n');
    const out: { type: 'same' | 'add' | 'del'; text: string }[] = [];
    const max = Math.max(la.length, lb.length);
    for (let i = 0; i < max; i++) {
      if (la[i] === lb[i]) out.push({ type: 'same', text: la[i] ?? '' });
      else {
        if (la[i] !== undefined) out.push({ type: 'del', text: la[i] });
        if (lb[i] !== undefined) out.push({ type: 'add', text: lb[i] });
      }
    }
    return out;
  }, [a, b]);
  return (
    <Panel title="Text Diff">
      <div className="grid-2">
        <textarea className="textarea" rows={8} value={a} onChange={(e) => setA(e.target.value)} placeholder="Original..." />
        <textarea className="textarea" rows={8} value={b} onChange={(e) => setB(e.target.value)} placeholder="Modified..." />
      </div>
      <div className="mt-3 p-3 rounded-lg bg-[var(--panel-2)] font-mono text-sm max-h-64 overflow-auto">
        {diff.map((d, i) => (
          <div key={i} style={{ color: d.type === 'add' ? 'var(--good)' : d.type === 'del' ? 'var(--bad)' : 'var(--text)' }}>
            {d.type === 'add' ? '+ ' : d.type === 'del' ? '- ' : '  '}{d.text}
          </div>
        ))}
      </div>
    </Panel>
  );
}
