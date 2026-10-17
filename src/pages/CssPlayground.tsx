import { useState } from 'react';
import { Layout } from 'lucide-react';

export default function CssPlaygroundPage() {
  const [tab, setTab] = useState('flex');
  const [flexDir, setFlexDir] = useState('row');
  const [justify, setJustify] = useState('flex-start');
  const [align, setAlign] = useState('stretch');
  const [wrap, setWrap] = useState('nowrap');
  const [gap, setGap] = useState(8);
  const [gridCols, setGridCols] = useState(3);
  const [gridGap, setGridGap] = useState(8);
  const tabs = [{ id: 'flex', label: 'Flexbox' }, { id: 'grid', label: 'Grid' }];
  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <h2 className="font-bold text-lg mb-3 flex items-center gap-2"><Layout size={18} /> CSS Playground</h2>
        <div className="flex gap-2 flex-wrap mb-3">
          {tabs.map((t) => (
            <button key={t.id} className={`chip ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
        </div>
        {tab === 'flex' && (
          <div>
            <div className="grid-2 mb-3">
              <div><label className="text-xs text-[var(--muted)] block mb-1">flex-direction</label>
                <select className="select" value={flexDir} onChange={(e) => setFlexDir(e.target.value)}>
                  {['row','row-reverse','column','column-reverse'].map((v) => <option key={v} value={v}>{v}</option>)}
                </select></div>
              <div><label className="text-xs text-[var(--muted)] block mb-1">justify-content</label>
                <select className="select" value={justify} onChange={(e) => setJustify(e.target.value)}>
                  {['flex-start','center','flex-end','space-between','space-around','space-evenly'].map((v) => <option key={v} value={v}>{v}</option>)}
                </select></div>
              <div><label className="text-xs text-[var(--muted)] block mb-1">align-items</label>
                <select className="select" value={align} onChange={(e) => setAlign(e.target.value)}>
                  {['stretch','flex-start','center','flex-end','baseline'].map((v) => <option key={v} value={v}>{v}</option>)}
                </select></div>
              <div><label className="text-xs text-[var(--muted)] block mb-1">flex-wrap</label>
                <select className="select" value={wrap} onChange={(e) => setWrap(e.target.value)}>
                  {['nowrap','wrap','wrap-reverse'].map((v) => <option key={v} value={v}>{v}</option>)}
                </select></div>
              <div><label className="text-xs text-[var(--muted)] block mb-1">gap {gap}px</label>
                <input type="range" min="0" max="40" value={gap} onChange={(e) => setGap(Number(e.target.value))} className="w-full" /></div>
            </div>
            <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--panel-2)] min-h-[200px] flex"
              style={{ flexDirection: flexDir as any, justifyContent: justify, alignItems: align, flexWrap: wrap as any, gap }}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-16 h-16 rounded-lg bg-[var(--accent)] flex items-center justify-center text-white font-bold">{i}</div>
              ))}
            </div>
            <pre className="mt-3 p-3 rounded-lg bg-[var(--panel-2)] text-xs font-mono">display: flex;\nflex-direction: {flexDir};\njustify-content: {justify};\nalign-items: {align};\nflex-wrap: {wrap};\ngap: {gap}px;</pre>
          </div>
        )}
        {tab === 'grid' && (
          <div>
            <div className="grid-2 mb-3">
              <div><label className="text-xs text-[var(--muted)] block mb-1">Columns {gridCols}</label>
                <input type="range" min="1" max="6" value={gridCols} onChange={(e) => setGridCols(Number(e.target.value))} className="w-full" /></div>
              <div><label className="text-xs text-[var(--muted)] block mb-1">Gap {gridGap}px</label>
                <input type="range" min="0" max="40" value={gridGap} onChange={(e) => setGridGap(Number(e.target.value))} className="w-full" /></div>
            </div>
            <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--panel-2)] grid"
              style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)`, gap: gridGap }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-16 rounded-lg bg-[var(--accent-2)] flex items-center justify-center text-white font-bold">{i + 1}</div>
              ))}
            </div>
            <pre className="mt-3 p-3 rounded-lg bg-[var(--panel-2)] text-xs font-mono">display: grid;\ngrid-template-columns: repeat({gridCols}, 1fr);\ngap: {gridGap}px;</pre>
          </div>
        )}
      </div>
    </div>
  );
}
