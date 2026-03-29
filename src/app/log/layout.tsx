/**
 * Wider reading column for episode pages (still under site chrome).
 * Breaks out of the root `main` max-width so the graphic + recap can breathe.
 */
export default function LogSectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 px-4 pb-24 pt-2 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </div>
  );
}
