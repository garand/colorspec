# Colorspec

Colorspec is an OKLCH-based color-system generator that outputs a framework-agnostic config object with semantic token groups and accessibility-aware constraints.

## Workspace Structure

- `packages/core`: publishable generation library (`@colorspec/core`)
- `apps/docs`: TanStack Start docs + interactive playground

## Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm test
pnpm lint
```

## Core API

`@colorspec/core` exposes:

- `generateScheme(input)`
- `wcag2ContrastRatio(fg, bg)`
- `apcaContrastLc(fg, bg)`

`generateScheme` accepts:

- a seed (`hue`, `chroma`)
- contrast standard (`wcag2`, `apca`, or `both`)
- optional thresholds (`wcag2MinRatio`, `apcaMinLc`)

And returns:

- light/dark accent and neutral scales
- semantic token groups (`background`, `border`, `icon`, `text`)
- contrast report metadata

## v1 Scope

v1 focuses on `packages/core` and docs playground. Future wrappers (Tailwind, React hooks) can be layered on top of the generated config object.
