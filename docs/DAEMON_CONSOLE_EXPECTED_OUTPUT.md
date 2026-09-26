# Daemon Console - Expected Output Report

## System State at Test Time

### Current Status (Before Startup)
- **Ollama**: NOT RUNNING
- **Free Claude Code (FCC) Server**: NOT RUNNING  
- **Copilot API**: NOT RUNNING (optional, on-demand)
- **Hermes Desktop**: NOT RUNNING
- **Agent OS CLI**: NOT RUNNING

---

## Daemon Console - Real-Time Output When Running

### Health Dashboard Summary
```
System Daemon Monitor
✓ All Systems Healthy | 5 / 5 Running
```

### Active Daemons
```
┌─────────────────────┬──────────┬────────────┐
│ Daemon              │ Status   │ Details    │
├─────────────────────┼──────────┼────────────┤
│ Ollama              │ ✓ Online │ 2ms        │
│ Free Claude Code    │ ✓ Online │ 1ms        │
│ Copilot API         │ ○ Online │ 3ms        │
│ Hermes Desktop      │ ✓ Online │ localhost  │
│ Agent OS            │ ✓ Online │ 3000       │
└─────────────────────┴──────────┴────────────┘
```

### Room Agents Status
```
┌─────────────────────────────────────────┐
│ hermes (Ollama/Qwen3.6-64k)             │
│ Status: Ready                           │
│ Model: qwen3.6-64k                      │
│ Provider: ollama                        │
│ Latency: 45ms                           │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ openclaw (Ollama/Qwen3.6-64k)           │
│ Status: Ready                           │
│ Model: qwen3.6-64k                      │
│ Provider: ollama                        │
│ Latency: 52ms                           │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ copilot (GitHub Copilot)                │
│ Status: Ready (when API running)        │
│ Model: gpt-4                            │
│ Provider: github-copilot                │
│ Endpoint: http://localhost:4141/v1      │
│ Latency: 180ms                          │
└─────────────────────────────────────────┘
```

### API Tokens & Providers
```
┌──────────────────────┬────────────────┐
│ Provider             │ Status         │
├──────────────────────┼────────────────┤
│ GitHub Copilot       │ ✓ Ready        │
│ OpenRouter           │ ✓ Ready        │
│ ElevenLabs           │ ✓ Ready        │
│ Ollama (Local)       │ ✓ Ready        │
└──────────────────────┴────────────────┘
```

### Alert Examples

#### Critical Issues (if any)
```
⚠ Critical Issues:
• Ollama daemon is down
```

#### Warnings (if any)
```
⚠ Warnings:
• FCC Server not responding
• Hermes Desktop process not running
```

---

## API Response Format (`/api/daemon-health`)

```json
{
  "timestamp": 1704067200000,
  "daemons": [
    {
      "name": "Ollama",
      "running": true,
      "endpoint": "http://localhost:11434",
      "reachable": true,
      "latencyMs": 2,
      "model": "qwen3.6-64k"
    },
    {
      "name": "Free Claude Code",
      "running": true,
      "endpoint": "http://localhost:8082",
      "reachable": true,
      "latencyMs": 1,
      "provider": "free-claude-code"
    },
    {
      "name": "Copilot API",
      "running": true,
      "endpoint": "http://localhost:4141/usage",
      "reachable": true,
      "latencyMs": 3,
      "model": "GitHub Copilot"
    },
    {
      "name": "Hermes",
      "running": true,
      "endpoint": "local-process"
    },
    {
      "name": "Agent OS",
      "running": true,
      "endpoint": "http://localhost:3000"
    }
  ],
  "tokens": [
    {
      "provider": "GitHub Copilot",
      "available": true
    },
    {
      "provider": "OpenRouter",
      "available": true
    },
    {
      "provider": "ElevenLabs",
      "available": true
    }
  ],
  "summary": {
    "allHealthy": true,
    "runningDaemons": 5,
    "totalDaemons": 5,
    "criticalIssues": [],
    "warnings": []
  }
}
```

---

## Integration Points

### Sidebar Navigation
- **"System Status"** nav item links to `/daemon-console`
- Activity icon indicates health at a glance
- Auto-refreshes every 8 seconds

### Agent OS Auto-Startup
- **Script**: `C:\Users\mattm\agent-os-full-startup.bat`
- **Location**: Windows Startup folder (auto-runs on login)
- **Sequence**:
  1. Ollama starts (waits 3s)
  2. FCC Server starts (waits 3s)
  3. Hermes Desktop launches
  4. Agent OS CLI starts
  5. Dashboard opens at `http://localhost:3000`

### Daemon Console Features
- ✓ Real-time health status
- ✓ Process detection (Ollama, Hermes, Agent OS)
- ✓ Endpoint connectivity checks
- ✓ Latency measurement
- ✓ API token availability
- ✓ Critical issue alerts
- ✓ Warning notifications
- ✓ 8-second auto-refresh
- ✓ Matches Agent OS midnight aubergine UI

---

## Testing Checklist

- [ ] Run `C:\Users\mattm\agent-os-full-startup.bat`
- [ ] Verify Ollama starts
- [ ] Verify FCC Server starts  
- [ ] Verify Hermes Desktop launches
- [ ] Verify Agent OS CLI opens
- [ ] Open `http://localhost:3000/daemon-console`
- [ ] Verify all daemons show "Online"
- [ ] Check latency values are reasonable
- [ ] Test toggling services off and verify alerts
- [ ] Confirm auto-refresh works (8s interval)
