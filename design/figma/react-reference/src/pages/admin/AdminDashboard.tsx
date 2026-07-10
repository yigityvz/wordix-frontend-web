import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Database, Cloud, TrendingUp, Download, Activity, Users, Search, GraduationCap, RefreshCw } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { mockAdminStats, topLookups, providerUsageData } from '../../data/mockData';
import type { AppView } from '../../types';

interface AdminDashboardProps {
  onNavigate: (view: AppView) => void;
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 rounded-[10px] text-xs shadow-xl" style={{ background: 'var(--surface)', border: '1px solid var(--surface-border)', color: 'var(--text-primary)' }}>
      <p className="font-bold mb-1">{label}</p>
      {payload.map((p: any) => <p key={p.dataKey} style={{ color: p.color }}>{p.name}: {p.value}</p>)}
    </div>
  );
};

export default function AdminDashboard({ onNavigate, onToast }: AdminDashboardProps) {
  const [dateFilter, setDateFilter] = useState('7d');
  const [exportModal, setExportModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <h1 className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>Admin Dashboard</h1>
            <Badge variant="admin">Admin</Badge>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Platform analytics and system health</p>
        </div>
        <div className="flex items-center gap-2">
          {['7d', '30d', '90d'].map(d => (
            <button key={d} onClick={() => setDateFilter(d)} className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all" style={{ background: dateFilter === d ? 'var(--nav-active)' : 'var(--surface)', border: `1px solid ${dateFilter === d ? 'transparent' : 'var(--surface-border)'}`, color: dateFilter === d ? 'var(--nav-active-text)' : 'var(--text-secondary)' }}>
              {d}
            </button>
          ))}
          <Button variant="secondary" size="sm" icon={<Download size={14} />} onClick={() => setExportModal(true)}>Export</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard label="Total Lookups" value={mockAdminStats.totalLookups.toLocaleString()} trend={{ value: 8, label: 'vs prev' }} onClick={() => onNavigate('admin/lookups')} />
        <StatCard label="DB Hit Rate" value={`${mockAdminStats.dbHitRate}%`} sub="cache efficiency" accent />
        <StatCard label="Provider Fallbacks" value={mockAdminStats.providerFallbacks.toLocaleString()} sub="external API calls" />
        <StatCard label="Most Saved" value={mockAdminStats.mostSavedItem} sub="top item" onClick={() => onNavigate('admin/lookups')} />
        <StatCard label="Quiz Completion" value={`${mockAdminStats.quizCompletionRate}%`} trend={{ value: 3, label: 'vs prev' }} />
        <StatCard label="Import Jobs" value={mockAdminStats.activeImportJobs} sub="active" onClick={() => onNavigate('admin/provider')} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Provider vs Database Usage</h2>
            <button onClick={() => onNavigate('admin/provider')} className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>Details →</button>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={providerUsageData} barSize={12}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-border)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="database" fill="#2c7da0" radius={[4, 4, 0, 0]} name="Database" />
              <Bar dataKey="provider" fill="#89c2d9" radius={[4, 4, 0, 0]} name="Provider" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Top Lookup Trend</h2>
            <button onClick={() => onNavigate('admin/lookups')} className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>All lookups →</button>
          </div>
          <div className="space-y-2.5">
            {topLookups.slice(0, 5).map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-5 text-xs font-bold font-mono text-center" style={{ color: 'var(--text-muted)' }}>{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{item.query}</span>
                    <Badge variant={item.type as any}>{item.type}</Badge>
                    <Badge variant={item.dbHit ? 'success' : 'warning'} size="sm">{item.dbHit ? 'DB' : 'API'}</Badge>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface-2)' }}>
                    <div className="h-full rounded-full" style={{ width: `${(item.count / 342) * 100}%`, background: 'var(--accent)' }} />
                  </div>
                </div>
                <span className="text-xs font-mono font-bold w-8 text-right" style={{ color: 'var(--text-muted)' }}>{item.count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Import jobs */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Import Jobs</h2>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" icon={<RefreshCw size={14} />} onClick={() => onToast('Import jobs refreshed', 'info')}>Refresh</Button>
            <Button variant="secondary" size="sm" onClick={() => onNavigate('admin/provider')}>View all</Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--surface-border)' }}>
                {['Job ID', 'Type', 'Status', 'Progress', 'Started', 'Actions'].map(h => (
                  <th key={h} className="pb-2 text-left text-xs font-bold uppercase tracking-wider pr-4" style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { id: 'JOB-0192', type: 'Dictionary Sync', status: 'running', progress: 67, started: '14:22' },
                { id: 'JOB-0191', type: 'Provider Cache', status: 'completed', progress: 100, started: '12:15' },
                { id: 'JOB-0190', type: 'Quiz Data', status: 'failed', progress: 42, started: '09:30' },
              ].map((job, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--surface-border)' }}>
                  <td className="py-3 pr-4 font-mono text-xs" style={{ color: 'var(--text-primary)' }}>{job.id}</td>
                  <td className="py-3 pr-4 text-sm" style={{ color: 'var(--text-primary)' }}>{job.type}</td>
                  <td className="py-3 pr-4">
                    <Badge variant={job.status === 'running' ? 'info' : job.status === 'completed' ? 'success' : 'error'}>
                      {job.status}
                    </Badge>
                  </td>
                  <td className="py-3 pr-4 w-32">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface-2)' }}>
                        <div className="h-full rounded-full" style={{ width: `${job.progress}%`, background: job.status === 'failed' ? '#f87171' : job.status === 'completed' ? '#10b981' : '#2c7da0' }} />
                      </div>
                      <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{job.progress}%</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{job.started}</td>
                  <td className="py-3">
                    {job.status === 'failed' ? (
                      <Button variant="ghost" size="sm" icon={<RefreshCw size={12} />} onClick={() => onToast(`Retrying ${job.id}...`, 'info')}>Retry</Button>
                    ) : (
                      <Button variant="ghost" size="sm" onClick={() => onNavigate('admin/provider')}>View log</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Export modal */}
      <Modal
        open={exportModal}
        onClose={() => setExportModal(false)}
        title="Export Analytics"
        size="sm"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setExportModal(false)}>Cancel</Button>
            <Button size="sm" disabled title="Export to CSV — coming soon">Export CSV (Coming soon)</Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>CSV export is not yet available in this version. Choose a format when the feature launches:</p>
          {['Lookup analytics', 'Provider statistics', 'Quiz completion data', 'User activity summary'].map((opt, i) => (
            <div key={i} className="flex items-center gap-2 p-2.5 rounded-[10px] opacity-50" style={{ background: 'var(--surface-2)' }}>
              <input type="checkbox" disabled />
              <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{opt}</span>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
