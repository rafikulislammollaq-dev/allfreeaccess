import { useState, useRef } from 'react';
import { Upload, Download, Image as ImageIcon, Loader2 } from 'lucide-react';
import imageCompression from 'browser-image-compression';

export default function ImageToolsPage() {
  const [tab, setTab] = useState<'compress' | 'resize' | 'convert' | 'crop'>('compress');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState('');
  const [targetW, setTargetW] = useState(1024);
  const [targetH, setTargetH] = useState(1024);
  const [format, setFormat] = useState('image/jpeg');
  const [quality, setQuality] = useState(0.8);
  const inputRef = useRef<HTMLInputElement>(null);

  const onFile = (f: File) => {
    setFile(f); setResult(''); setResultBlob(null);
    const url = URL.createObjectURL(f);
    setPreview(url);
    setInfo(`${f.name} · ${(f.size / 1024).toFixed(1)} KB · ${f.type}`);
  };

  const download = () => {
    if (!resultBlob) return;
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement('a'); a.href = url;
    a.download = `aurora-${tab}.${format.split('/')[1] || 'png'}`;
    a.click(); URL.revokeObjectURL(url);
  };

  const compress = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const out = await imageCompression(file, { maxSizeMB: quality * 5, maxWidthOrHeight: 1920, useWebWorker: true, initialQuality: quality });
      setResultBlob(out);
      setResult(URL.createObjectURL(out));
      setInfo(`Compressed: ${(file.size/1024).toFixed(1)} KB → ${(out.size/1024).toFixed(1)} KB (${Math.round((1-out.size/file.size)*100)}% smaller)`);
    } catch (e: any) { setInfo('Error: ' + e.message); }
    finally { setLoading(false); }
  };

  const resize = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const img = await loadImage(preview);
      const canvas = document.createElement('canvas');
      canvas.width = targetW; canvas.height = targetH;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, targetW, targetH);
      canvas.toBlob((blob) => {
        if (!blob) return;
        setResultBlob(blob);
        setResult(URL.createObjectURL(blob));
        setInfo(`Resized to ${targetW}×${targetH}`);
        setLoading(false);
      }, format, quality);
    } catch (e: any) { setInfo('Error: ' + e.message); setLoading(false); }
  };

  const convert = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const img = await loadImage(preview);
      const canvas = document.createElement('canvas');
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) return;
        setResultBlob(blob);
        setResult(URL.createObjectURL(blob));
        setInfo(`Converted to ${format}`);
        setLoading(false);
      }, format, quality);
    } catch (e: any) { setInfo('Error: ' + e.message); setLoading(false); }
  };

  const run = () => {
    if (tab === 'compress') compress();
    else if (tab === 'resize') resize();
    else if (tab === 'convert') convert();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <h2 className="font-bold text-lg mb-3 flex items-center gap-2"><ImageIcon size={18} /> Image Tools (free, client-side)</h2>
        <div className="flex gap-2 flex-wrap mb-3">
          {(['compress','resize','convert'] as const).map((t) => (
            <button key={t} className={`chip ${tab === t ? 'active' : ''}`} onClick={() => { setTab(t); setResult(''); setResultBlob(null); }}>{t}</button>
          ))}
        </div>
        <div
          className="border-2 border-dashed border-[var(--border)] rounded-xl p-6 text-center cursor-pointer hover:border-[var(--accent)]"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) onFile(f); }}
        >
          <Upload size={24} className="mx-auto mb-2 text-[var(--muted)]" />
          <div className="text-sm text-[var(--muted)]">Click or drop an image here</div>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
        </div>
        {file && <div className="text-xs text-[var(--muted)] mt-2">{info}</div>}

        {tab === 'compress' && (
          <div className="mt-3">
            <label className="text-xs text-[var(--muted)]">Quality {Math.round(quality*100)}%</label>
            <input type="range" min="0.1" max="1" step="0.05" value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full" />
          </div>
        )}
        {tab === 'resize' && (
          <div className="grid-2 mt-3">
            <div>
              <label className="text-xs text-[var(--muted)]">Width</label>
              <input type="number" className="input mt-1" value={targetW} onChange={(e) => setTargetW(Number(e.target.value))} />
            </div>
            <div>
              <label className="text-xs text-[var(--muted)]">Height</label>
              <input type="number" className="input mt-1" value={targetH} onChange={(e) => setTargetH(Number(e.target.value))} />
            </div>
          </div>
        )}
        {tab === 'convert' && (
          <div className="mt-3">
            <label className="text-xs text-[var(--muted)]">Format</label>
            <select className="select mt-1" value={format} onChange={(e) => setFormat(e.target.value)}>
              <option value="image/jpeg">JPEG</option>
              <option value="image/png">PNG</option>
              <option value="image/webp">WebP</option>
            </select>
          </div>
        )}
        {tab !== 'compress' && (
          <div className="mt-3">
            <label className="text-xs text-[var(--muted)]">Quality {Math.round(quality*100)}%</label>
            <input type="range" min="0.1" max="1" step="0.05" value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full" />
            <label className="text-xs text-[var(--muted)] mt-2 block">Format</label>
            <select className="select mt-1" value={format} onChange={(e) => setFormat(e.target.value)}>
              <option value="image/jpeg">JPEG</option>
              <option value="image/png">PNG</option>
              <option value="image/webp">WebP</option>
            </select>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <button className="btn primary" onClick={run} disabled={!file || loading}>
            {loading ? <><Loader2 size={14} className="animate-spin" /> Processing...</> : 'Process'}
          </button>
          {resultBlob && <button className="btn" onClick={download}><Download size={14} /> Download</button>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {preview && (
          <div className="card">
            <div className="text-xs text-[var(--muted)] mb-2">Original</div>
            <img src={preview} alt="original" className="w-full rounded-lg" />
          </div>
        )}
        {result && (
          <div className="card">
            <div className="text-xs text-[var(--muted)] mb-2">Result</div>
            <img src={result} alt="result" className="w-full rounded-lg" />
          </div>
        )}
      </div>
    </div>
  );
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
