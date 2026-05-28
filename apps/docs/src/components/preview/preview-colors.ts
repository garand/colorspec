import type { GeneratedScheme, TokenGroupName } from "@colorspec/core"

export type PreviewMode = "light" | "dark"

export function pickRowColor(
  scheme: GeneratedScheme,
  rowKey: string,
  mode: PreviewMode,
  position: number,
): string | undefined {
  const row = scheme.scales.matrix.find((entry) => entry.key === rowKey)
  if (!row) return undefined
  const scale = mode === "dark" ? row.dark : row.light
  if (scale.length === 0) return undefined
  const index = Math.min(scale.length - 1, Math.max(0, Math.round(position * (scale.length - 1))))
  return scale[index]
}

export function pickRowGroupColor(
  scheme: GeneratedScheme,
  rowKey: string,
  mode: PreviewMode,
  group: TokenGroupName,
  indexInGroup: number,
): string | undefined {
  const row = scheme.scales.matrix.find((entry) => entry.key === rowKey)
  if (!row) return undefined

  const scale = mode === "dark" ? row.dark : row.light
  const groups = scheme.groups[mode]
  const groupLength = groups[group].length
  if (groupLength === 0) return undefined

  const offset =
    groups.background.length +
    groups.border.length +
    groups.icon.length +
    groups.solid.length

  const groupOffsets: Record<TokenGroupName, number> = {
    background: 0,
    border: groups.background.length,
    icon: groups.background.length + groups.border.length,
    solid: groups.background.length + groups.border.length + groups.icon.length,
    text: offset,
  }

  const index = groupOffsets[group] + Math.min(groupLength - 1, Math.max(0, indexInGroup))
  return scale[index]
}

function chartColors(scheme: GeneratedScheme, mode: PreviewMode): string[] {
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

function destructiveTextColor(scheme: GeneratedScheme, mode: PreviewMode): string {
  return (
    pickRowGroupColor(scheme, "red", mode, "text", 0) ??
    pickRowGroupColor(scheme, "orange", mode, "text", 0) ??
    scheme.tokens[mode].text.subtle
  )
}

function destructiveSolidColor(scheme: GeneratedScheme, mode: PreviewMode): string {
  const solidIndex = Math.max(0, scheme.groups[mode].solid.length - 1)
  return (
    pickRowGroupColor(scheme, "red", mode, "solid", solidIndex) ??
    pickRowGroupColor(scheme, "orange", mode, "solid", solidIndex) ??
    scheme.tokens[mode].background.interactive
  )
}

function buildHueVars(scheme: GeneratedScheme, mode: PreviewMode): Record<string, string> {
  const tokens = scheme.tokens[mode]
  const vars: Record<string, string> = {}

  for (const row of scheme.scales.matrix) {
    const solid =
      pickRowGroupColor(scheme, row.key, mode, "solid", 0) ?? tokens.background.interactive
    const text = pickRowGroupColor(scheme, row.key, mode, "text", 0) ?? tokens.text.default
    const border = pickRowGroupColor(scheme, row.key, mode, "border", 0) ?? tokens.border.subtle
    const surface =
      pickRowGroupColor(scheme, row.key, mode, "background", 1) ??
      pickRowGroupColor(scheme, row.key, mode, "background", 0) ??
      tokens.background.elevated

    vars[`--hue-${row.key}-solid`] = solid
    vars[`--hue-${row.key}-text`] = text
    vars[`--hue-${row.key}-border`] = border
    vars[`--hue-${row.key}-surface`] = surface
    vars[`--hue-${row.key}-on-solid`] = tokens.text.onAccent
  }

  return vars
}

export function buildPreviewVars(scheme: GeneratedScheme, mode: PreviewMode): Record<string, string> {
  const tokens = scheme.tokens[mode]
  const charts = chartColors(scheme, mode)
  const destructiveText = destructiveTextColor(scheme, mode)
  const destructiveSolid = destructiveSolidColor(scheme, mode)
  const hueVars = buildHueVars(scheme, mode)

  return {
    ...hueVars,
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
    "--destructive": destructiveSolid,
    "--destructive-foreground": tokens.text.onAccent,
    "--destructive-text": destructiveText,
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
