import { createContext, useContext } from "react"

export const PreviewPortalContext = createContext<HTMLElement | null>(null)

export function usePreviewPortalContainer() {
  return useContext(PreviewPortalContext)
}
