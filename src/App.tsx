import { useEffect, useState } from 'react';
import {
  Home, MessageSquare, Image as ImageIcon, Mic, Wrench, Sparkles, Code2, Globe, FileText, ImagePlus, Wand2, Smile, ClipboardList, Video, Notebook, Library, History as HistoryIcon,
  Settings as SettingsIcon, Info, Menu, Sun, Moon,
} from 'lucide-react';
import { load } from './lib/storage';
import Sidebar, { type TabId } from './components/Sidebar';
import CommandPalette from './components/CommandPalette';
import AdSlot from './components/AdSlot';
import { lazy, Suspense } from 'react';
const HomePage = lazy(() => import('./pages/Home'));
const ChatPage = lazy(() => import('./pages/Chat'));
const ImagePage = lazy(() => import('./pages/ImageGen'));
const VoicePage = lazy(() => import('./pages/Voice'));
const ToolsPage = lazy(() => import('./pages/Tools'));
const AiToolsPage = lazy(() => import('./pages/AiTools'));
const ImageToolsPage = lazy(() => import('./pages/ImageTools'));
const PdfToolsPage = lazy(() => import('./pages/PdfTools'));
const PhotoEditorPage = lazy(() => import('./pages/PhotoEditor'));
const MemePage = lazy(() => import('./pages/Meme'));
const ResumePage = lazy(() => import('./pages/Resume'));
const VideoToolsPage = lazy(() => import('./pages/VideoTools'));
const NotesPage = lazy(() => import('./pages/Notes'));
const PlaygroundPage = lazy(() => import('./pages/Playground'));
const ResourcesPage = lazy(() => import('./pages/Resources'));
const PromptsPage = lazy(() => import('./pages/Prompts'));
const HistoryPage = lazy(() => import('./pages/History'));
const SettingsPage = lazy(() => import('./pages/Settings'));
const AboutPage = lazy(() => import('./pages/About'));

const GROUPS = [
  { title: 'Main', items: [
    { id: 'home' as TabId, label: 'Home', icon: Home },
    { id: 'chat' as TabId, label: 'AI Chat', icon: MessageSquare },
    { id: 'notes' as TabId, label: 'Notes', icon: Notebook },
  ]},
  { title: 'Create', items: [
    { id: 'image' as TabId, label: 'Image Gen', icon: ImageIcon },
    { id: 'photoeditor' as TabId, label: 'Photo Editor', icon: Wand2 },
    { id: 'meme' as TabId, label: 'Meme Gen', icon: Smile },
    { id: 'imagetools' as TabId, label: 'Image Tools', icon: ImagePlus },
  ]},
  { title: 'Documents', items: [
    { id: 'pdftools' as TabId, label: 'PDF Tools', icon: FileText },
    { id: 'resume' as TabId, label: 'Resume', icon: ClipboardList },
  ]},
  { title: 'Media', items: [
    { id: 'videotools' as TabId, label: 'Video Tools', icon: Video },
    { id: 'voice' as TabId, label: 'Voice', icon: Mic },
  ]},
  { title: 'Tools', items: [
    { id: 'ai' as TabId, label: 'AI Utils', icon: Sparkles },
    { id: 'tools' as TabId, label: 'Dev Tools', icon: Wrench },
    { id: 'playground' as TabId, label: 'Playground', icon: Code2 },
    { id: 'prompts' as TabId, label: 'Prompts', icon: Library },
  ]},
  { title: 'More', items: [
    { id: 'resources' as TabId, label: 'Resources', icon: Globe },
    { id: 'history' as TabId, label: 'History', icon: HistoryIcon },
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
      <CommandPalette items={CMD_ITEMS} onSelect={setTab} />
      <main className="main">
        <div className="hidden md:flex items-center justify-end mb-3 gap-2">
          <button className="btn ghost sm" onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))} title="Press Ctrl+K">
            <span className="text-[var(--muted)]">Search</span>
            <span className="kbd">Ctrl K</span>
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
          {tab === 'chat' && <ChatPage />}
          {tab === 'image' && <ImagePage />}
          {tab === 'voice' && <VoicePage />}
          {tab === 'tools' && <ToolsPage />}
          {tab === 'ai' && <AiToolsPage />}
          {tab === 'imagetools' && <ImageToolsPage />}
          {tab === 'photoeditor' && <PhotoEditorPage />}
          {tab === 'meme' && <MemePage />}
          {tab === 'resume' && <ResumePage />}
          {tab === 'videotools' && <VideoToolsPage />}
          {tab === 'pdftools' && <PdfToolsPage />}
          {tab === 'playground' && <PlaygroundPage />}
          {tab === 'resources' && <ResourcesPage />}
          {tab === 'notes' && <NotesPage />}
          {tab === 'prompts' && <PromptsPage />}
          {tab === 'history' && <HistoryPage />}
          {tab === 'settings' && <SettingsPage onTheme={handleTheme} />}
          {tab === 'about' && <AboutPage />}
        </Suspense>
      </main>
    </div>
  );
}
