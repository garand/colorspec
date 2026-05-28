import { Link } from "@tanstack/react-router"

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--header-bg)] px-4 backdrop-blur-lg">
      <nav className="flex w-full items-center justify-between py-3">
        <Link to="/" className="text-lg font-semibold text-[var(--text-strong)] no-underline">
          Colorspec
        </Link>
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link to="/" className="text-[var(--text-subtle)] no-underline hover:text-[var(--text-strong)]">
            Playground
          </Link>
          <Link to="/about" className="text-[var(--text-subtle)] no-underline hover:text-[var(--text-strong)]">
            About
          </Link>
          <a
            href="https://www.radix-ui.com/colors"
            target="_blank"
            rel="noreferrer"
            className="text-[var(--text-subtle)] no-underline hover:text-[var(--text-strong)]"
          >
            Radix Colors
          </a>
        </div>
      </nav>
    </header>
  )
}
