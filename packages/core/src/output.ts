import type { GeneratedScheme, SchemeInput } from "./types"

export interface GenerationDiagnostics {
  adjustedForContrast: boolean
  notes: string[]
}

export function withOutputMetadata(
  input: SchemeInput,
  scheme: Omit<GeneratedScheme, "meta">,
  diagnostics: GenerationDiagnostics,
): GeneratedScheme & { diagnostics: GenerationDiagnostics } {
  return {
    meta: {
      name: input.name ?? "colorspec-scheme",
      standard: input.standard ?? "both",
      steps: scheme.scales.matrix[0]?.light.length ?? 12,
      contrastTargets: {
        wcag2MinRatio: input.contrastTargets?.wcag2MinRatio ?? 4.5,
        apcaMinLc: input.contrastTargets?.apcaMinLc ?? 60,
      },
      generatedAt: new Date().toISOString(),
    },
    ...scheme,
    diagnostics,
  }
}
