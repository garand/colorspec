import { useMemo, useState } from "react"
import { Popover } from "@base-ui/react/popover"
import { Slider } from "@base-ui/react/slider"
import { apcaContrastLc, generateScheme, wcag2ContrastRatio } from "@colorspec/core"
import type { ContrastStandard, RampProfileName } from "@colorspec/core"

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
const RAMP_PROFILES: Array<{ value: RampProfileName; label: string; description: string }> = [
  { value: "radix", label: "Radix-like", description: "Subtle early steps, saturated upper steps, and a darker final text step." },
  { value: "linear", label: "Linear", description: "Even movement from min to max within each group." },
  { value: "soft", label: "Soft", description: "Gentler chroma shifts for quieter palettes." },
  { value: "punchy", label: "Punchy", description: "Faster chroma build for louder accents." },
  { value: "contrast", label: "Contrast", description: "Holds lighter values longer, then drops harder for readability." },
]
type GroupKey = (typeof GROUP_KEYS)[number]
type ChromaRangeState = Record<GroupKey, { min: number; max: number }>
type LightnessRangeState = Record<GroupKey, { min: number; max: number }>
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
  if (standard === "wcag2") {
    return stats.wcag2 >= wcagRatio
  }

  if (standard === "apca") {
    return stats.apca >= apcaLc
  }

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

function SingleSlider({
  value,
  min,
  max,
  step,
  onChange,
  label,
}: {
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
  label: string
}) {
  return (
    <Slider.Root
      value={[value]}
      min={min}
      max={max}
      step={step}
      onValueChange={(next) => {
        const values = Array.isArray(next) ? next : [next]
        onChange(Number(values[0]))
      }}
    >
      <Slider.Control className="h-4 w-full touch-none">
        <Slider.Track className="relative h-1.5 rounded-full bg-slate-200">
          <Slider.Indicator className="absolute h-full rounded-full bg-slate-700" />
          <Slider.Thumb
            index={0}
            aria-label={label}
            className="block h-3 w-3 rounded-full border border-slate-700 bg-white shadow-sm outline-none focus:ring-2 focus:ring-slate-400"
          />
        </Slider.Track>
      </Slider.Control>
    </Slider.Root>
  )
}

function RangeSlider({
  value,
  min,
  max,
  step,
  onChange,
  minLabel,
  maxLabel,
}: {
  value: [number, number]
  min: number
  max: number
  step: number
  onChange: (value: [number, number]) => void
  minLabel: string
  maxLabel: string
}) {
  return (
    <Slider.Root
      value={value}
      min={min}
      max={max}
      step={step}
      onValueChange={(next) => {
        const values = Array.isArray(next) ? next : [next, next]
        onChange([Number(values[0]), Number(values[1])])
      }}
    >
      <Slider.Control className="h-4 w-full touch-none">
        <Slider.Track className="relative h-1.5 rounded-full bg-slate-200">
          <Slider.Indicator className="absolute h-full rounded-full bg-slate-700" />
          <Slider.Thumb
            index={0}
            aria-label={minLabel}
            className="block h-3 w-3 rounded-full border border-slate-700 bg-white shadow-sm outline-none focus:ring-2 focus:ring-slate-400"
          />
          <Slider.Thumb
            index={1}
            aria-label={maxLabel}
            className="block h-3 w-3 rounded-full border border-slate-700 bg-white shadow-sm outline-none focus:ring-2 focus:ring-slate-400"
          />
        </Slider.Track>
      </Slider.Control>
    </Slider.Root>
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
      ...scheme.groups.light.background.map((_, index) => ({
        group: "background",
        token: `bg${index + 1}`,
      })),
      ...scheme.groups.light.border.map((_, index) => ({
        group: "border",
        token: `border${index + 1}`,
      })),
      ...scheme.groups.light.icon.map((_, index) => ({
        group: "icon",
        token: `icon${index + 1}`,
      })),
      ...scheme.groups.light.solid.map((_, index) => ({
        group: "solid",
        token: `solid${index + 1}`,
      })),
      ...scheme.groups.light.text.map((_, index) => ({
        group: "text",
        token: `text${index + 1}`,
      })),
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

  return (
    <section className="grid gap-2 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="border border-[var(--line)] bg-white p-3">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--text-strong)]">Config</h2>
        <label className="mb-3 block">
          <span className="mb-1 block text-sm text-[var(--text-subtle)]">Neutral source hue row</span>
          <select
            value={neutralSource}
            onChange={(event) => setNeutralSource(event.currentTarget.value as (typeof HUE_OPTIONS)[number]["key"])}
            className="w-full border border-[var(--line)] bg-transparent px-2 py-1.5"
          >
            {HUE_OPTIONS.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="mb-3 block">
          <span className="mb-1 block text-sm text-[var(--text-subtle)]">Ramp profile</span>
          <select
            value={rampProfile}
            onChange={(event) => setRampProfile(event.currentTarget.value as RampProfileName)}
            className="w-full border border-[var(--line)] bg-transparent px-2 py-1.5"
          >
            {RAMP_PROFILES.map((profile) => (
              <option key={profile.value} value={profile.value}>
                {profile.label}
              </option>
            ))}
          </select>
          <span className="mt-1 block text-[11px] leading-4 text-[var(--text-subtle)]">
            {RAMP_PROFILES.find((profile) => profile.value === rampProfile)?.description}
          </span>
        </label>
        <label className="mb-3 flex items-start gap-2 border border-[var(--line)] p-2">
          <input
            type="checkbox"
            checked={grayscaleView}
            onChange={(event) => setGrayscaleView(event.currentTarget.checked)}
            className="mt-0.5"
          />
          <span>
            <span className="block text-sm text-[var(--text-strong)]">Grayscale view</span>
            <span className="block text-[11px] leading-4 text-[var(--text-subtle)]">
              Hide chip borders and gaps, then grayscale the palette for value comparison.
            </span>
          </span>
        </label>
        <label className="mb-3 flex items-start gap-2 border border-[var(--line)] p-2">
          <input
            type="checkbox"
            checked={contrastOverlay}
            onChange={(event) => setContrastOverlay(event.currentTarget.checked)}
            className="mt-0.5"
          />
          <span>
            <span className="block text-sm text-[var(--text-strong)]">Contrast overlay</span>
            <span className="block text-[11px] leading-4 text-[var(--text-subtle)]">
              Show light and dark text contrast; flips to darkest background where dark text fails.
            </span>
          </span>
        </label>
        <label className="mb-3 block">
          <span className="mb-1 block text-sm text-[var(--text-subtle)]">Background token count ({bgCount})</span>
          <input
            type="range"
            min={1}
            max={8}
            step={1}
            value={bgCount}
            onChange={(event) => setBgCount(Number(event.currentTarget.value))}
            className="w-full"
          />
        </label>
        <label className="mb-3 block">
          <span className="mb-1 block text-sm text-[var(--text-subtle)]">Text token count ({textCount})</span>
          <input
            type="range"
            min={1}
            max={8}
            step={1}
            value={textCount}
            onChange={(event) => setTextCount(Number(event.currentTarget.value))}
            className="w-full"
          />
        </label>
        <label className="mb-3 block">
          <span className="mb-1 block text-sm text-[var(--text-subtle)]">Border token count ({borderCount})</span>
          <input
            type="range"
            min={1}
            max={8}
            step={1}
            value={borderCount}
            onChange={(event) => setBorderCount(Number(event.currentTarget.value))}
            className="w-full"
          />
        </label>
        <label className="mb-3 block">
          <span className="mb-1 block text-sm text-[var(--text-subtle)]">Solid token count ({solidCount})</span>
          <input
            type="range"
            min={1}
            max={8}
            step={1}
            value={solidCount}
            onChange={(event) => setSolidCount(Number(event.currentTarget.value))}
            className="w-full"
          />
        </label>
        <label className="mb-3 block">
          <span className="mb-1 block text-sm text-[var(--text-subtle)]">Icon token count ({iconCount})</span>
          <input
            type="range"
            min={0}
            max={8}
            step={1}
            value={iconCount}
            onChange={(event) => setIconCount(Number(event.currentTarget.value))}
            className="w-full"
          />
        </label>
        <Popover.Root>
          <Popover.Trigger className="mb-3 inline-flex w-full items-center justify-center border border-[var(--line)] px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--text-strong)]">
            Advanced controls
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Positioner sideOffset={8}>
              <Popover.Popup className="w-[460px] max-w-[90vw] border border-[var(--line)] bg-white p-3 shadow-xl">
                <Popover.Title className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-strong)]">
                  Chroma ranges and hue values
                </Popover.Title>
                <div className="grid gap-3">
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--text-subtle)]">
                      Group lightness min/max
                    </p>
                    <p className="mb-2 text-[11px] leading-4 text-[var(--text-subtle)]">
                      Min is darkest, max is lightest; scales render light-to-dark.
                    </p>
                    {GROUP_KEYS.map((group) => (
                      <div key={`${group}-lightness-range`} className="mb-2 grid grid-cols-[110px_1fr_72px] items-center gap-2">
                        <span className="text-xs capitalize text-[var(--text-subtle)]">{group}</span>
                        <RangeSlider
                          minLabel={`${group} min lightness`}
                          maxLabel={`${group} max lightness`}
                          value={[groupLightnessRange[group].min, groupLightnessRange[group].max]}
                          min={0}
                          max={1}
                          step={0.01}
                          onChange={([min, max]) =>
                            setGroupLightnessRange((previous) => ({
                              ...previous,
                              [group]: { min: Math.min(min, max), max: Math.max(min, max) },
                            }))
                          }
                        />
                        <span className="text-xs text-[var(--text-subtle)]">
                          {groupLightnessRange[group].min.toFixed(2)}-{groupLightnessRange[group].max.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--text-subtle)]">
                      Group chroma min/max
                    </p>
                    <p className="mb-2 text-[11px] leading-4 text-[var(--text-subtle)]">
                      Equal min/max keeps chroma flat; lightness still changes across the scale.
                    </p>
                    {GROUP_KEYS.map((group) => (
                      <div key={`${group}-range`} className="mb-2 grid grid-cols-[110px_1fr_72px] items-center gap-2">
                        <span className="text-xs capitalize text-[var(--text-subtle)]">{group}</span>
                        <RangeSlider
                          minLabel={`${group} min chroma`}
                          maxLabel={`${group} max chroma`}
                          value={[groupChromaRange[group].min, groupChromaRange[group].max]}
                          min={0}
                          max={1.6}
                          step={0.01}
                          onChange={([min, max]) =>
                            setGroupChromaRange((previous) => ({
                              ...previous,
                              [group]: { min: Math.min(min, max), max: Math.max(min, max) },
                            }))
                          }
                        />
                        <span className="text-xs text-[var(--text-subtle)]">
                          {groupChromaRange[group].min.toFixed(2)}-{groupChromaRange[group].max.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-subtle)]">Hue values by row</p>
                    {HUE_OPTIONS.map((option) => (
                      <div key={`${option.key}-hue`} className="mb-2 grid grid-cols-[110px_1fr_44px] items-center gap-2">
                        <span className="text-xs text-[var(--text-subtle)]">{option.label}</span>
                        <SingleSlider
                          label={`${option.label} hue`}
                          value={hueValues[option.key] ?? option.hue}
                          min={0}
                          max={360}
                          step={1}
                          onChange={(value) =>
                            setHueValues((previous) => ({
                              ...previous,
                              [option.key]: value,
                            }))
                          }
                        />
                        <span className="text-xs text-[var(--text-subtle)]">{Math.round(hueValues[option.key] ?? option.hue)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
        <div className="mb-3 border border-[var(--line)] px-2 py-1.5 text-xs text-[var(--text-subtle)]">
          Total steps: {totalSteps}
        </div>
        <label className="mb-3 block">
          <span className="mb-1 block text-sm text-[var(--text-subtle)]">Standard</span>
          <select
            value={standard}
            onChange={(event) => setStandard(event.currentTarget.value as ContrastStandard)}
            className="w-full border border-[var(--line)] bg-transparent px-2 py-1.5"
          >
            <option value="both">both</option>
            <option value="wcag2">wcag2</option>
            <option value="apca">apca</option>
          </select>
        </label>
        <label className="mb-3 block">
          <span className="mb-1 block text-sm text-[var(--text-subtle)]">WCAG2 min ratio ({wcagRatio.toFixed(1)})</span>
          <input
            type="range"
            min={3}
            max={7}
            step={0.1}
            value={wcagRatio}
            onChange={(event) => setWcagRatio(Number(event.currentTarget.value))}
            className="w-full"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm text-[var(--text-subtle)]">APCA min Lc ({apcaLc})</span>
          <input
            type="range"
            min={45}
            max={90}
            step={1}
            value={apcaLc}
            onChange={(event) => setApcaLc(Number(event.currentTarget.value))}
            className="w-full"
          />
        </label>
      </aside>

      <div className="space-y-2">
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
                  {scheme.scales.matrix.map((row) => {
                    const lightTextColor = row.light[textColumnIndexes[0]]
                    const darkTextColor = row.light[textColumnIndexes[textColumnIndexes.length - 1]]
                    const flipTextColor = row.light[backgroundColumnIndexes[backgroundColumnIndexes.length - 1]]

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
                        {row.light.map((color, index) => {
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

        <article className="border border-[var(--line)] bg-[#0f172a] p-2">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-white">Generated config object</h2>
          <pre className="max-h-[320px] overflow-auto text-[11px] text-slate-200">
            {JSON.stringify(scheme, null, 2)}
          </pre>
        </article>
      </div>
    </section>
  )
}
