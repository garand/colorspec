import type { CSSProperties, ReactNode } from "react"
import { useMemo } from "react"
import type { GeneratedScheme, ThemeTokens } from "@colorspec/core"

import { cn } from "#/lib/utils.ts"

type Mode = "light" | "dark"

function pickRowColor(
  scheme: GeneratedScheme,
  rowKey: string,
  mode: Mode,
  position: number,
): string | undefined {
  const row = scheme.scales.matrix.find((entry) => entry.key === rowKey)
  if (!row) return undefined
  const scale = mode === "dark" ? row.dark : row.light
  if (scale.length === 0) return undefined
  const index = Math.min(scale.length - 1, Math.max(0, Math.round(position * (scale.length - 1))))
  return scale[index]
}

function chartColors(scheme: GeneratedScheme, mode: Mode): string[] {
  const fallback = ["blue", "green", "magenta", "orange", "teal", "violet", "yellow", "red"]
  const result: string[] = []
  for (const key of fallback) {
    const color = pickRowColor(scheme, key, mode, 0.55)
    if (color) result.push(color)
    if (result.length >= 5) break
  }
  while (result.length < 5) result.push(scheme.tokens[mode].background.interactive)
  return result
}

function destructiveTextColor(scheme: GeneratedScheme, mode: Mode): string {
  return (
    pickRowColor(scheme, "red", mode, 1) ??
    pickRowColor(scheme, "orange", mode, 1) ??
    scheme.tokens[mode].text.strong
  )
}

export function buildPreviewVars(scheme: GeneratedScheme, mode: Mode): Record<string, string> {
  const tokens: ThemeTokens = scheme.tokens[mode]
  const charts = chartColors(scheme, mode)
  const destructive = destructiveTextColor(scheme, mode)

  return {
    "--background": tokens.background.canvas,
    "--foreground": tokens.text.default,
    "--card": tokens.background.surface,
    "--card-foreground": tokens.text.default,
    "--popover": tokens.background.elevated,
    "--popover-foreground": tokens.text.default,
    "--primary": tokens.background.interactive,
    "--primary-foreground": tokens.text.onAccent,
    "--secondary": tokens.background.elevated,
    "--secondary-foreground": tokens.text.strong,
    "--muted": tokens.background.elevated,
    "--muted-foreground": tokens.text.muted,
    "--accent": tokens.background.elevated,
    "--accent-foreground": tokens.text.strong,
    "--destructive": destructive,
    "--destructive-foreground": tokens.text.onAccent,
    "--border": tokens.border.subtle,
    "--input": tokens.border.strong,
    "--ring": tokens.border.focus,
    "--chart-1": charts[0],
    "--chart-2": charts[1],
    "--chart-3": charts[2],
    "--chart-4": charts[3],
    "--chart-5": charts[4],
    "--sidebar": tokens.background.surface,
    "--sidebar-foreground": tokens.text.default,
    "--sidebar-primary": tokens.background.interactive,
    "--sidebar-primary-foreground": tokens.text.onAccent,
    "--sidebar-accent": tokens.background.elevated,
    "--sidebar-accent-foreground": tokens.text.strong,
    "--sidebar-border": tokens.border.subtle,
    "--sidebar-ring": tokens.border.focus,
  }
}

export function PreviewThemeProvider({
  scheme,
  mode,
  children,
  className,
}: {
  scheme: GeneratedScheme
  mode: Mode
  children: ReactNode
  className?: string
}) {
  const cssVars = useMemo(() => buildPreviewVars(scheme, mode), [scheme, mode])

  return (
    <div
      data-preview-root=""
      data-mode={mode}
      className={cn(
        mode === "dark" ? "dark" : "",
        "bg-background text-foreground",
        className,
      )}
      style={cssVars as CSSProperties}
    >
      {children}
    </div>
  )
}
