/** Vintage compass rose for watermark / decorative use. */
export function CompassMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="1" opacity="0.15" />
      <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
      <path d="M50 8 L56 42 L50 50 L44 42 Z" fill="currentColor" opacity="0.12" />
      <path d="M50 92 L44 58 L50 50 L56 58 Z" fill="currentColor" opacity="0.06" />
      <path d="M8 50 L42 44 L50 50 L42 56 Z" fill="currentColor" opacity="0.08" />
      <path d="M92 50 L58 56 L50 50 L58 44 Z" fill="currentColor" opacity="0.08" />
      <text x="50" y="14" textAnchor="middle" fill="currentColor" opacity="0.12" fontSize="7" fontFamily="serif">N</text>
      <text x="50" y="94" textAnchor="middle" fill="currentColor" opacity="0.12" fontSize="7" fontFamily="serif">S</text>
      <text x="7" y="53" textAnchor="middle" fill="currentColor" opacity="0.12" fontSize="7" fontFamily="serif">W</text>
      <text x="93" y="53" textAnchor="middle" fill="currentColor" opacity="0.12" fontSize="7" fontFamily="serif">E</text>
    </svg>
  );
}
