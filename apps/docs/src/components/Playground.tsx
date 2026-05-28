import { useMemo, useState } from "react"
import { apcaContrastLc, generateScheme, wcag2ContrastRatio } from "@colorspec/core"
import type { ContrastStandard, RampProfileName } from "@colorspec/core"
import {
  ChevronRightIcon,
  CodeIcon,
  ContrastIcon,
  MoonIcon,
  PaletteIcon,
  ScanLineIcon,
  Settings2Icon,
  SunIcon,
} from "lucide-react"

import { Badge } from "#/components/ui/badge.tsx"
import { Button } from "#/components/ui/button.tsx"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "#/components/ui/sheet.tsx"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "#/components/ui/tabs.tsx"
import { Toggle } from "#/components/ui/toggle.tsx"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "#/components/ui/tooltip.tsx"
import { Slider } from "#/components/ui/slider.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/components/ui/select.tsx"
import { Separator } from "#/components/ui/separator.tsx"
import { PreviewThemeProvider } from "#/components/preview/PreviewThemeProvider.tsx"
import { SaasPreview } from "#/components/preview/SaasPreview.tsx"

const HUE_OPTIONS = [
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

const GROUP_KEYS = ["background", "border", "icon", "solid", "text"] as const
type GroupKey = (typeof GROUP_KEYS)[number]
type ChromaRangeState = Record<GroupKey, { min: number; max: number }>
type LightnessRangeState = Record<GroupKey, { min: number; max: number }>

const RAMP_PROFILES: Array<{ value: RampProfileName; label: string; description: string }> = [
  { value: "radix", label: "Radix-like", description: "Subtle early steps, saturated upper steps, and a darker final text step." },
  { value: "linear", label: "Linear", description: "Even movement from min to max within each group." },
  { value: "soft", label: "Soft", description: "Gentler chroma shifts for quieter palettes." },
  { value: "punchy", label: "Punchy", description: "Faster chroma build for louder accents." },
  { value: "contrast", label: "Contrast", description: "Holds lighter values longer, then drops harder for readability." },
]

const WHITE_TEXT = "#ffffff"

function getContrastStats(foreground: string, background: string) {
  return {
    wcag2: wcag2ContrastRatio(foreground, background),
    apca: Math.abs(apcaContrastLc(foreground, background)),
  }
}

function formatContrast(stats: { wcag2: number; apca: number }, standard: ContrastStandard) {
  return standard === "apca" ? `Lc ${Math.round(stats.apca)}` : stats.wcag2.toFixed(1)
}

function passesContrast(stats: { wcag2: number; apca: number }, standard: ContrastStandard, wcagRatio: number, apcaLc: number) {
  if (standard === "wcag2") return stats.wcag2 >= wcagRatio
  if (standard === "apca") return stats.apca >= apcaLc
  return stats.wcag2 >= wcagRatio && stats.apca >= apcaLc
}

function getChipContrast({
  background,
  standard,
  wcagRatio,
  apcaLc,
  lightText,
  darkText,
  flipText,
}: {
  background: string
  standard: ContrastStandard
  wcagRatio: number
  apcaLc: number
  lightText: string
  darkText: string
  flipText: string
}) {
  const lightTextStats = getContrastStats(lightText, background)
  const darkTextStats = getContrastStats(darkText, background)
  const flipStats = getContrastStats(flipText, background)
  const whiteStats = getContrastStats(WHITE_TEXT, background)
  const shouldFlip = !passesContrast(lightTextStats, standard, wcagRatio, apcaLc)
  const topStats = shouldFlip ? flipStats : lightTextStats
  const bottomStats = shouldFlip ? whiteStats : darkTextStats

  return {
    topForeground: shouldFlip ? flipText : lightText,
    bottomForeground: shouldFlip ? WHITE_TEXT : darkText,
    topLabel: formatContrast(topStats, standard),
    bottomLabel: formatContrast(bottomStats, standard),
    topName: shouldFlip ? "BG" : "L",
    bottomName: shouldFlip ? "W" : "D",
    title: [
      shouldFlip
        ? `darkest background: WCAG ${flipStats.wcag2.toFixed(2)}:1, APCA Lc ${Math.round(flipStats.apca)}`
        : `light text: WCAG ${lightTextStats.wcag2.toFixed(2)}:1, APCA Lc ${Math.round(lightTextStats.apca)}`,
      shouldFlip
        ? `white text: WCAG ${whiteStats.wcag2.toFixed(2)}:1, APCA Lc ${Math.round(whiteStats.apca)}`
        : `dark text: WCAG ${darkTextStats.wcag2.toFixed(2)}:1, APCA Lc ${Math.round(darkTextStats.apca)}`,
    ].join("; "),
  }
}

function toArray(values: number | readonly number[]): readonly number[] {
  return Array.isArray(values) ? values : [values as number]
}

function CountSlider({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  onChange: (value: number) => void
}) {
  return (
    <div className="grid gap-2">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium">{label}</span>
        <Badge variant="outline" className="font-mono">
          {value}
        </Badge>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={1}
        onValueChange={(values) => {
          const next = toArray(values)
          onChange(Math.round(Number(next[0] ?? value)))
        }}
      />
    </div>
  )
}

function RangeRow({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string
  value: [number, number]
  min: number
  max: number
  step: number
  format: (value: number) => string
  onChange: (next: [number, number]) => void
}) {
  return (
    <div className="grid grid-cols-[110px_minmax(0,1fr)_120px] items-center gap-3">
      <span className="text-xs capitalize text-muted-foreground">{label}</span>
      <Slider
        value={value}
        min={min}
        max={max}
        step={step}
        onValueChange={(values) => {
          const next = toArray(values)
          const a = Number(next[0] ?? value[0])
          const b = Number(next[1] ?? value[1])
          onChange([Math.min(a, b), Math.max(a, b)])
        }}
      />
      <span className="text-right font-mono text-xs text-muted-foreground">
        {format(value[0])} – {format(value[1])}
      </span>
    </div>
  )
}

function HueRow({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (value: number) => void
}) {
  return (
    <div className="grid grid-cols-[110px_minmax(0,1fr)_60px] items-center gap-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <Slider
        value={[value]}
        min={0}
        max={360}
        step={1}
        onValueChange={(values) => {
          const next = toArray(values)
          onChange(Math.round(Number(next[0] ?? value)))
        }}
      />
      <span className="text-right font-mono text-xs text-muted-foreground">{Math.round(value)}°</span>
    </div>
  )
}

export function Playground() {
  const [neutralSource, setNeutralSource] = useState<(typeof HUE_OPTIONS)[number]["key"]>("blue")
  const baseChroma = 0.14
  const [textCount, setTextCount] = useState(2)
  const [bgCount, setBgCount] = useState(5)
  const [borderCount, setBorderCount] = useState(3)
  const [solidCount, setSolidCount] = useState(2)
  const [iconCount, setIconCount] = useState(0)
  const [rampProfile, setRampProfile] = useState<RampProfileName>("radix")
  const [grayscaleView, setGrayscaleView] = useState(false)
  const [contrastOverlay, setContrastOverlay] = useState(false)
  const [groupChromaRange, setGroupChromaRange] = useState<ChromaRangeState>({
    background: { min: 0.02, max: 0.18 },
    border: { min: 0.24, max: 0.56 },
    solid: { min: 1.15, max: 1.45 },
    icon: { min: 0.65, max: 1 },
    text: { min: 0.95, max: 1.25 },
  })
  const [groupLightnessRange, setGroupLightnessRange] = useState<LightnessRangeState>({
    background: { min: 0.915, max: 0.995 },
    border: { min: 0.76, max: 0.88 },
    solid: { min: 0.56, max: 0.62 },
    icon: { min: 0.72, max: 0.8 },
    text: { min: 0.2, max: 0.5 },
  })
  const [hueValues, setHueValues] = useState<Record<string, number>>(
    Object.fromEntries(HUE_OPTIONS.map((entry) => [entry.key, entry.hue])),
  )
  const [standard, setStandard] = useState<ContrastStandard>("both")
  const [wcagRatio, setWcagRatio] = useState(4.5)
  const [apcaLc, setApcaLc] = useState(60)
  const [outputMode, setOutputMode] = useState<"light" | "dark">("light")
  const [controlsOpen, setControlsOpen] = useState(false)
  const [activeView, setActiveView] = useState("preview")

  const hue = HUE_OPTIONS.find((entry) => entry.key === neutralSource)?.hue ?? 245

  const scheme = useMemo(
    () =>
      generateScheme({
        name: "playground-scheme",
        seed: { hue, chroma: baseChroma },
        standard,
        groupSizes: {
          background: bgCount,
          border: borderCount,
          solid: solidCount,
          text: textCount,
          icon: iconCount,
        },
        groupChromaRange,
        groupLightnessRange,
        rampProfile,
        hueValues,
        contrastTargets: { wcag2MinRatio: wcagRatio, apcaMinLc: apcaLc },
      }),
    [
      apcaLc,
      bgCount,
      borderCount,
      groupChromaRange,
      groupLightnessRange,
      hue,
      hueValues,
      iconCount,
      rampProfile,
      solidCount,
      standard,
      textCount,
      wcagRatio,
    ],
  )

  const stepRoles = useMemo(() => {
    return [
      ...scheme.groups.light.background.map((_, index) => ({ group: "background", token: `bg${index + 1}` })),
      ...scheme.groups.light.border.map((_, index) => ({ group: "border", token: `border${index + 1}` })),
      ...scheme.groups.light.icon.map((_, index) => ({ group: "icon", token: `icon${index + 1}` })),
      ...scheme.groups.light.solid.map((_, index) => ({ group: "solid", token: `solid${index + 1}` })),
      ...scheme.groups.light.text.map((_, index) => ({ group: "text", token: `text${index + 1}` })),
    ] as const
  }, [scheme.groups.light])

  const totalSteps = stepRoles.length
  const textColumnIndexes = stepRoles.flatMap((role, index) => (role.group === "text" ? [index] : []))
  const backgroundColumnIndexes = stepRoles.flatMap((role, index) => (role.group === "background" ? [index] : []))

  const groupSpans = useMemo(() => {
    const spans: Array<{ name: string; span: number }> = []
    for (const role of stepRoles) {
      const last = spans[spans.length - 1]
      if (last && last.name === role.group) {
        last.span += 1
      } else {
        spans.push({ name: role.group, span: 1 })
      }
    }
    return spans
  }, [stepRoles])

  const matrixRows = outputMode === "dark"
    ? scheme.scales.matrix.map((row) => row.dark)
    : scheme.scales.matrix.map((row) => row.light)

  return (
    <TooltipProvider>
      <section className="flex flex-col gap-3">
        <div className="sticky top-[58px] z-30 flex flex-wrap items-center gap-2 border border-[var(--line)] bg-white/90 px-3 py-2 shadow-sm backdrop-blur-lg">
          <div className="flex items-center gap-2">
            <PaletteIcon className="size-4 text-[var(--text-subtle)]" />
            <span className="text-sm font-semibold text-[var(--text-strong)]">
              {HUE_OPTIONS.find((entry) => entry.key === neutralSource)?.label} scheme
            </span>
            <Badge variant="outline" className="font-mono">
              {totalSteps} steps
            </Badge>
            <Badge variant="outline" className="font-mono capitalize">
              {rampProfile}
            </Badge>
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center rounded-md border border-[var(--line)] bg-[var(--line)] p-0.5">
              <button
                type="button"
                onClick={() => setOutputMode("light")}
                aria-pressed={outputMode === "light"}
                className={`inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] font-semibold uppercase tracking-wide transition-colors ${
                  outputMode === "light" ? "bg-white text-[var(--text-strong)] shadow-sm" : "text-[var(--text-subtle)]"
                }`}
              >
                <SunIcon className="size-3.5" /> Light
              </button>
              <button
                type="button"
                onClick={() => setOutputMode("dark")}
                aria-pressed={outputMode === "dark"}
                className={`inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] font-semibold uppercase tracking-wide transition-colors ${
                  outputMode === "dark" ? "bg-white text-[var(--text-strong)] shadow-sm" : "text-[var(--text-subtle)]"
                }`}
              >
                <MoonIcon className="size-3.5" /> Dark
              </button>
            </div>

            <Tooltip>
              <TooltipTrigger
                render={
                  <Toggle
                    pressed={contrastOverlay}
                    onPressedChange={setContrastOverlay}
                    aria-label="Show contrast overlay"
                    size="sm"
                  >
                    <ContrastIcon />
                    Contrast
                  </Toggle>
                }
              />
              <TooltipContent>Show contrast info on chips</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger
                render={
                  <Toggle
                    pressed={grayscaleView}
                    onPressedChange={setGrayscaleView}
                    aria-label="Toggle grayscale view"
                    size="sm"
                  >
                    <ScanLineIcon />
                    Grayscale
                  </Toggle>
                }
              />
              <TooltipContent>Compare values without hue</TooltipContent>
            </Tooltip>

            <Sheet open={controlsOpen} onOpenChange={setControlsOpen}>
              <SheetTrigger
                render={
                  <Button size="sm" variant="default">
                    <Settings2Icon data-icon="inline-start" />
                    Adjust scheme
                  </Button>
                }
              />
              <SheetContent side="left" className="w-[min(440px,90vw)] sm:max-w-[440px]">
                <SheetHeader className="border-b border-border">
                  <SheetTitle>Scheme controls</SheetTitle>
                  <SheetDescription>
                    Tune token counts, ramp profile, contrast targets, and per-row hues.
                  </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-4 pb-6">
                  <Tabs defaultValue="basics" className="mt-3">
                    <TabsList>
                      <TabsTrigger value="basics">Basics</TabsTrigger>
                      <TabsTrigger value="ranges">Ranges</TabsTrigger>
                      <TabsTrigger value="hues">Hues</TabsTrigger>
                      <TabsTrigger value="contrast">Contrast</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basics" className="flex flex-col gap-5 pt-4">
                      <div className="grid gap-2">
                        <label className="text-sm font-medium" htmlFor="neutral-source">
                          Neutral source hue
                        </label>
                        <Select
                          value={neutralSource}
                          onValueChange={(value) => setNeutralSource(value as (typeof HUE_OPTIONS)[number]["key"])}
                        >
                          <SelectTrigger id="neutral-source">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {HUE_OPTIONS.map((option) => (
                              <SelectItem key={option.key} value={option.key}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <label className="text-sm font-medium" htmlFor="ramp-profile">
                          Ramp profile
                        </label>
                        <Select
                          value={rampProfile}
                          onValueChange={(value) => setRampProfile(value as RampProfileName)}
                        >
                          <SelectTrigger id="ramp-profile">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {RAMP_PROFILES.map((profile) => (
                              <SelectItem key={profile.value} value={profile.value}>
                                {profile.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs leading-5 text-muted-foreground">
                          {RAMP_PROFILES.find((profile) => profile.value === rampProfile)?.description}
                        </p>
                      </div>

                      <Separator />

                      <div className="grid gap-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Token counts
                        </p>
                        <CountSlider label="Background" value={bgCount} min={1} max={8} onChange={setBgCount} />
                        <CountSlider label="Border" value={borderCount} min={1} max={8} onChange={setBorderCount} />
                        <CountSlider label="Icon" value={iconCount} min={0} max={8} onChange={setIconCount} />
                        <CountSlider label="Solid" value={solidCount} min={1} max={8} onChange={setSolidCount} />
                        <CountSlider label="Text" value={textCount} min={1} max={8} onChange={setTextCount} />
                        <div className="rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                          Total steps generated: <span className="font-mono">{totalSteps}</span>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="ranges" className="flex flex-col gap-6 pt-4">
                      <div className="grid gap-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Group lightness min / max
                        </p>
                        <p className="text-xs leading-5 text-muted-foreground">
                          Min is darkest, max is lightest; scales render light-to-dark.
                        </p>
                        {GROUP_KEYS.map((group) => (
                          <RangeRow
                            key={`l-${group}`}
                            label={group}
                            value={[groupLightnessRange[group].min, groupLightnessRange[group].max]}
                            min={0}
                            max={1}
                            step={0.01}
                            format={(value) => value.toFixed(2)}
                            onChange={([min, max]) =>
                              setGroupLightnessRange((previous) => ({
                                ...previous,
                                [group]: { min, max },
                              }))
                            }
                          />
                        ))}
                      </div>

                      <Separator />

                      <div className="grid gap-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Group chroma min / max
                        </p>
                        <p className="text-xs leading-5 text-muted-foreground">
                          Equal min/max keeps chroma flat; lightness still changes across the scale.
                        </p>
                        {GROUP_KEYS.map((group) => (
                          <RangeRow
                            key={`c-${group}`}
                            label={group}
                            value={[groupChromaRange[group].min, groupChromaRange[group].max]}
                            min={0}
                            max={1.6}
                            step={0.01}
                            format={(value) => value.toFixed(2)}
                            onChange={([min, max]) =>
                              setGroupChromaRange((previous) => ({
                                ...previous,
                                [group]: { min, max },
                              }))
                            }
                          />
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="hues" className="flex flex-col gap-3 pt-4">
                      <p className="text-xs leading-5 text-muted-foreground">
                        Override the hue (degrees) for each named matrix row.
                      </p>
                      {HUE_OPTIONS.map((option) => (
                        <HueRow
                          key={option.key}
                          label={option.label}
                          value={hueValues[option.key] ?? option.hue}
                          onChange={(value) =>
                            setHueValues((previous) => ({ ...previous, [option.key]: value }))
                          }
                        />
                      ))}
                    </TabsContent>

                    <TabsContent value="contrast" className="flex flex-col gap-5 pt-4">
                      <div className="grid gap-2">
                        <label className="text-sm font-medium" htmlFor="standard-select">
                          Contrast standard
                        </label>
                        <Select
                          value={standard}
                          onValueChange={(value) => setStandard(value as ContrastStandard)}
                        >
                          <SelectTrigger id="standard-select">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="both">Both (WCAG2 + APCA)</SelectItem>
                            <SelectItem value="wcag2">WCAG 2</SelectItem>
                            <SelectItem value="apca">APCA</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <div className="flex items-baseline justify-between">
                          <span className="text-sm font-medium">WCAG2 min ratio</span>
                          <Badge variant="outline" className="font-mono">
                            {wcagRatio.toFixed(1)}
                          </Badge>
                        </div>
                        <Slider
                          value={[wcagRatio]}
                          min={3}
                          max={7}
                          step={0.1}
                          onValueChange={(values) => {
                            const next = toArray(values)
                            setWcagRatio(Number(next[0] ?? wcagRatio))
                          }}
                        />
                      </div>

                      <div className="grid gap-2">
                        <div className="flex items-baseline justify-between">
                          <span className="text-sm font-medium">APCA min Lc</span>
                          <Badge variant="outline" className="font-mono">
                            {Math.round(apcaLc)}
                          </Badge>
                        </div>
                        <Slider
                          value={[apcaLc]}
                          min={45}
                          max={90}
                          step={1}
                          onValueChange={(values) => {
                            const next = toArray(values)
                            setApcaLc(Math.round(Number(next[0] ?? apcaLc)))
                          }}
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <article className="border border-[var(--line)] bg-white p-2">
          <div className="overflow-auto">
            <div className="min-w-[980px]">
              <table className="w-full border-collapse table-fixed">
                <thead>
                  <tr>
                    <th className="w-[150px]" />
                    {groupSpans.map((group, index) => (
                      <th
                        key={`${group.name}-${index}`}
                        colSpan={group.span}
                        className="border-b border-[var(--line)] pb-1 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-subtle)]"
                      >
                        {group.name}
                      </th>
                    ))}
                  </tr>
                  <tr>
                    <th className="w-[150px] text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-subtle)]">
                      Hue
                    </th>
                    {stepRoles.map((role, index) => (
                      <th key={`step-${index + 1}`} className="w-12 px-0.5 text-center align-bottom leading-tight">
                        <div className="text-xs font-semibold text-[var(--text-strong)]">{index + 1}</div>
                        <div className="text-[10px] text-[var(--text-subtle)]">{role.token}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {scheme.scales.matrix.map((row, rowIndex) => {
                    const rowScale = matrixRows[rowIndex]
                    const lightTextColor = rowScale[textColumnIndexes[0]]
                    const darkTextColor = rowScale[textColumnIndexes[textColumnIndexes.length - 1]]
                    const flipTextColor = rowScale[backgroundColumnIndexes[backgroundColumnIndexes.length - 1]]

                    return (
                      <tr key={row.key}>
                        <th className="w-[150px] py-0.5 pr-2 text-left text-base font-medium text-[var(--text-strong)]">
                          <div className="flex items-center">
                            {row.label}
                            {row.isNeutral ? (
                              <span className="ml-2 border border-[var(--line)] px-1 py-0.5 text-[10px] uppercase tracking-wide text-[var(--text-subtle)]">
                                from source hue
                              </span>
                            ) : null}
                          </div>
                        </th>
                        {rowScale.map((color, index) => {
                          const contrast = contrastOverlay
                            ? getChipContrast({
                                background: color,
                                standard,
                                wcagRatio,
                                apcaLc,
                                lightText: lightTextColor,
                                darkText: darkTextColor,
                                flipText: flipTextColor,
                              })
                            : undefined
                          const chipTitle = `${row.label} ${index + 1}: ${color}${contrast ? ` (${contrast.title})` : ""}`

                          return (
                            <td key={`${row.key}-${index}`} className={grayscaleView ? "p-0" : "p-0.5"}>
                              <div
                                className={[
                                  "h-10 w-full",
                                  grayscaleView ? "" : "border border-black/10",
                                  contrastOverlay ? "flex items-center justify-center overflow-hidden text-center" : "",
                                ]
                                  .filter(Boolean)
                                  .join(" ")}
                                style={{
                                  backgroundColor: color,
                                  filter: grayscaleView ? "grayscale(1)" : undefined,
                                }}
                                title={chipTitle}
                              >
                                {contrast ? (
                                  <span className="grid gap-0.5 leading-none">
                                    <span className="text-[10px] font-semibold" style={{ color: contrast.topForeground }}>
                                      {contrast.topName} {contrast.topLabel}
                                    </span>
                                    <span className="text-[10px] font-semibold" style={{ color: contrast.bottomForeground }}>
                                      {contrast.bottomName} {contrast.bottomLabel}
                                    </span>
                                  </span>
                                ) : null}
                              </div>
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </article>

        <Tabs value={activeView} onValueChange={setActiveView}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="preview">SaaS preview</TabsTrigger>
              <TabsTrigger value="tokens">Generated tokens</TabsTrigger>
            </TabsList>
            <Badge variant="outline" className="font-mono uppercase">
              <ChevronRightIcon className="size-3" />
              {outputMode}
            </Badge>
          </div>

          <TabsContent value="preview" className="mt-3">
            <PreviewThemeProvider scheme={scheme} mode={outputMode} className="w-full">
              <SaasPreview />
            </PreviewThemeProvider>
          </TabsContent>

          <TabsContent value="tokens" className="mt-3">
            <div className="rounded-xl border border-[var(--line)] bg-[#0f172a] p-3 text-slate-200">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white">
                <CodeIcon className="size-3.5" />
                Generated {outputMode} tokens
              </div>
              <pre className="max-h-[480px] overflow-auto text-[11px] leading-5">
                {JSON.stringify(scheme.tokens[outputMode], null, 2)}
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </TooltipProvider>
  )
}
