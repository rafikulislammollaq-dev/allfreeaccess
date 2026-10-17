import { useState } from 'react';
import { Plus, Trash2, Copy, Check } from 'lucide-react';
import { load, save, uid } from '../lib/storage';

interface Prompt { id: string; title: string; content: string; category: string; createdAt: number; }

const DEFAULTS: Prompt[] = [
  { id: 'p1', title: 'Code reviewer', content: 'You are a senior software engineer. Review the following code for bugs, performance, and readability. Provide actionable suggestions.\n\n```\n{code}\n```', category: 'Coding', createdAt: Date.now() },
  { id: 'p2', title: 'Explain simply', content: 'Explain the following concept in simple terms a 10-year-old could understand:\n\n{topic}', category: 'Learning', createdAt: Date.now() },
  { id: 'p3', title: 'Blog post', content: 'Write a 600-word blog post about {topic}. Use headings, bullet points, and a catchy title.', category: 'Writing', createdAt: Date.now() },
  { id: 'p4', title: 'Translate', content: 'Translate the following text to {language}. Keep the tone and formatting.\n\n{text}', category: 'Language', createdAt: Date.now() },
  { id: 'p5', title: 'Summarize', content: 'Summarize the following text in 3-5 bullet points:\n\n{text}', category: 'Productivity', createdAt: Date.now() },
  { id: 'p6', title: 'Email reply', content: 'Write a professional email reply to the message below. Tone: {tone}.\n\n{message}', category: 'Productivity', createdAt: Date.now() },
];

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>(() => {
    const stored = load<Prompt[]>('aurora.prompts', []);
    return stored.length ? stored : DEFAULTS;
  });
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [filter, setFilter] = useState('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const persist = (next: Prompt[]) => { setPrompts(next); save('aurora.prompts', next); };

  const add = () => {
    if (!title.trim() || !content.trim()) return;
    persist([{ id: uid(), title, content, category, createdAt: Date.now() }, ...prompts]);
    setTitle(''); setContent('');
  };
  const remove = (id: string) => persist(prompts.filter((p) => p.id !== id));
  const copy = (p: Prompt) => {
    navigator.clipboard.writeText(p.content);
    setCopiedId(p.id); setTimeout(() => setCopiedId(null), 1200);
  };

  const categories = ['All', ...Array.from(new Set(prompts.map((p) => p.category)))];
  const filtered = filter === 'All' ? prompts : prompts.filter((p) => p.category === filter);

  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <h3 className="font-semibold mb-3">Add prompt template</h3>
        <div className="grid-2">
          <input className="input" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input className="input" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
        </div>
        <textarea className="textarea mt-3" rows={4} placeholder="Prompt content (use {placeholders})" value={content} onChange={(e) => setContent(e.target.value)} />
        <button className="btn primary mt-3" onClick={add}><Plus size={14} /> Add</button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {categories.map((c) => (
          <button key={c} className={`chip ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)}>{c}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((p) => (
          <div key={p.id} className="card">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="font-semibold">{p.title}</div>
                <div className="text-xs text-[var(--muted)]">{p.category}</div>
              </div>
              <div className="flex gap-1">
                <button className="btn ghost text-xs" onClick={() => copy(p)}>{copiedId === p.id ? <Check size={12} /> : <Copy size={12} />}</button>
                <button className="btn danger text-xs" onClick={() => remove(p.id)}><Trash2 size={12} /></button>
              </div>
            </div>
            <pre className="text-sm whitespace-pre-wrap text-[var(--muted)]">{p.content}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}
