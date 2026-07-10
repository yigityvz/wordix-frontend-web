import { useState } from 'react';
import { ArrowLeft, Star, AlertTriangle, GraduationCap, Layers, Plus, Edit2, Trash2, X, CheckCircle2, BookOpen } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ProgressBar from '../../components/ui/ProgressBar';
import Modal from '../../components/ui/Modal';
import { mockDictionaryItems, mockDecks } from '../../data/mockData';
import type { AppView, DictionaryItem, Note } from '../../types';

interface DictionaryDetailPageProps {
  onNavigate: (view: AppView) => void;
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  item?: DictionaryItem;
}

export default function DictionaryDetailPage({ onNavigate, onToast, item: propItem }: DictionaryDetailPageProps) {
  const [item, setItem] = useState<DictionaryItem>(propItem || mockDictionaryItems[0]);
  const [noteModal, setNoteModal] = useState(false);
  const [editNote, setEditNote] = useState<Note | null>(null);
  const [noteText, setNoteText] = useState('');
  const [deleteNoteId, setDeleteNoteId] = useState<string | null>(null);
  const [deckModal, setDeckModal] = useState(false);

  const toggleFavorite = () => {
    setItem(p => ({ ...p, isFavorite: !p.isFavorite }));
    onToast(item.isFavorite ? 'Removed from favorites' : 'Added to favorites', 'success');
  };

  const toggleDifficult = () => {
    setItem(p => ({ ...p, isDifficult: !p.isDifficult }));
    onToast(item.isDifficult ? 'Removed difficult flag' : 'Marked as difficult', 'info');
  };

  const saveNote = () => {
    if (!noteText.trim()) return;
    if (editNote) {
      setItem(p => ({ ...p, notes: p.notes.map(n => n.id === editNote.id ? { ...n, content: noteText, updatedAt: '2026-07-10' } : n) }));
      onToast('Note updated', 'success');
    } else {
      const newNote: Note = { id: `n${Date.now()}`, content: noteText, createdAt: '2026-07-10', updatedAt: '2026-07-10' };
      setItem(p => ({ ...p, notes: [...p.notes, newNote] }));
      onToast('Note added', 'success');
    }
    setNoteModal(false);
    setNoteText('');
    setEditNote(null);
  };

  const deleteNote = (id: string) => {
    setItem(p => ({ ...p, notes: p.notes.filter(n => n.id !== id) }));
    setDeleteNoteId(null);
    onToast('Note deleted', 'info');
  };

  const quizHistory = [
    { date: '2026-07-09', correct: true, type: 'multiple_choice' },
    { date: '2026-07-07', correct: false, type: 'writing' },
    { date: '2026-07-05', correct: true, type: 'multiple_choice' },
    { date: '2026-07-03', correct: true, type: 'writing' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <button className="flex items-center gap-2 text-sm font-semibold hover:opacity-70 transition-opacity" style={{ color: 'var(--accent)' }} onClick={() => onNavigate('user/dictionary')}>
        <ArrowLeft size={16} /> Back to Dictionary
      </button>

      {/* Hero card */}
      <Card glow>
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge variant={item.type}>{item.type}</Badge>
              <Badge variant={item.status}>{item.status}</Badge>
              {item.partOfSpeech && <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{item.partOfSpeech}</span>}
            </div>
            <h1 className="text-4xl font-extrabold" style={{ color: 'var(--text-primary)' }}>{item.text}</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={toggleFavorite}
              className="w-10 h-10 flex items-center justify-center rounded-[12px] transition-all hover:scale-110"
              style={{ background: item.isFavorite ? 'rgba(245,158,11,0.15)' : 'var(--surface-2)', color: item.isFavorite ? '#f59e0b' : 'var(--text-muted)', border: '1px solid var(--surface-border)' }}
            >
              <Star size={18} className={item.isFavorite ? 'fill-amber-400' : ''} />
            </button>
            <button
              onClick={toggleDifficult}
              className="w-10 h-10 flex items-center justify-center rounded-[12px] transition-all hover:scale-110"
              style={{ background: item.isDifficult ? 'rgba(220,38,38,0.15)' : 'var(--surface-2)', color: item.isDifficult ? '#f87171' : 'var(--text-muted)', border: '1px solid var(--surface-border)' }}
            >
              <AlertTriangle size={18} />
            </button>
          </div>
        </div>

        {/* Meanings */}
        <div className="mb-5">
          <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>Türkçe anlamları</p>
          <div className="flex flex-wrap gap-2">
            {item.meanings.map((m, i) => (
              <span key={i} className="px-3 py-1.5 rounded-full text-sm font-semibold" style={{ background: 'var(--surface-2)', border: '1px solid var(--surface-border)', color: 'var(--text-primary)' }}>{m}</span>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div className="rounded-[12px] p-4" style={{ background: 'var(--surface-2)', border: '1px solid var(--surface-border)' }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Confidence</p>
            <span className="text-sm font-bold font-mono" style={{ color: 'var(--text-primary)' }}>{item.confidence}%</span>
          </div>
          <ProgressBar value={item.confidence} size="md" />
          {item.nextReview && <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>Next review: <strong style={{ color: 'var(--text-secondary)' }}>{item.nextReview}</strong></p>}
        </div>

        <div className="flex flex-wrap gap-2 mt-5">
          <Button icon={<GraduationCap size={14} />} size="sm" onClick={() => onNavigate('user/quiz/start')}>Start Quiz</Button>
          <Button variant="secondary" icon={<Layers size={14} />} size="sm" onClick={() => setDeckModal(true)}>Add to Deck</Button>
        </div>
      </Card>

      {/* Quiz history */}
      <Card>
        <h2 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Quiz History</h2>
        <div className="flex gap-2">
          {quizHistory.map((q, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${q.correct ? 'bg-emerald-500/15' : 'bg-red-500/15'}`}>
                {q.correct ? <CheckCircle2 size={16} className="text-emerald-400" /> : <X size={16} className="text-red-400" />}
              </div>
              <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{q.date.slice(5)}</span>
              <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>{q.type === 'writing' ? 'Write' : 'MC'}</span>
            </div>
          ))}
          <div className="text-xs ml-2 self-center" style={{ color: 'var(--text-muted)' }}>3/4 correct</div>
        </div>
      </Card>

      {/* Notes */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Notes</h2>
          <Button variant="ghost" size="sm" icon={<Plus size={14} />} onClick={() => { setEditNote(null); setNoteText(''); setNoteModal(true); }}>Add note</Button>
        </div>
        {item.notes.length === 0 ? (
          <p className="text-sm text-center py-4" style={{ color: 'var(--text-muted)' }}>No notes yet. Add one to help remember this item.</p>
        ) : (
          <div className="space-y-3">
            {item.notes.map(note => (
              <div key={note.id} className="rounded-[12px] p-3.5 group" style={{ background: 'var(--surface-2)', border: '1px solid var(--surface-border)' }}>
                <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{note.content}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{note.updatedAt}</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditNote(note); setNoteText(note.content); setNoteModal(true); }} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[var(--surface-border)]" style={{ color: 'var(--text-muted)' }}>
                      <Edit2 size={13} />
                    </button>
                    <button onClick={() => setDeleteNoteId(note.id)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-500/10 text-red-400">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Deck membership */}
      <Card>
        <h2 className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>In Decks</h2>
        {item.deckIds.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Not in any deck yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {item.deckIds.map(deckId => {
              const deck = mockDecks.find(d => d.id === deckId);
              return deck ? (
                <button key={deckId} onClick={() => onNavigate('user/decks/detail')} className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:scale-105" style={{ background: 'rgba(44,125,160,0.1)', border: '1px solid rgba(44,125,160,0.25)', color: 'var(--accent)' }}>
                  {deck.name}
                </button>
              ) : null;
            })}
          </div>
        )}
      </Card>

      {/* Note modal */}
      <Modal
        open={noteModal}
        onClose={() => setNoteModal(false)}
        title={editNote ? 'Edit note' : 'Add note'}
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setNoteModal(false)}>Cancel</Button>
            <Button size="sm" onClick={saveNote} disabled={!noteText.trim()}>Save note</Button>
          </>
        }
      >
        <textarea
          value={noteText}
          onChange={e => setNoteText(e.target.value)}
          placeholder="Write your note here…"
          rows={4}
          className="w-full px-4 py-3 text-sm rounded-[12px] outline-none resize-none"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--surface-border)', color: 'var(--text-primary)' }}
          onFocus={e => (e.target.style.borderColor = 'var(--ring)')}
          onBlur={e => (e.target.style.borderColor = 'var(--surface-border)')}
          autoFocus
        />
      </Modal>

      {/* Delete note confirm */}
      <Modal
        open={!!deleteNoteId}
        onClose={() => setDeleteNoteId(null)}
        title="Delete note"
        size="sm"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setDeleteNoteId(null)}>Cancel</Button>
            <Button variant="danger" size="sm" onClick={() => deleteNoteId && deleteNote(deleteNoteId)}>Delete</Button>
          </>
        }
      >
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>This note will be permanently deleted. This action cannot be undone.</p>
      </Modal>

      {/* Deck modal */}
      <Modal open={deckModal} onClose={() => setDeckModal(false)} title="Add to Deck" footer={<Button variant="secondary" size="sm" onClick={() => setDeckModal(false)}>Close</Button>}>
        <div className="space-y-2">
          {mockDecks.map(deck => {
            const inDeck = item.deckIds.includes(deck.id);
            return (
              <button
                key={deck.id}
                className="w-full flex items-center justify-between p-3 rounded-[12px] text-left transition-all hover:bg-[var(--surface-2)]"
                style={{ border: '1px solid var(--surface-border)' }}
                onClick={() => {
                  setItem(p => ({ ...p, deckIds: inDeck ? p.deckIds.filter(id => id !== deck.id) : [...p.deckIds, deck.id] }));
                  onToast(inDeck ? `Removed from ${deck.name}` : `Added to ${deck.name}`, 'success');
                }}
              >
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{deck.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{deck.itemCount} items</p>
                </div>
                {inDeck && <CheckCircle2 size={18} className="text-emerald-400" />}
              </button>
            );
          })}
        </div>
      </Modal>
    </div>
  );
}
