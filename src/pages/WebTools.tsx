import { useState } from 'react';
import { Globe } from 'lucide-react';

export default function WebToolsPage() {
  const [tab, setTab] = useState('robots');
  const tabs = [
    { id: 'robots', label: 'robots.txt' },
    { id: 'sitemap', label: 'Sitemap' },
    { id: 'htaccess', label: '.htaccess' },
    { id: 'manifest', label: 'Web Manifest' },
  ];
  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <h2 className="font-bold text-lg mb-3 flex items-center gap-2"><Globe size={18} /> Web Tools</h2>
        <div className="flex gap-2 flex-wrap mb-3">
          {tabs.map((t) => (
            <button key={t.id} className={`chip ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
        </div>
        {tab === 'robots' && <RobotsTool />}
        {tab === 'sitemap' && <SitemapTool />}
        {tab === 'htaccess' && <HtaccessTool />}
        {tab === 'manifest' && <ManifestTool />}
      </div>
    </div>
  );
}

function RobotsTool() {
  const [allow, setAllow] = useState('/');
  const [disallow, setDisallow] = useState('/admin,/private');
  const [sitemap, setSitemap] = useState('https://example.com/sitemap.xml');
  const out = `User-agent: *\nAllow: ${allow}\n${disallow.split(',').map((d) => `Disallow: ${d.trim()}`).join('\n')}\n\nSitemap: ${sitemap}`;
  return (
    <div>
      <div className="grid-2 mb-3">
        <div><label className="text-xs text-[var(--muted)] block mb-1">Allow</label><input className="input" value={allow} onChange={(e) => setAllow(e.target.value)} /></div>
        <div><label className="text-xs text-[var(--muted)] block mb-1">Disallow (comma)</label><input className="input" value={disallow} onChange={(e) => setDisallow(e.target.value)} /></div>
        <div><label className="text-xs text-[var(--muted)] block mb-1">Sitemap URL</label><input className="input" value={sitemap} onChange={(e) => setSitemap(e.target.value)} /></div>
      </div>
      <pre className="p-3 rounded-lg bg-[var(--panel-2)] text-sm font-mono whitespace-pre-wrap">{out}</pre>
      <button className="btn text-xs mt-2" onClick={() => navigator.clipboard.writeText(out)}>Copy</button>
    </div>
  );
}

function SitemapTool() {
  const [urls, setUrls] = useState('https://example.com/\nhttps://example.com/about');
  const out = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.split('\n').filter(Boolean).map((u) => `  <url>\n    <loc>${u.trim()}</loc>\n    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`).join('\n')}
</urlset>`;
  return (
    <div>
      <label className="text-xs text-[var(--muted)] block mb-1">URLs (one per line)</label>
      <textarea className="textarea" rows={6} value={urls} onChange={(e) => setUrls(e.target.value)} />
      <pre className="mt-3 p-3 rounded-lg bg-[var(--panel-2)] text-sm font-mono overflow-x-auto whitespace-pre-wrap">{out}</pre>
      <button className="btn text-xs mt-2" onClick={() => navigator.clipboard.writeText(out)}>Copy</button>
    </div>
  );
}

function HtaccessTool() {
  const [redirect, setRedirect] = useState('https://example.com');
  const [forceHttps, setForceHttps] = useState(true);
  const [cache, setCache] = useState(true);
  const lines: string[] = [];
  if (forceHttps) lines.push('RewriteEngine On', 'RewriteCond %{HTTPS} off', 'RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]', '');
  lines.push(`Redirect 301 /old ${redirect}`);
  if (cache) lines.push('', '<IfModule mod_expires.c>', 'ExpiresActive On', 'ExpiresByType image/jpg "access plus 1 year"', 'ExpiresByType text/css "access plus 1 month"', 'ExpiresByType application/javascript "access plus 1 month"', '</IfModule>');
  const out = lines.join('\n');
  return (
    <div>
      <div className="mb-3">
        <label className="text-xs text-[var(--muted)] block mb-1">Redirect target</label>
        <input className="input" value={redirect} onChange={(e) => setRedirect(e.target.value)} />
      </div>
      <div className="flex gap-4 mb-3">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={forceHttps} onChange={(e) => setForceHttps(e.target.checked)} /> Force HTTPS</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={cache} onChange={(e) => setCache(e.target.checked)} /> Cache headers</label>
      </div>
      <pre className="p-3 rounded-lg bg-[var(--panel-2)] text-sm font-mono whitespace-pre-wrap">{out}</pre>
      <button className="btn text-xs mt-2" onClick={() => navigator.clipboard.writeText(out)}>Copy</button>
    </div>
  );
}

function ManifestTool() {
  const [name, setName] = useState('My App');
  const [short, setShort] = useState('App');
  const [theme, setTheme] = useState('#6366f1');
  const [bg, setBg] = useState('#0a0a0f');
  const [start, setStart] = useState('/');
  const out = JSON.stringify({
    name, short_name: short, start_url: start, display: 'standalone',
    background_color: bg, theme_color: theme, icons: [],
  }, null, 2);
  return (
    <div>
      <div className="grid-2 mb-3">
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="App name" />
        <input className="input" value={short} onChange={(e) => setShort(e.target.value)} placeholder="Short name" />
        <input className="input" value={start} onChange={(e) => setStart(e.target.value)} placeholder="Start URL" />
        <div className="flex gap-2">
          <input type="color" value={theme} onChange={(e) => setTheme(e.target.value)} className="w-12 h-10 rounded cursor-pointer" />
          <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="w-12 h-10 rounded cursor-pointer" />
        </div>
      </div>
      <pre className="p-3 rounded-lg bg-[var(--panel-2)] text-sm font-mono">{out}</pre>
      <button className="btn text-xs mt-2" onClick={() => navigator.clipboard.writeText(out)}>Copy</button>
    </div>
  );
}
