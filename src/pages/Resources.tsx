import { useState } from 'react';
import { ExternalLink } from 'lucide-react';

interface Res { name: string; desc: string; url: string; category: string; free: string; }

const RESOURCES: Res[] = [
  { name: 'Aurora AI', desc: 'Free AI text & image generation, no API key.', url: 'https://aurora-free.ai', category: 'AI', free: '100% free' },
  { name: 'Hugging Face', desc: 'Open models, datasets, inference API.', url: 'https://huggingface.co', category: 'AI', free: 'Free tier' },
  { name: 'OpenRouter', desc: 'Unified API for many LLMs, free models.', url: 'https://openrouter.ai', category: 'AI', free: 'Free models' },
  { name: 'GitHub', desc: 'Code hosting, CI, Pages hosting.', url: 'https://github.com', category: 'Dev', free: 'Free tier' },
  { name: 'Vercel', desc: 'Frontend hosting & serverless.', url: 'https://vercel.com', category: 'Hosting', free: 'Free tier' },
  { name: 'Netlify', desc: 'Static hosting with CI.', url: 'https://netlify.com', category: 'Hosting', free: 'Free tier' },
  { name: 'Cloudflare Pages', desc: 'Fast global static hosting.', url: 'https://pages.cloudflare.com', category: 'Hosting', free: 'Free' },
  { name: 'Supabase', desc: 'Postgres, auth, storage, realtime.', url: 'https://supabase.com', category: 'Backend', free: 'Free tier' },
  { name: 'Firebase', desc: 'Auth, DB, hosting, functions.', url: 'https://firebase.google.com', category: 'Backend', free: 'Free tier' },
  { name: 'Appwrite', desc: 'Open-source backend platform.', url: 'https://appwrite.io', category: 'Backend', free: 'Free tier' },
  { name: 'MongoDB Atlas', desc: 'Managed MongoDB.', url: 'https://mongodb.com/atlas', category: 'Database', free: 'Free tier' },
  { name: 'PlanetScale', desc: 'Serverless MySQL.', url: 'https://planetscale.com', category: 'Database', free: 'Free tier' },
  { name: 'Neon', desc: 'Serverless Postgres.', url: 'https://neon.tech', category: 'Database', free: 'Free tier' },
  { name: 'Upstash', desc: 'Serverless Redis & Kafka.', url: 'https://upstash.com', category: 'Database', free: 'Free tier' },
  { name: 'Unsplash', desc: 'Free high-res photos API.', url: 'https://unsplash.com/developers', category: 'Media', free: 'Free' },
  { name: 'Pexels', desc: 'Free stock photos & videos.', url: 'https://pexels.com/api', category: 'Media', free: 'Free' },
  { name: 'Pixabay', desc: 'Free images, videos, music.', url: 'https://pixabay.com/api/docs', category: 'Media', free: 'Free' },
  { name: 'Remove.bg', desc: 'Background removal (limited free).', url: 'https://remove.bg', category: 'Media', free: 'Limited' },
  { name: 'QR Server', desc: 'Free QR code generation API.', url: 'https://goqr.me/api', category: 'Utilities', free: 'Free' },
  { name: 'EmailJS', desc: 'Send emails from frontend.', url: 'https://emailjs.com', category: 'Utilities', free: 'Free tier' },
  { name: 'Formspree', desc: 'Form backend.', url: 'https://formspree.io', category: 'Utilities', free: 'Free tier' },
  { name: 'Google Fonts', desc: 'Free web fonts.', url: 'https://fonts.google.com', category: 'Design', free: 'Free' },
  { name: 'Font Awesome', desc: 'Icon library.', url: 'https://fontawesome.com', category: 'Design', free: 'Free tier' },
  { name: 'Lucide', desc: 'Open-source icons.', url: 'https://lucide.dev', category: 'Design', free: 'Free' },
  { name: 'Tailwind CSS', desc: 'Utility-first CSS framework.', url: 'https://tailwindcss.com', category: 'Dev', free: 'Free' },
  { name: 'shadcn/ui', desc: 'Reusable UI components.', url: 'https://ui.shadcn.com', category: 'Dev', free: 'Free' },
];

export default function ResourcesPage() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const cats = ['All', ...Array.from(new Set(RESOURCES.map((r) => r.category)))];
  const filtered = RESOURCES.filter((r) => {
    if (cat !== 'All' && r.category !== cat) return false;
    if (q && !(r.name + r.desc + r.category).toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });
  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <h2 className="font-bold text-lg mb-3">Free Resources Directory</h2>
        <p className="text-sm text-[var(--muted)] mb-3">Curated list of free tools, APIs, and services to build and ship for $0.</p>
        <input className="input" placeholder="Search..." value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="flex gap-2 flex-wrap mt-3">
          {cats.map((c) => (
            <button key={c} className={`chip ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((r) => (
          <a key={r.name} href={r.url} target="_blank" rel="noreferrer" className="card hover:border-[var(--accent)] transition block">
            <div className="flex items-center justify-between">
              <div className="font-semibold">{r.name}</div>
              <ExternalLink size={14} className="text-[var(--muted)]" />
            </div>
            <div className="text-sm text-[var(--muted)] mt-1">{r.desc}</div>
            <div className="flex gap-2 mt-2">
              <span className="chip">{r.category}</span>
              <span className="chip" style={{ background: 'rgba(52,211,153,.15)', color: 'var(--good)' }}>{r.free}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
