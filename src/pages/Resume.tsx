import { useState } from 'react';
import { FileText, Download, Plus, Trash2 } from 'lucide-react';

interface Exp { title: string; company: string; period: string; desc: string; }
interface Edu { degree: string; school: string; period: string; }

export default function ResumePage() {
  const [name, setName] = useState('Your Name');
  const [title, setTitle] = useState('Software Engineer');
  const [email, setEmail] = useState('you@example.com');
  const [phone, setPhone] = useState('+1 555 000 0000');
  const [location, setLocation] = useState('City, Country');
  const [website, setWebsite] = useState('yourwebsite.com');
  const [summary, setSummary] = useState('A passionate professional with experience building great products.');
  const [skills, setSkills] = useState('JavaScript, TypeScript, React, Node.js, Python, SQL');
  const [experience, setExperience] = useState<Exp[]>([
    { title: 'Senior Engineer', company: 'Acme Inc.', period: '2022 — Present', desc: 'Led development of core platform. Improved performance by 40%.' },
  ]);
  const [education, setEducation] = useState<Edu[]>([
    { degree: 'B.Sc. Computer Science', school: 'University Name', period: '2018 — 2022' },
  ]);

  const addExp = () => setExperience((e) => [...e, { title: '', company: '', period: '', desc: '' }]);
  const removeExp = (i: number) => setExperience((e) => e.filter((_, idx) => idx !== i));
  const updateExp = (i: number, field: keyof Exp, v: string) => setExperience((e) => e.map((x, idx) => idx === i ? { ...x, [field]: v } : x));
  const addEdu = () => setEducation((e) => [...e, { degree: '', school: '', period: '' }]);
  const removeEdu = (i: number) => setEducation((e) => e.filter((_, idx) => idx !== i));
  const updateEdu = (i: number, field: keyof Edu, v: string) => setEducation((e) => e.map((x, idx) => idx === i ? { ...x, [field]: v } : x));

  const download = () => {
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`
      <html><head><title>Resume - ${name}</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; margin: 40px; color: #222; }
        h1 { margin: 0; font-size: 28px; }
        h2 { font-size: 16px; border-bottom: 2px solid #7c5cff; padding-bottom: 4px; margin-top: 16px; color: #7c5cff; }
        .title { color: #555; font-size: 14px; margin-bottom: 8px; }
        .contact { font-size: 12px; color: #666; }
        .section { margin-top: 12px; }
        .item { margin-bottom: 10px; }
        .item-title { font-weight: 600; }
        .item-sub { color: #666; font-size: 13px; }
        .skills { display: flex; flex-wrap: wrap; gap: 6px; }
        .skill { background: #eee; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
        @media print { body { margin: 20px; } }
      </style></head><body>
      <h1>${name}</h1>
      <div class="title">${title}</div>
      <div class="contact">${email} · ${phone} · ${location} · ${website}</div>
      <h2>Summary</h2><p>${summary}</p>
      <h2>Skills</h2><div class="skills">${skills.split(',').map((s) => `<span class="skill">${s.trim()}</span>`).join('')}</div>
      <h2>Experience</h2>
      ${experience.map((e) => `<div class="item"><div class="item-title">${e.title} — ${e.company}</div><div class="item-sub">${e.period}</div><p>${e.desc}</p></div>`).join('')}
      <h2>Education</h2>
      ${education.map((e) => `<div class="item"><div class="item-title">${e.degree}</div><div class="item-sub">${e.school} · ${e.period}</div></div>`).join('')}
      </body></html>
    `);
    w.document.close();
    setTimeout(() => { w.print(); }, 300);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <h2 className="font-bold text-lg mb-3 flex items-center gap-2"><FileText size={18} /> Resume Builder (free)</h2>
        <div className="grid-2">
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" />
          <input className="input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" />
          <input className="input" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="Website" />
        </div>
        <textarea className="textarea mt-3" rows={3} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Summary" />
        <input className="input mt-3" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Skills (comma separated)" />
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Experience</h3>
          <button className="btn text-xs" onClick={addExp}><Plus size={12} /> Add</button>
        </div>
        {experience.map((e, i) => (
          <div key={i} className="flex flex-col gap-2 mb-3 p-3 rounded-lg bg-[var(--panel-2)]">
            <div className="grid-2">
              <input className="input" value={e.title} onChange={(ev) => updateExp(i, 'title', ev.target.value)} placeholder="Job title" />
              <input className="input" value={e.company} onChange={(ev) => updateExp(i, 'company', ev.target.value)} placeholder="Company" />
              <input className="input" value={e.period} onChange={(ev) => updateExp(i, 'period', ev.target.value)} placeholder="Period" />
            </div>
            <textarea className="textarea" rows={2} value={e.desc} onChange={(ev) => updateExp(i, 'desc', ev.target.value)} placeholder="Description" />
            <button className="btn danger text-xs self-end" onClick={() => removeExp(i)}><Trash2 size={12} /> Remove</button>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Education</h3>
          <button className="btn text-xs" onClick={addEdu}><Plus size={12} /> Add</button>
        </div>
        {education.map((e, i) => (
          <div key={i} className="flex flex-col gap-2 mb-3 p-3 rounded-lg bg-[var(--panel-2)]">
            <div className="grid-2">
              <input className="input" value={e.degree} onChange={(ev) => updateEdu(i, 'degree', ev.target.value)} placeholder="Degree" />
              <input className="input" value={e.school} onChange={(ev) => updateEdu(i, 'school', ev.target.value)} placeholder="School" />
              <input className="input" value={e.period} onChange={(ev) => updateEdu(i, 'period', ev.target.value)} placeholder="Period" />
            </div>
            <button className="btn danger text-xs self-end" onClick={() => removeEdu(i)}><Trash2 size={12} /> Remove</button>
          </div>
        ))}
      </div>

      <button className="btn primary" onClick={download}><Download size={14} /> Download PDF (Print)</button>
    </div>
  );
}
