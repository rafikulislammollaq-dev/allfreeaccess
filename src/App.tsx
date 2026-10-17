import { lazy, Suspense, useEffect, useState } from 'react';
import { Home, Key, Plug, Settings as SettingsIcon, Info, Menu, Sun, Moon } from 'lucide-react';
import { load } from './lib/storage';
import Sidebar, { type TabId } from './components/Sidebar';
import CommandPalette from './components/CommandPalette';
import AdSlot from './components/AdSlot';
import Footer from './components/Footer';

const HomePage = lazy(() => import('./pages/Home'));
const GetKeyPage = lazy(() => import('./pages/GetKey'));
const ApiPage = lazy(() => import('./pages/Api'));
const SettingsPage = lazy(() => import('./pages/Settings'));
const AboutPage = lazy(() => import('./pages/About'));

const GROUPS = [
  { title: 'Main', items: [
    { id: 'home' as TabId, label: 'Home', icon: Home },
    { id: 'getkey' as TabId, label: 'Get API Key', icon: Key },
    { id: 'api' as TabId, label: 'API & Integrations', icon: Plug },
  ]},
  { title: 'More', items: [
    { id: 'settings' as TabId, label: 'Settings', icon: SettingsIcon },
    { id: 'about' as TabId, label: 'About', icon: Info },
  ]},
];

const CMD_ITEMS = GROUPS.flatMap((g) => g.items.map((it) => ({ id: it.id, label: it.label })));

export default function App() {
  const [tab, setTab] = useState<TabId>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const s = load<any>('aurora.settings', { theme: 'dark' });
    return s.theme || 'dark';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  const handleTheme = (t: 'dark' | 'light') => {
    setTheme(t);
    document.documentElement.classList.toggle('light', t === 'light');
  };

  return (
    <div className="layout">
      <Sidebar groups={GROUPS} active={tab} onSelect={setTab} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="main">
        <CommandPalette items={CMD_ITEMS} onSelect={setTab} />
        <div className="hidden md:flex items-center justify-end mb-3 gap-2">
          <button className="btn ghost sm" onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))} title="Press Ctrl+K">
            <span className="text-[var(--muted)]">Search</span>
            <span className="kbd">Ctrl K</span>
          </button>
          <button className="btn ghost sm" onClick={() => handleTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
        <div className="flex items-center justify-between mb-4 md:hidden">
          <button className="btn" onClick={() => setSidebarOpen(true)}><Menu size={16} /></button>
          <div className="font-bold gradient-text">Aurora</div>
          <button className="btn ghost" onClick={() => handleTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
        <AdSlot slot="4444444444" className="mb-4" />
        <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="spinner" /></div>}>
          {tab === 'home' && <HomePage onNavigate={setTab} />}
          {tab === 'getkey' && <GetKeyPage />}
          {tab === 'api' && <ApiPage />}
          {tab === 'settings' && <SettingsPage onTheme={handleTheme} />}
          {tab === 'about' && <AboutPage />}
        </Suspense>
        <Footer />
      </main>
    </div>
  );
}
