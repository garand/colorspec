import type { CSSProperties } from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "#/lib/utils.ts"

export type BadgeHueTone = "solid" | "soft" | "outline" | "subtle"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 text-destructive-text focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20 [&>svg]:text-current",
        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

const badgeHueToneVariants = cva("", {
  variants: {
    tone: {
      solid:
        "border-transparent bg-[var(--badge-hue-solid)] text-[var(--badge-hue-on-solid)] [a]:hover:opacity-90 [&>svg]:text-current",
      soft:
        "border-transparent bg-[color-mix(in_oklab,var(--badge-hue-solid)_10%,transparent)] text-[var(--badge-hue-text)] focus-visible:ring-[color-mix(in_oklab,var(--badge-hue-solid)_20%,transparent)] dark:bg-[color-mix(in_oklab,var(--badge-hue-solid)_20%,transparent)] [a]:hover:bg-[color-mix(in_oklab,var(--badge-hue-solid)_20%,transparent)] [&>svg]:text-current",
      outline:
        "border border-[var(--badge-hue-border)] bg-transparent text-[var(--badge-hue-text)] [a]:hover:bg-[color-mix(in_oklab,var(--badge-hue-solid)_10%,transparent)] [&>svg]:text-current",
      subtle:
        "border-transparent bg-[var(--badge-hue-surface)] text-[var(--badge-hue-text)] [a]:hover:opacity-90 [&>svg]:text-current",
    },
  },
  defaultVariants: {
    tone: "solid",
  },
})

function badgeHueStyle(hue: string): CSSProperties {
  return {
    "--badge-hue-solid": `var(--hue-${hue}-solid)`,
    "--badge-hue-text": `var(--hue-${hue}-text)`,
    "--badge-hue-border": `var(--hue-${hue}-border)`,
    "--badge-hue-surface": `var(--hue-${hue}-surface)`,
    "--badge-hue-on-solid": `var(--hue-${hue}-on-solid)`,
  } as CSSProperties
}

function Badge({
  className,
  variant = "default",
  hue,
  tone = "solid",
  style,
  render,
  ...props
}: useRender.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    hue?: string
    tone?: BadgeHueTone
  }) {
  const usesHue = Boolean(hue)

  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(
          badgeVariants({ variant: usesHue ? null : variant }),
          usesHue && badgeHueToneVariants({ tone }),
          className,
        ),
        style: usesHue ? { ...badgeHueStyle(hue!), ...style } : style,
      },
      props,
    ),
    render,
    state: {
      slot: "badge",
      variant: usesHue ? undefined : variant,
      hue,
      tone: usesHue ? tone : undefined,
    },
  })
}

export { Badge, badgeVariants, badgeHueToneVariants }
