export function DesertBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-wwam-void">
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 120% 80% at 50% -20%, rgba(201, 162, 39, 0.18), transparent 55%),
            radial-gradient(ellipse 90% 60% at 100% 40%, rgba(120, 53, 15, 0.25), transparent 50%),
            radial-gradient(ellipse 70% 50% at 0% 80%, rgba(30, 58, 95, 0.12), transparent 45%)
          `,
        }}
      />
      <svg
        className="absolute bottom-0 left-0 right-0 h-[45vh] min-h-[240px] w-full text-wwam-dune/40"
        preserveAspectRatio="none"
        viewBox="0 0 1200 200"
        aria-hidden
      >
        <path
          fill="currentColor"
          d="M0,180 C200,120 400,200 600,140 C800,80 1000,160 1200,100 L1200,200 L0,200 Z"
        />
        <path
          fill="currentColor"
          opacity="0.5"
          d="M0,200 L0,165 C150,130 350,185 550,150 C750,115 950,175 1200,130 L1200,200 Z"
        />
      </svg>
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
