# Free Claude Code Server Setup

**Trigger:** Use when setting up Free Claude Code server (fcc-server) for Agent OS integration.

**One-line behavior:** Captures FCC server installation, configuration, and connectivity status for Agent OS Free Claude Code features.

## Setup

### Install the free-claude-code package
```bash
npm install free-claude-code
# Or: npm install -g free-claude-code
```

### Start the FCC server
```bash
fcc start
# Or: npx fcc start
# Or: cd /c/Users/mattm/HA.OS/node_modules/.bin/fcc start
```

### Verify FCC server is running
```bash
fcc status
# Should output: "Running."
# Or: curl -s http://127.0.0.1:8082/ | python3 -m json.tool
# Admin UI: http://127.0.0.1:8082/admin
```

### Configure the model in .fcc/.env
```bash
echo 'MODEL="ollama/qwen3.6-64k"' > ~/.fcc/.env
# Or: MODEL="ollama/qwen3.6" for standard context version
```

### Access the FCC admin UI
```bash
# Open in browser
open http://127.0.0.1:8082/admin
# Or: open http://127.0.0.1:8082/
```

### FCC server endpoints
- Root: `http://127.0.0.1:8082/` → `{"status":"ok","provider":"ollama","model":"ollama/qwen3.6-64k"}`
- Admin UI: `http://127.0.0.1:8082/admin` (HTML interface)
- Chat API: `http://127.0.0.1:8082/api/chat` (may require authentication)

### FCC server and OmniRoute comparison
- **FCC server**: Specific to Free Claude Code integration in Agent OS
- **OmniRoute**: Running on :20128, provides 90+ free models with auto-fallback
- **Both can coexist**: FCC server focuses on Free Claude Code, OmniRoute provides broader model access

### Voice-build feature note
- FCC server not required for voice-build functionality
- Voice-build works directly with Ollama: `ollama run qwen3.6-64k "build me a Python calculator"`
- FCC server enables full chat/workspace tab functionality

---
*Skill installed at: ~/HA.OS/skills/fcc-server-setup*