import { useState, useRef, useEffect } from 'react';
import { Upload, Download, Type } from 'lucide-react';

export default function MemePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [top, setTop] = useState('TOP TEXT');
  const [bottom, setBottom] = useState('BOTTOM TEXT');
  const [fontSize, setFontSize] = useState(48);
  const [color, setColor] = useState('#ffffff');
  const [stroke, setStroke] = useState('#000000');

  const onFile = (f: File) => {
    const url = URL.createObjectURL(f);
    const i = new Image();
    i.onload = () => { setImg(i); };
    i.src = url;
  };

  const render = () => {
    const c = canvasRef.current;
    if (!c || !img) return;
    c.width = img.width; c.height = img.height;
    const ctx = c.getContext('2d')!;
    ctx.drawImage(img, 0, 0);
    ctx.textAlign = 'center';
    ctx.font = `bold ${fontSize}px Impact, sans-serif`;
    ctx.fillStyle = color;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = Math.max(2, fontSize / 12);
    const drawText = (text: string, y: number) => {
      const t = text.toUpperCase();
      ctx.strokeText(t, c.width / 2, y);
      ctx.fillText(t, c.width / 2, y);
    };
    drawText(top, fontSize + 10);
    drawText(bottom, c.height - 20);
  };

  useEffect(() => { render(); }, [img, top, bottom, fontSize, color, stroke]);

  const exportMeme = () => {
    const c = canvasRef.current!;
    const url = c.toDataURL('image/png');
    const a = document.createElement('a'); a.href = url; a.download = 'meme.png'; a.click();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <h2 className="font-bold text-lg mb-3 flex items-center gap-2"><Type size={18} /> Meme Generator</h2>
        <div className="border-2 border-dashed border-[var(--border)] rounded-xl p-4 text-center cursor-pointer hover:border-[var(--accent)] mb-3"
          onClick={() => document.getElementById('meme-file')?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) onFile(f); }}>
          <Upload size={20} className="mx-auto mb-1 text-[var(--muted)]" />
          <div className="text-sm text-[var(--muted)]">Click or drop an image</div>
          <input id="meme-file" type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
        </div>
        <div className="grid-2">
          <input className="input" value={top} onChange={(e) => setTop(e.target.value)} placeholder="Top text" />
          <input className="input" value={bottom} onChange={(e) => setBottom(e.target.value)} placeholder="Bottom text" />
        </div>
        <div className="grid-2 mt-3">
          <div>
            <label className="text-xs text-[var(--muted)]">Font size {fontSize}</label>
            <input type="range" min="20" max="120" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full" />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs text-[var(--muted)]">Text color</label>
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-9 rounded mt-1" />
            </div>
            <div className="flex-1">
              <label className="text-xs text-[var(--muted)]">Outline</label>
              <input type="color" value={stroke} onChange={(e) => setStroke(e.target.value)} className="w-full h-9 rounded mt-1" />
            </div>
          </div>
        </div>
        <button className="btn primary mt-3" onClick={exportMeme} disabled={!img}><Download size={14} /> Download meme</button>
      </div>
      {img && (
        <div className="card p-2">
          <canvas ref={canvasRef} className="max-w-full rounded-lg" />
        </div>
      )}
    </div>
  );
}
