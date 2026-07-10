import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AlertTriangle, GraduationCap, ChevronRight } from 'lucide-react';
import Card from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ProgressBar from '../../components/ui/ProgressBar';
import { quizChartData, confidenceDistribution, mockDictionaryItems } from '../../data/mockData';
import type { AppView } from '../../types';

interface StatisticsPageProps {
  onNavigate: (view: AppView) => void;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 rounded-[10px] text-xs shadow-xl" style={{ background: 'var(--surface)', border: '1px solid var(--surface-border)', color: 'var(--text-primary)' }}>
      <p className="font-bold mb-1">{label}</p>
      {payload.map((p: any) => <p key={p.dataKey} style={{ color: p.color }}>{p.name}: {p.value}{p.dataKey === 'accuracy' ? '%' : ''}</p>)}
    </div>
  );
};

export default function StatisticsPage({ onNavigate }: StatisticsPageProps) {
  const [dateFilter, setDateFilter] = useState('7d');
  const [quizFilter, setQuizFilter] = useState('all');
  const difficultItems = mockDictionaryItems.filter(i => i.isDifficult);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>Statistics</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Your learning progress over time</p>
        </div>
        <div className="flex gap-2">
          {['7d', '30d', '90d'].map(d => (
            <button
              key={d}
              onClick={() => setDateFilter(d)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={{ background: dateFilter === d ? 'var(--nav-active)' : 'var(--surface)', border: `1px solid ${dateFilter === d ? 'transparent' : 'var(--surface-border)'}`, color: dateFilter === d ? 'var(--nav-active-text)' : 'var(--text-secondary)' }}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Quizzes" value="24" sub="last 7 days" trend={{ value: 12, label: 'vs prev' }} />
        <StatCard label="Avg. Accuracy" value="76%" sub="quiz scores" trend={{ value: 4, label: 'this week' }} accent />
        <StatCard label="Mastered Words" value="6" sub="high confidence" />
        <StatCard label="Study Streak" value="5 days" sub="keep it up!" />
      </div>

      {/* Quiz type filter */}
      <div className="flex gap-2">
        {[{ v: 'all', l: 'All Quizzes' }, { v: 'Test', l: 'Multiple Choice' }, { v: 'Writing', l: 'Writing' }].map(f => (
          <button key={f.v} onClick={() => setQuizFilter(f.v)} className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all" style={{ background: quizFilter === f.v ? 'var(--nav-active)' : 'var(--surface)', border: `1px solid ${quizFilter === f.v ? 'transparent' : 'var(--surface-border)'}`, color: quizFilter === f.v ? 'var(--nav-active-text)' : 'var(--text-secondary)' }}>
            {f.l}
          </button>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card>
          <h2 className="text-sm font-bold mb-5" style={{ color: 'var(--text-primary)' }}>Quiz Accuracy</h2>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={quizChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-border)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="accuracy" stroke="#2c7da0" strokeWidth={2.5} dot={{ fill: '#2c7da0', r: 4 }} activeDot={{ r: 6 }} name="Accuracy" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h2 className="text-sm font-bold mb-5" style={{ color: 'var(--text-primary)' }}>Confidence Distribution</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={confidenceDistribution} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-border)" />
              <XAxis dataKey="range" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} name="Items">
                {confidenceDistribution.map((_, i) => (
                  <Cell key={i} fill={['#468faf', '#2c7da0', '#01497c', '#013a63', '#059669'][i % 5]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Difficult items */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <AlertTriangle size={16} className="text-amber-400" /> Difficult Items
          </h2>
          <Button variant="ghost" size="sm" icon={<GraduationCap size={14} />} onClick={() => onNavigate('user/quiz/start')}>
            Practice all
          </Button>
        </div>
        <div className="space-y-2.5">
          {difficultItems.map(item => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-[12px] cursor-pointer hover:bg-[var(--surface-2)] transition-colors"
              onClick={() => onNavigate('user/dictionary/detail')}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{item.text}</span>
                  <Badge variant={item.type}>{item.type}</Badge>
                </div>
                <ProgressBar value={item.confidence} showLabel className="max-w-48" />
              </div>
              <ChevronRight size={15} style={{ color: 'var(--text-muted)' }} />
            </div>
          ))}
        </div>
      </Card>

      {/* Deck stats */}
      <Card>
        <h2 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Deck Performance</h2>
        <div className="space-y-3">
          {[
            { name: 'Career & Success', items: 18, accuracy: 71 },
            { name: 'Daily Conversation', items: 31, accuracy: 64 },
            { name: 'Academic English', items: 12, accuracy: undefined },
          ].map((d, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-[12px] hover:bg-[var(--surface-2)] cursor-pointer transition-colors" onClick={() => onNavigate('user/decks/detail')}>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{d.name}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{d.items} items</p>
              </div>
              {d.accuracy !== undefined ? (
                <div className="flex items-center gap-2">
                  <ProgressBar value={d.accuracy} className="w-24" showLabel />
                </div>
              ) : (
                <Badge variant="default">No data</Badge>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
