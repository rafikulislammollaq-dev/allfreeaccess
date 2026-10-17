import type { LucideIcon } from 'lucide-react';
import AdSlot from './AdSlot';

export type TabId =
  | 'home'
  | 'chat'
  | 'image'
  | 'voice'
  | 'tools'
  | 'ai'
  | 'imagetools'
  | 'pdftools'
  | 'photoeditor'
  | 'meme'
  | 'resume'
  | 'videotools'
  | 'playground'
  | 'resources'
  | 'prompts'
  | 'history'
  | 'settings'
  | 'about';

interface NavItem {
  id: TabId;
  label: string;
  icon: LucideIcon;
}

interface Props {
  items: NavItem[];
  active: TabId;
  onSelect: (id: TabId) => void;
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ items, active, onSelect, open, onClose }: Props) {
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />}
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#7c5cff,#22d3ee)' }}>
            <span className="text-white font-bold">A</span>
          </div>
          <div>
            <div className="font-bold text-lg gradient-text">Aurora</div>
            <div className="text-xs text-[var(--muted)]">Free AI Studio</div>
          </div>
        </div>
        <nav className="flex flex-col gap-1">
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <button
                key={it.id}
                className={`tab ${active === it.id ? 'active' : ''}`}
                style={{ justifyContent: 'flex-start', width: '100%' }}
                onClick={() => { onSelect(it.id); onClose(); }}
              >
                <Icon size={16} /> {it.label}
              </button>
            );
          })}
        </nav>
        <div className="mt-6">
          <AdSlot slot="1111111111" />
        </div>
        <div className="mt-4 text-xs text-[var(--muted)]">
          Powered by free, open APIs. No payment required.
        </div>
      </aside>
    </>
  );
}
