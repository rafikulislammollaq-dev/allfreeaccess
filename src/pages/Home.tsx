import { MessageSquare, Image as ImageIcon, Mic, Wrench, Sparkles, ImagePlus, FileText, Code2, Globe, Library } from 'lucide-react';
import type { TabId } from '../components/Sidebar';

interface Card { id: TabId; title: string; desc: string; icon: any; }

const CARDS: Card[] = [
  { id: 'chat', title: 'AI Chat', desc: 'Chat with multiple AI models, streaming.', icon: MessageSquare },
  { id: 'image', title: 'Image Gen', desc: 'Generate images from text prompts.', icon: ImageIcon },
  { id: 'imagetools', title: 'Image Tools', desc: 'Compress, resize, convert images.', icon: ImagePlus },
  { id: 'pdftools', title: 'PDF Tools', desc: 'Merge, split, convert PDFs.', icon: FileText },
  { id: 'ai', title: 'AI Utilities', desc: 'Summarize, translate, rewrite, code.', icon: Sparkles },
  { id: 'tools', title: 'Dev Tools', desc: 'JSON, Base64, JWT, Regex, Hash & more.', icon: Wrench },
  { id: 'playground', title: 'Playground', desc: 'Live HTML/CSS/JS editor.', icon: Code2 },
  { id: 'voice', title: 'Voice', desc: 'Speech-to-text & text-to-speech.', icon: Mic },
  { id: 'resources', title: 'Resources', desc: 'Curated free tools & APIs.', icon: Globe },
  { id: 'prompts', title: 'Prompts', desc: 'Reusable prompt templates.', icon: Library },
];

export default function HomePage({ onNavigate }: { onNavigate: (t: TabId) => void }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="card text-center py-10" style={{ background: 'linear-gradient(135deg, rgba(124,92,255,.15), rgba(34,211,238,.1))' }}>
        <div className="text-5xl mb-3">✨</div>
        <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">Aurora Free AI Studio</h1>
        <p className="text-[var(--muted)] max-w-2xl mx-auto">
          Everything you need to create, convert, and ship — 100% free, in your browser.
          No account, no payment, no API keys.
        </p>
        <div className="flex justify-center gap-2 mt-5 flex-wrap">
          <button className="btn primary" onClick={() => onNavigate('chat')}>Start chatting</button>
          <button className="btn" onClick={() => onNavigate('imagetools')}>Image tools</button>
          <button className="btn" onClick={() => onNavigate('pdftools')}>PDF tools</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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

      <div className="card">
        <h3 className="font-semibold mb-2">Why Aurora?</h3>
        <ul className="text-sm text-[var(--muted)] space-y-1">
          <li>• 100% free — no subscriptions, no hidden costs</li>
          <li>• Runs in your browser — your data stays on your device</li>
          <li>• No account required — start using immediately</li>
          <li>• Open source (MIT) — inspect, fork, contribute</li>
        </ul>
      </div>
    </div>
  );
}
