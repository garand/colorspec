import { createFileRoute } from "@tanstack/react-router"
import { Playground } from "../components/Playground"

export const Route = createFileRoute("/")({
  component: IndexPage,
})

function IndexPage() {
  return (
    <div className="space-y-2">
      <section className="border border-[var(--line)] bg-white px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-subtle)]">
          Spiritual successor to Radix Colors
        </p>
        <h1 className="text-2xl font-bold text-[var(--text-strong)]">
          Generate semantic color systems in OKLCH.
        </h1>
        <p className="mt-1 text-sm leading-6 text-[var(--text-subtle)]">
          Colorspec returns a stable config object for background, border, icon, and text token groups.
          Configure accessibility constraints with WCAG 2, APCA, or both.
        </p>
      </section>
      <Playground />
    </div>
  )
}
