import { useEffect, useState } from 'react';
import {
  MessageSquare, Image as ImageIcon, Mic, Wrench, Sparkles, Code2, Globe, Library, History as HistoryIcon,
  Settings as SettingsIcon, Info, Menu, Sun, Moon,
} from 'lucide-react';
import { load } from './lib/storage';
import Sidebar, { type TabId } from './components/Sidebar';
import AdSlot from './components/AdSlot';
import ChatPage from './pages/Chat';
import ImagePage from './pages/ImageGen';
import VoicePage from './pages/Voice';
import ToolsPage from './pages/Tools';
import AiToolsPage from './pages/AiTools';
import PlaygroundPage from './pages/Playground';
import ResourcesPage from './pages/Resources';
import PromptsPage from './pages/Prompts';
import HistoryPage from './pages/History';
import SettingsPage from './pages/Settings';
import AboutPage from './pages/About';

const NAV = [
  { id: 'chat' as TabId, label: 'Chat', icon: MessageSquare },
  { id: 'image' as TabId, label: 'Image', icon: ImageIcon },
  { id: 'voice' as TabId, label: 'Voice', icon: Mic },
  { id: 'tools' as TabId, label: 'Tools', icon: Wrench },
  { id: 'ai' as TabId, label: 'AI Utils', icon: Sparkles },
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
        {tab === 'chat' && <ChatPage />}
        {tab === 'image' && <ImagePage />}
        {tab === 'voice' && <VoicePage />}
        {tab === 'tools' && <ToolsPage />}
        {tab === 'ai' && <AiToolsPage />}
        {tab === 'playground' && <PlaygroundPage />}
        {tab === 'resources' && <ResourcesPage />}
        {tab === 'prompts' && <PromptsPage />}
        {tab === 'history' && <HistoryPage />}
        {tab === 'settings' && <SettingsPage onTheme={handleTheme} />}
        {tab === 'about' && <AboutPage />}
      </main>
    </div>
  );
}
