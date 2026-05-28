import { converter, formatCss } from "culori"
import { apcaContrastLc } from "./contrast/apca"
import { wcag2ContrastRatio } from "./contrast/wcag2"
import { withOutputMetadata } from "./output"
import type { GenerationDiagnostics } from "./output"
import type {
  ContrastCheck,
  ContrastStandard,
  GeneratedScheme,
  HueScaleRow,
  RampProfileName,
  SchemeInput,
  ThemeTokens,
  TokenGroupName,
} from "./types"

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
const toOklch = converter("oklch")
interface HueDefinition {
  key: string
  label: string
  hue: number
}

interface StepGroupEntry {
  group: TokenGroupName
  index: number
  count: number
}

type RampChannel = "chroma" | "lightness"

const RAINBOW_HUE_ROWS: readonly HueDefinition[] = [
  { key: "red", label: "Red", hue: 25 },
  { key: "orange", label: "Orange", hue: 55 },
  { key: "yellow", label: "Yellow", hue: 95 },
  { key: "lime", label: "Lime", hue: 125 },
  { key: "green", label: "Green", hue: 145 },
  { key: "teal", label: "Teal", hue: 175 },
  { key: "cyan", label: "Cyan", hue: 205 },
  { key: "blue", label: "Blue", hue: 245 },
  { key: "indigo", label: "Indigo", hue: 275 },
  { key: "violet", label: "Violet", hue: 305 },
  { key: "magenta", label: "Magenta", hue: 335 },
] as const

function findClosestHueRow(hue: number): HueDefinition {
  const normalized = ((hue % 360) + 360) % 360
  let winner = RAINBOW_HUE_ROWS[0]
  let bestDistance = Number.POSITIVE_INFINITY

  for (const row of RAINBOW_HUE_ROWS) {
    const direct = Math.abs(row.hue - normalized)
    const wrapped = Math.min(direct, 360 - direct)
    if (wrapped < bestDistance) {
      bestDistance = wrapped
      winner = row
    }
  }

  return winner
}

function oklchToCss(lightness: number, chroma: number, hue: number): string {
  return formatCss({
    mode: "oklch",
    l: clamp(lightness, 0, 1),
    c: clamp(chroma, 0, 0.4),
    h: ((hue % 360) + 360) % 360,
  })
}

function pickAt<T>(items: T[], index: number): T {
  return items[clamp(index, 0, items.length - 1)]
}

function easeInOut(value: number): number {
  return value * value * (3 - 2 * value)
}

function shapeRampPosition(profile: RampProfileName, channel: RampChannel, group: TokenGroupName, position: number): number {
  const t = clamp(position, 0, 1)

  if (profile === "linear") {
    return t
  }

  if (profile === "soft") {
    return channel === "chroma" ? t ** 1.45 : easeInOut(t)
  }

  if (profile === "punchy") {
    return channel === "chroma" ? 1 - (1 - t) ** 2 : t ** 0.8
  }

  if (profile === "contrast") {
    return channel === "chroma" ? t ** 0.9 : t ** 1.35
  }

  if (group === "background") {
    return channel === "chroma" ? t ** 1.8 : t ** 1.2
  }

  if (group === "border") {
    return channel === "chroma" ? t ** 1.35 : easeInOut(t)
  }

  if (group === "icon") {
    return easeInOut(t)
  }

  if (group === "solid") {
    return channel === "chroma" ? 1 - t ** 1.8 : t ** 0.75
  }

  if (channel === "chroma") {
    return 1 - t ** 1.5
  }

  return t ** 2.8
}

function applyChromaToColor(
  color: string,
  options: {
    chromaMin: number
    chromaMax: number
    lightnessMin: number
    lightnessMax: number
    sourceChroma: number
    index: number
    count: number
    group: TokenGroupName
    rampProfile: RampProfileName
    isDark: boolean
  },
): string {
  const parsed = toOklch(color)
  if (!parsed || parsed.l === undefined || parsed.c === undefined || parsed.h === undefined) {
    return color
  }
  const position = options.count <= 1 ? 0.5 : options.index / (options.count - 1)
  const chromaPosition = shapeRampPosition(options.rampProfile, "chroma", options.group, position)
  const lightnessPosition = shapeRampPosition(options.rampProfile, "lightness", options.group, position)
  const chromaRangeValue = options.chromaMin + (options.chromaMax - options.chromaMin) * chromaPosition
  const lightnessRangeValue = options.isDark
    ? options.lightnessMin + (options.lightnessMax - options.lightnessMin) * lightnessPosition
    : options.lightnessMax + (options.lightnessMin - options.lightnessMax) * lightnessPosition
  const nextChroma = options.sourceChroma * chromaRangeValue
  return oklchToCss(lightnessRangeValue, clamp(nextChroma, 0, 0.4), parsed.h)
}

function buildScale({
  steps,
  hue,
  chroma,
  isDark,
  neutral,
}: {
  steps: number
  hue: number
  chroma: number
  isDark: boolean
  neutral: boolean
}): string[] {
  const out: string[] = []
  const c = neutral ? chroma * 0.15 : chroma

  for (let i = 0; i < steps; i += 1) {
    const t = i / (steps - 1)
    const l = isDark ? 0.14 + t * 0.78 : 0.97 - t * 0.86
    out.push(oklchToCss(l, c, hue))
  }

  return out
}

function checkContrast(fg: string, bg: string, standard: ContrastStandard, minRatio: number, minLc: number): ContrastCheck {
  const wcag2Ratio = wcag2ContrastRatio(fg, bg)
  const apcaLc = Math.abs(apcaContrastLc(fg, bg))

  const passesWcag2 = standard === "apca" ? true : wcag2Ratio >= minRatio
  const passesApca = standard === "wcag2" ? true : apcaLc >= minLc

  return {
    wcag2Ratio,
    apcaLc,
    passesWcag2,
    passesApca,
  }
}

function findReadableText({
  candidates,
  background,
  standard,
  minRatio,
  minLc,
}: {
  candidates: string[]
  background: string
  standard: ContrastStandard
  minRatio: number
  minLc: number
}): { color: string; check: ContrastCheck; adjusted: boolean } {
  for (const candidate of candidates) {
    const check = checkContrast(candidate, background, standard, minRatio, minLc)
    if (check.passesApca && check.passesWcag2) {
      return { color: candidate, check, adjusted: false }
    }
  }

  const fallback = candidates[candidates.length - 1]
  return {
    color: fallback,
    check: checkContrast(fallback, background, standard, minRatio, minLc),
    adjusted: true,
  }
}

function createThemeTokens({
  accent,
  neutral,
  groups,
  standard,
  minRatio,
  minLc,
}: {
  accent: string[]
  neutral: string[]
  groups: Record<TokenGroupName, string[]>
  standard: ContrastStandard
  minRatio: number
  minLc: number
}): { tokens: ThemeTokens; primaryCheck: ContrastCheck; adjusted: boolean } {
  const backgroundCanvas = pickAt(groups.background, 0)
  const backgroundSurface = pickAt(groups.background, 1)
  const backgroundElevated = pickAt(groups.background, 2)
  const interactive = pickAt(groups.solid, 0)
  const iconGroup = groups.icon.length > 0 ? groups.icon : groups.text
  const subtleIcon = pickAt(iconGroup, 0)
  const defaultIcon = pickAt(iconGroup, 1)
  const strongIcon = pickAt(iconGroup, 2)
  const subtleText = pickAt(groups.text, 0)
  const mutedText = pickAt(groups.text, 1)
  const defaultText = pickAt(groups.text, 2)
  const strongText = pickAt(groups.text, 3)

  const { color: onAccent } = findReadableText({
    candidates: [strongText, defaultText, pickAt(neutral, 0), pickAt(neutral, 1)],
    background: interactive,
    standard,
    minRatio,
    minLc,
  })

  const primaryReadability = findReadableText({
    candidates: [strongText, defaultText, mutedText, subtleText],
    background: backgroundCanvas,
    standard,
    minRatio,
    minLc,
  })

  const tokens: ThemeTokens = {
    background: {
      canvas: backgroundCanvas,
      surface: backgroundSurface,
      elevated: backgroundElevated,
      interactive,
    },
    border: {
      subtle: pickAt(groups.border, 0),
      strong: pickAt(groups.border, 1),
      focus: pickAt(groups.border, 2),
    },
    icon: {
      subtle: subtleIcon,
      default: defaultIcon,
      strong: strongIcon,
      accent: pickAt(accent, 8),
    },
    text: {
      subtle: subtleText,
      muted: mutedText,
      default: defaultText,
      strong: primaryReadability.color,
      accent: pickAt(accent, 8),
      onAccent,
    },
  }

  return {
    tokens,
    primaryCheck: primaryReadability.check,
    adjusted: primaryReadability.adjusted,
  }
}

export function generateScheme(input: SchemeInput): GeneratedScheme & { diagnostics: GenerationDiagnostics } {
  const standard = input.standard ?? "both"
  const minRatio = input.contrastTargets?.wcag2MinRatio ?? 4.5
  const minLc = input.contrastTargets?.apcaMinLc ?? 60
  const baseHue = input.seed.hue
  const baseChroma = input.seed.chroma
  const groupSizes: Record<TokenGroupName, number> = {
    background: clamp(input.groupSizes?.background ?? 5, 1, 24),
    border: clamp(input.groupSizes?.border ?? 3, 1, 24),
    solid: clamp(input.groupSizes?.solid ?? 2, 1, 24),
    text: clamp(input.groupSizes?.text ?? 2, 1, 24),
    icon: clamp(input.groupSizes?.icon ?? 0, 0, 24),
  }
  const groupOrder: TokenGroupName[] = ["background", "border", "icon", "solid", "text"]
  const stepGroups: StepGroupEntry[] = groupOrder.flatMap((group) =>
    Array.from({ length: groupSizes[group] }, (_, index) => ({
      group,
      index,
      count: groupSizes[group],
    })),
  )
  const steps = stepGroups.length
  const defaultRampProfile = input.rampProfile ?? "radix"
  const groupChromaRange: Record<TokenGroupName, { min: number; max: number }> = {
    background: input.groupChromaRange?.background ?? { min: 0.02, max: 0.18 },
    border: input.groupChromaRange?.border ?? { min: 0.24, max: 0.56 },
    solid: input.groupChromaRange?.solid ?? { min: 1.15, max: 1.45 },
    icon: input.groupChromaRange?.icon ?? { min: 0.65, max: 1 },
    text: input.groupChromaRange?.text ?? { min: 0.95, max: 1.25 },
  }
  const groupLightnessRange: Record<TokenGroupName, { min: number; max: number }> = {
    background: input.groupLightnessRange?.background ?? { min: 0.915, max: 0.995 },
    border: input.groupLightnessRange?.border ?? { min: 0.76, max: 0.88 },
    solid: input.groupLightnessRange?.solid ?? { min: 0.56, max: 0.62 },
    icon: input.groupLightnessRange?.icon ?? { min: 0.72, max: 0.8 },
    text: input.groupLightnessRange?.text ?? { min: 0.2, max: 0.5 },
  }
  const groupDarkLightnessRange: Record<TokenGroupName, { min: number; max: number }> = {
    background: input.groupDarkLightnessRange?.background ?? { min: 0.12, max: 0.19 },
    border: input.groupDarkLightnessRange?.border ?? { min: 0.24, max: 0.38 },
    solid: input.groupDarkLightnessRange?.solid ?? { min: 0.56, max: 0.7 },
    icon: input.groupDarkLightnessRange?.icon ?? { min: 0.68, max: 0.84 },
    text: input.groupDarkLightnessRange?.text ?? { min: 0.78, max: 0.96 },
  }
  const groupRampProfiles: Record<TokenGroupName, RampProfileName> = {
    background: input.groupRampProfiles?.background ?? defaultRampProfile,
    border: input.groupRampProfiles?.border ?? defaultRampProfile,
    solid: input.groupRampProfiles?.solid ?? defaultRampProfile,
    icon: input.groupRampProfiles?.icon ?? defaultRampProfile,
    text: input.groupRampProfiles?.text ?? defaultRampProfile,
  }

  const baseMatrixRows: HueScaleRow[] = [
    {
      key: "neutral",
      label: "Neutral",
      hue: baseHue,
      chroma: clamp(baseChroma * 0.15, 0.006, 0.06),
      isNeutral: true,
      light: buildScale({
        steps,
        hue: baseHue,
        chroma: baseChroma,
        isDark: false,
        neutral: true,
      }),
      dark: buildScale({
        steps,
        hue: baseHue,
        chroma: baseChroma,
        isDark: true,
        neutral: true,
      }),
    },
    ...RAINBOW_HUE_ROWS.map((row) => {
      const rowHue = input.hueValues?.[row.key] ?? row.hue
      return {
        key: row.key,
        label: row.label,
        hue: rowHue,
        chroma: baseChroma,
        light: buildScale({
          steps,
          hue: rowHue,
          chroma: baseChroma,
          isDark: false,
          neutral: false,
        }),
        dark: buildScale({
          steps,
          hue: rowHue,
          chroma: baseChroma * 0.9,
          isDark: true,
          neutral: false,
        }),
      }
    }),
  ]

  const matrixRows: HueScaleRow[] = baseMatrixRows.map((row) => ({
    ...row,
    light: row.light.map((color, index) =>
      applyChromaToColor(color, {
        chromaMin: groupChromaRange[stepGroups[index].group].min,
        chromaMax: groupChromaRange[stepGroups[index].group].max,
        lightnessMin: groupLightnessRange[stepGroups[index].group].min,
        lightnessMax: groupLightnessRange[stepGroups[index].group].max,
        sourceChroma: row.chroma,
        index: stepGroups[index].index,
        count: stepGroups[index].count,
        group: stepGroups[index].group,
        rampProfile: groupRampProfiles[stepGroups[index].group],
        isDark: false,
      }),
    ),
    dark: row.dark.map((color, index) =>
      applyChromaToColor(color, {
        chromaMin: groupChromaRange[stepGroups[index].group].min,
        chromaMax: groupChromaRange[stepGroups[index].group].max,
        lightnessMin: groupDarkLightnessRange[stepGroups[index].group].min,
        lightnessMax: groupDarkLightnessRange[stepGroups[index].group].max,
        sourceChroma: row.chroma,
        index: stepGroups[index].index,
        count: stepGroups[index].count,
        group: stepGroups[index].group,
        rampProfile: groupRampProfiles[stepGroups[index].group],
        isDark: true,
      }),
    ),
  }))

  const neutralLight = matrixRows[0].light
  const neutralDark = matrixRows[0].dark
  const accentSource = findClosestHueRow(baseHue)
  const accentRow = matrixRows.find((row) => row.key === accentSource.key) ?? matrixRows[1]
  const accentLight = accentRow.light
  const accentDark = accentRow.dark
  const pickGroupColumns = (scale: string[], group: TokenGroupName) =>
    scale.filter((_, index) => stepGroups[index].group === group)

  const baseLightGroups: Record<TokenGroupName, string[]> = {
    background: pickGroupColumns(neutralLight, "background"),
    border: pickGroupColumns(neutralLight, "border"),
    solid: pickGroupColumns(accentLight, "solid"),
    text: pickGroupColumns(neutralLight, "text"),
    icon: pickGroupColumns(neutralLight, "icon"),
  }
  const baseDarkGroups: Record<TokenGroupName, string[]> = {
    background: pickGroupColumns(neutralDark, "background"),
    border: pickGroupColumns(neutralDark, "border"),
    solid: pickGroupColumns(accentDark, "solid"),
    text: pickGroupColumns(neutralDark, "text"),
    icon: pickGroupColumns(neutralDark, "icon"),
  }
  const lightGroups: Record<TokenGroupName, string[]> = {
    background: baseLightGroups.background,
    border: baseLightGroups.border,
    solid: baseLightGroups.solid,
    text: baseLightGroups.text,
    icon: baseLightGroups.icon,
  }
  const darkGroups: Record<TokenGroupName, string[]> = {
    background: baseDarkGroups.background,
    border: baseDarkGroups.border,
    solid: baseDarkGroups.solid,
    text: baseDarkGroups.text,
    icon: baseDarkGroups.icon,
  }

  const lightTheme = createThemeTokens({
    accent: accentLight,
    neutral: neutralLight,
    groups: lightGroups,
    standard,
    minRatio,
    minLc,
  })

  const darkTheme = createThemeTokens({
    accent: [...accentDark].reverse(),
    neutral: [...neutralDark].reverse(),
    groups: darkGroups,
    standard,
    minRatio,
    minLc,
  })

  const notes: string[] = []
  if (lightTheme.adjusted || darkTheme.adjusted) {
    notes.push("One or more text tokens used fallback candidates to satisfy constraints.")
  }

  return withOutputMetadata(
    input,
    {
      scales: {
        accent: { light: accentLight, dark: accentDark },
        neutral: { light: neutralLight, dark: neutralDark },
        matrix: matrixRows,
      },
      groups: {
        light: lightGroups,
        dark: darkGroups,
      },
      tokens: {
        light: lightTheme.tokens,
        dark: darkTheme.tokens,
      },
      contrast: {
        light: lightTheme.primaryCheck,
        dark: darkTheme.primaryCheck,
      },
    },
    {
      adjustedForContrast: lightTheme.adjusted || darkTheme.adjusted,
      notes,
    },
  )
}
