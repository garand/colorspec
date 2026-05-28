import type { BadgeHueTone } from "#/components/ui/badge.tsx"
import { Badge } from "#/components/ui/badge.tsx"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card.tsx"
import { usePreviewScheme } from "#/components/preview/preview-scheme-context.tsx"

const BADGE_TONES: Array<{ key: BadgeHueTone; label: string; description: string }> = [
  { key: "solid", label: "Solid", description: "Solid fill with on-accent label text." },
  { key: "soft", label: "Soft", description: "10% solid tint with hue text token." },
  { key: "outline", label: "Outline", description: "Hue border and text on transparent fill." },
  { key: "subtle", label: "Subtle", description: "Elevated hue surface with hue text token." },
]

export function BadgeColorGallery() {
  const previewScheme = usePreviewScheme()
  if (!previewScheme) return null

  const rows = previewScheme.scheme.scales.matrix

  return (
    <Card>
      <CardHeader>
        <CardTitle>Badge hue gallery</CardTitle>
        <CardDescription>
          Every hue row in the active scheme, rendered with{" "}
          <code className="font-mono text-[11px]">&lt;Badge hue=&quot;…&quot; tone=&quot;…&quot; /&gt;</code>.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {BADGE_TONES.map((tone) => (
          <div key={tone.key} className="flex flex-col gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {tone.label}
              </p>
              <p className="text-xs text-muted-foreground">{tone.description}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {rows.map((row) => (
                <Badge key={row.key} hue={row.key} tone={tone.key}>
                  {row.label}
                </Badge>
              ))}
            </div>
          </div>
        ))}

        <div className="flex flex-col gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Full matrix
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Compare every hue against every tone side by side.
            </p>
          </div>

          <div className="overflow-x-auto rounded-lg border border-border">
            <div className="min-w-[36rem]">
              <div className="grid grid-cols-[5.5rem_repeat(4,minmax(0,1fr))] gap-2 border-b border-border bg-muted/40 px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                <div aria-hidden="true" />
                {BADGE_TONES.map((entry) => (
                  <div key={entry.key}>{entry.label}</div>
                ))}
              </div>

              {rows.map((row) => (
                <div
                  key={row.key}
                  className="grid grid-cols-[5.5rem_repeat(4,minmax(0,1fr))] items-center gap-2 border-b border-border px-3 py-2 last:border-b-0"
                >
                  <span className="text-xs font-medium text-foreground">{row.label}</span>
                  {BADGE_TONES.map((entry) => (
                    <Badge key={entry.key} hue={row.key} tone={entry.key}>
                      {row.label}
                    </Badge>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
