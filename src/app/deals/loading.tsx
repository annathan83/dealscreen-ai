export default function DealsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-muted rounded" />
          <div className="h-4 w-72 bg-muted rounded" />
        </div>
        <div className="h-9 w-28 bg-muted rounded" />
      </div>
      <div className="rounded-xl border border-border overflow-hidden divide-y divide-border/60">
        {[1, 2, 3].map((i) => (
          <div key={i} className="px-5 py-4 flex flex-col md:flex-row gap-2 md:gap-4 md:items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-4 w-40 bg-muted rounded" />
              <div className="h-3 w-56 bg-muted rounded" />
            </div>
            <div className="h-4 w-32 bg-muted rounded self-start md:self-center" />
          </div>
        ))}
      </div>
    </div>
  );
}
