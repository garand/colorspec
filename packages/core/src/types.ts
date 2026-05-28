export type ContrastStandard = "wcag2" | "apca" | "both"
export type TokenGroupName = "background" | "border" | "solid" | "text" | "icon"
export type RampProfileName = "linear" | "soft" | "radix" | "punchy" | "contrast"

export interface ContrastTargets {
  wcag2MinRatio: number
  apcaMinLc: number
}

export interface SchemeInput {
  name?: string
  seed: {
    hue: number
    chroma: number
  }
  standard?: ContrastStandard
  contrastTargets?: Partial<ContrastTargets>
  steps?: number
  groupSizes?: Partial<Record<TokenGroupName, number>>
  groupChromaRange?: Partial<Record<TokenGroupName, { min: number; max: number }>>
  groupLightnessRange?: Partial<Record<TokenGroupName, { min: number; max: number }>>
  rampProfile?: RampProfileName
  groupRampProfiles?: Partial<Record<TokenGroupName, RampProfileName>>
  hueValues?: Partial<Record<string, number>>
}

export interface HueScaleRow {
  key: string
  label: string
  hue: number
  chroma: number
  isNeutral?: boolean
  light: string[]
  dark: string[]
}

export type TokenGroup = "background" | "border" | "icon" | "text"

export type TokenSet<TValue extends string = string> = Record<TokenGroup, Record<string, TValue>>

export interface ThemeTokens<TValue extends string = string> extends TokenSet<TValue> {
  background: {
    canvas: TValue
    surface: TValue
    elevated: TValue
    interactive: TValue
  }
  border: {
    subtle: TValue
    strong: TValue
    focus: TValue
  }
  icon: {
    subtle: TValue
    default: TValue
    strong: TValue
    accent: TValue
  }
  text: {
    subtle: TValue
    muted: TValue
    default: TValue
    strong: TValue
    accent: TValue
    onAccent: TValue
  }
}

export interface ContrastCheck {
  wcag2Ratio: number
  apcaLc: number
  passesWcag2: boolean
  passesApca: boolean
}

export interface GeneratedScheme {
  meta: {
    name: string
    standard: ContrastStandard
    steps: number
    contrastTargets: ContrastTargets
    generatedAt: string
  }
  scales: {
    accent: {
      light: string[]
      dark: string[]
    }
    neutral: {
      light: string[]
      dark: string[]
    }
    matrix: HueScaleRow[]
  }
  groups: {
    light: Record<TokenGroupName, string[]>
    dark: Record<TokenGroupName, string[]>
  }
  tokens: {
    light: ThemeTokens
    dark: ThemeTokens
  }
  contrast: {
    light: ContrastCheck
    dark: ContrastCheck
  }
}
