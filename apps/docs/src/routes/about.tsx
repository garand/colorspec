import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/about")({
  component: AboutPage,
})

function AboutPage() {
  return (
    <section className="rounded-2xl border border-[var(--line)] bg-white p-6">
      <h1 className="text-3xl font-bold text-[var(--text-strong)]">About Colorspec</h1>
      <p className="mt-4 max-w-3xl leading-7 text-[var(--text-subtle)]">
        Colorspec is a framework-agnostic color engine for generating production-ready palettes from OKLCH.
        It is designed to output a config object first, then let adapters transform that object for systems like
        Tailwind, React contexts, CSS variables, and design token pipelines.
      </p>
    </section>
  )
}
