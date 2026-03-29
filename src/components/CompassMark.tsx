export function CompassMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
      <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="0.75" opacity="0.2" />
      <path d="M50 8 L56 42 L50 50 L44 42 Z" fill="currentColor" opacity="0.85" />
      <path d="M50 92 L44 58 L50 50 L56 58 Z" fill="currentColor" opacity="0.35" />
      <text
        x="50"
        y="14"
        textAnchor="middle"
        fill="currentColor"
        opacity="0.45"
        fontSize="8"
        fontFamily="system-ui"
      >
        N
      </text>
    </svg>
  );
}
