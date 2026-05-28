import { converter } from "culori"

const toRgb = converter("rgb")
const clamp = (value: number) => Math.min(1, Math.max(0, value))

function toDisplayLightness(color: string): number {
  const rgb = toRgb(color)
  if (!rgb || rgb.r === undefined || rgb.g === undefined || rgb.b === undefined) {
    throw new Error(`Unable to convert color to RGB: ${color}`)
  }

  const r = clamp(rgb.r)
  const g = clamp(rgb.g)
  const b = clamp(rgb.b)

  return 0.2126729 * r ** 2.4 + 0.7151522 * g ** 2.4 + 0.072175 * b ** 2.4
}

export function apcaContrastLc(fg: string, bg: string): number {
  const txtY = toDisplayLightness(fg)
  const bgY = toDisplayLightness(bg)
  const polarity = bgY > txtY ? 1 : -1
  const contrast = Math.abs(bgY ** 0.56 - txtY ** 0.57) * 100
  return contrast * polarity
}
