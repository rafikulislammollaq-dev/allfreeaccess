import { useState } from 'react';
import { Lock, Unlock } from 'lucide-react';

const MORSE: Record<string, string> = {
  a: '.-', b: '-...', c: '-.-.', d: '-..', e: '.', f: '..-.', g: '--.', h: '....', i: '..', j: '.---',
  k: '-.-', l: '.-..', m: '--', n: '-.', o: '---', p: '.--.', q: '--.-', r: '.-.', s: '...', t: '-',
  u: '..-', v: '...-', w: '.--', x: '-..-', y: '-.--', z: '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
  '6': '-....', '7': '--...', '8': '---..', '9': '----.', ' ': '/',
};

export default function EncodePage() {
  const [input, setInput] = useState('');
  const [tab, setTab] = useState('html');
  const tabs = ['html', 'hex', 'binary', 'base64', 'rot13', 'morse', 'url'];
  const encode = (t: string, type: string): string => {
    try {
      switch (type) {
        case 'html': return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        case 'hex': return Array.from(new TextEncoder().encode(t)).map((b) => b.toString(16).padStart(2, '0')).join(' ');
        case 'binary': return Array.from(new TextEncoder().encode(t)).map((b) => b.toString(2).padStart(8, '0')).join(' ');
        case 'base64': return btoa(unescape(encodeURIComponent(t)));
        case 'rot13': return t.replace(/[a-zA-Z]/g, (c) => {
          const base = c <= 'Z' ? 65 : 97;
          return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
        });
        case 'morse': return t.toLowerCase().split('').map((c) => MORSE[c] || c).join(' ');
        case 'url': return encodeURIComponent(t);
        default: return t;
      }
    } catch { return 'Error'; }
  };
  const decode = (t: string, type: string): string => {
    try {
      switch (type) {
        case 'html': return t.replace(/&quot;/g, '"').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');
        case 'hex': return new TextDecoder().decode(new Uint8Array(t.split(/\s+/).map((h) => parseInt(h, 16))));
        case 'binary': return new TextDecoder().decode(new Uint8Array(t.split(/\s+/).map((b) => parseInt(b, 2))));
        case 'base64': return decodeURIComponent(escape(atob(t)));
        case 'rot13': return encode(t, 'rot13');
        case 'url': return decodeURIComponent(t);
        default: return t;
      }
    } catch { return 'Error'; }
  };
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const result = mode === 'encode' ? encode(input, tab) : decode(input, tab);
  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <h2 className="font-bold text-lg mb-3 flex items-center gap-2"><Lock size={18} /> Encode / Decode</h2>
        <div className="flex gap-2 flex-wrap mb-3">
          {tabs.map((t) => (
            <button key={t} className={`chip ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>
        <div className="flex gap-2 mb-3">
          <button className={`chip ${mode === 'encode' ? 'active' : ''}`} onClick={() => setMode('encode')}><Lock size={12} /> Encode</button>
          <button className={`chip ${mode === 'decode' ? 'active' : ''}`} onClick={() => setMode('decode')}><Unlock size={12} /> Decode</button>
        </div>
        <textarea className="textarea" rows={4} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Input..." />
        <div className="mt-3 p-3 rounded-lg bg-[var(--panel-2)]">
          <div className="text-xs text-[var(--muted)] mb-1">Result</div>
          <pre className="text-sm font-mono whitespace-pre-wrap break-all">{result || '—'}</pre>
        </div>
        <button className="btn text-xs mt-2" onClick={() => navigator.clipboard.writeText(result)} disabled={!result}>Copy</button>
      </div>
    </div>
  );
}
