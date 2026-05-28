import { describe, expect, it } from "vitest"
import { apcaContrastLc } from "../contrast/apca"
import { wcag2ContrastRatio } from "../contrast/wcag2"
import { generateScheme } from "../generate"

function parseLightness(oklchColor: string): number {
  const match = /oklch\(([0-9.]+)/.exec(oklchColor)
  if (!match) {
    throw new Error(`Could not parse OKLCH color: ${oklchColor}`)
  }
  return Number.parseFloat(match[1])
}

function parseChroma(oklchColor: string): number {
  const match = /oklch\([0-9.]+ ([0-9.]+)/.exec(oklchColor)
  if (!match) {
    throw new Error(`Could not parse OKLCH chroma: ${oklchColor}`)
  }
  return Number.parseFloat(match[1])
}

describe("generateScheme", () => {
  it("is deterministic for equal inputs", () => {
    const input = {
      seed: { hue: 210, chroma: 0.14 },
      standard: "both" as const,
      contrastTargets: { wcag2MinRatio: 4.5, apcaMinLc: 60 },
    }
    const a = generateScheme(input)
    const b = generateScheme(input)
    expect(a.scales).toEqual(b.scales)
    expect(a.tokens).toEqual(b.tokens)
  })

  it("produces light-to-dark ramps within each light group", () => {
    const scheme = generateScheme({ seed: { hue: 250, chroma: 0.17 } })

    for (const group of Object.values(scheme.groups.light)) {
      const lightness = group.map(parseLightness)
      for (let i = 1; i < lightness.length; i += 1) {
        expect(lightness[i]).toBeLessThanOrEqual(lightness[i - 1])
      }
    }
  })

  it("creates grouped semantic tokens", () => {
    const scheme = generateScheme({ seed: { hue: 120, chroma: 0.13 } })
    expect(scheme.tokens.light.background.canvas).toMatch(/^oklch\(/)
    expect(scheme.tokens.light.border.focus).toMatch(/^oklch\(/)
    expect(scheme.tokens.light.icon.accent).toMatch(/^oklch\(/)
    expect(scheme.tokens.light.text.muted).toMatch(/^oklch\(/)
    expect(scheme.tokens.light.text.onAccent).toMatch(/^oklch\(/)
  })

  it("uses Radix-like default scale composition", () => {
    const scheme = generateScheme({ seed: { hue: 210, chroma: 0.14 } })
    expect(scheme.groups.light.background).toHaveLength(5)
    expect(scheme.groups.light.border).toHaveLength(3)
    expect(scheme.groups.light.solid).toHaveLength(2)
    expect(scheme.groups.light.icon).toHaveLength(0)
    expect(scheme.groups.light.text).toHaveLength(2)
    expect(scheme.meta.steps).toBe(12)
  })

  it("orders default scale groups from light to dark", () => {
    const scheme = generateScheme({ seed: { hue: 210, chroma: 0.14 } })
    expect(scheme.groups.light.background).toEqual(scheme.scales.neutral.light.slice(0, 5))
    expect(scheme.groups.light.border).toEqual(scheme.scales.neutral.light.slice(5, 8))
    expect(scheme.groups.light.icon).toEqual([])
    expect(scheme.groups.light.solid).toEqual(scheme.scales.accent.light.slice(8, 10))
    expect(scheme.groups.light.text).toEqual(scheme.scales.neutral.light.slice(10, 12))
  })

  it("uses Radix-like default lightness roles", () => {
    const scheme = generateScheme({ seed: { hue: 210, chroma: 0.14 } })
    const backgroundLightness = scheme.groups.light.background.map(parseLightness)
    const borderLightness = scheme.groups.light.border.map(parseLightness)
    const solidLightness = scheme.groups.light.solid.map(parseLightness)
    const textLightness = scheme.groups.light.text.map(parseLightness)

    expect(backgroundLightness[backgroundLightness.length - 1]).toBeGreaterThan(borderLightness[0])
    expect(borderLightness[borderLightness.length - 1]).toBeGreaterThan(solidLightness[0])
    expect(solidLightness[0]).toBeGreaterThan(textLightness[0])
    expect(textLightness[textLightness.length - 1]).toBeLessThan(solidLightness[solidLightness.length - 1])
  })

  it("matches Radix text contrast targets against step 2 backgrounds", () => {
    const scheme = generateScheme({ seed: { hue: 210, chroma: 0.14 } })

    for (const row of scheme.scales.matrix) {
      const step2Background = row.light[1]
      const lowContrastText = row.light[10]
      const highContrastText = row.light[11]

      expect(Math.abs(apcaContrastLc(lowContrastText, step2Background))).toBeGreaterThanOrEqual(60)
      expect(Math.abs(apcaContrastLc(highContrastText, step2Background))).toBeGreaterThanOrEqual(90)
    }
  })

  it("creates hue matrix with neutral first and rainbow rows", () => {
    const scheme = generateScheme({ seed: { hue: 42, chroma: 0.16 }, steps: 10 })
    expect(scheme.scales.matrix[0].key).toBe("neutral")
    expect(scheme.scales.matrix[0].isNeutral).toBe(true)
    expect(scheme.scales.matrix[0].light).toHaveLength(scheme.meta.steps)
    expect(scheme.scales.matrix).toHaveLength(12)
    expect(scheme.scales.matrix[1].key).toBe("red")
    expect(scheme.scales.matrix[11].key).toBe("magenta")
    expect(scheme.scales.matrix[0].chroma).toBeLessThan(scheme.scales.matrix[1].chroma)
  })

  it("meets requested WCAG and APCA thresholds for primary text", () => {
    const scheme = generateScheme({
      seed: { hue: 310, chroma: 0.12 },
      standard: "both",
      contrastTargets: {
        wcag2MinRatio: 4.5,
        apcaMinLc: 60,
      },
    })
    expect(scheme.contrast.light.wcag2Ratio).toBeGreaterThanOrEqual(4.5)
    expect(scheme.contrast.light.apcaLc).toBeGreaterThanOrEqual(60)
  })

  it("keeps contrast calculations finite for saturated generated colors", () => {
    const scheme = generateScheme({ seed: { hue: 245, chroma: 0.14 } })
    const yellowRow = scheme.scales.matrix.find((row) => row.key === "yellow")
    if (!yellowRow) {
      throw new Error("Missing yellow row")
    }

    const darkText = yellowRow.light[yellowRow.light.length - 1]
    expect(Number.isFinite(wcag2ContrastRatio(darkText, yellowRow.light[0]))).toBe(true)
    expect(Number.isFinite(apcaContrastLc(darkText, yellowRow.light[0]))).toBe(true)
  })

  it("supports customizable group sizes", () => {
    const scheme = generateScheme({
      seed: { hue: 210, chroma: 0.14 },
      groupSizes: {
        background: 6,
        text: 5,
        border: 4,
      },
    })
    expect(scheme.groups.light.background).toHaveLength(6)
    expect(scheme.groups.light.text).toHaveLength(5)
    expect(scheme.groups.light.border).toHaveLength(4)
    expect(scheme.meta.steps).toBe(
      scheme.groups.light.background.length +
        scheme.groups.light.border.length +
        scheme.groups.light.solid.length +
        scheme.groups.light.text.length +
        scheme.groups.light.icon.length,
    )
  })

  it("keeps text as the darkest hierarchy over icons", () => {
    const scheme = generateScheme({
      seed: { hue: 210, chroma: 0.14 },
    })

    const bg = scheme.tokens.light.background.canvas
    const iconStrong = scheme.tokens.light.icon.strong
    const textStrong = scheme.tokens.light.text.strong

    expect(wcag2ContrastRatio(textStrong, bg)).toBeGreaterThanOrEqual(wcag2ContrastRatio(iconStrong, bg))
  })

  it("uses the generated icon group for icon tokens", () => {
    const scheme = generateScheme({
      seed: { hue: 210, chroma: 0.14 },
      groupSizes: {
        icon: 2,
      },
    })

    expect(scheme.tokens.light.icon.subtle).toBe(scheme.groups.light.icon[0])
    expect(scheme.tokens.light.icon.default).toBe(scheme.groups.light.icon[1])
  })

  it("falls back to text colors for icon tokens when no icon steps are configured", () => {
    const scheme = generateScheme({
      seed: { hue: 210, chroma: 0.14 },
    })

    expect(scheme.tokens.light.icon.subtle).toBe(scheme.groups.light.text[0])
    expect(scheme.tokens.light.icon.default).toBe(scheme.groups.light.text[1])
  })

  it("keeps Radix-like chroma highest in the solid steps", () => {
    const scheme = generateScheme({
      seed: { hue: 210, chroma: 0.14 },
    })

    const solidChroma = scheme.scales.accent.light.slice(8, 10).map(parseChroma)
    const textChroma = scheme.scales.accent.light.slice(10, 12).map(parseChroma)

    expect(solidChroma[0]).toBeGreaterThanOrEqual(textChroma[0])
    expect(textChroma[0]).toBeGreaterThan(textChroma[1])
  })

  it("uses a darker final text step for high-contrast text", () => {
    const scheme = generateScheme({
      seed: { hue: 210, chroma: 0.14 },
    })

    const textLightness = scheme.groups.light.text.map(parseLightness)

    expect(textLightness[1]).toBeLessThan(textLightness[0] - 0.2)
  })

  it("supports per-hue overrides and group chroma ranges", () => {
    const scheme = generateScheme({
      seed: { hue: 210, chroma: 0.14 },
      hueValues: { red: 0, blue: 220 },
      groupChromaRange: {
        text: { min: 0, max: 0.12 },
      },
    })

    const redRow = scheme.scales.matrix.find((row) => row.key === "red")
    expect(redRow?.hue).toBe(0)
    expect(scheme.groups.light.text.length).toBeGreaterThan(0)
  })

  it("ramps chroma from min to max within each group", () => {
    const scheme = generateScheme({
      seed: { hue: 210, chroma: 0.14 },
      rampProfile: "linear",
      groupSizes: {
        solid: 3,
      },
      groupChromaRange: {
        solid: { min: 0, max: 1.6 },
      },
    })

    const solidChroma = scheme.groups.light.solid.map(parseChroma)
    expect(solidChroma[0]).toBeLessThan(solidChroma[1])
    expect(solidChroma[1]).toBeLessThan(solidChroma[2])
  })

  it("keeps chroma flat within a group when min and max match", () => {
    const scheme = generateScheme({
      seed: { hue: 210, chroma: 0.14 },
      groupChromaRange: {
        solid: { min: 1.6, max: 1.6 },
      },
    })

    const solidChroma = scheme.groups.light.solid.map(parseChroma)
    expect(new Set(solidChroma).size).toBe(1)
  })

  it("supports named ramp profiles", () => {
    const input = {
      seed: { hue: 210, chroma: 0.14 },
      groupSizes: {
        background: 4,
      },
    }

    const linear = generateScheme({ ...input, rampProfile: "linear" })
    const radix = generateScheme({ ...input, rampProfile: "radix" })

    expect(radix.groups.light.background).not.toEqual(linear.groups.light.background)
  })

  it("keeps swatches identical within a group when chroma and lightness ranges are flat", () => {
    const scheme = generateScheme({
      seed: { hue: 210, chroma: 0.14 },
      groupSizes: {
        solid: 3,
      },
      groupChromaRange: {
        solid: { min: 1.6, max: 1.6 },
      },
      groupLightnessRange: {
        solid: { min: 0.5, max: 0.5 },
      },
    })

    expect(new Set(scheme.groups.light.solid).size).toBe(1)
  })
})
