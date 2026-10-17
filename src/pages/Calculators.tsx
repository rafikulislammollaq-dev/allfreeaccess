import { useState } from 'react';
import { Calculator } from 'lucide-react';

export default function CalculatorsPage() {
  const [tab, setTab] = useState('percent');
  const tabs = [
    { id: 'percent', label: '%' },
    { id: 'bmi', label: 'BMI' },
    { id: 'age', label: 'Age' },
    { id: 'tip', label: 'Tip' },
    { id: 'discount', label: 'Discount' },
    { id: 'loan', label: 'Loan/EMI' },
    { id: 'compound', label: 'Compound' },
    { id: 'mortgage', label: 'Mortgage' },
  ];
  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <h2 className="font-bold text-lg mb-3 flex items-center gap-2"><Calculator size={18} /> Calculators</h2>
        <div className="flex gap-2 flex-wrap mb-3">
          {tabs.map((t) => (
            <button key={t.id} className={`chip ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
        </div>
        {tab === 'percent' && <PercentCalc />}
        {tab === 'bmi' && <BmiCalc />}
        {tab === 'age' && <AgeCalc />}
        {tab === 'tip' && <TipCalc />}
        {tab === 'discount' && <DiscountCalc />}
        {tab === 'loan' && <LoanCalc />}
        {tab === 'compound' && <CompoundCalc />}
        {tab === 'mortgage' && <MortgageCalc />}
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="mb-3"><label className="text-xs text-[var(--muted)] block mb-1">{label}</label>{children}</div>;
}

function PercentCalc() {
  const [a, setA] = useState(''); const [b, setB] = useState('');
  const r1 = a && b ? (Number(a) / 100) * Number(b) : '';
  const r2 = a && b ? ((Number(b) - Number(a)) / Number(a)) * 100 : '';
  return (
    <div className="grid-2">
      <div>
        <Row label="X% of Y"><div className="flex gap-2"><input className="input" value={a} onChange={(e) => setA(e.target.value)} placeholder="%" /><input className="input" value={b} onChange={(e) => setB(e.target.value)} placeholder="number" /></div></Row>
        <div className="p-3 rounded-lg bg-[var(--panel-2)]"><div className="text-xs text-[var(--muted)]">Result</div><div className="text-xl font-bold">{r1 === '' ? '—' : r1}</div></div>
      </div>
      <div>
        <Row label="Percentage change (from X to Y)"><div className="flex gap-2"><input className="input" value={a} onChange={(e) => setA(e.target.value)} placeholder="from" /><input className="input" value={b} onChange={(e) => setB(e.target.value)} placeholder="to" /></div></Row>
        <div className="p-3 rounded-lg bg-[var(--panel-2)]"><div className="text-xs text-[var(--muted)]">Change</div><div className="text-xl font-bold">{r2 === '' ? '—' : r2.toFixed(2) + '%'}</div></div>
      </div>
    </div>
  );
}

function BmiCalc() {
  const [h, setH] = useState('170'); const [w, setW] = useState('70'); const [unit, setUnit] = useState('metric');
  const bmi = unit === 'metric'
    ? (Number(w) / ((Number(h) / 100) ** 2))
    : (Number(w) / (Number(h) ** 2)) * 703;
  const cat = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese';
  return (
    <div>
      <div className="flex gap-2 mb-3">
        <button className={`chip ${unit === 'metric' ? 'active' : ''}`} onClick={() => setUnit('metric')}>Metric (cm/kg)</button>
        <button className={`chip ${unit === 'imperial' ? 'active' : ''}`} onClick={() => setUnit('imperial')}>Imperial (in/lb)</button>
      </div>
      <div className="grid-2">
        <Row label={unit === 'metric' ? 'Height (cm)' : 'Height (in)'}><input className="input" type="number" value={h} onChange={(e) => setH(e.target.value)} /></Row>
        <Row label={unit === 'metric' ? 'Weight (kg)' : 'Weight (lb)'}><input className="input" type="number" value={w} onChange={(e) => setW(e.target.value)} /></Row>
      </div>
      <div className="p-3 rounded-lg bg-[var(--panel-2)]">
        <div className="text-xs text-[var(--muted)]">BMI</div>
        <div className="text-2xl font-bold">{isNaN(bmi) ? '—' : bmi.toFixed(1)}</div>
        <div className="text-sm text-[var(--muted)]">{cat}</div>
      </div>
    </div>
  );
}

function AgeCalc() {
  const [dob, setDob] = useState('');
  const age = dob ? (() => {
    const b = new Date(dob); const n = new Date();
    let a = n.getFullYear() - b.getFullYear();
    if (n.getMonth() < b.getMonth() || (n.getMonth() === b.getMonth() && n.getDate() < b.getDate())) a--;
    return a;
  })() : null;
  return (
    <div>
      <Row label="Date of birth"><input className="input" type="date" value={dob} onChange={(e) => setDob(e.target.value)} /></Row>
      <div className="p-3 rounded-lg bg-[var(--panel-2)]">
        <div className="text-xs text-[var(--muted)]">Age</div>
        <div className="text-2xl font-bold">{age === null ? '—' : age + ' years'}</div>
      </div>
    </div>
  );
}

function TipCalc() {
  const [bill, setBill] = useState(''); const [tip, setTip] = useState('15'); const [people, setPeople] = useState('1');
  const t = Number(bill) * (Number(tip) / 100);
  const total = Number(bill) + t;
  const per = total / (Number(people) || 1);
  return (
    <div>
      <div className="grid-2">
        <Row label="Bill amount"><input className="input" type="number" value={bill} onChange={(e) => setBill(e.target.value)} /></Row>
        <Row label="Tip %"><input className="input" type="number" value={tip} onChange={(e) => setTip(e.target.value)} /></Row>
        <Row label="People"><input className="input" type="number" value={people} onChange={(e) => setPeople(e.target.value)} /></Row>
      </div>
      <div className="grid-2">
        <div className="p-3 rounded-lg bg-[var(--panel-2)]"><div className="text-xs text-[var(--muted)]">Tip</div><div className="text-xl font-bold">{t.toFixed(2)}</div></div>
        <div className="p-3 rounded-lg bg-[var(--panel-2)]"><div className="text-xs text-[var(--muted)]">Total per person</div><div className="text-xl font-bold">{per.toFixed(2)}</div></div>
      </div>
    </div>
  );
}

function DiscountCalc() {
  const [price, setPrice] = useState(''); const [disc, setDisc] = useState('');
  const saved = Number(price) * (Number(disc) / 100);
  const final = Number(price) - saved;
  return (
    <div>
      <div className="grid-2">
        <Row label="Original price"><input className="input" type="number" value={price} onChange={(e) => setPrice(e.target.value)} /></Row>
        <Row label="Discount %"><input className="input" type="number" value={disc} onChange={(e) => setDisc(e.target.value)} /></Row>
      </div>
      <div className="grid-2">
        <div className="p-3 rounded-lg bg-[var(--panel-2)]"><div className="text-xs text-[var(--muted)]">You save</div><div className="text-xl font-bold">{saved.toFixed(2)}</div></div>
        <div className="p-3 rounded-lg bg-[var(--panel-2)]"><div className="text-xs text-[var(--muted)]">Final price</div><div className="text-xl font-bold">{final.toFixed(2)}</div></div>
      </div>
    </div>
  );
}

function LoanCalc() {
  const [p, setP] = useState(''); const [r, setR] = useState(''); const [n, setN] = useState('');
  const monthly = (() => {
    const P = Number(p); const R = Number(r) / 100 / 12; const N = Number(n) * 12;
    if (!P || !R || !N) return 0;
    return (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
  })();
  const total = monthly * (Number(n) * 12);
  const interest = total - Number(p);
  return (
    <div>
      <div className="grid-2">
        <Row label="Principal"><input className="input" type="number" value={p} onChange={(e) => setP(e.target.value)} /></Row>
        <Row label="Annual rate %"><input className="input" type="number" value={r} onChange={(e) => setR(e.target.value)} /></Row>
        <Row label="Years"><input className="input" type="number" value={n} onChange={(e) => setN(e.target.value)} /></Row>
      </div>
      <div className="grid-2">
        <div className="p-3 rounded-lg bg-[var(--panel-2)]"><div className="text-xs text-[var(--muted)]">Monthly EMI</div><div className="text-xl font-bold">{monthly ? monthly.toFixed(2) : '—'}</div></div>
        <div className="p-3 rounded-lg bg-[var(--panel-2)]"><div className="text-xs text-[var(--muted)]">Total interest</div><div className="text-xl font-bold">{interest ? interest.toFixed(2) : '—'}</div></div>
      </div>
    </div>
  );
}

function CompoundCalc() {
  const [p, setP] = useState(''); const [r, setR] = useState(''); const [t, setT] = useState(''); const [freq, setFreq] = useState('12');
  const amt = Number(p) * Math.pow(1 + Number(r) / 100 / Number(freq), Number(freq) * Number(t));
  const interest = amt - Number(p);
  return (
    <div>
      <div className="grid-2">
        <Row label="Principal"><input className="input" type="number" value={p} onChange={(e) => setP(e.target.value)} /></Row>
        <Row label="Annual rate %"><input className="input" type="number" value={r} onChange={(e) => setR(e.target.value)} /></Row>
        <Row label="Years"><input className="input" type="number" value={t} onChange={(e) => setT(e.target.value)} /></Row>
        <Row label="Compounds/year"><input className="input" type="number" value={freq} onChange={(e) => setFreq(e.target.value)} /></Row>
      </div>
      <div className="grid-2">
        <div className="p-3 rounded-lg bg-[var(--panel-2)]"><div className="text-xs text-[var(--muted)]">Final amount</div><div className="text-xl font-bold">{amt ? amt.toFixed(2) : '—'}</div></div>
        <div className="p-3 rounded-lg bg-[var(--panel-2)]"><div className="text-xs text-[var(--muted)]">Interest earned</div><div className="text-xl font-bold">{interest ? interest.toFixed(2) : '—'}</div></div>
      </div>
    </div>
  );
}

function MortgageCalc() {
  const [price, setPrice] = useState(''); const [down, setDown] = useState(''); const [r, setR] = useState(''); const [y, setY] = useState('');
  const P = Number(price) - Number(down);
  const R = Number(r) / 100 / 12; const N = Number(y) * 12;
  const m = (P && R && N) ? (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1) : 0;
  return (
    <div>
      <div className="grid-2">
        <Row label="Home price"><input className="input" type="number" value={price} onChange={(e) => setPrice(e.target.value)} /></Row>
        <Row label="Down payment"><input className="input" type="number" value={down} onChange={(e) => setDown(e.target.value)} /></Row>
        <Row label="Annual rate %"><input className="input" type="number" value={r} onChange={(e) => setR(e.target.value)} /></Row>
        <Row label="Years"><input className="input" type="number" value={y} onChange={(e) => setY(e.target.value)} /></Row>
      </div>
      <div className="p-3 rounded-lg bg-[var(--panel-2)]">
        <div className="text-xs text-[var(--muted)]">Monthly payment</div>
        <div className="text-2xl font-bold">{m ? m.toFixed(2) : '—'}</div>
      </div>
    </div>
  );
}
