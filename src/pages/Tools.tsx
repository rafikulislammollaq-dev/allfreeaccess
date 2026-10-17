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
