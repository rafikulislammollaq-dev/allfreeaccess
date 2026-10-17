import { useState } from 'react';
import { Shield, Lock, Unlock } from 'lucide-react';

export default function SecurityPage() {
  const [tab, setTab] = useState('strength');
  const tabs = [
    { id: 'strength', label: 'Password Strength' },
    { id: 'aes', label: 'AES Encrypt/Decrypt' },
    { id: 'hash', label: 'Hash (SHA)' },
  ];
  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <h2 className="font-bold text-lg mb-3 flex items-center gap-2"><Shield size={18} /> Security Tools</h2>
        <div className="flex gap-2 flex-wrap mb-3">
          {tabs.map((t) => (
            <button key={t.id} className={`chip ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
        </div>
        {tab === 'strength' && <StrengthTool />}
        {tab === 'aes' && <AesTool />}
        {tab === 'hash' && <HashTool />}
      </div>
    </div>
  );
}

function StrengthTool() {
  const [pwd, setPwd] = useState('');
  const score = (() => {
    let s = 0;
    if (pwd.length >= 8) s++;
    if (pwd.length >= 12) s++;
    if (/[a-z]/.test(pwd)) s++;
    if (/[A-Z]/.test(pwd)) s++;
    if (/[0-9]/.test(pwd)) s++;
    if (/[^a-zA-Z0-9]/.test(pwd)) s++;
    return s;
  })();
  const label = score <= 2 ? 'Weak' : score <= 4 ? 'Fair' : score <= 5 ? 'Strong' : 'Very Strong';
  const color = score <= 2 ? 'var(--bad)' : score <= 4 ? 'var(--warn)' : 'var(--good)';
  const pct = (score / 6) * 100;
  return (
    <div>
      <input className="input" type="text" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="Enter password to check..." />
      <div className="mt-3">
        <div className="flex justify-between text-xs mb-1">
          <span style={{ color }}>{label}</span>
          <span className="text-[var(--muted)]">{score}/6</span>
        </div>
        <div className="h-2 rounded-full bg-[var(--panel-2)] overflow-hidden">
          <div className="h-full transition-all" style={{ width: pct + '%', background: color }} />
        </div>
      </div>
      <ul className="mt-3 text-xs text-[var(--muted)] space-y-1">
        <li>{pwd.length >= 8 ? '✓' : '✗'} At least 8 characters</li>
        <li>{pwd.length >= 12 ? '✓' : '✗'} At least 12 characters</li>
        <li>{/[a-z]/.test(pwd) ? '✓' : '✗'} Lowercase letters</li>
        <li>{/[A-Z]/.test(pwd) ? '✓' : '✗'} Uppercase letters</li>
        <li>{/[0-9]/.test(pwd) ? '✓' : '✗'} Numbers</li>
        <li>{/[^a-zA-Z0-9]/.test(pwd) ? '✓' : '✗'} Special characters</li>
      </ul>
    </div>
  );
}

function AesTool() {
  const [text, setText] = useState('');
  const [pass, setPass] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [out, setOut] = useState('');
  const [err, setErr] = useState('');
  const run = async () => {
    setErr(''); setOut('');
    if (!text || !pass) { setErr('Enter text and password'); return; }
    try {
      const enc = new TextEncoder();
      const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(pass.padEnd(32, '0').slice(0, 32)), { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
      if (mode === 'encrypt') {
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, keyMaterial, enc.encode(text));
        const buf = new Uint8Array(iv.byteLength + ct.byteLength);
        buf.set(iv); buf.set(new Uint8Array(ct), iv.byteLength);
        setOut(btoa(String.fromCharCode(...buf)));
      } else {
        const buf = Uint8Array.from(atob(text), (c) => c.charCodeAt(0));
        const iv = buf.slice(0, 12); const ct = buf.slice(12);
        const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, keyMaterial, ct);
        setOut(new TextDecoder().decode(pt));
      }
    } catch (e: any) { setErr('Error: ' + (e?.message || 'failed')); }
  };
  return (
    <div>
      <div className="flex gap-2 mb-3">
        <button className={`chip ${mode === 'encrypt' ? 'active' : ''}`} onClick={() => setMode('encrypt')}><Lock size={12} /> Encrypt</button>
        <button className={`chip ${mode === 'decrypt' ? 'active' : ''}`} onClick={() => setMode('decrypt')}><Unlock size={12} /> Decrypt</button>
      </div>
      <textarea className="textarea" rows={4} value={text} onChange={(e) => setText(e.target.value)} placeholder={mode === 'encrypt' ? 'Plain text...' : 'Base64 ciphertext...'} />
      <input className="input mt-3" type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Password (key)" />
      <button className="btn primary mt-3" onClick={run}>{mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}</button>
      {err && <div className="text-[var(--bad)] text-sm mt-2">{err}</div>}
      {out && (
        <div className="mt-3">
          <div className="text-xs text-[var(--muted)] mb-1">Result</div>
          <pre className="p-3 rounded-lg bg-[var(--panel-2)] text-sm font-mono break-all">{out}</pre>
          <button className="btn text-xs mt-2" onClick={() => navigator.clipboard.writeText(out)}>Copy</button>
        </div>
      )}
    </div>
  );
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
  return (
    <div>
      <textarea className="textarea" rows={4} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Text to hash..." />
      <button className="btn primary mt-3" onClick={run}>Generate Hashes</button>
      <div className="mt-3 flex flex-col gap-2">
        {hashes.map((h) => (
          <div key={h.algo} className="p-2 rounded-lg bg-[var(--panel-2)] flex items-center gap-2">
            <span className="text-xs text-[var(--muted)] w-20">{h.algo}</span>
            <code className="text-xs flex-1 break-all">{h.value}</code>
            <button className="btn ghost text-xs" onClick={() => navigator.clipboard.writeText(h.value)}>Copy</button>
          </div>
        ))}
      </div>
    </div>
  );
}
