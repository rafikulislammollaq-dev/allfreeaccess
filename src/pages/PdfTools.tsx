import { useState, useRef } from 'react';
import { Upload, Download, FileText, Loader2, Trash2 } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function PdfToolsPage() {
  const [tab, setTab] = useState<'merge' | 'split' | 'img2pdf'>('merge');
  const [files, setFiles] = useState<File[]>([]);
  const [resultUrl, setResultUrl] = useState('');
  const [resultName, setResultName] = useState('result.pdf');
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState('');
  const [splitRange, setSplitRange] = useState('1');
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (fs: FileList | null) => {
    if (!fs) return;
    setFiles((prev) => [...prev, ...Array.from(fs)]);
  };
  const removeFile = (i: number) => setFiles((prev) => prev.filter((_, idx) => idx !== i));

  const download = () => {
    if (!resultUrl) return;
    const a = document.createElement('a'); a.href = resultUrl; a.download = resultName; a.click();
  };

  const merge = async () => {
    if (files.length < 2) { setInfo('Need at least 2 PDFs'); return; }
    setLoading(true); setInfo('');
    try {
      const merged = await PDFDocument.create();
      for (const f of files) {
        const bytes = await f.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const pages = await merged.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
      }
      const bytes = await merged.save();
      const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });
      setResultUrl(URL.createObjectURL(blob));
      setResultName('merged.pdf');
      setInfo(`Merged ${files.length} PDFs → ${merged.getPageCount()} pages`);
    } catch (e: any) { setInfo('Error: ' + e.message); }
    finally { setLoading(false); }
  };

  const split = async () => {
    if (files.length !== 1) { setInfo('Select exactly one PDF'); return; }
    setLoading(true); setInfo('');
    try {
      const bytes = await files[0].arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const total = pdf.getPageIndices().length;
      // parse range like "1,3-5"
      const indices: number[] = [];
      splitRange.split(',').forEach((part) => {
        const p = part.trim();
        if (!p) return;
        if (p.includes('-')) {
          const [a, b] = p.split('-').map((x) => parseInt(x));
          for (let i = a; i <= b; i++) if (i >= 1 && i <= total) indices.push(i - 1);
        } else {
          const n = parseInt(p);
          if (n >= 1 && n <= total) indices.push(n - 1);
        }
      });
      if (indices.length === 0) { setInfo('Invalid range'); setLoading(false); return; }
      const out = await PDFDocument.create();
      const pages = await out.copyPages(pdf, indices);
      pages.forEach((p) => out.addPage(p));
      const b = await out.save();
      const blob = new Blob([b as BlobPart], { type: 'application/pdf' });
      setResultUrl(URL.createObjectURL(blob));
      setResultName('split.pdf');
      setInfo(`Extracted ${indices.length} of ${total} pages`);
    } catch (e: any) { setInfo('Error: ' + e.message); }
    finally { setLoading(false); }
  };

  const img2pdf = async () => {
    if (files.length === 0) { setInfo('Select images'); return; }
    setLoading(true); setInfo('');
    try {
      const pdf = await PDFDocument.create();
      for (const f of files) {
        const bytes = await f.arrayBuffer();
        const img = f.type === 'image/png'
          ? await pdf.embedPng(bytes)
          : await pdf.embedJpg(bytes);
        const page = pdf.addPage([img.width, img.height]);
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
      }
      const b = await pdf.save();
      const blob = new Blob([b as BlobPart], { type: 'application/pdf' });
      setResultUrl(URL.createObjectURL(blob));
      setResultName('images.pdf');
      setInfo(`Converted ${files.length} images to PDF`);
    } catch (e: any) { setInfo('Error: ' + e.message); }
    finally { setLoading(false); }
  };

  const run = () => {
    if (tab === 'merge') merge();
    else if (tab === 'split') split();
    else img2pdf();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <h2 className="font-bold text-lg mb-3 flex items-center gap-2"><FileText size={18} /> PDF Tools (free, client-side)</h2>
        <div className="flex gap-2 flex-wrap mb-3">
          {(['merge','split','img2pdf'] as const).map((t) => (
            <button key={t} className={`chip ${tab === t ? 'active' : ''}`} onClick={() => { setTab(t); setFiles([]); setResultUrl(''); setInfo(''); }}>
              {t === 'merge' ? 'Merge PDFs' : t === 'split' ? 'Split / Extract' : 'Images → PDF'}
            </button>
          ))}
        </div>
        <div
          className="border-2 border-dashed border-[var(--border)] rounded-xl p-6 text-center cursor-pointer hover:border-[var(--accent)]"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
        >
          <Upload size={24} className="mx-auto mb-2 text-[var(--muted)]" />
          <div className="text-sm text-[var(--muted)]">
            {tab === 'img2pdf' ? 'Click or drop images (JPG/PNG)' : 'Click or drop PDF files'}
          </div>
          <input ref={inputRef} type="file" multiple accept={tab === 'img2pdf' ? 'image/*' : 'application/pdf'} className="hidden" onChange={(e) => addFiles(e.target.files)} />
        </div>
        {files.length > 0 && (
          <div className="mt-3 flex flex-col gap-1">
            {files.map((f, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-[var(--panel-2)] text-sm">
                <span className="truncate">{f.name} ({(f.size/1024).toFixed(1)} KB)</span>
                <button className="btn danger text-xs" onClick={() => removeFile(i)}><Trash2 size={12} /></button>
              </div>
            ))}
          </div>
        )}
        {tab === 'split' && (
          <div className="mt-3">
            <label className="text-xs text-[var(--muted)]">Page range (e.g. 1,3-5)</label>
            <input className="input mt-1" value={splitRange} onChange={(e) => setSplitRange(e.target.value)} />
          </div>
        )}
        <div className="flex gap-2 mt-4">
          <button className="btn primary" onClick={run} disabled={files.length === 0 || loading}>
            {loading ? <><Loader2 size={14} className="animate-spin" /> Processing...</> : 'Process'}
          </button>
          {resultUrl && <button className="btn" onClick={download}><Download size={14} /> Download {resultName}</button>}
        </div>
        {info && <div className="text-sm text-[var(--muted)] mt-2">{info}</div>}
      </div>
    </div>
  );
}
