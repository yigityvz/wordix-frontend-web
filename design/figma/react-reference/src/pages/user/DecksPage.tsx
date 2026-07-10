import { useState } from 'react';
import { Plus, GraduationCap, Search, Layers, Edit2, Trash2, ChevronRight, Calendar, Target } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import { mockDecks, mockDictionaryItems } from '../../data/mockData';
import type { AppView, Deck } from '../../types';

interface DecksPageProps {
  onNavigate: (view: AppView) => void;
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export default function DecksPage({ onNavigate, onToast }: DecksPageProps) {
  const [decks, setDecks] = useState<Deck[]>(mockDecks);
  const [search, setSearch] = useState('');
  const [createModal, setCreateModal] = useState(false);
  const [editDeck, setEditDeck] = useState<Deck | null>(null);
  const [deleteDeckId, setDeleteDeckId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formError, setFormError] = useState('');

  const filtered = decks.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));

  const openCreate = () => { setFormName(''); setFormDesc(''); setFormError(''); setEditDeck(null); setCreateModal(true); };
  const openEdit = (deck: Deck, e: React.MouseEvent) => { e.stopPropagation(); setFormName(deck.name); setFormDesc(deck.description); setFormError(''); setEditDeck(deck); setCreateModal(true); };

  const saveDeck = () => {
    if (!formName.trim()) { setFormError('Deck name is required.'); return; }
    if (editDeck) {
      setDecks(prev => prev.map(d => d.id === editDeck.id ? { ...d, name: formName, description: formDesc } : d));
      onToast('Deck updated', 'success');
    } else {
      const newDeck: Deck = { id: `deck${Date.now()}`, name: formName, description: formDesc, itemCount: 0, createdAt: '2026-07-10' };
      setDecks(prev => [...prev, newDeck]);
      onToast('Deck created', 'success');
    }
    setCreateModal(false);
  };

  const deleteDeck = (id: string) => {
    setDecks(prev => prev.filter(d => d.id !== id));
    setDeleteDeckId(null);
    onToast('Deck deleted', 'info');
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>Decks</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{decks.length} learning collections</p>
        </div>
        <Button icon={<Plus size={15} />} onClick={openCreate}>New Deck</Button>
      </div>

      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search decks…"
          className="w-full pl-9 pr-4 py-2.5 text-sm rounded-[12px] outline-none max-w-sm"
          style={{ background: 'var(--surface)', border: '1px solid var(--surface-border)', color: 'var(--text-primary)' }}
          onFocus={e => (e.target.style.borderColor = 'var(--ring)')}
          onBlur={e => (e.target.style.borderColor = 'var(--surface-border)')}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Layers size={24} />}
          title={search ? 'No decks found' : 'No decks yet'}
          description={search ? `No decks match "${search}"` : 'Create a deck to organize your vocabulary into themed collections.'}
          action={{ label: 'Create your first deck', onClick: openCreate }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(deck => (
            <div
              key={deck.id}
              className="rounded-[16px] p-5 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg group"
              style={{ background: 'var(--surface)', border: '1px solid var(--surface-border)', boxShadow: 'var(--shadow)' }}
              onClick={() => onNavigate('user/decks/detail')}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, rgba(44,125,160,0.15), rgba(137,194,217,0.1))', border: '1px solid rgba(44,125,160,0.2)' }}>
                  <Layers size={18} style={{ color: 'var(--accent)' }} />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={e => openEdit(deck, e)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[var(--surface-2)]" style={{ color: 'var(--text-muted)' }}>
                    <Edit2 size={13} />
                  </button>
                  <button onClick={e => { e.stopPropagation(); setDeleteDeckId(deck.id); }} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-500/10 text-red-400">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <h3 className="text-base font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{deck.name}</h3>
              {deck.description && <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--text-muted)' }}>{deck.description}</p>}
              <div className="flex items-center gap-3 flex-wrap mb-4">
                <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <Layers size={12} /> {deck.itemCount} items
                </div>
                {deck.accuracy !== undefined && (
                  <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <Target size={12} /> {deck.accuracy}% accuracy
                  </div>
                )}
                {deck.lastPracticed && (
                  <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <Calendar size={12} /> {deck.lastPracticed}
                  </div>
                )}
              </div>
              <Button
                fullWidth
                size="sm"
                icon={<GraduationCap size={13} />}
                onClick={e => { e.stopPropagation(); onNavigate('user/quiz/start'); }}
                disabled={deck.itemCount === 0}
              >
                Start Quiz
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit modal */}
      <Modal
        open={createModal}
        onClose={() => setCreateModal(false)}
        title={editDeck ? 'Edit Deck' : 'Create New Deck'}
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setCreateModal(false)}>Cancel</Button>
            <Button size="sm" onClick={saveDeck}>{editDeck ? 'Save changes' : 'Create deck'}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Deck Name *</label>
            <input
              value={formName}
              onChange={e => { setFormName(e.target.value); setFormError(''); }}
              placeholder="e.g. Career & Business"
              className="w-full px-4 py-2.5 text-sm rounded-[12px] outline-none"
              style={{ background: 'var(--surface-2)', border: `1px solid ${formError ? 'var(--error)' : 'var(--surface-border)'}`, color: 'var(--text-primary)' }}
              onFocus={e => (e.target.style.borderColor = 'var(--ring)')}
              onBlur={e => (e.target.style.borderColor = formError ? 'var(--error)' : 'var(--surface-border)')}
              autoFocus
            />
            {formError && <p className="text-xs text-red-400 mt-1">{formError}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Description</label>
            <textarea
              value={formDesc}
              onChange={e => setFormDesc(e.target.value)}
              placeholder="Optional: describe what this deck is for"
              rows={3}
              className="w-full px-4 py-2.5 text-sm rounded-[12px] outline-none resize-none"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--surface-border)', color: 'var(--text-primary)' }}
              onFocus={e => (e.target.style.borderColor = 'var(--ring)')}
              onBlur={e => (e.target.style.borderColor = 'var(--surface-border)')}
            />
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal
        open={!!deleteDeckId}
        onClose={() => setDeleteDeckId(null)}
        title="Delete Deck"
        size="sm"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setDeleteDeckId(null)}>Cancel</Button>
            <Button variant="danger" size="sm" onClick={() => deleteDeckId && deleteDeck(deleteDeckId)}>Delete Deck</Button>
          </>
        }
      >
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>This deck will be permanently deleted. Dictionary items inside will not be removed from your dictionary.</p>
      </Modal>
    </div>
  );
}
