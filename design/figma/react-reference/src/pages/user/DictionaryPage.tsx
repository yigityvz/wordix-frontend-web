import { useState } from 'react';
import { Search, Star, AlertTriangle, BookOpen, SortAsc, Filter, GraduationCap, Plus, ChevronRight } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ProgressBar from '../../components/ui/ProgressBar';
import EmptyState from '../../components/ui/EmptyState';
import { mockDictionaryItems } from '../../data/mockData';
import type { AppView, DictionaryItem } from '../../types';

type FilterType = 'all' | 'word' | 'phrase' | 'sentence' | 'difficult' | 'favorite' | 'review';

interface DictionaryPageProps {
  onNavigate: (view: AppView) => void;
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onSelectItem?: (item: DictionaryItem) => void;
}

export default function DictionaryPage({ onNavigate, onToast, onSelectItem }: DictionaryPageProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('recent');
  const [items, setItems] = useState(mockDictionaryItems);

  const filtered = items.filter(item => {
    const matchSearch = search === '' || item.text.toLowerCase().includes(search.toLowerCase()) || item.meanings.some(m => m.toLowerCase().includes(search.toLowerCase()));
    const matchFilter = filter === 'all' ? true
      : filter === 'word' ? item.type === 'word'
      : filter === 'phrase' ? item.type === 'phrase'
      : filter === 'sentence' ? item.type === 'sentence'
      : filter === 'difficult' ? item.isDifficult
      : filter === 'favorite' ? item.isFavorite
      : filter === 'review' ? item.nextReview === '2026-07-10'
      : true;
    return matchSearch && matchFilter;
  }).sort((a, b) => {
    if (sort === 'confidence') return a.confidence - b.confidence;
    if (sort === 'alpha') return a.text.localeCompare(b.text);
    return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
  });

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setItems(prev => prev.map(i => i.id === id ? { ...i, isFavorite: !i.isFavorite } : i));
    onToast('Favorite updated', 'success');
  };

  const toggleDifficult = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setItems(prev => prev.map(i => i.id === id ? { ...i, isDifficult: !i.isDifficult } : i));
    onToast('Difficult flag updated', 'info');
  };

  const filters: { id: FilterType; label: string; count?: number }[] = [
    { id: 'all', label: 'All', count: items.length },
    { id: 'word', label: 'Words', count: items.filter(i => i.type === 'word').length },
    { id: 'phrase', label: 'Phrases', count: items.filter(i => i.type === 'phrase').length },
    { id: 'sentence', label: 'Sentences', count: items.filter(i => i.type === 'sentence').length },
    { id: 'difficult', label: 'Difficult', count: items.filter(i => i.isDifficult).length },
    { id: 'favorite', label: 'Favorites', count: items.filter(i => i.isFavorite).length },
    { id: 'review', label: 'Due Review', count: items.filter(i => i.nextReview === '2026-07-10').length },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>Dictionary</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{items.length} saved items</p>
        </div>
        <Button icon={<Plus size={15} />} onClick={() => onNavigate('user/lookup')}>Add Word</Button>
      </div>

      {/* Search + sort */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search your dictionary…"
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-[12px] outline-none"
            style={{ background: 'var(--surface)', border: '1px solid var(--surface-border)', color: 'var(--text-primary)' }}
            onFocus={e => (e.target.style.borderColor = 'var(--ring)')}
            onBlur={e => (e.target.style.borderColor = 'var(--surface-border)')}
          />
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)} className="px-3 py-2 text-sm rounded-[12px] outline-none font-semibold" style={{ background: 'var(--surface)', border: '1px solid var(--surface-border)', color: 'var(--text-secondary)' }}>
          <option value="recent">Recently added</option>
          <option value="confidence">Confidence ↑</option>
          <option value="alpha">A → Z</option>
        </select>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 flex-wrap">
        {filters.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:scale-105"
            style={{
              background: filter === f.id ? 'var(--nav-active)' : 'var(--surface)',
              border: `1px solid ${filter === f.id ? 'transparent' : 'var(--surface-border)'}`,
              color: filter === f.id ? 'var(--nav-active-text)' : 'var(--text-secondary)',
            }}
          >
            {f.label}
            {f.count !== undefined && <span className="opacity-70">{f.count}</span>}
          </button>
        ))}
      </div>

      {/* Items */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<BookOpen size={24} />}
          title={search ? 'No results found' : 'No items in this category'}
          description={search ? `No items match "${search}"` : 'Try a different filter or add new words from Lookup.'}
          action={!search ? { label: 'Add from Lookup', onClick: () => onNavigate('user/lookup') } : undefined}
        />
      ) : (
        <div className="space-y-2.5">
          {filtered.map(item => (
            <div
              key={item.id}
              className="rounded-[14px] p-4 transition-all hover:-translate-y-px hover:shadow-md cursor-pointer group"
              style={{ background: 'var(--surface)', border: '1px solid var(--surface-border)', boxShadow: 'var(--shadow)' }}
              onClick={() => { onSelectItem?.(item); onNavigate('user/dictionary/detail'); }}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{item.text}</span>
                    <Badge variant={item.type}>{item.type}</Badge>
                    <Badge variant={item.status}>{item.status}</Badge>
                    {item.isDifficult && <Badge variant="difficult"><AlertTriangle size={9} /> difficult</Badge>}
                    {item.isFavorite && <Badge variant="favorite"><Star size={9} /> favorite</Badge>}
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{item.meanings.join(' · ')}</p>
                  <div className="flex items-center gap-3 mt-2.5">
                    <ProgressBar value={item.confidence} showLabel className="flex-1 max-w-32" />
                    {item.nextReview && <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>Review: {item.nextReview}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={e => toggleFavorite(item.id, e)}
                    className="w-8 h-8 flex items-center justify-center rounded-[8px] transition-all hover:bg-[var(--surface-2)]"
                    style={{ color: item.isFavorite ? '#f59e0b' : 'var(--text-muted)' }}
                  >
                    <Star size={15} className={item.isFavorite ? 'fill-amber-400' : ''} />
                  </button>
                  <button
                    onClick={e => toggleDifficult(item.id, e)}
                    className="w-8 h-8 flex items-center justify-center rounded-[8px] transition-all hover:bg-[var(--surface-2)]"
                    style={{ color: item.isDifficult ? '#f87171' : 'var(--text-muted)' }}
                  >
                    <AlertTriangle size={15} />
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); onNavigate('user/quiz/start'); }}
                    className="w-8 h-8 flex items-center justify-center rounded-[8px] transition-all hover:bg-[var(--surface-2)]"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <GraduationCap size={15} />
                  </button>
                  <ChevronRight size={15} style={{ color: 'var(--text-muted)' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
