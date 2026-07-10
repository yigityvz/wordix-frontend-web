import { useState } from 'react';
import { Search, X, Clock, Sparkles, BookOpen, Layers, GraduationCap, Copy, CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import type { AppView } from '../../types';

interface LookupPageProps {
  onNavigate: (view: AppView) => void;
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  initialQuery?: string;
}

const recentSearches = ['achieve', 'give up', 'resilience', 'I want to improve my English.'];
const suggestions = ['struggle', 'persevere', 'break the ice', 'determination', 'overcome', 'ambition'];

const mockResults: Record<string, {
  text: string; type: 'word' | 'phrase' | 'sentence';
  meanings: string[]; partOfSpeech?: string; source: 'database' | 'provider';
  translation?: string;
}> = {
  'achieve': { text: 'achieve', type: 'word', meanings: ['başarmak', 'elde etmek', 'ulaşmak'], partOfSpeech: 'verb', source: 'database' },
  'give up': { text: 'give up', type: 'phrase', meanings: ['vazgeçmek', 'pes etmek', 'bırakmak'], source: 'database' },
  'i want to improve my english.': { text: 'I want to improve my English.', type: 'sentence', meanings: [], translation: 'İngilizcemi geliştirmek istiyorum.', source: 'provider' },
  'struggle': { text: 'struggle', type: 'word', meanings: ['mücadele etmek', 'uğraşmak', 'güçlük çekmek'], partOfSpeech: 'verb', source: 'database' },
  'resilience': { text: 'resilience', type: 'word', meanings: ['dayanıklılık', 'esneklik', 'toparlanma gücü'], partOfSpeech: 'noun', source: 'provider' },
};

export default function LookupPage({ onNavigate, onToast, initialQuery = '' }: LookupPageProps) {
  const [query, setQuery] = useState(initialQuery);
  const [result, setResult] = useState<typeof mockResults[string] | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const doSearch = (q: string) => {
    if (!q.trim()) { setError('Please enter a word, phrase, or sentence.'); return; }
    setError('');
    setLoading(true);
    setResult(null);
    setNotFound(false);
    setSaved(false);
    setTimeout(() => {
      const found = mockResults[q.trim().toLowerCase()];
      if (found) { setResult(found); } else { setNotFound(true); }
      setLoading(false);
    }, 900);
  };

  const handleSave = () => {
    setSaved(true);
    onToast('Saved to dictionary!', 'success');
  };

  const handleCopy = () => {
    setCopied(true);
    onToast('Copied to clipboard', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold mb-1" style={{ color: 'var(--text-primary)' }}>Smart Lookup</h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Search English words, phrases, or sentences — get Turkish meanings instantly.</p>
      </div>

      {/* Search card */}
      <Card>
        <div className="flex gap-2 mb-1">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
            <input
              value={query}
              onChange={e => { setQuery(e.target.value); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && doSearch(query)}
              placeholder="Enter a word, phrase, or sentence…"
              className="w-full pl-10 pr-10 py-3 text-sm rounded-[12px] outline-none transition-all"
              style={{ background: 'var(--surface-2)', border: `1px solid ${error ? 'var(--error)' : 'var(--surface-border)'}`, color: 'var(--text-primary)' }}
              onFocus={e => !error && (e.target.style.borderColor = 'var(--ring)')}
              onBlur={e => !error && (e.target.style.borderColor = 'var(--surface-border)')}
              autoFocus
            />
            {query && (
              <button className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => { setQuery(''); setResult(null); setNotFound(false); setError(''); }} style={{ color: 'var(--text-muted)' }}>
                <X size={15} />
              </button>
            )}
          </div>
          <div className="flex gap-1.5">
            <select className="px-3 py-2 text-xs rounded-[12px] font-semibold outline-none" style={{ background: 'var(--surface-2)', border: '1px solid var(--surface-border)', color: 'var(--text-secondary)' }}>
              <option>English</option>
            </select>
            <select className="px-3 py-2 text-xs rounded-[12px] font-semibold outline-none" style={{ background: 'var(--surface-2)', border: '1px solid var(--surface-border)', color: 'var(--text-secondary)' }}>
              <option>Turkish</option>
            </select>
          </div>
        </div>
        {error && <p className="text-xs text-red-400 mt-1 ml-1 flex items-center gap-1"><AlertCircle size={12} />{error}</p>}
        <Button fullWidth size="md" onClick={() => doSearch(query)} loading={loading} className="mt-3" icon={<Search size={15} />}>
          {loading ? 'Searching…' : 'Search'}
        </Button>
      </Card>

      {/* Suggestions */}
      {!result && !loading && !notFound && (
        <>
          <div>
            <p className="text-xs font-semibold mb-2.5 flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}><Clock size={13} /> Recent searches</p>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map(s => (
                <button key={s} onClick={() => { setQuery(s); doSearch(s); }} className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:scale-105" style={{ background: 'var(--surface-2)', border: '1px solid var(--surface-border)', color: 'var(--text-secondary)' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold mb-2.5 flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}><Sparkles size={13} /> Popular today</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map(s => (
                <button key={s} onClick={() => { setQuery(s); doSearch(s); }} className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:scale-105" style={{ background: 'rgba(44,125,160,0.1)', border: '1px solid rgba(44,125,160,0.2)', color: 'var(--accent)' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Loading */}
      {loading && (
        <Card>
          <div className="flex items-center gap-4 py-4">
            <div className="w-12 h-12 rounded-[14px] skeleton" />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-1/2 skeleton rounded" />
              <div className="h-4 w-3/4 skeleton rounded" />
              <div className="h-4 w-1/3 skeleton rounded" />
            </div>
          </div>
        </Card>
      )}

      {/* Not found */}
      {notFound && (
        <Card>
          <div className="text-center py-8">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--surface-2)' }}>
              <Search size={24} style={{ color: 'var(--text-muted)' }} />
            </div>
            <h3 className="text-base font-bold mb-1" style={{ color: 'var(--text-primary)' }}>No results found</h3>
            <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>We couldn't find "<strong>{query}</strong>". Try a different spelling or a simpler form.</p>
            <Button variant="secondary" size="sm" onClick={() => { setQuery(''); setNotFound(false); }}>Try again</Button>
          </div>
        </Card>
      )}

      {/* Result */}
      {result && (
        <Card glow>
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={result.type}>{result.type}</Badge>
                <Badge variant={result.source === 'database' ? 'success' : 'info'} size="sm">
                  {result.source === 'database' ? '✓ Database' : '⚡ Provider'}
                </Badge>
              </div>
              <h2 className="text-3xl font-extrabold" style={{ color: 'var(--text-primary)' }}>{result.text}</h2>
              {result.partOfSpeech && <p className="text-xs font-mono mt-1" style={{ color: 'var(--text-muted)' }}>{result.partOfSpeech}</p>}
            </div>
            <button onClick={handleCopy} className="flex-shrink-0 mt-1 w-9 h-9 flex items-center justify-center rounded-[10px] transition-all hover:scale-105" style={{ background: 'var(--surface-2)', border: '1px solid var(--surface-border)', color: 'var(--text-muted)' }}>
              {copied ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Copy size={16} />}
            </button>
          </div>

          {result.type === 'sentence' ? (
            <div className="rounded-[14px] p-4 mb-5" style={{ background: 'var(--surface-2)', border: '1px solid var(--surface-border)' }}>
              <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Türkçe çeviri</p>
              <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{result.translation}</p>
            </div>
          ) : (
            <div className="mb-5">
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>Türkçe anlamları</p>
              <div className="flex flex-wrap gap-2">
                {result.meanings.map((m, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-full text-sm font-semibold" style={{ background: 'var(--surface-2)', border: '1px solid var(--surface-border)', color: 'var(--text-primary)' }}>{m}</span>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-4" style={{ borderTop: '1px solid var(--surface-border)' }}>
            {saved ? (
              <Button variant="success" size="sm" icon={<CheckCircle2 size={14} />} disabled>Saved to Dictionary</Button>
            ) : (
              <Button size="sm" icon={<BookOpen size={14} />} onClick={handleSave}>Save to Dictionary</Button>
            )}
            <Button variant="secondary" size="sm" icon={<GraduationCap size={14} />} onClick={() => onNavigate('user/quiz/start')}>
              Start Quiz
            </Button>
            <Button variant="secondary" size="sm" icon={<Layers size={14} />} onClick={() => onToast('Open "Add to Deck" drawer', 'info')}>
              Add to Deck
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
