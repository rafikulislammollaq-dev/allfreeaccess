import { useState, useRef, useEffect } from 'react';
import { Play, RotateCcw, Copy } from 'lucide-react';

export default function PlaygroundPage() {
  const [html, setHtml] = useState('<h1>Hello Aurora</h1>\n<p>Edit me!</p>');
  const [css, setCss] = useState('body { font-family: sans-serif; padding: 20px; background: #f5f7fb; }\nh1 { color: #7c5cff; }');
  const [js, setJs] = useState('console.log("Hello from JS");\ndocument.querySelector("h1").addEventListener("click", () => alert("clicked!"));');
  const [tab, setTab] = useState<'html' | 'css' | 'js'>('html');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const run = () => {
    const src = `<!doctype html><html><head><style>${css}</style></head><body>${html}<script>${js}<\/script></body></html>`;
    const blob = new Blob([src], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    if (iframeRef.current) iframeRef.current.src = url;
  };

  useEffect(() => { run(); }, []);

  const reset = () => {
    setHtml('<h1>Hello Aurora</h1>\n<p>Edit me!</p>');
    setCss('body { font-family: sans-serif; padding: 20px; background: #f5f7fb; }\nh1 { color: #7c5cff; }');
    setJs('console.log("Hello from JS");');
  };

  const copyAll = () => {
    navigator.clipboard.writeText(`<!doctype html>\n<html>\n<head><style>\n${css}\n</style></head>\n<body>\n${html}\n<script>\n${js}\n</script>\n</body>\n</html>`);
  };

  return (
    <div className="flex flex-col gap-3" style={{ height: 'calc(100vh - 80px)' }}>
      <div className="flex items-center gap-2">
        <h2 className="font-bold text-lg">Code Playground</h2>
        <div className="flex gap-1 ml-4">
          {(['html', 'css', 'js'] as const).map((t) => (
            <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t.toUpperCase()}</button>
          ))}
        </div>
        <div className="ml-auto flex gap-2">
          <button className="btn" onClick={copyAll}><Copy size={14} /> Copy</button>
          <button className="btn" onClick={reset}><RotateCcw size={14} /> Reset</button>
          <button className="btn primary" onClick={run}><Play size={14} /> Run</button>
        </div>
      </div>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 min-h-0">
        <div className="card p-0 overflow-hidden flex flex-col">
          <textarea
            className="flex-1 p-3 font-mono text-sm bg-[var(--bg-soft)] border-0 outline-none resize-none"
            value={tab === 'html' ? html : tab === 'css' ? css : js}
            onChange={(e) => {
              if (tab === 'html') setHtml(e.target.value);
              else if (tab === 'css') setCss(e.target.value);
              else setJs(e.target.value);
            }}
            spellCheck={false}
          />
        </div>
        <div className="card p-0 overflow-hidden">
          <iframe ref={iframeRef} title="preview" className="w-full h-full border-0 bg-white" sandbox="allow-scripts allow-modals" />
        </div>
      </div>
    </div>
  );
}
