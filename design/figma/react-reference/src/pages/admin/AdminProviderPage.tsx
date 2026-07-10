import { useState } from 'react';
import { RefreshCw, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import Card from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import type { AppView } from '../../types';

interface AdminProviderPageProps {
  onNavigate: (view: AppView) => void;
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const importJobs = [
  { id: 'JOB-0192', type: 'Dictionary Sync', status: 'running', progress: 67, started: '2026-07-10 14:22', items: 1240, errors: 0 },
  { id: 'JOB-0191', type: 'Provider Cache Warm', status: 'completed', progress: 100, started: '2026-07-10 12:15', items: 3820, errors: 0 },
  { id: 'JOB-0190', type: 'Quiz Data Import', status: 'failed', progress: 42, started: '2026-07-10 09:30', items: 520, errors: 14 },
  { id: 'JOB-0189', type: 'Dictionary Sync', status: 'completed', progress: 100, started: '2026-07-09 22:00', items: 4100, errors: 2 },
  { id: 'JOB-0188', type: 'Provider Cache Warm', status: 'completed', progress: 100, started: '2026-07-09 12:00', items: 3960, errors: 0 },
];

const providerLogs = [
  { id: 'LOG-1824', provider: 'OpenAI', query: 'resilience', status: 'success', latency: '234ms', time: '14:31:44' },
  { id: 'LOG-1823', provider: 'OpenAI', query: 'perseverance', status: 'success', latency: '198ms', time: '14:31:22' },
  { id: 'LOG-1822', provider: 'OpenAI', query: 'dedication', status: 'failed', latency: '5020ms', time: '14:30:58' },
  { id: 'LOG-1821', provider: 'OpenAI', query: 'tenacity', status: 'success', latency: '212ms', time: '14:29:11' },
  { id: 'LOG-1820', provider: 'OpenAI', query: 'grit', status: 'success', latency: '189ms', time: '14:28:44' },
];

export default function AdminProviderPage({ onToast }: AdminProviderPageProps) {
  const [logDetail, setLogDetail] = useState<typeof providerLogs[0] | null>(null);
  const [retrying, setRetrying] = useState<string | null>(null);

  const retry = (id: string) => {
    setRetrying(id);
    setTimeout(() => { setRetrying(null); onToast(`Job ${id} retried`, 'success'); }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>Provider / Import</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Import jobs, provider requests, and cache performance</p>
      </div>

      {/* Provider stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Cache Hit Ratio" value="68.4%" trend={{ value: 2, label: 'vs prev' }} accent />
        <StatCard label="Provider Requests" value="4,712" sub="last 7 days" />
        <StatCard label="Failed Requests" value="38" sub="last 7 days" />
        <StatCard label="Avg. Latency" value="218ms" sub="provider API" />
      </div>

      {/* Import jobs table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Import Jobs</h2>
          <Button variant="ghost" size="sm" icon={<RefreshCw size={14} />} onClick={() => onToast('Jobs refreshed', 'info')}>Refresh</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--surface-border)' }}>
                {['Job ID', 'Type', 'Status', 'Progress', 'Items', 'Errors', 'Started', 'Actions'].map(h => (
                  <th key={h} className="pb-2.5 text-left text-xs font-bold uppercase tracking-wider pr-4" style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {importJobs.map((job, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--surface-border)' }} className="hover:bg-[var(--surface-2)] transition-colors">
                  <td className="py-3 pr-4 font-mono text-xs" style={{ color: 'var(--text-primary)' }}>{job.id}</td>
                  <td className="py-3 pr-4 text-sm" style={{ color: 'var(--text-primary)' }}>{job.type}</td>
                  <td className="py-3 pr-4">
                    <Badge variant={job.status === 'running' ? 'info' : job.status === 'completed' ? 'success' : 'error'}>
                      {job.status === 'running' && <span className="w-1.5 h-1.5 rounded-full bg-[#89c2d9] pulse-dot" />}
                      {job.status}
                    </Badge>
                  </td>
                  <td className="py-3 pr-4 w-28">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface-2)' }}>
                        <div className="h-full rounded-full transition-all" style={{ width: `${job.progress}%`, background: job.status === 'failed' ? '#f87171' : job.status === 'completed' ? '#10b981' : '#2c7da0' }} />
                      </div>
                      <span className="text-xs font-mono w-8 text-right" style={{ color: 'var(--text-muted)' }}>{job.progress}%</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-sm font-mono" style={{ color: 'var(--text-primary)' }}>{job.items.toLocaleString()}</td>
                  <td className="py-3 pr-4">
                    {job.errors > 0 ? <span className="text-sm font-mono text-red-400">{job.errors}</span> : <span className="text-sm font-mono text-emerald-400">0</span>}
                  </td>
                  <td className="py-3 pr-4 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{job.started}</td>
                  <td className="py-3">
                    {job.status === 'failed' ? (
                      <Button variant="ghost" size="sm" loading={retrying === job.id} icon={<RefreshCw size={12} />} onClick={() => retry(job.id)}>Retry</Button>
                    ) : job.status === 'running' ? (
                      <Button variant="ghost" size="sm" icon={<Clock size={12} />} disabled>Running</Button>
                    ) : (
                      <Button variant="ghost" size="sm" icon={<CheckCircle2 size={12} />} disabled>Done</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Provider logs */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Recent Provider Requests</h2>
          <Badge variant="info">Live</Badge>
        </div>
        <div className="space-y-2">
          {providerLogs.map((log, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-[12px] cursor-pointer hover:bg-[var(--surface-2)] transition-colors"
              style={{ border: '1px solid var(--surface-border)' }}
              onClick={() => setLogDetail(log)}
            >
              {log.status === 'success'
                ? <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />
                : <AlertCircle size={15} className="text-red-400 flex-shrink-0" />}
              <span className="text-xs font-mono w-20 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{log.id}</span>
              <span className="text-sm font-semibold flex-1" style={{ color: 'var(--text-primary)' }}>{log.query}</span>
              <Badge variant={log.status === 'success' ? 'success' : 'error'}>{log.status}</Badge>
              <span className="text-xs font-mono w-14 text-right" style={{ color: log.latency.includes('5') ? '#f87171' : 'var(--text-muted)' }}>{log.latency}</span>
              <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{log.time}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Log detail modal */}
      {logDetail && (
        <>
          <div className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={() => setLogDetail(null)} />
          <div className="fixed right-0 top-0 bottom-0 w-80 z-50 page-enter" style={{ background: 'var(--surface)', borderLeft: '1px solid var(--surface-border)' }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--surface-border)' }}>
              <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Request Detail</h2>
              <button onClick={() => setLogDetail(null)} className="w-7 h-7 flex items-center justify-center rounded-lg" style={{ color: 'var(--text-muted)' }}>✕</button>
            </div>
            <div className="p-5 space-y-4">
              {[
                { label: 'Request ID', value: logDetail.id },
                { label: 'Query', value: logDetail.query },
                { label: 'Provider', value: logDetail.provider },
                { label: 'Status', value: logDetail.status },
                { label: 'Latency', value: logDetail.latency },
                { label: 'Time', value: logDetail.time },
              ].map((f, i) => (
                <div key={i}>
                  <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--text-muted)' }}>{f.label}</p>
                  <p className="text-sm font-semibold font-mono" style={{ color: 'var(--text-primary)' }}>{f.value}</p>
                </div>
              ))}
              {logDetail.status === 'failed' && (
                <Button fullWidth size="sm" icon={<RefreshCw size={14} />} onClick={() => { setLogDetail(null); onToast('Request retried', 'info'); }}>
                  Retry Request
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
