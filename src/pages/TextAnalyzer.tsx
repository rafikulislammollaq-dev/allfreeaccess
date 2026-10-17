import { useState, useMemo } from 'react';
import { FileText } from 'lucide-react';

export default function TextAnalyzerPage() {
  const [text, setText] = useState('');
  const stats = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/) : [];
    const sentences = text.trim() ? (text.match(/[.!?]+/g) || []).length : 0;
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter((p) => p.trim()).length : 0;
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, '').length;
    const readingTime = Math.ceil(words.length / 200);
    const speakingTime = Math.ceil(words.length / 130);
    // keyword density
    const freq: Record<string, number> = {};
    words.forEach((w) => {
      const clean = w.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (clean.length > 2) freq[clean] = (freq[clean] || 0) + 1;
    });
    const topWords = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 10);
    // readability (Flesch-Kincaid simplified)
    const syllables = words.reduce((acc, w) => acc + countSyllables(w), 0);
    const fk = words.length && sentences
      ? 206.835 - 1.015 * (words.length / sentences) - 84.6 * (syllables / words.length)
      : 0;
    return { words: words.length, sentences, paragraphs, chars, charsNoSpace, readingTime, speakingTime, topWords, fk: Math.round(fk) };
  }, [text]);

  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <h2 className="font-bold text-lg mb-3 flex items-center gap-2"><FileText size={18} /> Text Analyzer</h2>
        <textarea className="textarea" rows={8} value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste or type text to analyze..." />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Words" value={stats.words} />
        <Stat label="Characters" value={stats.chars} />
        <Stat label="No spaces" value={stats.charsNoSpace} />
        <Stat label="Sentences" value={stats.sentences} />
        <Stat label="Paragraphs" value={stats.paragraphs} />
        <Stat label="Reading time" value={stats.readingTime + ' min'} />
        <Stat label="Speaking time" value={stats.speakingTime + ' min'} />
        <Stat label="Readability (FK)" value={stats.fk} />
      </div>
      {stats.topWords.length > 0 && (
        <div className="card">
          <h3 className="font-semibold mb-3">Top Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {stats.topWords.map(([w, c]) => (
              <span key={w} className="chip">{w} <span className="text-[var(--muted)]">({c})</span></span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="p-3 rounded-lg bg-[var(--panel-2)]">
      <div className="text-xs text-[var(--muted)]">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  const m = word.match(/[aeiouy]{1,2}/g);
  return m ? m.length : 1;
}
