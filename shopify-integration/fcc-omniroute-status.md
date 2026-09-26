# FCC / OmniRoute bring-up status

**Machine:** LegionSixxx  
**When:** 2026-09-11 17:19 PT  
**Scope:** OmniRoute + Free Claude path smoke (no UI/theme/CSS edits)

## Ports

| Service | Port | Status |
|---------|------|--------|
| OmniRoute | :20128 | **UP** (daemon PID ~36176) — `omniroute serve --port 20128 --no-open --daemon` |
| Ollama | :11434 | **UP** — models include `qwen3.8:latest` + `qwen3.6-64k:latest` |
| FCC tray | :8082 | **UP** (unchanged) — token `freecc` |
| Agent OS Mission Control | :3737 | **UP** — but **admin-slice build** (see blockers) |

## OmniRoute

- Started fresh after backup of undecryptable DB (missing `STORAGE_ENCRYPTION_KEY`).
  - Backup: `C:\Users\mattm\.omniroute\db_backups\pre-fresh-20260911-170657\`
  - New key minted: `C:\Users\mattm\.omniroute\.env` (STORAGE_ENCRYPTION_KEY)
- `GET /healthz` → `ok`
- `GET /v1/models` **requires a valid OmniRoute API key** even with `REQUIRE_API_KEY=false` (OmniRoute 3.8.50 `assertAuth` rejects anonymous CLIENT_API). Keyless probe → 401.
- Created gateway API key name `agent-os-free`; stored in:
  - User env `OMNIROUTE_API_KEY`
  - `~\.omniroute\config.json` (mylocal/default contexts)
  - `~\.claude\settings.json` (ANTHROPIC_API_KEY / AUTH_TOKEN)
  - Agent OS `source\.env` `OMNIROUTE_API_KEY` (process may need restart to load)
- **Smoke OK:** `POST /v1/chat/completions` + `POST /v1/messages` with model `oc/big-pickle` → assistant `Hi` / free pool works.
- Added Ollama provider connection `ollama-local` → `http://127.0.0.1:11434`, default `qwen3.8:latest`. Catalog currently lists few `ollama*` ids (embeddings); full qwen chat ids not yet appearing in `/v1/models` — free pool path works regardless.

## PATH / Claude CLI

- Added `C:\Users\mattm\.local\bin` to **User PATH** (was missing).
- `claude --version` → **2.1.268**
- `claude --bare -p "Say hi in one word"` with OmniRoute env: **HANGS** (>45–60s, killed). Blocker for CLI smoke.
- Anthropic-compatible gateway path itself is fine (messages API smoke OK). Claude settings model set to `oc/big-pickle` for Free Claude alignment.

## Agent OS Free Claude

- Running site on `:3737` returns **404** for `/freeclaude`, `/api/fcc`, `/api/omniroute/status` (HTML “This room is not on the map” — admin-slice only).
- Map’s Free Claude UI lives in pack source `agent-os-pack-2026-08-16\...\src\lib\fcc.ts` / `omniroute.ts`, but **that surface is not served by the process currently on :3737**.
- How to use when a full Agent OS build is running: open `http://127.0.0.1:3737/freeclaude` (sidebar Free Claude). It expects OmniRoute `:20128` via `fccSpawnEnv()` / `omnirouteClaudeEnv()`.
- Minimal **non-UI** probe fix applied in pack source `src\lib\omniroute.ts`: `probeOmniRoute()` now sends `Authorization` / `x-api-key` from `OMNIROUTE_API_KEY` (needed because keyless `/v1/models` 401s). **Requires Agent OS rebuild/restart** of the 08-16 pack to take effect — not applied to the slim :3737 process.

## FCC (optional)

- Left running on `:8082`. Unauthenticated GET → Missing API key; with `freecc` models HTTP 200. Did not change FCC MODEL / did not disrupt OmniRoute-first path.

## Blockers / follow-ups

1. **Claude Code CLI hang** on `--bare -p` despite working `/v1/messages` — needs separate debug (stdio/permissions/model discovery).
2. **Running Agent OS :3737 lacks Free Claude / OmniRoute API routes** — start/serve the 08-16 pack (or whichever build includes `/freeclaude`), with updated `OMNIROUTE_API_KEY`, then re-smoke UI.
3. **Ollama model catalog in OmniRoute** incomplete for chat models after provider add — free `oc/*` path works; pin/sync `ollama/qwen3.8:latest` in OmniRoute dashboard if local-primary desired.
4. Old OmniRoute DB preserved under `db_backups\pre-fresh-*` if encryption key is ever recovered.

## Do-not-touch compliance

- No CSS / theme / redesign / agent-os-pack UI files edited.
- No paid Anthropic keys used.