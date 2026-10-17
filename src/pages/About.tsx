import { Key, Globe, Shield, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="card text-center py-8">
        <div className="text-5xl mb-3">🔑</div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Aurora Free API</h1>
        <p className="text-[var(--muted)] max-w-xl mx-auto">
          Free AI API keys for everyone. No signup, no payment. Use with any OpenAI-compatible tool.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[
          { icon: Key, title: 'Free API Keys', desc: 'Generate instantly, no account required.' },
          { icon: Globe, title: 'Universal', desc: 'Works with Claude Code, OpenCode, Cursor, VS Code, Aider, Hermes.' },
          { icon: Shield, title: 'Privacy', desc: 'Keys are generated in your browser. No tracking.' },
          { icon: Heart, title: 'Open Source', desc: 'MIT licensed. Inspect and fork.' },
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
        <h3 className="font-semibold mb-2">Tech</h3>
        <p className="text-sm text-[var(--muted)]">
          React + Vite + Tailwind. AI via free public providers (Pollinations). Hosting via GitHub Pages.
        </p>
      </div>
    </div>
  );
}
