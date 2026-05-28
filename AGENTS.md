<!-- intent-skills:start -->
## Skill Loading

Before substantial work:
- Skill check: run `npx @tanstack/intent@latest list`, or use skills already listed in context.
- Skill guidance: if one local skill clearly matches the task, run `npx @tanstack/intent@latest load <package>#<skill>` and follow the returned `SKILL.md`.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->

## Project Bootstrap Context (Durable)

### Exact Commands Run
- Initial scaffold command (as requested): `npx @tanstack/cli@latest create my-tanstack-app --agent`
- Follow-up TanStack Intent commands:
  - `npx @tanstack/intent@latest install`
  - `npx @tanstack/intent@latest list`

### Chosen Stack and Integrations
- Framework: TanStack Start (React)
- Styling: Tailwind CSS (v4 via `tailwindcss` + `@tailwindcss/vite`)
- Router: TanStack Router (`@tanstack/react-router`)
- Tooling: Vite + TypeScript + Vitest
- Package manager target: `pnpm` (dependencies installed with `pnpm install`; `pnpm-lock.yaml` is source of truth)
- Add-ons: none intentionally selected beyond the default blank template dependencies emitted by TanStack CLI

### Root Layout Decision
- CLI generated into `my-tanstack-app/`; project files were merged into repository root to satisfy the brief that code must live at root.
- Nested scaffold `.git` metadata was excluded during merge to preserve the parent repository history.

### Environment Variables
- No app-required runtime variables are needed for the blank starter.
- Optional:
  - `TANSTACK_CLI_TELEMETRY_DISABLED=1` to disable TanStack CLI telemetry.
  - Use Vite public env vars with `VITE_` prefix only.

### Deployment Notes
- This starter builds with `vite build` and previews with `vite preview`.
- Common platforms for TanStack Start include Vercel, Netlify, Cloudflare, Node/Docker, Bun, and Railway; pick adapter/runtime strategy before first deploy.
- Ensure production environment variables are configured in platform settings (especially `VITE_` vars intended for client exposure).

### Key Architectural Decisions
- Keep the generated filesystem route structure and plugin setup from TanStack CLI defaults.
- Preserve TanStack Intent skill-loading instructions at the top of this file for future agent-driven changes.
- Standardize on `pnpm` lockfile workflow (`pnpm-lock.yaml`), and do not re-introduce `package-lock.json`.

### Known Gotchas
- `create --agent` scaffold installed dependencies via npm in this run; explicitly re-installed with pnpm to align with project preference.
- Local machine `.npmrc` may reference `${GITHUB_TOKEN}`; pnpm can warn if undefined.
- If running TanStack commands in constrained sandboxes, writes to `~/.config/tanstack` can fail without elevated permissions.

### Recommended Next Steps
- Run `pnpm dev` and verify local startup.
- If further TanStack work is requested, run `npx @tanstack/intent@latest list` and load the most specific skill before implementation.
- Add CI steps for `pnpm install --frozen-lockfile`, `pnpm test`, and `pnpm build`.
