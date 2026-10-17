import { useEffect, useRef, useState } from 'react';
import { Send, Plus, Trash2, Download, Copy, StopCircle } from 'lucide-react';
import { chatStream, TEXT_MODELS, type ChatMessage } from '../lib/aurora';
import { load, save, uid } from '../lib/storage';
import AdSlot from '../components/AdSlot';

interface Chat {
  id: string;
  title: string;
  messages: ChatMessage[];
  model: string;
  system: string;
  createdAt: number;
}

const DEFAULT_SYSTEM = 'You are Aurora, a helpful, friendly AI assistant. Be concise and accurate.';

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>(() => load('aurora.chats', []));
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [model, setModel] = useState('openai');
  const [system, setSystem] = useState(DEFAULT_SYSTEM);
  const [showSystem, setShowSystem] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { save('aurora.chats', chats); }, [chats]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chats, streaming]);

  const active = chats.find((c) => c.id === activeId) || null;

  const newChat = () => {
    const c: Chat = { id: uid(), title: 'New chat', messages: [], model, system, createdAt: Date.now() };
    setChats((prev) => [c, ...prev]);
    setActiveId(c.id);
  };

  const ensureActive = (): Chat => {
    if (active) return active;
    const c: Chat = { id: uid(), title: 'New chat', messages: [], model, system, createdAt: Date.now() };
    setChats((prev) => [c, ...prev]);
    setActiveId(c.id);
    return c;
  };

  const send = async () => {
    const text = input.trim();
    if (!text || streaming) return;
    const c = ensureActive();
    const userMsg: ChatMessage = { role: 'user', content: text };
    const newMessages = [...c.messages, userMsg];
    // title
    const title = c.messages.length === 0 ? text.slice(0, 40) : c.title;
    setChats((prev) => prev.map((x) => x.id === c.id ? { ...x, messages: newMessages, title, model, system } : x));
    setInput('');
    setStreaming(true);
    const controller = new AbortController();
    abortRef.current = controller;
    let acc = '';
    const assistantMsg: ChatMessage = { role: 'assistant', content: '' };
    // placeholder
    setChats((prev) => prev.map((x) => x.id === c.id ? { ...x, messages: [...newMessages, assistantMsg] } : x));
    try {
      await chatStream(newMessages, { model, system }, (chunk) => {
        acc += chunk;
        setChats((prev) => prev.map((x) => {
          if (x.id !== c.id) return x;
          const msgs = [...x.messages];
          msgs[msgs.length - 1] = { role: 'assistant', content: acc };
          return { ...x, messages: msgs };
        }));
      }, controller.signal);
    } catch (e: any) {
      if (e?.name !== 'AbortError') {
        setChats((prev) => prev.map((x) => {
          if (x.id !== c.id) return x;
          const msgs = [...x.messages];
          msgs[msgs.length - 1] = { role: 'assistant', content: acc + '\n\n[Error: ' + (e?.message || 'failed') + ']' };
          return { ...x, messages: msgs };
        }));
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  const stop = () => abortRef.current?.abort();

  const deleteChat = (id: string) => {
    setChats((prev) => prev.filter((c) => c.id !== id));
    if (activeId === id) setActiveId(null);
  };

  const clearAll = () => {
    if (confirm('Delete all chats?')) { setChats([]); setActiveId(null); }
  };

  const exportChat = () => {
    if (!active) return;
    const md = active.messages.map((m) => `**${m.role}**: ${m.content}`).join('\n\n---\n\n');
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${active.title}.md`; a.click();
    URL.revokeObjectURL(url);
  };

  const copyMsg = (text: string) => navigator.clipboard.writeText(text);

  return (
    <div className="flex h-[calc(100vh-40px)] gap-4">
      {/* chat list */}
      <div className="w-64 shrink-0 card p-3 flex flex-col gap-2 overflow-hidden">
        <button className="btn primary" onClick={newChat}><Plus size={16} /> New chat</button>
        <div className="flex gap-2">
          <select className="select" value={model} onChange={(e) => setModel(e.target.value)}>
            {TEXT_MODELS.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar flex flex-col gap-1">
          {chats.map((c) => (
            <button
              key={c.id}
              className={`text-left px-3 py-2 rounded-lg text-sm ${activeId === c.id ? 'bg-[var(--panel-2)]' : ''} hover:bg-[var(--panel-2)]`}
              onClick={() => { setActiveId(c.id); setModel(c.model); setSystem(c.system); }}
            >
              <div className="truncate font-medium">{c.title || 'Untitled'}</div>
              <div className="text-xs text-[var(--muted)]">{new Date(c.createdAt).toLocaleDateString()}</div>
            </button>
          ))}
          {chats.length === 0 && <div className="text-xs text-[var(--muted)] text-center mt-4">No chats yet</div>}
        </div>
        <div className="flex gap-2">
          <button className="btn ghost text-xs" onClick={clearAll}><Trash2 size={12} /> Clear</button>
        </div>
      </div>

      {/* main chat */}
      <div className="flex-1 flex flex-col card p-0 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
          <div className="font-semibold truncate">{active?.title || 'New chat'}</div>
          <div className="flex gap-2">
            <button className="btn ghost text-xs" onClick={() => setShowSystem((s) => !s)}>System</button>
            <button className="btn ghost text-xs" onClick={exportChat} disabled={!active}><Download size={12} /> Export</button>
            {active && active.messages.length > 0 && (
              <button className="btn ghost text-xs" onClick={() => {
                const msgs = [...active.messages];
                while (msgs.length && msgs[msgs.length - 1].role === 'assistant') msgs.pop();
                const lastUser = [...msgs].reverse().find((m) => m.role === 'user')?.content || '';
                setChats((prev) => prev.map((x) => x.id === active.id ? { ...x, messages: msgs } : x));
                setInput(lastUser);
              }}>Retry last</button>
            )}
            {active && <button className="btn danger text-xs" onClick={() => deleteChat(active.id)}><Trash2 size={12} /></button>}
          </div>
        </div>
        {showSystem && (
          <div className="px-4 py-2 border-b border-[var(--border)]">
            <textarea className="textarea" rows={2} value={system} onChange={(e) => setSystem(e.target.value)} placeholder="System prompt" />
          </div>
        )}
        <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar p-4 flex flex-col gap-3">
          {!active || active.messages.length === 0 ? (
            <div className="m-auto text-center text-[var(--muted)] max-w-md">
              <div className="text-2xl mb-2">💬</div>
              <div className="font-semibold mb-1">Start a conversation</div>
              <div className="text-sm">Ask anything. Powered by Aurora free AI.</div>
            </div>
          ) : (
            active.messages.map((m, i) => (
              <div key={i} className={`msg ${m.role} fade-in`}>
                <div className="text-xs opacity-70 mb-1 flex items-center justify-between">
                  <span>{m.role}</span>
                  {m.role === 'assistant' && m.content && (
                    <button className="opacity-60 hover:opacity-100" onClick={() => copyMsg(m.content)}><Copy size={12} /></button>
                  )}
                </div>
                {m.content || (streaming && i === active.messages.length - 1 ? '▋' : '')}
              </div>
            ))
          )}
        </div>
        <AdSlot slot="2222222222" className="mx-4 mb-2" />
        <div className="p-3 border-t border-[var(--border)] flex gap-2">
          <textarea
            className="textarea"
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Type a message... (Enter to send, Shift+Enter for newline)"
          />
          {streaming ? (
            <button className="btn danger" onClick={stop}><StopCircle size={16} /></button>
          ) : (
            <button className="btn primary" onClick={send}><Send size={16} /></button>
          )}
        </div>
      </div>
    </div>
  );
}
