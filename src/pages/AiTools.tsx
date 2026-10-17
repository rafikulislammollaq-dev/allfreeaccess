import { useState } from 'react';
import { Sparkles, Copy, Check, Loader2 } from 'lucide-react';
import { chatComplete, TEXT_MODELS } from '../lib/aurora';

const TASKS = [
  { id: 'summarize', label: 'Summarize', prompt: (t: string) => `Summarize the following text in clear bullet points:\n\n${t}` },
  { id: 'translate', label: 'Translate', prompt: (t: string, extra?: string) => `Translate the following text to ${extra || 'English'}. Preserve formatting:\n\n${t}` },
  { id: 'rewrite', label: 'Rewrite', prompt: (t: string, extra?: string) => `Rewrite the following text in a ${extra || 'professional'} tone:\n\n${t}` },
  { id: 'explain', label: 'Explain code', prompt: (t: string) => `Explain what this code does, line by line, in simple terms:\n\n${t}` },
  { id: 'fix', label: 'Fix code', prompt: (t: string) => `Find bugs in this code and provide a corrected version:\n\n${t}` },
  { id: 'email', label: 'Write email', prompt: (t: string, extra?: string) => `Write a ${extra || 'professional'} email about: ${t}` },
  { id: 'ideas', label: 'Brainstorm', prompt: (t: string) => `Brainstorm 10 creative ideas for: ${t}` },
  { id: 'title', label: 'Generate titles', prompt: (t: string) => `Generate 10 catchy titles/headlines for: ${t}` },
];

export default function AiToolsPage() {
  const [task, setTask] = useState('summarize');
  const [input, setInput] = useState('');
  const [extra, setExtra] = useState('');
  const [model, setModel] = useState('openai');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const run = async () => {
    if (!input.trim()) return;
    setLoading(true); setOutput('');
    const t = TASKS.find((x) => x.id === task)!;
    try {
      const res = await chatComplete([{ role: 'user', content: t.prompt(input, extra) }], { model });
      setOutput(res);
    } catch (e: any) {
      setOutput('Error: ' + (e?.message || 'failed'));
    } finally {
      setLoading(false);
    }
  };

  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1200); };

  const needExtra = task === 'translate' || task === 'rewrite' || task === 'email';

  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <h2 className="font-bold text-lg mb-3 flex items-center gap-2"><Sparkles size={18} className="text-[var(--accent)]" /> AI Utilities</h2>
        <div className="flex gap-2 flex-wrap mb-3">
          {TASKS.map((t) => (
            <button key={t.id} className={`chip ${task === t.id ? 'active' : ''}`} onClick={() => setTask(t.id)}>{t.label}</button>
          ))}
        </div>
        <textarea className="textarea" rows={8} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste your text or code here..." />
        {needExtra && (
          <input className="input mt-3" value={extra} onChange={(e) => setExtra(e.target.value)} placeholder={
            task === 'translate' ? 'Target language (e.g. Spanish)' :
            task === 'rewrite' ? 'Tone (e.g. casual, formal)' :
            'Tone (e.g. professional, friendly)'
          } />
        )}
        <div className="flex items-center gap-2 mt-3">
          <select className="select" style={{ width: 180 }} value={model} onChange={(e) => setModel(e.target.value)}>
            {TEXT_MODELS.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <button className="btn primary" onClick={run} disabled={loading || !input.trim()}>
            {loading ? <><Loader2 size={14} className="animate-spin" /> Working...</> : <><Sparkles size={14} /> Run</>}
          </button>
        </div>
      </div>
      {output && (
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Result</h3>
            <button className="btn ghost text-xs" onClick={copy}>{copied ? <Check size={12} /> : <Copy size={12} />} Copy</button>
          </div>
          <div className="whitespace-pre-wrap text-sm">{output}</div>
        </div>
      )}
    </div>
  );
}
