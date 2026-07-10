import { useState } from 'react';
import { Search, Filter, ChevronRight } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { topLookups } from '../../data/mockData';
import type { AppView } from '../../types';

interface AdminTopLookupsProps {
  onNavigate: (view: AppView) => void;
}

export default function AdminTopLookups({ onNavigate }: AdminTopLookupsProps) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [drawer, setDrawer] = useState<typeof topLookups[0] | null>(null);

  const filtered = topLookups.filter(item => {
    const matchSearch = !search || item.query.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || item.type === typeFilter;
    const matchSource = sourceFilter === 'all' || (sourceFilter === 'db' ? item.dbHit : !item.dbHit);
    return matchSearch && matchType && matchSource;
  });

  return (
    <div className="space-y-5 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>Top Lookups</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Most searched terms across all users</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search queries…"
            className="pl-8 pr-4 py-2 text-sm rounded-[11px] outline-none w-52"
            style={{ background: 'var(--surface)', border: '1px solid var(--surface-border)', color: 'var(--text-primary)' }}
            onFocus={e => (e.target.style.borderColor = 'var(--ring)')}
            onBlur={e => (e.target.style.borderColor = 'var(--surface-border)')}
          />
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-2 text-sm rounded-[11px] outline-none" style={{ background: 'var(--surface)', border: '1px solid var(--surface-border)', color: 'var(--text-secondary)' }}>
          <option value="all">All types</option>
          <option value="word">Words</option>
          <option value="phrase">Phrases</option>
          <option value="sentence">Sentences</option>
        </select>
        <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)} className="px-3 py-2 text-sm rounded-[11px] outline-none" style={{ background: 'var(--surface)', border: '1px solid var(--surface-border)', color: 'var(--text-secondary)' }}>
          <option value="all">All sources</option>
          <option value="db">Database hits</option>
          <option value="api">Provider fallbacks</option>
        </select>
      </div>

      {/* Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--surface-border)' }}>
                {['#', 'Query', 'Type', 'Source', 'Count', 'Last Searched', ''].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => (
                <tr key={i} className="hover:bg-[var(--surface-2)] transition-colors cursor-pointer" style={{ borderBottom: '1px solid var(--surface-border)' }} onClick={() => setDrawer(item)}>
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-bold font-mono" style={{ color: 'var(--text-muted)' }}>{i + 1}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{item.query}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge variant={item.type as any}>{item.type}</Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge variant={item.dbHit ? 'success' : 'warning'}>{item.dbHit ? '✓ Database' : '⚡ Provider'}</Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold font-mono" style={{ color: 'var(--text-primary)' }}>{item.count}</span>
                      <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface-2)' }}>
                        <div className="h-full rounded-full bg-[#2c7da0]" style={{ width: `${(item.count / 342) * 100}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{item.lastSearched}</td>
                  <td className="px-5 py-3.5">
                    <ChevronRight size={15} style={{ color: 'var(--text-muted)' }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detail drawer */}
      {drawer && (
        <>
          <div className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={() => setDrawer(null)} />
          <div
            className="fixed right-0 top-0 bottom-0 w-80 z-50 flex flex-col page-enter"
            style={{ background: 'var(--surface)', borderLeft: '1px solid var(--surface-border)', boxShadow: 'var(--shadow-lg)' }}
          >
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--surface-border)' }}>
              <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Lookup Detail</h2>
              <button onClick={() => setDrawer(null)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[var(--surface-2)]" style={{ color: 'var(--text-muted)' }}>✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div>
                <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Query</p>
                <p className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>{drawer.query}</p>
              </div>
              <div className="flex gap-2">
                <Badge variant={drawer.type as any}>{drawer.type}</Badge>
                <Badge variant={drawer.dbHit ? 'success' : 'warning'}>{drawer.dbHit ? 'Database hit' : 'Provider fallback'}</Badge>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Total searches', value: drawer.count.toString() },
                  { label: 'Last searched', value: drawer.lastSearched },
                  { label: 'Source', value: drawer.dbHit ? 'Internal database' : 'External provider' },
                ].map((f, i) => (
                  <div key={i}>
                    <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--text-muted)' }}>{f.label}</p>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{f.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
