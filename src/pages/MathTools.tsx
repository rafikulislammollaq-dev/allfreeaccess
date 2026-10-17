import { useState } from 'react';
import { Hash } from 'lucide-react';

export default function MathToolsPage() {
  const [tab, setTab] = useState('stats');
  const tabs = [
    { id: 'stats', label: 'Statistics' },
    { id: 'matrix', label: 'Matrix' },
    { id: 'prime', label: 'Prime/Factor' },
    { id: 'fib', label: 'Fibonacci' },
    { id: 'gcd', label: 'GCD/LCM' },
  ];
  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <h2 className="font-bold text-lg mb-3 flex items-center gap-2"><Hash size={18} /> Math Tools</h2>
        <div className="flex gap-2 flex-wrap mb-3">
          {tabs.map((t) => (
            <button key={t.id} className={`chip ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
        </div>
        {tab === 'stats' && <StatsTool />}
        {tab === 'matrix' && <MatrixTool />}
        {tab === 'prime' && <PrimeTool />}
        {tab === 'fib' && <FibTool />}
        {tab === 'gcd' && <GcdTool />}
      </div>
    </div>
  );
}

function StatsTool() {
  const [input, setInput] = useState('1,2,3,4,5,6,7,8,9,10');
  const nums = input.split(/[,\s]+/).map(Number).filter((n) => !isNaN(n));
  const n = nums.length;
  const sum = nums.reduce((a, b) => a + b, 0);
  const mean = n ? sum / n : 0;
  const sorted = [...nums].sort((a, b) => a - b);
  const median = n ? (n % 2 ? sorted[Math.floor(n / 2)] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2) : 0;
  const variance = n ? nums.reduce((a, b) => a + (b - mean) ** 2, 0) / n : 0;
  const std = Math.sqrt(variance);
  const min = n ? Math.min(...nums) : 0;
  const max = n ? Math.max(...nums) : 0;
  return (
    <div>
      <textarea className="textarea" rows={3} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Numbers separated by commas/spaces" />
      <div className="grid-2 mt-3">
        <Stat label="Count" value={n} />
        <Stat label="Sum" value={sum} />
        <Stat label="Mean" value={mean.toFixed(4)} />
        <Stat label="Median" value={median} />
        <Stat label="Min" value={min} />
        <Stat label="Max" value={max} />
        <Stat label="Variance" value={variance.toFixed(4)} />
        <Stat label="Std Dev" value={std.toFixed(4)} />
      </div>
    </div>
  );
}
function Stat({ label, value }: { label: string; value: any }) {
  return <div className="p-3 rounded-lg bg-[var(--panel-2)]"><div className="text-xs text-[var(--muted)]">{label}</div><div className="text-xl font-bold">{value}</div></div>;
}

function MatrixTool() {
  const [a, setA] = useState('1,2;3,4');
  const [b, setB] = useState('5,6;7,8');
  const parse = (s: string) => s.trim().split(';').map((r) => r.split(',').map(Number));
  const add = () => {
    const A = parse(a), B = parse(b);
    if (A.length !== B.length || A[0].length !== B[0].length) return 'Dimension mismatch';
    return A.map((r, i) => r.map((v, j) => v + B[i][j]).join(', ')).join(';\n');
  };
  const mul = () => {
    const A = parse(a), B = parse(b);
    if (A[0].length !== B.length) return 'Dimension mismatch';
    const R = A.map((r) => B[0].map((_, j) => r.reduce((s, v, k) => s + v * B[k][j], 0)));
    return R.map((r) => r.join(', ')).join(';\n');
  };
  const det = () => {
    const A = parse(a);
    if (A.length !== 2 || A[0].length !== 2) return '2x2 only';
    return String(A[0][0] * A[1][1] - A[0][1] * A[1][0]);
  };
  const transpose = () => {
    const A = parse(a);
    return A[0].map((_, j) => A.map((r) => r[j]).join(', ')).join(';\n');
  };
  return (
    <div>
      <div className="grid-2 mb-3">
        <div><label className="text-xs text-[var(--muted)] block mb-1">Matrix A (rows ; cols ,)</label><textarea className="textarea" rows={3} value={a} onChange={(e) => setA(e.target.value)} /></div>
        <div><label className="text-xs text-[var(--muted)] block mb-1">Matrix B</label><textarea className="textarea" rows={3} value={b} onChange={(e) => setB(e.target.value)} /></div>
      </div>
      <div className="flex gap-2 flex-wrap">
        <button className="btn" onClick={() => setB(add())}>A+B</button>
        <button className="btn" onClick={() => setB(mul())}>A×B</button>
        <button className="btn" onClick={() => alert('det(A) = ' + det())}>det(A)</button>
        <button className="btn" onClick={() => setB(transpose())}>Aᵀ</button>
      </div>
    </div>
  );
}

function PrimeTool() {
  const [n, setN] = useState('');
  const num = Number(n);
  const isPrime = (x: number) => {
    if (x < 2) return false;
    for (let i = 2; i <= Math.sqrt(x); i++) if (x % i === 0) return false;
    return true;
  };
  const factors = (x: number) => {
    const f: number[] = [];
    for (let i = 2; i <= x; i++) { while (x % i === 0) { f.push(i); x /= i; } }
    return f;
  };
  return (
    <div>
      <input className="input" type="number" value={n} onChange={(e) => setN(e.target.value)} placeholder="Number" />
      {n && (
        <div className="mt-3 flex flex-col gap-2">
          <div className="p-3 rounded-lg bg-[var(--panel-2)]"><div className="text-xs text-[var(--muted)]">Is prime?</div><div className="text-xl font-bold">{isPrime(num) ? 'Yes' : 'No'}</div></div>
          <div className="p-3 rounded-lg bg-[var(--panel-2)]"><div className="text-xs text-[var(--muted)]">Prime factorization</div><div className="font-mono">{factors(num).join(' × ') || '—'}</div></div>
        </div>
      )}
    </div>
  );
}

function FibTool() {
  const [n, setN] = useState(10);
  const fib: number[] = [0, 1];
  for (let i = 2; i < n; i++) fib.push(fib[i - 1] + fib[i - 2]);
  return (
    <div>
      <label className="text-xs text-[var(--muted)] block mb-1">Count</label>
      <input className="input" type="number" value={n} onChange={(e) => setN(Number(e.target.value))} />
      <div className="mt-3 p-3 rounded-lg bg-[var(--panel-2)] font-mono text-sm break-all">{fib.slice(0, n).join(', ')}</div>
    </div>
  );
}

function GcdTool() {
  const [a, setA] = useState(''); const [b, setB] = useState('');
  const gcd = (x: number, y: number): number => (y === 0 ? x : gcd(y, x % y));
  const lcm = (x: number, y: number) => (x * y) / gcd(x, y);
  const g = a && b ? gcd(Number(a), Number(b)) : 0;
  const l = a && b ? lcm(Number(a), Number(b)) : 0;
  return (
    <div>
      <div className="grid-2">
        <input className="input" type="number" value={a} onChange={(e) => setA(e.target.value)} placeholder="A" />
        <input className="input" type="number" value={b} onChange={(e) => setB(e.target.value)} placeholder="B" />
      </div>
      <div className="grid-2 mt-3">
        <div className="p-3 rounded-lg bg-[var(--panel-2)]"><div className="text-xs text-[var(--muted)]">GCD</div><div className="text-xl font-bold">{g || '—'}</div></div>
        <div className="p-3 rounded-lg bg-[var(--panel-2)]"><div className="text-xs text-[var(--muted)]">LCM</div><div className="text-xl font-bold">{l || '—'}</div></div>
      </div>
    </div>
  );
}
