import { createContext, useContext } from "react"
import type { GeneratedScheme } from "@colorspec/core"

import type { PreviewMode } from "#/components/preview/preview-colors.ts"

export type PreviewSchemeContextValue = {
  scheme: GeneratedScheme
  mode: PreviewMode
}

export const PreviewSchemeContext = createContext<PreviewSchemeContextValue | null>(null)

export function usePreviewScheme() {
  return useContext(PreviewSchemeContext)
}
