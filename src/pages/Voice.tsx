import { useEffect, useRef, useState } from 'react';
import { Mic, Volume2, Square, Copy, Trash2 } from 'lucide-react';
import { chatComplete, TEXT_MODELS } from '../lib/aurora';

export default function VoicePage() {
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const [ttsText, setTtsText] = useState('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceIdx, setVoiceIdx] = useState(0);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [aiReply, setAiReply] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [model, setModel] = useState('openai');
  const recRef = useRef<any>(null);

  useEffect(() => {
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  const startListen = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert('Speech recognition not supported in this browser. Try Chrome/Edge.'); return; }
    const rec = new SR();
    rec.lang = 'en-US';
    rec.interimResults = true;
    rec.continuous = true;
    rec.onresult = (e: any) => {
      let t = '';
      for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript;
      setTranscript(t);
    };
    rec.onend = () => setListening(false);
    rec.start();
    recRef.current = rec;
    setListening(true);
  };
  const stopListen = () => { recRef.current?.stop(); setListening(false); };

  const speak = () => {
    if (!ttsText.trim()) return;
    const u = new SpeechSynthesisUtterance(ttsText);
    if (voices[voiceIdx]) u.voice = voices[voiceIdx];
    u.rate = rate; u.pitch = pitch;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };
  const stopSpeak = () => window.speechSynthesis.cancel();

  const askAI = async () => {
    const text = transcript.trim() || ttsText.trim();
    if (!text) return;
    setAiLoading(true);
    try {
      const reply = await chatComplete([{ role: 'user', content: text }], { model });
      setAiReply(reply);
      const u = new SpeechSynthesisUtterance(reply);
      if (voices[voiceIdx]) u.voice = voices[voiceIdx];
      u.rate = rate; u.pitch = pitch;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch (e: any) {
      setAiReply('Error: ' + (e?.message || 'failed'));
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <h2 className="font-bold text-lg mb-3 flex items-center gap-2"><Mic size={18} /> Speech to Text</h2>
        <div className="flex gap-2 mb-3">
          {!listening ? (
            <button className="btn primary" onClick={startListen}><Mic size={16} /> Start listening</button>
          ) : (
            <button className="btn danger" onClick={stopListen}><Square size={16} /> Stop</button>
          )}
          <button className="btn" onClick={() => setTranscript('')}><Trash2 size={14} /> Clear</button>
          <button className="btn" onClick={() => navigator.clipboard.writeText(transcript)}><Copy size={14} /> Copy</button>
        </div>
        <textarea className="textarea" rows={6} value={transcript} onChange={(e) => setTranscript(e.target.value)} placeholder="Transcript will appear here..." />
        <div className="flex items-center gap-2 mt-3">
          <select className="select" style={{ width: 200 }} value={model} onChange={(e) => setModel(e.target.value)}>
            {TEXT_MODELS.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <button className="btn primary" onClick={askAI} disabled={aiLoading || (!transcript.trim() && !ttsText.trim())}>
            {aiLoading ? 'Thinking...' : 'Ask AI & speak reply'}
          </button>
        </div>
        {aiReply && (
          <div className="mt-3 p-3 rounded-lg bg-[var(--panel-2)] border border-[var(--border)] whitespace-pre-wrap">{aiReply}</div>
        )}
      </div>

      <div className="card">
        <h2 className="font-bold text-lg mb-3 flex items-center gap-2"><Volume2 size={18} /> Text to Speech</h2>
        <textarea className="textarea" rows={4} value={ttsText} onChange={(e) => setTtsText(e.target.value)} placeholder="Type text to speak..." />
        <div className="grid-2 mt-3">
          <div>
            <label className="text-xs text-[var(--muted)]">Voice</label>
            <select className="select mt-1" value={voiceIdx} onChange={(e) => setVoiceIdx(Number(e.target.value))}>
              {voices.map((v, i) => <option key={i} value={i}>{v.name} ({v.lang})</option>)}
            </select>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-[var(--muted)]">Rate {rate.toFixed(1)}</label>
              <input type="range" min="0.5" max="2" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full" />
            </div>
            <div className="flex-1">
              <label className="text-xs text-[var(--muted)]">Pitch {pitch.toFixed(1)}</label>
              <input type="range" min="0.5" max="2" step="0.1" value={pitch} onChange={(e) => setPitch(Number(e.target.value))} className="w-full" />
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <button className="btn primary" onClick={speak}><Volume2 size={16} /> Speak</button>
          <button className="btn" onClick={stopSpeak}><Square size={14} /> Stop</button>
        </div>
      </div>
    </div>
  );
}
