import { useState } from 'react';
import { Database } from 'lucide-react';

export default function DataConverterPage() {
  const [tab, setTab] = useState('csv2json');
  const tabs = [
    { id: 'csv2json', label: 'CSV → JSON' },
    { id: 'json2csv', label: 'JSON → CSV' },
    { id: 'xml2json', label: 'XML → JSON' },
    { id: 'tsv2json', label: 'TSV → JSON' },
  ];
  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <h2 className="font-bold text-lg mb-3 flex items-center gap-2"><Database size={18} /> Data Converters</h2>
        <div className="flex gap-2 flex-wrap mb-3">
          {tabs.map((t) => (
            <button key={t.id} className={`chip ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
        </div>
        {tab === 'csv2json' && <Csv2Json />}
        {tab === 'json2csv' && <Json2Csv />}
        {tab === 'xml2json' && <Xml2Json />}
        {tab === 'tsv2json' && <Tsv2Json />}
      </div>
    </div>
  );
}

function Csv2Json() {
  const [input, setInput] = useState('name,age,city\nAlice,30,NYC\nBob,25,LA');
  const [output, setOutput] = useState('');
  const convert = () => {
    const lines = input.trim().split('\n');
    if (lines.length < 2) { setOutput('Need header + data'); return; }
    const headers = lines[0].split(',').map((h) => h.trim());
    const rows = lines.slice(1).map((line) => {
      const vals = line.split(',').map((v) => v.trim());
      const obj: any = {};
      headers.forEach((h, i) => { obj[h] = vals[i] ?? ''; });
      return obj;
    });
    setOutput(JSON.stringify(rows, null, 2));
  };
  return (
    <div>
      <textarea className="textarea" rows={6} value={input} onChange={(e) => setInput(e.target.value)} />
      <button className="btn primary mt-2" onClick={convert}>Convert</button>
      <button className="btn text-xs mt-2 ml-2" onClick={() => navigator.clipboard.writeText(output)} disabled={!output}>Copy</button>
      {output && <pre className="mt-3 p-3 rounded-lg bg-[var(--panel-2)] text-sm font-mono overflow-x-auto">{output}</pre>}
    </div>
  );
}

function Json2Csv() {
  const [input, setInput] = useState('[{"name":"Alice","age":30},{"name":"Bob","age":25}]');
  const [output, setOutput] = useState('');
  const convert = () => {
    try {
      const arr = JSON.parse(input);
      if (!Array.isArray(arr) || arr.length === 0) { setOutput('Need array of objects'); return; }
      const headers = Object.keys(arr[0]);
      const rows = [headers.join(',')];
      arr.forEach((obj) => {
        rows.push(headers.map((h) => JSON.stringify(obj[h] ?? '')).join(','));
      });
      setOutput(rows.join('\n'));
    } catch (e: any) { setOutput('Error: ' + e.message); }
  };
  return (
    <div>
      <textarea className="textarea" rows={6} value={input} onChange={(e) => setInput(e.target.value)} />
      <button className="btn primary mt-2" onClick={convert}>Convert</button>
      <button className="btn text-xs mt-2 ml-2" onClick={() => navigator.clipboard.writeText(output)} disabled={!output}>Copy</button>
      {output && <pre className="mt-3 p-3 rounded-lg bg-[var(--panel-2)] text-sm font-mono whitespace-pre-wrap">{output}</pre>}
    </div>
  );
}

function Xml2Json() {
  const [input, setInput] = useState('<users><user><name>Alice</name><age>30</age></user></users>');
  const [output, setOutput] = useState('');
  const convert = () => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(input, 'text/xml');
      const toJson = (node: any): any => {
        if (node.nodeType === 3) return node.nodeValue?.trim() || null;
        const obj: any = {};
        if (node.attributes) {
          for (let i = 0; i < node.attributes.length; i++) {
            obj['@' + node.attributes[i].name] = node.attributes[i].value;
          }
        }
        const children = Array.from(node.childNodes);
        const textNodes = children.filter((c: any) => c.nodeType === 3).map((c: any) => c.nodeValue?.trim()).filter(Boolean);
        if (textNodes.length && children.length === 1) return textNodes[0];
        children.forEach((c: any) => {
          if (c.nodeType === 1) {
            const child = toJson(c);
            if (obj[c.nodeName]) {
              if (!Array.isArray(obj[c.nodeName])) obj[c.nodeName] = [obj[c.nodeName]];
              obj[c.nodeName].push(child);
            } else {
              obj[c.nodeName] = child;
            }
          }
        });
        return obj;
      };
      setOutput(JSON.stringify(toJson(doc.documentElement), null, 2));
    } catch (e: any) { setOutput('Error: ' + e.message); }
  };
  return (
    <div>
      <textarea className="textarea" rows={6} value={input} onChange={(e) => setInput(e.target.value)} />
      <button className="btn primary mt-2" onClick={convert}>Convert</button>
      <button className="btn text-xs mt-2 ml-2" onClick={() => navigator.clipboard.writeText(output)} disabled={!output}>Copy</button>
      {output && <pre className="mt-3 p-3 rounded-lg bg-[var(--panel-2)] text-sm font-mono overflow-x-auto">{output}</pre>}
    </div>
  );
}

function Tsv2Json() {
  const [input, setInput] = useState('name\tage\tcity\nAlice\t30\tNYC\nBob\t25\tLA');
  const [output, setOutput] = useState('');
  const convert = () => {
    const lines = input.trim().split('\n');
    if (lines.length < 2) { setOutput('Need header + data'); return; }
    const headers = lines[0].split('\t').map((h) => h.trim());
    const rows = lines.slice(1).map((line) => {
      const vals = line.split('\t').map((v) => v.trim());
      const obj: any = {};
      headers.forEach((h, i) => { obj[h] = vals[i] ?? ''; });
      return obj;
    });
    setOutput(JSON.stringify(rows, null, 2));
  };
  return (
    <div>
      <textarea className="textarea" rows={6} value={input} onChange={(e) => setInput(e.target.value)} />
      <button className="btn primary mt-2" onClick={convert}>Convert</button>
      <button className="btn text-xs mt-2 ml-2" onClick={() => navigator.clipboard.writeText(output)} disabled={!output}>Copy</button>
      {output && <pre className="mt-3 p-3 rounded-lg bg-[var(--panel-2)] text-sm font-mono overflow-x-auto">{output}</pre>}
    </div>
  );
}
