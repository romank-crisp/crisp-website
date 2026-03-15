---
description: Capture a component's live UI and send it to Figma via Claude Code MCP
---

# Capture Component to Figma

## Prerequisites
- The user's dev server is already running on `localhost:3000` — do NOT start or stop it.
- Claude Code is installed globally (`@anthropic-ai/claude-code`).
- The `figma-remote` MCP server is configured in `~/.claude.json`.

## Steps

### 1. Create a temporary preview page

Create a preview route at `src/app/preview/<component-name>/page.tsx` that:
- Fetches any required JSON data via `readContent()`
- Renders the target component in a client wrapper
- Wraps with any required providers (e.g. `ContactFormProvider`)
- Does **NOT** include the preloader — render outside `GlobalLayout` if needed
- Sets appropriate background color to match production context

Example structure:
```
src/app/preview/<component-name>/
  ├── page.tsx           (server component — data fetching)
  └── preview-client.tsx (client component — renders the block)
```

### 2. Verify the preview page loads

Open `http://localhost:3000/preview/<component-name>` in the browser to confirm it renders correctly.

### 3. Launch Claude Code and capture

// turbo
```bash
claude --resume e505cff9-8350-4460-8fdb-43a380498dc4
```

Send this prompt to Claude Code (adjust the URL and component name):

```
The dev server is already running on localhost:3000. Do NOT start or stop it.
Inject the Figma capture script into layout.tsx, capture http://localhost:3000/preview/<component-name>, and send to this Figma file:
https://www.figma.com/design/acjjnxwAAEAt0oeuTmiPY6/Productized
After capture completes, remove the capture script from layout.tsx. Do NOT stop the dev server.
```

### 4. Approve prompts in Claude Code

Claude Code will ask to:
1. Edit `layout.tsx` (inject capture script) → approve
2. Open browser with capture hash → approve
3. Poll capture status → approve
4. Edit `layout.tsx` (remove capture script) → approve

### 5. Fix indentation in layout.tsx

Claude Code tends to break the indentation on line 58 when removing the capture script. After it finishes, fix the `<Script` tag indentation if needed.

### 6. Clean up

- Delete the temporary preview directory: `rm -rf src/app/preview/<component-name>`
- Exit Claude Code: `/exit`

### 7. Verify in Figma

Open the Figma link from Claude Code's output to verify the captured design.
