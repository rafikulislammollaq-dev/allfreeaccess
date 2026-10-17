import { useState } from 'react';
import { Trash2, Download } from 'lucide-react';
import { load, save } from '../lib/storage';

export default function HistoryPage() {
  const [chats] = useState(() => load<any[]>('aurora.chats', []));
  const [images] = useState(() => load<any[]>('aurora.images', []));

  const exportAll = () => {
    const data = { chats, images, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'aurora-data.json'; a.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    if (confirm('Clear all chats, images, and prompts?')) {
      save('aurora.chats', []); save('aurora.images', []); save('aurora.prompts', []);
      location.reload();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <h2 className="font-bold text-lg mb-3">History & Data</h2>
        <div className="grid-2">
          <div className="p-3 rounded-lg bg-[var(--panel-2)]">
            <div className="text-xs text-[var(--muted)]">Saved chats</div>
            <div className="text-2xl font-bold">{chats.length}</div>
          </div>
          <div className="p-3 rounded-lg bg-[var(--panel-2)]">
            <div className="text-xs text-[var(--muted)]">Saved images</div>
            <div className="text-2xl font-bold">{images.length}</div>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button className="btn primary" onClick={exportAll}><Download size={14} /> Export all data</button>
          <button className="btn danger" onClick={clearAll}><Trash2 size={14} /> Clear all data</button>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold mb-3">Recent chats</h3>
        {chats.length === 0 ? <div className="text-sm text-[var(--muted)]">None</div> : (
          <div className="flex flex-col gap-2">
            {chats.slice(0, 20).map((c: any) => (
              <div key={c.id} className="p-2 rounded-lg bg-[var(--panel-2)] flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{c.title}</div>
                  <div className="text-xs text-[var(--muted)]">{c.messages?.length || 0} messages · {new Date(c.createdAt).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h3 className="font-semibold mb-3">Recent images</h3>
        {images.length === 0 ? <div className="text-sm text-[var(--muted)]">None</div> : (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {images.slice(0, 24).map((img: any) => (
              <img key={img.id} src={img.url} alt={img.prompt} className="aspect-square object-cover rounded-lg" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
