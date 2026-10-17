import { useEffect, useState } from 'react';
import {
  MessageSquare, Image as ImageIcon, Mic, Wrench, Sparkles, Code2, Globe, FileText, ImagePlus, Library, History as HistoryIcon,
  Settings as SettingsIcon, Info, Menu, Sun, Moon,
} from 'lucide-react';
import { load } from './lib/storage';
import Sidebar, { type TabId } from './components/Sidebar';
import AdSlot from './components/AdSlot';
import { lazy, Suspense } from 'react';
const ChatPage = lazy(() => import('./pages/Chat'));
const ImagePage = lazy(() => import('./pages/ImageGen'));
const VoicePage = lazy(() => import('./pages/Voice'));
const ToolsPage = lazy(() => import('./pages/Tools'));
const AiToolsPage = lazy(() => import('./pages/AiTools'));
const ImageToolsPage = lazy(() => import('./pages/ImageTools'));
const PdfToolsPage = lazy(() => import('./pages/PdfTools'));
const PlaygroundPage = lazy(() => import('./pages/Playground'));
const ResourcesPage = lazy(() => import('./pages/Resources'));
const PromptsPage = lazy(() => import('./pages/Prompts'));
const HistoryPage = lazy(() => import('./pages/History'));
const SettingsPage = lazy(() => import('./pages/Settings'));
const AboutPage = lazy(() => import('./pages/About'));

const NAV = [
  { id: 'chat' as TabId, label: 'Chat', icon: MessageSquare },
  { id: 'image' as TabId, label: 'Image', icon: ImageIcon },
  { id: 'voice' as TabId, label: 'Voice', icon: Mic },
  { id: 'tools' as TabId, label: 'Tools', icon: Wrench },
  { id: 'ai' as TabId, label: 'AI Utils', icon: Sparkles },
  { id: 'imagetools' as TabId, label: 'Image Tools', icon: ImagePlus },
  { id: 'pdftools' as TabId, label: 'PDF Tools', icon: FileText },
  { id: 'playground' as TabId, label: 'Playground', icon: Code2 },
  { id: 'resources' as TabId, label: 'Resources', icon: Globe },
  { id: 'prompts' as TabId, label: 'Prompts', icon: Library },
  { id: 'history' as TabId, label: 'History', icon: HistoryIcon },
  { id: 'settings' as TabId, label: 'Settings', icon: SettingsIcon },
  { id: 'about' as TabId, label: 'About', icon: Info },
];

export default function App() {
  const [tab, setTab] = useState<TabId>('chat');
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
      <Sidebar items={NAV} active={tab} onSelect={setTab} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="main">
        <div className="flex items-center justify-between mb-4 md:hidden">
          <button className="btn" onClick={() => setSidebarOpen(true)}><Menu size={16} /></button>
          <div className="font-bold gradient-text">Aurora</div>
          <button className="btn ghost" onClick={() => handleTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
        <AdSlot slot="4444444444" className="mb-4" />
        <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="spinner" /></div>}>
          {tab === 'chat' && <ChatPage />}
          {tab === 'image' && <ImagePage />}
          {tab === 'voice' && <VoicePage />}
          {tab === 'tools' && <ToolsPage />}
          {tab === 'ai' && <AiToolsPage />}
          {tab === 'imagetools' && <ImageToolsPage />}
          {tab === 'pdftools' && <PdfToolsPage />}
          {tab === 'playground' && <PlaygroundPage />}
          {tab === 'resources' && <ResourcesPage />}
          {tab === 'prompts' && <PromptsPage />}
          {tab === 'history' && <HistoryPage />}
          {tab === 'settings' && <SettingsPage onTheme={handleTheme} />}
          {tab === 'about' && <AboutPage />}
        </Suspense>
      </main>
    </div>
  );
}
