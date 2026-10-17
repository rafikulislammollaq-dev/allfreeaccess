import { useEffect, useState, useRef } from 'react';
import { Search, Command } from 'lucide-react';
import type { TabId } from './Sidebar';

interface Item { id: TabId; label: string; keywords?: string; }

export default function CommandPalette({ items, onSelect }: { items: Item[]; onSelect: (id: TabId) => void }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [idx, setIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (open) { setQ(''); setIdx(0); setTimeout(() => inputRef.current?.focus(), 50); }
  }, [open]);

  const filtered = items.filter((it) =>
    (it.label + ' ' + (it.keywords || '')).toLowerCase().includes(q.toLowerCase())
  );

  const choose = (id: TabId) => { onSelect(id); setOpen(false); };

  if (!open) return null;
  return (
    <div className="cmd-palette" onClick={() => setOpen(false)}>
      <div className="cmd-box" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 px-4">
          <Search size={16} className="text-[var(--muted)]" />
          <input ref={inputRef} className="cmd-input" placeholder="Search tools, pages..." value={q}
            onChange={(e) => { setQ(e.target.value); setIdx(0); }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); setIdx((i) => Math.min(i + 1, filtered.length - 1)); }
              else if (e.key === 'ArrowUp') { e.preventDefault(); setIdx((i) => Math.max(i - 1, 0)); }
              else if (e.key === 'Enter') { if (filtered[idx]) choose(filtered[idx].id); }
            }} />
          <span className="kbd">ESC</span>
        </div>
        <div className="cmd-list">
          {filtered.length === 0 && <div className="cmd-item" style={{ cursor: 'default' }}>No results</div>}
          {filtered.map((it, i) => (
            <div key={it.id} className={`cmd-item ${i === idx ? 'active' : ''}`} onClick={() => choose(it.id)}>
              <Command size={14} />
              {it.label}
            </div>
          ))}
        </div>
        <div className="px-4 py-2 border-t border-[var(--border)] text-xs text-[var(--muted)] flex justify-between">
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}
