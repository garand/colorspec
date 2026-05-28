import type { CSSProperties, ReactNode } from "react"
import { useMemo, useState } from "react"
import type { GeneratedScheme } from "@colorspec/core"

import { cn } from "#/lib/utils.ts"
import { buildPreviewVars, type PreviewMode } from "#/components/preview/preview-colors.ts"
import { PreviewPortalContext } from "#/components/preview/preview-portal-context.tsx"
import { PreviewSchemeContext } from "#/components/preview/preview-scheme-context.tsx"

export { buildPreviewVars } from "#/components/preview/preview-colors.ts"

export function PreviewThemeProvider({
  scheme,
  mode,
  children,
  className,
}: {
  scheme: GeneratedScheme
  mode: PreviewMode
  children: ReactNode
  className?: string
}) {
  const cssVars = useMemo(() => buildPreviewVars(scheme, mode), [scheme, mode])
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(null)
  const schemeContext = useMemo(() => ({ scheme, mode }), [scheme, mode])

  return (
    <PreviewSchemeContext.Provider value={schemeContext}>
      <PreviewPortalContext.Provider value={portalContainer}>
        <div
          ref={setPortalContainer}
          data-preview-root=""
          data-mode={mode}
          className={cn(
            mode === "dark" ? "dark" : "",
            "bg-background text-foreground",
            className,
          )}
          style={cssVars as CSSProperties}
        >
          {children}
        </div>
      </PreviewPortalContext.Provider>
    </PreviewSchemeContext.Provider>
  )
}
