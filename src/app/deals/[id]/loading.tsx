export default function DealWorkspaceLoading() {
  return (
    <div className="space-y-6 animate-pulse max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-5 w-28 bg-muted rounded" />
          <div className="h-6 w-56 bg-muted rounded" />
          <div className="h-4 w-40 bg-muted rounded" />
        </div>
      </div>
      <div className="rounded-xl border border-border p-5 space-y-4">
        <div className="h-5 w-32 bg-muted rounded" />
        <div className="space-y-2">
          <div className="h-10 w-full bg-muted rounded" />
          <div className="h-24 w-full bg-muted rounded" />
        </div>
      </div>
    </div>
  );
}
