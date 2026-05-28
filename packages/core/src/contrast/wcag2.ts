import { converter } from "culori"

const toRgb = converter("rgb")
const clamp = (value: number) => Math.min(1, Math.max(0, value))

function channelToLinear(value: number): number {
  if (value <= 0.04045) {
    return value / 12.92
  }
  return ((value + 0.055) / 1.055) ** 2.4
}

function relativeLuminance(color: string): number {
  const rgb = toRgb(color)
  if (!rgb || rgb.r === undefined || rgb.g === undefined || rgb.b === undefined) {
    throw new Error(`Unable to convert color to RGB: ${color}`)
  }

  const r = channelToLinear(clamp(rgb.r))
  const g = channelToLinear(clamp(rgb.g))
  const b = channelToLinear(clamp(rgb.b))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function wcag2ContrastRatio(fg: string, bg: string): number {
  const l1 = relativeLuminance(fg)
  const l2 = relativeLuminance(bg)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}
