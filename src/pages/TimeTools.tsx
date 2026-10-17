import { useState, useEffect, useRef } from 'react';
import { Clock } from 'lucide-react';

export default function TimeToolsPage() {
  const [tab, setTab] = useState('world');
  const tabs = [
    { id: 'world', label: 'World Clock' },
    { id: 'convert', label: 'Timezone Convert' },
    { id: 'countdown', label: 'Countdown' },
    { id: 'stopwatch', label: 'Stopwatch' },
  ];
  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <h2 className="font-bold text-lg mb-3 flex items-center gap-2"><Clock size={18} /> Time Tools</h2>
        <div className="flex gap-2 flex-wrap mb-3">
          {tabs.map((t) => (
            <button key={t.id} className={`chip ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
        </div>
        {tab === 'world' && <WorldClock />}
        {tab === 'convert' && <TzConvert />}
        {tab === 'countdown' && <Countdown />}
        {tab === 'stopwatch' && <Stopwatch />}
      </div>
    </div>
  );
}

const ZONES = ['UTC', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'Asia/Shanghai', 'Asia/Dubai', 'Asia/Kolkata', 'Australia/Sydney'];

function WorldClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const i = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(i); }, []);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {ZONES.map((z) => (
        <div key={z} className="p-3 rounded-lg bg-[var(--panel-2)] flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">{z.replace(/_/g, ' ')}</div>
            <div className="text-xs text-[var(--muted)]">{now.toLocaleDateString('en-US', { timeZone: z, weekday: 'short', month: 'short', day: 'numeric' })}</div>
          </div>
          <div className="text-xl font-mono font-bold">{now.toLocaleTimeString('en-US', { timeZone: z, hour12: false })}</div>
        </div>
      ))}
    </div>
  );
}

function TzConvert() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));
  const [from, setFrom] = useState('UTC');
  const [to, setTo] = useState('America/New_York');
  const result = (() => {
    try {
      const d = new Date(date + ':00');
      // adjust: interpret input as `from` zone by offsetting
      const fromOffset = new Date(d.toLocaleString('en-US', { timeZone: from })).getTime() - d.getTime();
      const utc = d.getTime() - fromOffset;
      const toStr = new Date(utc).toLocaleString('en-US', { timeZone: to, dateStyle: 'medium', timeStyle: 'medium' });
      return toStr;
    } catch { return 'Invalid'; }
  })();
  return (
    <div>
      <div className="grid-2 mb-3">
        <div><label className="text-xs text-[var(--muted)] block mb-1">Date & time</label><input className="input" type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} /></div>
        <div><label className="text-xs text-[var(--muted)] block mb-1">From</label>
          <select className="select" value={from} onChange={(e) => setFrom(e.target.value)}>{ZONES.map((z) => <option key={z} value={z}>{z}</option>)}</select></div>
        <div><label className="text-xs text-[var(--muted)] block mb-1">To</label>
          <select className="select" value={to} onChange={(e) => setTo(e.target.value)}>{ZONES.map((z) => <option key={z} value={z}>{z}</option>)}</select></div>
      </div>
      <div className="p-3 rounded-lg bg-[var(--panel-2)]">
        <div className="text-xs text-[var(--muted)]">Converted</div>
        <div className="text-xl font-bold">{result}</div>
      </div>
    </div>
  );
}

function Countdown() {
  const [target, setTarget] = useState('');
  const [remaining, setRemaining] = useState('');
  useEffect(() => {
    if (!target) return;
    const i = setInterval(() => {
      const diff = new Date(target).getTime() - Date.now();
      if (diff <= 0) { setRemaining('Time reached!'); clearInterval(i); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemaining(`${d}d ${h}h ${m}m ${s}s`);
    }, 1000);
    return () => clearInterval(i);
  }, [target]);
  return (
    <div>
      <label className="text-xs text-[var(--muted)] block mb-1">Target date & time</label>
      <input className="input" type="datetime-local" value={target} onChange={(e) => setTarget(e.target.value)} />
      <div className="mt-3 p-4 rounded-lg bg-[var(--panel-2)] text-center">
        <div className="text-xs text-[var(--muted)]">Time remaining</div>
        <div className="text-3xl font-mono font-bold">{remaining || '—'}</div>
      </div>
    </div>
  );
}

function Stopwatch() {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [laps, setLaps] = useState<number[]>([]);
  const startRef = useRef<number>(0);
  const accRef = useRef<number>(0);
  useEffect(() => {
    if (!running) return;
    startRef.current = Date.now();
    const i = setInterval(() => setElapsed(accRef.current + (Date.now() - startRef.current)), 100);
    return () => clearInterval(i);
  }, [running]);
  const start = () => setRunning(true);
  const stop = () => { accRef.current = elapsed; setRunning(false); };
  const reset = () => { accRef.current = 0; setElapsed(0); setLaps([]); setRunning(false); };
  const lap = () => setLaps((l) => [elapsed, ...l]);
  const fmt = (ms: number) => {
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const c = Math.floor((ms % 1000) / 10);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(c).padStart(2, '0')}`;
  };
  return (
    <div>
      <div className="p-6 rounded-lg bg-[var(--panel-2)] text-center mb-3">
        <div className="text-4xl font-mono font-bold">{fmt(elapsed)}</div>
      </div>
      <div className="flex gap-2 justify-center mb-3">
        {!running ? <button className="btn primary" onClick={start}>Start</button> : <button className="btn danger" onClick={stop}>Stop</button>}
        <button className="btn" onClick={lap} disabled={!running}>Lap</button>
        <button className="btn" onClick={reset}>Reset</button>
      </div>
      {laps.length > 0 && (
        <div className="flex flex-col gap-1">
          {laps.map((l, i) => (
            <div key={i} className="p-2 rounded bg-[var(--panel-2)] text-sm font-mono flex justify-between">
              <span>Lap {laps.length - i}</span><span>{fmt(l)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
