import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { AlertTriangle, CheckCircle2, Clock, Activity, Server, Database, Zap, RefreshCw, ChevronRight } from 'lucide-react';
import Card from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ProgressBar from '../../components/ui/ProgressBar';
import { mockDictionaryItems } from '../../data/mockData';
import type { AppView } from '../../types';

const TT = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 rounded-[10px] text-xs shadow-xl"
      style={{ background: 'var(--surface-solid)', border: '1px solid var(--surface-border)', color: 'var(--text-primary)' }}>
      <p className="font-bold mb-1">{label}</p>
      {payload.map((p: any) => <p key={p.dataKey} style={{ color: p.color }}>{p.name}: {p.value}</p>)}
    </div>
  );
};

// ─── Most Saved ──────────────────────────────────────────────────────────────
export function AdminMostSavedPage({ onNavigate }: { onNavigate: (v: AppView) => void }) {
  const mostSaved = [
    { word: 'achieve',      saves: 284, type: 'word' },
    { word: 'persevere',    saves: 216, type: 'word' },
    { word: 'give up',      saves: 198, type: 'phrase' },
    { word: 'resilience',   saves: 177, type: 'word' },
    { word: 'struggle',     saves: 162, type: 'word' },
    { word: 'break the ice',saves: 149, type: 'phrase' },
    { word: 'improve',      saves: 141, type: 'word' },
    { word: 'determination',saves: 103, type: 'word' },
  ];
  const typeBreakdown = [
    { name: 'Words',     value: 68, fill: '#014f86' },
    { name: 'Phrases',   value: 23, fill: '#2c7da0' },
    { name: 'Sentences', value: 9,  fill: '#89c2d9' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>Most Saved</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Items saved most often across all users</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Saves" value="14,392" trend={{ value: 6, label: 'vs prev' }} accent />
        <StatCard label="Unique Items" value="2,847" sub="ever saved" />
        <StatCard label="Top Item" value="achieve" sub="284 saves" />
        <StatCard label="Phrases Saved" value="23%" sub="of total saves" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="md:col-span-2">
          <h2 className="text-sm font-bold mb-5" style={{ color: 'var(--text-primary)' }}>Top Saved Items</h2>
          <div className="space-y-3">
            {mostSaved.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-5 text-xs font-bold font-mono text-right flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{i + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{item.word}</span>
                    <Badge variant={item.type as any} size="xs">{item.type}</Badge>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface-2)' }}>
                    <div className="h-full rounded-full" style={{ width: `${(item.saves / 284) * 100}%`, background: 'linear-gradient(90deg,#013a63,#2c7da0)', transition: 'width 0.6s ease' }} />
                  </div>
                </div>
                <span className="text-xs font-mono font-bold w-8 text-right flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{item.saves}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>By Content Type</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={typeBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {typeBreakdown.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Pie>
              <Tooltip formatter={(v: any) => `${v}%`} contentStyle={{ background: 'var(--surface-solid)', border: '1px solid var(--surface-border)', borderRadius: '10px', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {typeBreakdown.map((t, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: t.fill }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{t.name}</span>
                </div>
                <span className="font-bold font-mono" style={{ color: 'var(--text-primary)' }}>{t.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── Quiz Insights ───────────────────────────────────────────────────────────
export function AdminQuizInsightsPage({ onNavigate }: { onNavigate: (v: AppView) => void }) {
  const completionByType = [
    { type: 'Multiple Choice', completion: 87, avgScore: 74, sessions: 1284 },
    { type: 'Writing',         completion: 78, avgScore: 68, sessions: 892 },
  ];
  const wrongByItem = [
    { item: 'resilience', wrong: 142, pct: 68 },
    { item: 'persevere',  wrong: 118, pct: 54 },
    { item: 'tenacity',   wrong: 97,  pct: 62 },
    { item: 'give up',    wrong: 84,  pct: 42 },
    { item: 'struggle',   wrong: 76,  pct: 49 },
  ];
  const weeklyData = [
    { day: 'Mon', sessions: 142, avg: 72 },
    { day: 'Tue', sessions: 168, avg: 75 },
    { day: 'Wed', sessions: 154, avg: 70 },
    { day: 'Thu', sessions: 201, avg: 78 },
    { day: 'Fri', sessions: 187, avg: 74 },
    { day: 'Sat', sessions: 223, avg: 80 },
    { day: 'Sun', sessions: 196, avg: 76 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>Quiz Insights</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Quiz completion rates, accuracy, and common mistakes</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Sessions" value="2,176" trend={{ value: 11, label: 'this week' }} accent />
        <StatCard label="Completion Rate" value="84.2%" trend={{ value: 3, label: 'vs prev' }} />
        <StatCard label="Avg. Score" value="74%" sub="across all quizzes" />
        <StatCard label="Writing Sessions" value="892" sub="41% of total" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Weekly sessions */}
        <Card>
          <h2 className="text-sm font-bold mb-5" style={{ color: 'var(--text-primary)' }}>Weekly Sessions &amp; Avg. Score</h2>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={weeklyData} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-border)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<TT />} />
              <Bar yAxisId="left" dataKey="sessions" fill="#014f86" radius={[4, 4, 0, 0]} name="Sessions" />
              <Line yAxisId="right" type="monotone" dataKey="avg" stroke="#89c2d9" strokeWidth={2} dot={false} name="Avg Score %" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Completion by type */}
        <Card>
          <h2 className="text-sm font-bold mb-5" style={{ color: 'var(--text-primary)' }}>By Quiz Type</h2>
          <div className="space-y-5">
            {completionByType.map((t, i) => (
              <div key={i} className="p-4 rounded-[14px]" style={{ background: 'var(--surface-2)', border: '1px solid var(--surface-border)' }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{t.type}</p>
                  <Badge variant="info" size="xs">{t.sessions.toLocaleString()} sessions</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Completion</p>
                    <ProgressBar value={t.completion} showLabel />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Avg. Score</p>
                    <ProgressBar value={t.avgScore} showLabel />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Most missed items */}
      <Card>
        <h2 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Most Missed Items</h2>
        <div className="space-y-2.5">
          {wrongByItem.map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-[12px]"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--surface-border)' }}>
              <span className="w-5 text-xs font-mono font-bold text-center flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{i + 1}</span>
              <span className="text-sm font-semibold flex-1" style={{ color: 'var(--text-primary)' }}>{item.item}</span>
              <span className="text-xs font-mono text-red-400">{item.wrong} wrong</span>
              <div className="w-24">
                <ProgressBar value={item.pct} color="red" showLabel />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── System Health ───────────────────────────────────────────────────────────
export function AdminSystemHealthPage({ onToast }: { onToast: (m: string, t?: 'success' | 'error' | 'info') => void }) {
  const [refreshing, setRefreshing] = useState(false);

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => { setRefreshing(false); onToast('Health status refreshed', 'success'); }, 1200);
  };

  const services = [
    { name: 'API Server',       status: 'healthy', latency: '12ms',   uptime: '99.98%', url: 'http://localhost:5000/api' },
    { name: 'Keycloak Auth',    status: 'healthy', latency: '34ms',   uptime: '99.95%', url: 'http://localhost:8080' },
    { name: 'Dictionary DB',    status: 'healthy', latency: '4ms',    uptime: '100%',   url: null },
    { name: 'Provider API',     status: 'degraded',latency: '1840ms', uptime: '97.2%',  url: null },
    { name: 'Cache Layer',      status: 'healthy', latency: '1ms',    uptime: '100%',   url: null },
    { name: 'Job Queue',        status: 'healthy', latency: '8ms',    uptime: '99.90%', url: null },
  ];

  const metrics = [
    { label: 'CPU Usage',    value: 34,  unit: '%', color: 'green' },
    { label: 'Memory',       value: 58,  unit: '%', color: 'blue' },
    { label: 'Disk',         value: 41,  unit: '%', color: 'blue' },
    { label: 'Cache Hit Rate',value: 68, unit: '%', color: 'green' },
  ];

  const statusColor = (s: string) =>
    s === 'healthy' ? '#10b981' : s === 'degraded' ? '#f59e0b' : '#f87171';
  const statusVariant = (s: string): any =>
    s === 'healthy' ? 'success' : s === 'degraded' ? 'warning' : 'error';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>System Health</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Service status and infrastructure metrics</p>
        </div>
        <Button variant="secondary" size="sm" loading={refreshing}
          icon={<RefreshCw size={14} />} onClick={refresh}>
          Refresh
        </Button>
      </div>

      {/* Overall status */}
      <div className="rounded-[18px] p-5 flex items-center gap-4"
        style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.22)' }}>
        <CheckCircle2 size={28} className="text-emerald-400 flex-shrink-0" />
        <div>
          <p className="text-base font-bold text-emerald-400">All Systems Operational</p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>1 degraded service · Last checked: 14:38:22</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <Card key={i}>
            <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>{m.label}</p>
            <p className="text-2xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>{m.value}{m.unit}</p>
            <ProgressBar value={m.value} color={m.color as any} size="sm" />
          </Card>
        ))}
      </div>

      {/* Services table */}
      <Card padding="none">
        <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--surface-border)' }}>
          <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Service Status</h2>
        </div>
        <div className="divide-y" style={{ '--tw-divide-opacity': 1 } as any}>
          {services.map((svc, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-[var(--surface-2)] t-all">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: statusColor(svc.status), boxShadow: `0 0 6px ${statusColor(svc.status)}` }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{svc.name}</p>
                {svc.url && <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{svc.url}</p>}
              </div>
              <Badge variant={statusVariant(svc.status)}>{svc.status}</Badge>
              <span className="text-xs font-mono w-16 text-right" style={{ color: svc.latency.includes('1840') ? '#f59e0b' : 'var(--text-muted)' }}>{svc.latency}</span>
              <span className="text-xs font-mono w-14 text-right" style={{ color: 'var(--text-muted)' }}>{svc.uptime}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
