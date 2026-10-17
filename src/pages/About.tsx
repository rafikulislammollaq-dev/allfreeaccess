import { Heart, Zap, Shield, Globe, ExternalLink } from 'lucide-react';

export default function AboutPage() {
  const features = [
    { icon: Zap, title: 'Free AI Chat', desc: 'Chat with multiple AI models. No API key, no payment.' },
    { icon: Globe, title: 'Image Generation', desc: 'Generate images from text prompts in seconds.' },
    { icon: Shield, title: 'Voice Tools', desc: 'Speech-to-text and text-to-speech in your browser.' },
    { icon: Heart, title: 'Developer Utilities', desc: 'JSON, Base64, JWT, Regex, Hash, and more.' },
  ];
  return (
    <div className="flex flex-col gap-4">
      <div className="card text-center py-8">
        <div className="text-5xl mb-3">✨</div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Aurora Free AI Studio</h1>
        <p className="text-[var(--muted)] max-w-xl mx-auto">
          An all-in-one, 100% free creative studio. Chat, generate images, use voice, and run developer tools —
          all in your browser, with no account and no payment.
        </p>
        <div className="flex justify-center gap-2 mt-4">
          <a className="btn" href="https://github.com/myrajibgit/allfreeaccess" target="_blank" rel="noreferrer"><ExternalLink size={14} /> GitHub</a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {features.map((f) => {
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
        <h3 className="font-semibold mb-2">Privacy</h3>
        <p className="text-sm text-[var(--muted)]">
          Your data stays in your browser (localStorage). Chats and images are sent to free public AI providers
          (Pollinations) for processing. No tracking, no accounts.
        </p>
      </div>

      <div className="card">
        <h3 className="font-semibold mb-2">Tech</h3>
        <p className="text-sm text-[var(--muted)]">
          React + Vite + Tailwind. AI via Pollinations (free). Hosting via GitHub Pages (free).
        </p>
      </div>
    </div>
  );
}
