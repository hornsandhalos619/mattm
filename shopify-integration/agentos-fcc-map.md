# Agent OS ↔ Free Claude Code / Ollama / OmniRoute Map

**Machine:** LegionSixxx (`ac535892-696b-41ac-aa78-9cb754910a32`) · Windows · user `mattm`  
**Mapped:** 2026-09-11 ~17:00 PT (read-only investigation)  
**Goal:** Working FREE Claude Code for HA.OS via Ollama local + free cloud, through fcc-server and/or OmniRoute.

---

## 1. What exists (inventory)

### Claude Code CLI
| Item | Status |
|------|--------|
| Binary | **Installed:** `C:\Users\mattm\.local\bin\claude.exe` |
| Version | **2.1.268** (Claude Code) |
| On PATH? | **NO** — User PATH does not include `~\.local\bin`; `Get-Command claude` fails |
| npm `@anthropic-ai/claude-code` | Not in global npm list |
| Downloads cache | `~\.claude\downloads\claude-2.1.258-win32-x64.exe` (+ older 2.1.210) |
| Desktop/App packages | `AppData\Local\Claude`, `Claude-3p`, `claude-cli-nodejs`, Store package present |
| Settings | `~\.claude\settings.json` already points Claude at **OmniRoute** |

Current `~\.claude\settings.json` env (no secrets):
```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "http://localhost:20128",
    "ANTHROPIC_API_KEY": "free-local",
    "ANTHROPIC_AUTH_TOKEN": "free-local",
    "ANTHROPIC_MODEL": "ollama-local/qwen3.8:latest",
    "ANTHROPIC_SMALL_FAST_MODEL": "ollama-local/qwen3.8:latest",
    "MAX_THINKING_TOKENS": "0",
    "CLAUDE_CODE_DISABLE_UNKNOWN_MODEL_WINDOW_ENFORCEMENT": "1"
  },
  "model": "haiku"
}
```

### Ollama
| Item | Status |
|------|--------|
| Install | `C:\Users\mattm\AppData\Local\Programs\Ollama\ollama.exe` |
| Version | **0.34.0** |
| Running | **YES** — PID listening `127.0.0.1:11434` |
| Env | `OLLAMA_GPU_LAYERS=-1`, `KEEP_ALIVE=30m`, `MAX_LOADED_MODELS=2`, `NUM_PARALLEL=4` |

**Installed models (`ollama list`):**

| Model | Size | Tools? | Notes |
|-------|------|--------|-------|
| `qwen3.8:latest` | 17 GB | tools+thinking+vision | **Best coding pick present** (registry tags coding) |
| `qwen3.6-64k:latest` | 23 GB | tools+thinking+vision | Long context (262K); FCC default |
| `qwen3.6:latest` | 22 GB | tools+thinking+vision | Hermes delegation model |
| `qwen3.6:27b` | 17 GB | tools+thinking+vision | Smaller 27B sibling |
| `qwen3:8b` | 5.2 GB | tools+thinking | Fast local |
| `qwen:latest` | 2.3 GB | completion | Lightweight |
| `glm-4.7-flash:latest` | 19 GB | tools+thinking | Strong reasoning alt |
| `gemma4:12b` | 7.6 GB | tools+thinking+vision | Hermes default in config |
| `gemma2:2b` | 1.6 GB | completion | Tiny fallback |
| `nemotron:latest` | 42 GB | tools | Heavy; creative routing |
| `mirage335/NVIDIA-Nemotron-Nano-9B-v2-virtuoso` | 9.1 GB | completion | Fast/long-context |
| `nomic-embed-text:latest` | 274 MB | embedding | Memory/embeddings |
| `nemotron-3-super:cloud` | cloud stub | — | ollama.com remote |

**Not present:** `qwen2.5-coder`, `deepseek-coder`, `codellama` — **do not need to pull** unless you want a dedicated coder GGUF; `qwen3.8:latest` already covers coding + tools.

**Disk:** ~196 GB free on C: — room for pulls if parent wants, but not required.

### FCC / free-claude-code
| Item | Status |
|------|--------|
| npm package | Local in `C:\Users\mattm\HA.OS\package.json` → `free-claude-code@2.0.0` |
| Launcher | `HA.OS\node_modules\.bin\fcc` |
| Windows tray app | `%LOCALAPPDATA%\fcc-npm\versions\2.0.0\Free Claude Code\Free Claude Code.exe` |
| Process | **RUNNING** (PID ~22628) |
| Port | **`:8082` LISTENING** (`0.0.0.0:8082`) |
| Config | `C:\Users\mattm\.fcc\.env` |
| Active MODEL | `ollama/qwen3.6-64k` |
| Auth token (in .env) | `ANTHROPIC_AUTH_TOKEN=freecc` |
| Unauthenticated GET `/` | `{"detail":"Missing API key"}` (alive, needs key) |
| Docs | `HA.OS\fcc-server-setup.md`; install guide `agent-os-pack-2026-07-13\...\install\5-FREE-CLAUDE-CODE.md` |
| Toggle | `~\.agentic-os\fcc.json` → `{ "enabled": true }` |

Provider keys in `~\.fcc\.env` (presence only, values redacted):
- NVIDIA_NIM: present · OPENCODE: present · OPENROUTER: **empty** · Gemini/DeepSeek/Groq/etc: empty
- OLLAMA_BASE_URL=`http://localhost:11434`

### OmniRoute
| Item | Status |
|------|--------|
| npm global | **`omniroute@3.8.50`** installed (`AppData\Roaming\npm`) |
| Also installed | `claude-code-router@2.1.1`, `openclaw`, `opencode-ai`, `qwen-code` |
| Process / port `:20128` | **NOT RUNNING** (no LISTENING) |
| Package path | `...\npm\node_modules\omniroute\` (has `.env` with JWT/API_KEY secrets set) |
| User env | `OMNIROUTE_MANAGEMENT_PASSWORD` present in environment |
| Docs | `install\28-OMNIROUTE.md` |
| Workspace | `~\.agentic-os\omniroute-workspace` |

### Agent OS (HA.OS)
| Item | Path / Status |
|------|----------------|
| Pack (current) | `C:\Users\mattm\HA.OS\agent-os-pack-2026-08-16\agent-os\source` |
| Older pack | `...\agent-os-pack-2026-07-13\...` (same API surface) |
| Running | **YES** — Mission Control on `http://127.0.0.1:3737` |
| `.env` | Points to Ollama `:11434`, OmniRoute `:20128`, FCC `:8082`, Hermes, OpenClaw |
| Free Claude UI | Sidebar → `/freeclaude` |
| OmniRoute UI | Sidebar → `/omniroute` ("Free AI Coder") |
| Local UI | `/local` |

**Critical code fact (08-16 source):** Agent OS **Free Claude Code panel no longer uses FCC `:8082`**.  
`src/lib/fcc.ts` + `src/lib/omniroute.ts` hard-wire Free Claude to **OmniRoute `:20128`**:
- `probeReachable()` → `probeOmniRoute()` (checks `http://localhost:20128/v1/models`)
- `fccSpawnEnv()` → `omnirouteClaudeEnv()` (`ANTHROPIC_BASE_URL=http://localhost:20128`, key `free-local`, model default `oc/big-pickle`)
- Comments explicitly say fcc-server is "retired" for this panel (even though FCC.exe is still running locally)

API routes present:
- `/api/fcc` — toggle/state (reports OmniRoute reachability)
- `/api/freeclaude/chat|workspace|build|...` — spawns `claude --bare -p ...` with OmniRoute env
- `/api/omniroute/status|chat|workspace` — direct free-provider gateway

### Hermes
| Item | Status |
|------|--------|
| Install | `C:\Users\mattm\AppData\Local\hermes\` (+ `hermes-agent`, bin `hermes.exe`) |
| Config | `config.yaml` — primary **Ollama** (`base_url http://127.0.0.1:11434/v1`, default `gemma4:12b`, provider `ollama-launch`) |
| Delegation | `qwen3.6:latest` / Ollama |
| Fallbacks | opencode-free, MOA (OpenRouter / openai-codex mix — some paid/cloud) |
| Agent OS room | `~\.agentic-os\config.json` roomAgents → hermes/openclaw on `ollama` / `qwen3.6-64k` |

### Other related
- OpenClaw gateway listening `:18789`
- Model registry: `~\.agentic-os\model-registry.json` — coding primary = `qwen3.8:latest`
- `HA.OS\ollama_webhook.py` present

---

## 2. Recommended architecture (5 bullets)

1. **Primary free path for Agent OS Free Claude panel:** keep OmniRoute as the Anthropic-compatible gateway on `:20128` (this is what the 08-16 code already expects). Start it and leave it running; Free Claude / Claude CLI / Codex can all talk to it.
2. **Local coding brain:** bind OmniRoute’s Ollama provider to **`qwen3.8:latest`** (coding + tools) with fallback **`qwen3.6-64k:latest`** for long context — already on disk; Claude settings already name `ollama-local/qwen3.8:latest`.
3. **Free cloud overflow:** use OmniRoute free pool (`oc/big-pickle`, `auto/coding:free`, `auto/best-free`) when local GPU is busy or for variety — zero Anthropic spend; OpenRouter `:free` only if you add a free OpenRouter key later (optional, rate-limited).
4. **FCC `:8082` as optional local Anthropic shim:** keep Free Claude Code tray app for direct `ANTHROPIC_BASE_URL=http://127.0.0.1:8082` + token `freecc` when you want **Ollama-only** Claude Code without OmniRoute (MODEL already `ollama/qwen3.6-64k`). Agent OS UI will still prefer OmniRoute unless code is changed.
5. **Do not buy Anthropic credits** for this path; prefer Ollama unlimited local + OmniRoute free providers. Optional $0 OpenRouter account only if you want named `:free` models and accept daily free-tier limits.

```
┌─────────────┐     ANTHROPIC_BASE_URL      ┌──────────────────┐
│ Claude Code │ ───────────────────────────►│ OmniRoute :20128 │──┬─► free cloud providers
│ 2.1.268     │   key: free-local           │ (Anthropic+OAI)  │  └─► Ollama :11434
└─────────────┘                             └──────────────────┘         (qwen3.8 / 3.6-64k)
       ▲                                              ▲
       │ spawn --bare                                 │ /api/freeclaude, /api/omniroute
┌──────┴──────┐                                       │
│ Agent OS    │───────────────────────────────────────┘
│ :3737       │
└─────────────┘
       optional parallel:
┌─────────────┐  ANTHROPIC_BASE_URL=:8082 / freecc  ┌─────────────────┐
│ Claude CLI  │ ───────────────────────────────────►│ FCC tray :8082  │──► Ollama
└─────────────┘                                     └─────────────────┘
```

---

## 3. Exact commands / files to change

### A. Unblock Free Claude in Agent OS (must-do): start OmniRoute
```powershell
# From any shell with npm global bin on PATH:
omniroute
# or:
node "$env:APPDATA\npm\node_modules\omniroute\bin\omniroute.mjs" serve
# Verify:
curl.exe -s http://127.0.0.1:20128/v1/models
```
Leave running (or install as a Windows startup / scheduled task).  
Agent OS Free Claude tab green when `/api/omniroute/status` → `running: true`.

### B. Put Claude CLI on PATH
```powershell
# User PATH — persist:
[Environment]::SetEnvironmentVariable(
  'Path',
  [Environment]::GetEnvironmentVariable('Path','User') + ';C:\Users\mattm\.local\bin',
  'User'
)
# New terminals then:
claude --version   # expect 2.1.268
```

### C. Align Claude ↔ OmniRoute ↔ Ollama (already mostly done)
File: `C:\Users\mattm\.claude\settings.json`  
Keep OmniRoute base URL; ensure model id matches what OmniRoute exposes for Ollama, e.g.:
- `ollama-local/qwen3.8:latest` (current) **or**
- whatever OmniRoute lists under `/v1/models` after start

If OmniRoute uses a different Ollama id prefix, sync `ANTHROPIC_MODEL` / `ANTHROPIC_SMALL_FAST_MODEL` to a listed id.

### D. Optional: FCC as Claude’s sole upstream (local-only mode)
If preferring FCC over OmniRoute for the CLI:
```json
// ~/.claude/settings.json env
"ANTHROPIC_BASE_URL": "http://127.0.0.1:8082",
"ANTHROPIC_API_KEY": "freecc",
"ANTHROPIC_AUTH_TOKEN": "freecc",
"ANTHROPIC_MODEL": "ollama/qwen3.8:latest"
```
And/or edit `C:\Users\mattm\.fcc\.env`:
```
MODEL=ollama/qwen3.8:latest
# optional aliases:
# MODEL_SONNET=ollama/qwen3.8:latest
# MODEL_HAIKU=ollama/qwen3:8b
```
Restart FCC via tray Quit then `cd C:\Users\mattm\HA.OS; npx fcc start` (or tray Start).  
**Note:** Agent OS Free Claude panel still probes OmniRoute unless you change `src/lib/fcc.ts` to probe `:8082` again.

### E. Agent OS env (already wired — verify placeholders)
File: `C:\Users\mattm\HA.OS\agent-os-pack-2026-08-16\agent-os\source\.env`
```
OLLAMA_BASE_URL=http://127.0.0.1:11434
OMNIROUTE_BASE_URL=http://127.0.0.1:20128
FCC_SERVER_URL=http://127.0.0.1:8082
HERMES_API_URL=http://127.0.0.1:20128
```
Several keys in that `.env` look like **short placeholders** (len≈6) for OpenRouter / OpenAI / OmniRoute — replace only if you intentionally use those providers; **not required** for pure Ollama+OmniRoute-free.

### F. Optional code tweak (only if parent wants FCC-primary Agent OS)
In `source\src\lib\fcc.ts`, restore `:8082` probe + spawn env instead of `omnirouteClaudeEnv()`, using `FCC_BASE` / `FCC_TOKEN=freecc`. Prefer OmniRoute-first unless there is a reason to diverge.

### G. Model pulls — ask parent before large downloads
Not required. If wanted later:
```powershell
# Example dedicated coder (~optional; multi-GB):
# ollama pull qwen2.5-coder:14b
```
Disk OK (~196 GB free), but `qwen3.8` already present.

---

## 4. Blockers

| Blocker | Severity | Fix |
|---------|----------|-----|
| **OmniRoute not running on :20128** | **Critical** for Agent OS Free Claude + current Claude settings | Start `omniroute` / `omniroute serve` |
| Claude CLI not on PATH | High (Agent OS spawn may fail if it resolves `claude` via PATH) | Add `C:\Users\mattm\.local\bin` to User PATH |
| OPENROUTER empty in `~\.fcc\.env` & likely placeholder in Agent OS `.env` | Low for local path; Medium if relying on OpenRouter `:free` | Add free OpenRouter key **only if** using that provider; else ignore |
| Agent OS code “retired” FCC for Free Claude UI | Medium (confusion) | Use OmniRoute for UI; keep FCC for optional CLI/local shim |
| No `qwen2.5-coder` / deepseek-coder / codellama | None | Use `qwen3.8:latest` |
| Hermes MOA references OpenRouter / openai-codex | Low for Free Claude map | Separate from Free Claude path; leave alone unless MOA needed |
| Secrets sprawl (`~\.fcc\.env`, agentic-os config) | Security note | Do not commit; rotate Telegram/NIM/etc if exposed |

**Non-blockers (good news):**
- Ollama up with strong coding models  
- FCC tray already running → Ollama  
- Agent OS Mission Control up on :3737  
- Claude Code binary present at 2.1.268  
- Settings already aimed at OmniRoute  

---

## 5. Immediate next install/config steps (parent implements)

1. **Start OmniRoute** and confirm `curl http://127.0.0.1:20128/v1/models` returns models (include Ollama models if configured in OmniRoute dashboard).
2. **Add `C:\Users\mattm\.local\bin` to User PATH**; verify `claude --version` → 2.1.268.
3. **Smoke-test Free Claude** in Agent OS: open `http://127.0.0.1:3737/freeclaude` — should no longer 503 “OmniRoute isn’t running”.
4. **Smoke-test CLI:**  
   `claude --bare -p "Say hi in one word"` with env from settings (OmniRoute up).
5. **Optional:** In OmniRoute admin, pin local default to `qwen3.8:latest` / ensure `ollama-local/*` routes work; keep FCC as backup with `MODEL=ollama/qwen3.8:latest`.
6. **Do not** create paid Anthropic accounts or spend money; skip OpenRouter credits unless free daily quota is needed later.

---

## Quick reference paths

| Role | Path |
|------|------|
| Agent OS source | `C:\Users\mattm\HA.OS\agent-os-pack-2026-08-16\agent-os\source` |
| Agent OS `.env` | `...\source\.env` |
| FCC lib (points to OmniRoute) | `...\source\src\lib\fcc.ts` |
| OmniRoute lib | `...\source\src\lib\omniroute.ts` |
| FCC config | `C:\Users\mattm\.fcc\.env` |
| Claude settings | `C:\Users\mattm\.claude\settings.json` |
| Claude binary | `C:\Users\mattm\.local\bin\claude.exe` |
| OmniRoute npm | `%APPDATA%\npm\node_modules\omniroute` |
| Hermes config | `C:\Users\mattm\AppData\Local\hermes\config.yaml` |
| Model registry | `C:\Users\mattm\.agentic-os\model-registry.json` |
| This map | `/workspace/overmind/agentos-fcc-map.md` |
