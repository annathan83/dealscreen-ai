export default function NewDealLoading() {
  return (
    <div className="space-y-6 animate-pulse max-w-xl">
      <div className="space-y-2">
        <div className="h-6 w-40 bg-muted rounded" />
        <div className="h-4 w-96 bg-muted rounded" />
      </div>
      <div className="rounded-xl border border-border p-5 sm:p-6 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-24 bg-muted rounded" />
            <div className="h-10 w-full bg-muted rounded" />
          </div>
        ))}
        <div className="pt-2">
          <div className="h-10 w-28 bg-muted rounded" />
        </div>
      </div>
    </div>
  );
}
