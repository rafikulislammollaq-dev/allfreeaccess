import { useState } from 'react';
import { Plus, Trash2, Download } from 'lucide-react';
import { load, save, uid } from '../lib/storage';

interface Note { id: string; title: string; content: string; createdAt: number; updatedAt: number; }

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>(() => load('aurora.notes', []));
  const [activeId, setActiveId] = useState<string | null>(null);
  const [q, setQ] = useState('');

  const persist = (next: Note[]) => { setNotes(next); save('aurora.notes', next); };
  const active = notes.find((n) => n.id === activeId) || null;

  const newNote = () => {
    const n: Note = { id: uid(), title: 'Untitled note', content: '', createdAt: Date.now(), updatedAt: Date.now() };
    persist([n, ...notes]);
    setActiveId(n.id);
  };
  const update = (patch: Partial<Note>) => {
    if (!active) return;
    persist(notes.map((n) => n.id === active.id ? { ...n, ...patch, updatedAt: Date.now() } : n));
  };
  const remove = (id: string) => {
    persist(notes.filter((n) => n.id !== id));
    if (activeId === id) setActiveId(null);
  };
  const exportNote = () => {
    if (!active) return;
    const blob = new Blob([active.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${active.title}.md`; a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = notes.filter((n) => (n.title + n.content).toLowerCase().includes(q.toLowerCase()));

  const simpleMd = (s: string) => s
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/^### (.*)$/gm, '<h3>$1</h3>')
    .replace(/^## (.*)$/gm, '<h2>$1</h2>')
    .replace(/^# (.*)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/^- (.*)$/gm, '<li>$1</li>')
    .replace(/\n/g, '<br/>');

  return (
    <div className="flex h-[calc(100vh-80px)] gap-4">
      <div className="w-64 shrink-0 card p-3 flex flex-col gap-2 overflow-hidden">
        <button className="btn primary" onClick={newNote}><Plus size={16} /> New note</button>
        <input className="input" placeholder="Search..." value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="flex-1 overflow-y-auto scrollbar flex flex-col gap-1">
          {filtered.map((n) => (
            <button key={n.id} className={`text-left px-3 py-2 rounded-lg text-sm ${activeId === n.id ? 'bg-[var(--panel-2)]' : ''} hover:bg-[var(--panel-2)]`}
              onClick={() => setActiveId(n.id)}>
              <div className="truncate font-medium">{n.title || 'Untitled'}</div>
              <div className="text-xs text-[var(--muted)]">{new Date(n.updatedAt).toLocaleDateString()}</div>
            </button>
          ))}
          {filtered.length === 0 && <div className="text-xs text-[var(--muted)] text-center mt-4">No notes</div>}
        </div>
      </div>
      <div className="flex-1 flex flex-col card p-0 overflow-hidden">
        {!active ? (
          <div className="m-auto text-center text-[var(--muted)]">
            <div className="text-4xl mb-2">📝</div>
            <div>Select or create a note</div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border)]">
              <input className="input" style={{ width: 'auto', flex: 1 }} value={active.title} onChange={(e) => update({ title: e.target.value })} />
              <button className="btn ghost text-xs" onClick={exportNote}><Download size={12} /> Export</button>
              <button className="btn danger text-xs" onClick={() => remove(active.id)}><Trash2 size={12} /></button>
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 min-h-0">
              <textarea className="p-4 bg-transparent border-0 outline-none resize-none font-mono text-sm"
                value={active.content} onChange={(e) => update({ content: e.target.value })}
                placeholder="# Markdown notes..." />
              <div className="p-4 border-l border-[var(--border)] overflow-auto" dangerouslySetInnerHTML={{ __html: simpleMd(active.content) }} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
