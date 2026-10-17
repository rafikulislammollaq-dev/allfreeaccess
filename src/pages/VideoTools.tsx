import { useState, useRef } from 'react';
import { Upload, Download, Film, Loader2 } from 'lucide-react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export default function VideoToolsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [ffmpegLoading, setFfmpegLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [info, setInfo] = useState('');
  const [resultUrl, setResultUrl] = useState('');
  const [resultName, setResultName] = useState('output.mp4');
  const [op, setOp] = useState<'convert' | 'trim' | 'audio' | 'gif' | 'compress'>('convert');
  const [format, setFormat] = useState('mp4');
  const [start, setStart] = useState('0');
  const [end, setEnd] = useState('5');
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFfmpeg = async () => {
    if (loaded) return true;
    setFfmpegLoading(true);
    try {
      const ffmpeg = new FFmpeg();
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
      ffmpegRef.current = ffmpeg;
      setLoaded(true);
      return true;
    } catch (e: any) {
      setInfo('Failed to load FFmpeg: ' + (e?.message || e));
      return false;
    } finally {
      setFfmpegLoading(false);
    }
  };

  const run = async () => {
    if (!file) { setInfo('Select a video first'); return; }
    const ok = await loadFfmpeg();
    if (!ok) return;
    const ffmpeg = ffmpegRef.current!;
    setLoading(true); setInfo('Processing... (first run downloads ~30MB)'); setResultUrl('');
    try {
      const inputName = 'input' + (file.name.includes('.') ? file.name.slice(file.name.lastIndexOf('.')) : '.mp4');
      await ffmpeg.writeFile(inputName, await fetchFile(file));
      let args: string[] = [];
      let outName = 'output.mp4';
      if (op === 'convert') {
        outName = `output.${format}`;
        args = ['-i', inputName, `output.${format}`];
      } else if (op === 'trim') {
        outName = 'output.mp4';
        args = ['-ss', start, '-to', end, '-i', inputName, '-c', 'copy', 'output.mp4'];
      } else if (op === 'audio') {
        outName = 'output.mp3';
        args = ['-i', inputName, '-vn', '-c:a', 'libmp3lame', 'output.mp3'];
      } else if (op === 'gif') {
        outName = 'output.gif';
        args = ['-i', inputName, '-vf', 'fps=10,scale=480:-1:flags=lanczos', '-loop', '0', 'output.gif'];
      } else if (op === 'compress') {
        outName = 'output.mp4';
        args = ['-i', inputName, '-vcodec', 'libx264', '-crf', '28', '-preset', 'fast', 'output.mp4'];
      }
      await ffmpeg.exec(args);
      const data = await ffmpeg.readFile(outName);
      const blob = new Blob([data as BlobPart], { type: guessMime(outName) });
      setResultUrl(URL.createObjectURL(blob));
      setResultName(outName);
      setInfo('Done!');
      // cleanup
      try { await ffmpeg.deleteFile(inputName); await ffmpeg.deleteFile(outName); } catch {}
    } catch (e: any) {
      setInfo('Error: ' + (e?.message || e));
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!resultUrl) return;
    const a = document.createElement('a'); a.href = resultUrl; a.download = resultName; a.click();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <h2 className="font-bold text-lg mb-3 flex items-center gap-2"><Film size={18} /> Video Tools (free, in-browser)</h2>
        <p className="text-xs text-[var(--muted)] mb-3">Powered by FFmpeg.wasm. First run downloads ~30MB (cached after).</p>
        <div className="border-2 border-dashed border-[var(--border)] rounded-xl p-4 text-center cursor-pointer hover:border-[var(--accent)] mb-3"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) setFile(f); }}>
          <Upload size={20} className="mx-auto mb-1 text-[var(--muted)]" />
          <div className="text-sm text-[var(--muted)]">{file ? `${file.name} (${(file.size/1024/1024).toFixed(1)} MB)` : 'Click or drop a video'}</div>
          <input ref={inputRef} type="file" accept="video/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) setFile(f); }} />
        </div>

        <div className="flex gap-2 flex-wrap mb-3">
          {(['convert','trim','audio','gif','compress'] as const).map((o) => (
            <button key={o} className={`chip ${op === o ? 'active' : ''}`} onClick={() => setOp(o)}>{o}</button>
          ))}
        </div>

        {op === 'convert' && (
          <div>
            <label className="text-xs text-[var(--muted)]">Output format</label>
            <select className="select mt-1" value={format} onChange={(e) => setFormat(e.target.value)}>
              <option value="mp4">MP4</option>
              <option value="webm">WebM</option>
              <option value="mov">MOV</option>
              <option value="mkv">MKV</option>
            </select>
          </div>
        )}
        {op === 'trim' && (
          <div className="grid-2">
            <div>
              <label className="text-xs text-[var(--muted)]">Start (s)</label>
              <input className="input mt-1" value={start} onChange={(e) => setStart(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-[var(--muted)]">End (s)</label>
              <input className="input mt-1" value={end} onChange={(e) => setEnd(e.target.value)} />
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <button className="btn primary" onClick={run} disabled={!file || loading || ffmpegLoading}>
            {ffmpegLoading ? <><Loader2 size={14} className="animate-spin" /> Loading FFmpeg...</> :
             loading ? <><Loader2 size={14} className="animate-spin" /> Processing...</> : 'Process'}
          </button>
          {resultUrl && <button className="btn" onClick={download}><Download size={14} /> Download {resultName}</button>}
        </div>
        {info && <div className="text-sm text-[var(--muted)] mt-2">{info}</div>}
      </div>
    </div>
  );
}

function guessMime(name: string): string {
  if (name.endsWith('.mp3')) return 'audio/mpeg';
  if (name.endsWith('.gif')) return 'image/gif';
  if (name.endsWith('.webm')) return 'video/webm';
  return 'video/mp4';
}
