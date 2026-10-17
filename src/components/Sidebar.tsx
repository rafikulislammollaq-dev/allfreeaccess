import type { LucideIcon } from 'lucide-react';
import AdSlot from './AdSlot';

export type TabId =
  | 'home'
  | 'getkey'
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
  | 'generators'
  | 'colortools'
  | 'textanalyzer'
  | 'encode'
  | 'dataconverter'
  | 'security'
  | 'webtools'
  | 'mathtools'
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

interface NavItem { id: TabId; label: string; icon: LucideIcon; }

interface Props {
  groups?: { title: string; items: NavItem[] }[];
  items?: NavItem[];
  active: TabId;
  onSelect: (id: TabId) => void;
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ groups, items, active, onSelect, open, onClose }: Props) {
  const grouped = groups && groups.length ? groups : [{ title: 'Menu', items: items || [] }];
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
            <div className="text-xs text-[var(--muted)]">Free API Keys</div>
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
