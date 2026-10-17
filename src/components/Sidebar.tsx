import type { LucideIcon } from 'lucide-react';
import AdSlot from './AdSlot';

export type TabId =
  | 'home'
  | 'chat'
  | 'image'
  | 'imagetools'
  | 'photoeditor'
  | 'meme'
  | 'pdftools'
  | 'videotools'
  | 'ai'
  | 'tools'
  | 'calculators'
  | 'playground'
  | 'voice'
  | 'notes'
  | 'resume'
  | 'prompts'
  | 'resources'
  | 'api'
  | 'history'
  | 'settings'
  | 'about';

// navigation groups are passed from App
interface NavItem { id: TabId; label: string; icon: LucideIcon; }

interface Props {
  items?: NavItem[];
  groups?: { title: string; items: NavItem[] }[];
  active: TabId;
  onSelect: (id: TabId) => void;
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ items, groups, active, onSelect, open, onClose }: Props) {
  const grouped = groups && groups.length ? groups : [{ title: 'Menu', items }];
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={onClose} />}
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent)' }}>
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <div>
            <div className="font-bold text-base" style={{ color: 'var(--text)' }}>Aurora</div>
            <div className="text-xs text-[var(--muted)]">Free Studio</div>
          </div>
        </div>
        <nav className="flex flex-col gap-2 flex-1 overflow-y-auto scrollbar">
          {grouped.map((g) => (
            <div key={g.title} className="sidebar-group">
              <div className="sidebar-group-title">{g.title}</div>
              {(g.items || []).map((it) => {
                const Icon = it.icon;
                return (
                  <button
                    key={it.id}
                    className={`nav-item ${active === it.id ? 'active' : ''}`}
                    onClick={() => { onSelect(it.id); onClose(); }}
                  >
                    <Icon size={16} /> {it.label}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="mt-2">
          <AdSlot slot="1111111111" />
        </div>
      </aside>
    </>
  );
}
