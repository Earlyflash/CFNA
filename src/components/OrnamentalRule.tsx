export function OrnamentalRule({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 text-np-rule ${className}`} aria-hidden>
      <span className="h-px flex-1 bg-np-rule" />
      <span className="text-xs tracking-[0.3em]">&#10038;</span>
      <span className="h-px flex-1 bg-np-rule" />
    </div>
  );
}
