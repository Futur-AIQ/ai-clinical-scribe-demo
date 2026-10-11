/** Three gray blocks in the content area, shown until the demo data is ready. */
export function ContentSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading demo data" className="flex flex-col gap-5">
      <div className="h-[58px] w-[min(420px,100%)] rounded-card bg-line-2" />
      <div className="h-[220px] rounded-card bg-line-2" />
      <div className="h-[160px] rounded-card bg-line-2" />
    </div>
  );
}

/** Light placeholder of the whole shell, prerendered as the Suspense fallback. */
export function ShellSkeleton() {
  return (
    <div className="min-h-dvh md:grid md:grid-cols-[248px_minmax(0,1fr)]">
      <div className="sticky top-0 h-dvh border-r border-line bg-surface max-md:hidden" />
      <div className="flex min-w-0 flex-col">
        <div className="h-[62px] border-b border-line bg-white" />
        <div className="px-7 pt-[26px] max-md:px-4 max-md:pt-5">
          <ContentSkeleton />
        </div>
      </div>
    </div>
  );
}
