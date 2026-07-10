interface SkeletonProps {
  className?: string;
  lines?: number;
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} style={{ minHeight: '16px' }} />;
}

export function SkeletonCard() {
  return (
    <div className="rounded-[16px] p-5" style={{ background: 'var(--surface)', border: '1px solid var(--surface-border)' }}>
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="w-10 h-10 rounded-[12px]" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4 rounded" />
          <Skeleton className="h-3 w-1/2 rounded" />
        </div>
      </div>
      <Skeleton className="h-3 w-full rounded mb-2" />
      <Skeleton className="h-3 w-2/3 rounded" />
    </div>
  );
}

export function SkeletonPage() {
  return (
    <div className="space-y-5 page-enter">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <Skeleton className="h-9 w-28 rounded-xl" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="rounded-[16px] p-5" style={{ background: 'var(--surface)', border: '1px solid var(--surface-border)' }}>
            <Skeleton className="h-5 w-32 rounded mb-4" />
            <div className="space-y-3">
              {[...Array(4)].map((_, j) => <Skeleton key={j} className="h-12 w-full rounded-lg" />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
