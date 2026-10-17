import { Key, Plug, Zap, Shield, Globe } from 'lucide-react';
import type { TabId } from '../components/Sidebar';

interface Card { id: TabId; title: string; desc: string; icon: any; }

const CARDS: Card[] = [
  { id: 'getkey', title: 'Get Free API Key', desc: 'Generate an API key instantly. No signup.', icon: Key },
  { id: 'api', title: 'API & Integrations', desc: 'Docs, endpoints, and setup guides.', icon: Plug },
];

export default function HomePage({ onNavigate }: { onNavigate: (t: TabId) => void }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="card text-center py-12" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,.15), rgba(34,211,238,.1))' }}>
        <div className="text-5xl mb-3">🔑</div>
        <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">Free AI API Keys</h1>
        <p className="text-[var(--muted)] max-w-2xl mx-auto">
          Get a free API key instantly. Use it with Claude Code, OpenCode, Cursor, VS Code, Aider, Hermes,
          and any OpenAI-compatible client. No signup, no credit card, no payment.
        </p>
        <div className="flex justify-center gap-2 mt-5 flex-wrap">
          <button className="btn primary" onClick={() => onNavigate('getkey')}>Get your free key</button>
          <button className="btn" onClick={() => onNavigate('api')}>View docs</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CARDS.map((c) => {
          const Icon = c.icon;
          return (
            <button key={c.id} className="card text-left hover:border-[var(--accent)] transition" onClick={() => onNavigate(c.id)}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[var(--panel-2)]">
                  <Icon size={18} className="text-[var(--accent)]" />
                </div>
                <div className="font-semibold">{c.title}</div>
              </div>
              <div className="text-sm text-[var(--muted)]">{c.desc}</div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { icon: Zap, title: 'Instant', desc: 'Generate a key in one click. No forms.' },
          { icon: Shield, title: 'Free', desc: 'No payment, no limits to start.' },
          { icon: Globe, title: 'Universal', desc: 'Works with any OpenAI-compatible tool.' },
        ].map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.title} className="card flex gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[var(--panel-2)]"><Icon size={18} className="text-[var(--accent)]" /></div>
              <div>
                <div className="font-semibold">{f.title}</div>
                <div className="text-sm text-[var(--muted)]">{f.desc}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <h3 className="font-semibold mb-2">Supported tools</h3>
        <div className="flex flex-wrap gap-2">
          {['Claude Code', 'OpenCode', 'Cursor', 'VS Code (Continue/Cline)', 'Aider', 'Hermes', 'LangChain', 'LlamaIndex'].map((t) => (
            <span key={t} className="chip">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
