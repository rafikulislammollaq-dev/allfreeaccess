import { useState, useRef, useEffect } from 'react';
import { Upload, RotateCw, FlipHorizontal, FlipVertical, Undo2, Redo2, Sliders } from 'lucide-react';

const FILTERS = [
  { name: 'None', value: '' },
  { name: 'Grayscale', value: 'grayscale(1)' },
  { name: 'Sepia', value: 'sepia(1)' },
  { name: 'Invert', value: 'invert(1)' },
  { name: 'Vintage', value: 'sepia(0.5) contrast(1.1) brightness(1.1) saturate(1.2)' },
  { name: 'Cool', value: 'hue-rotate(180deg) saturate(1.2)' },
  { name: 'Warm', value: 'sepia(0.3) saturate(1.4) brightness(1.05)' },
  { name: 'Dramatic', value: 'contrast(1.4) saturate(1.3) brightness(0.9)' },
  { name: 'Soft', value: 'contrast(0.9) brightness(1.1) blur(0.5px)' },
  { name: 'Sharp', value: 'contrast(1.2) saturate(1.1)' },
];

export default function PhotoEditorPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [hue, setHue] = useState(0);
  const [blur, setBlur] = useState(0);
  const [filter, setFilter] = useState('');
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [tool, setTool] = useState<'select' | 'text' | 'draw' | 'eraser'>('select');
  const [drawColor, setDrawColor] = useState('#ff0000');
  const [drawSize, setDrawSize] = useState(4);
  const [textInput, setTextInput] = useState('');
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const drawing = useRef(false);
  const lastPt = useRef<{ x: number; y: number } | null>(null);

  const onFile = (f: File) => {
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      setImgLoaded(true);
      // fit canvas to image (cap at 1200)
      const max = 1200;
      let w = img.width, h = img.height;
      if (w > max || h > max) { const s = max / Math.max(w, h); w = Math.round(w * s); h = Math.round(h * s); }
      const c = canvasRef.current!;
      c.width = w; c.height = h;
      resetAdjustments();
      render();
      saveHistory();
    };
    img.src = url;
  };

  const resetAdjustments = () => {
    setBrightness(100); setContrast(100); setSaturation(100); setHue(0); setBlur(0);
    setFilter(''); setRotation(0); setFlipH(false); setFlipV(false);
  };

  const buildFilter = () => {
    const parts = [`brightness(${brightness}%)`, `contrast(${contrast}%)`, `saturate(${saturation}%)`, `hue-rotate(${hue}deg)`, `blur(${blur}px)`];
    if (filter) parts.push(filter);
    return parts.join(' ');
  };

  const render = () => {
    const c = canvasRef.current;
    const img = imgRef.current;
    if (!c || !img) return;
    const ctx = c.getContext('2d')!;
    ctx.save();
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.filter = buildFilter();
    ctx.translate(c.width / 2, c.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.drawImage(img, -c.width / 2, -c.height / 2, c.width, c.height);
    ctx.restore();
    ctx.filter = 'none';
  };

  useEffect(() => { if (imgLoaded) render(); }, [brightness, contrast, saturation, hue, blur, filter, rotation, flipH, flipV]);

  const saveHistory = () => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d')!;
    const data = ctx.getImageData(0, 0, c.width, c.height);
    setHistory((prev) => {
      const next = prev.slice(0, historyIdx + 1);
      next.push(data);
      if (next.length > 20) next.shift();
      return next;
    });
    setHistoryIdx((i) => Math.min(i + 1, 19));
  };

  const undo = () => {
    if (historyIdx <= 0) return;
    const idx = historyIdx - 1;
    const c = canvasRef.current!;
    const ctx = c.getContext('2d')!;
    ctx.putImageData(history[idx], 0, 0);
    setHistoryIdx(idx);
  };
  const redo = () => {
    if (historyIdx >= history.length - 1) return;
    const idx = historyIdx + 1;
    const c = canvasRef.current!;
    const ctx = c.getContext('2d')!;
    ctx.putImageData(history[idx], 0, 0);
    setHistoryIdx(idx);
  };

  const handleCanvasDown = (e: React.MouseEvent) => {
    if (tool === 'select') return;
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    const scaleX = c.width / rect.width;
    const scaleY = c.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    if (tool === 'text' && textInput.trim()) {
      const ctx = c.getContext('2d')!;
      ctx.font = 'bold 32px sans-serif';
      ctx.fillStyle = drawColor;
      ctx.fillText(textInput, x, y);
      saveHistory();
      return;
    }
    if (tool === 'draw' || tool === 'eraser') {
      drawing.current = true;
      lastPt.current = { x, y };
    }
  };
  const handleCanvasMove = (e: React.MouseEvent) => {
    if (!drawing.current) return;
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    const scaleX = c.width / rect.width;
    const scaleY = c.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    const ctx = c.getContext('2d')!;
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : drawColor;
    ctx.lineWidth = tool === 'eraser' ? drawSize * 3 : drawSize;
    ctx.lineCap = 'round';
    ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
    ctx.beginPath();
    ctx.moveTo(lastPt.current!.x, lastPt.current!.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';
    lastPt.current = { x, y };
  };
  const handleCanvasUp = () => {
    if (drawing.current) { drawing.current = false; saveHistory(); }
  };

  const exportImg = (fmt: string) => {
    const c = canvasRef.current!;
    const url = c.toDataURL(fmt, 0.92);
    const a = document.createElement('a'); a.href = url; a.download = `aurora-edited.${fmt.split('/')[1]}`; a.click();
  };

  const rotate = (deg: number) => setRotation((r) => r + deg);

  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <h2 className="font-bold text-lg mb-3 flex items-center gap-2"><Sliders size={18} /> Photo Editor (free, in-browser)</h2>
        <div
          className="border-2 border-dashed border-[var(--border)] rounded-xl p-4 text-center cursor-pointer hover:border-[var(--accent)]"
          onClick={() => document.getElementById('pe-file')?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) onFile(f); }}
        >
          <Upload size={20} className="mx-auto mb-1 text-[var(--muted)]" />
          <div className="text-sm text-[var(--muted)]">Click or drop an image to edit</div>
          <input id="pe-file" type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
        </div>
      </div>

      {imgLoaded && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
          <div className="card p-2">
            <div className="flex gap-2 mb-2 flex-wrap">
              <button className="btn ghost text-xs" onClick={undo}><Undo2 size={12} /></button>
              <button className="btn ghost text-xs" onClick={redo}><Redo2 size={12} /></button>
              <button className="btn ghost text-xs" onClick={() => rotate(90)}><RotateCw size={12} /> 90°</button>
              <button className="btn ghost text-xs" onClick={() => setFlipH((v) => !v)}><FlipHorizontal size={12} /></button>
              <button className="btn ghost text-xs" onClick={() => setFlipV((v) => !v)}><FlipVertical size={12} /></button>
              <div className="ml-auto flex gap-2">
                <button className="btn text-xs" onClick={() => exportImg('image/png')}>PNG</button>
                <button className="btn text-xs" onClick={() => exportImg('image/jpeg')}>JPG</button>
                <button className="btn text-xs" onClick={() => exportImg('image/webp')}>WebP</button>
              </div>
            </div>
            <div className="overflow-auto">
              <canvas
                ref={canvasRef}
                className="max-w-full border border-[var(--border)] rounded-lg cursor-crosshair"
                onMouseDown={handleCanvasDown}
                onMouseMove={handleCanvasMove}
                onMouseUp={handleCanvasUp}
                onMouseLeave={handleCanvasUp}
              />
            </div>
          </div>

          <div className="card flex flex-col gap-3">
            <div>
              <div className="text-xs font-semibold mb-1">Tools</div>
              <div className="flex gap-1 flex-wrap">
                {(['select','text','draw','eraser'] as const).map((t) => (
                  <button key={t} className={`chip ${tool === t ? 'active' : ''}`} onClick={() => setTool(t)}>{t}</button>
                ))}
              </div>
            </div>
            {(tool === 'draw' || tool === 'eraser') && (
              <div>
                <label className="text-xs text-[var(--muted)]">Color</label>
                <input type="color" value={drawColor} onChange={(e) => setDrawColor(e.target.value)} className="w-full h-8 rounded mt-1" />
                <label className="text-xs text-[var(--muted)] mt-2 block">Size {drawSize}</label>
                <input type="range" min="1" max="40" value={drawSize} onChange={(e) => setDrawSize(Number(e.target.value))} className="w-full" />
              </div>
            )}
            {tool === 'text' && (
              <div>
                <label className="text-xs text-[var(--muted)]">Text to place (click canvas)</label>
                <input className="input mt-1" value={textInput} onChange={(e) => setTextInput(e.target.value)} placeholder="Hello!" />
                <input type="color" value={drawColor} onChange={(e) => setDrawColor(e.target.value)} className="w-full h-8 rounded mt-2" />
              </div>
            )}

            <div>
              <div className="text-xs font-semibold mb-2 flex items-center gap-1"><Sliders size={12} /> Adjustments</div>
              {[
                ['Brightness', brightness, setBrightness, 0, 200],
                ['Contrast', contrast, setContrast, 0, 200],
                ['Saturation', saturation, setSaturation, 0, 200],
                ['Hue', hue, setHue, -180, 180],
                ['Blur', blur, setBlur, 0, 10],
              ].map(([label, val, set, min, max]: any) => (
                <div key={label} className="mb-2">
                  <div className="flex justify-between text-xs text-[var(--muted)]">
                    <span>{label}</span><span>{val}</span>
                  </div>
                  <input type="range" min={min} max={max} value={val} onChange={(e) => set(Number(e.target.value))} className="w-full" />
                </div>
              ))}
            </div>

            <div>
              <div className="text-xs font-semibold mb-2">Filters</div>
              <div className="flex flex-wrap gap-1">
                {FILTERS.map((f) => (
                  <button key={f.name} className={`chip ${filter === f.value ? 'active' : ''}`} onClick={() => setFilter(f.value)}>{f.name}</button>
                ))}
              </div>
            </div>

            <button className="btn ghost text-xs" onClick={resetAdjustments}>Reset adjustments</button>
          </div>
        </div>
      )}
    </div>
  );
}
