# System Command Center - Complete Implementation

## Overview

Your Agent OS now has a unified **System Command Center** with two integrated dashboards:

### 1. **Daemon Health Monitor**
- Real-time status of all system daemons
- Process detection (Ollama, FCC Server, Copilot API, Hermes, Agent OS)
- Endpoint connectivity checks with latency measurement
- Critical alerts and warnings
- 8-second auto-refresh

### 2. **Agent Usage & Optimization Dashboard**
- Per-agent resource monitoring (hermes, openclaw, copilot)
- Token quota tracking with visual progress bars
- Cost estimation for paid APIs
- Rate limit information
- **Model switching interface** - change agent models on-the-fly
- Efficiency recommendations based on latency & success rate
- Global optimization recommendations

---

## Architecture

### API Endpoints

#### `/api/daemon-health` (GET)
Returns comprehensive daemon status report:
```json
{
  "timestamp": 1704067200000,
  "daemons": [
    {
      "name": "Ollama",
      "running": true,
      "endpoint": "http://localhost:11434",
      "reachable": true,
      "latencyMs": 2
    },
    ...
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

#### `/api/agent-usage` (GET & POST)
**GET**: Returns usage report for all agents
```json
{
  "timestamp": 1704067200000,
  "agents": [
    {
      "agent": "hermes",
      "provider": "ollama",
      "currentModel": "qwen3.6-64k",
      "availableModels": ["qwen3.6-64k", "qwen3.6:27b", "qwen3:8b", "nemotron-3-super:cloud"],
      "usage": {
        "requestsToday": 247,
        "tokensUsed": 2847392,
        "percentageOfLimit": 0,
        "status": "ok"
      },
      "efficiency": {
        "avgLatencyMs": 450,
        "successRate": 0.998,
        "recommendation": "Running smoothly..."
      }
    },
    ...
  ],
  "globalRecommendations": [...]
}
```

**POST**: Change agent model
```json
{
  "agent": "hermes",
  "newModel": "qwen3:8b"
}
```
Response:
```json
{
  "success": true,
  "message": "hermes model changed to qwen3:8b",
  "requiresRestart": true
}
```

---

## UI Components

### System Dashboard (Tabbed Interface)
- **Location**: `/daemon-console`
- **Tabs**:
  1. **Daemon Health** - System status overview
  2. **Agent Usage & Optimization** - Resource usage and model switching

### Daemon Console Component
- Grid of daemon status cards
- Real-time connectivity checks
- Latency display
- Critical issue alerts
- Token provider status

### Agent Usage Component
- **Per-Agent Cards**:
  - Current model badge
  - Requests today counter
  - Token quota with progress bar (for paid APIs)
  - Rate limit information
  - Efficiency metrics (latency, success rate)
  - Model switcher dropdown
  - AI-generated optimization recommendations

- **Global Recommendations Section**:
  - Aggregated insights across all agents
  - Budget warnings
  - Performance optimization tips
  - Memory management advice

---

## Key Features

### 1. **Model Switching**
- Dropdown selector per agent
- Shows all available models
- One-click model change
- Configuration auto-saved to `~/.agentic-os/config.json`
- Requires Agent OS restart to apply

### 2. **Token & Quota Monitoring**
- **Ollama (Local)**: Rate limit display (100 req/min)
- **GitHub Copilot**: Monthly token quota with visual bar
- **OpenRouter**: Token balance tracking
- **ElevenLabs**: API token status
- Percentage-based quota visualization (0-100%)
- Color-coded status: green (ok), yellow (warning), red (critical)

### 3. **Efficiency Metrics**
- Average latency per agent
- Success rate percentage
- Request count tracking
- Cost estimation (for paid APIs)
- Auto-generated recommendations

### 4. **Free Model Optimization**
For local models (Ollama):
- Shows rate limit capacity
- Suggests model downsizing if latency > 600ms
- Recommends batch size reduction
- VRAM usage insights

### 5. **Paid Model Optimization**
For GitHub Copilot:
- Tracks monthly token quota
- Estimates remaining budget
- Recommends switching to cheaper models when >70% used
- Shows per-request cost
- Cost-per-1M-tokens metrics

---

## Usage Scenarios

### Scenario 1: Token Running Out
1. Check "Agent Usage & Optimization" tab
2. See Copilot agent at 92% quota
3. Click model dropdown → select "gpt-4o-mini" (cheaper)
4. System updates config and asks for restart
5. Agent automatically switches to lower-cost model

### Scenario 2: Slow Response Times
1. View efficiency section → see latency 850ms
2. AI recommendation: "Switch to qwen3:8b for faster responses"
3. Click dropdown → select "qwen3:8b"
4. Restart Agent OS
5. Latency improves to ~300ms

### Scenario 3: Monitor Budget
1. Daily check of Agent Usage tab
2. See all agents at glance
3. Global recommendations show: "Copilot quota at 45%, switch non-critical to local"
4. Adjust routing to use hermes/openclaw for brainstorming, copilot only for critical tasks

### Scenario 4: Daemon Goes Down
1. Daemon Health tab shows "Ollama" in red
2. Critical alert: "Ollama daemon is down"
3. Click model switcher for hermes → falls back to copilot-api
4. System continues operating while you restart Ollama

---

## Files Created

```
src/app/api/daemon-health/route.ts         (Daemon health checks)
src/app/api/agent-usage/route.ts           (Agent usage tracking & model switching)
src/components/DaemonConsole.tsx           (Daemon status dashboard)
src/components/DaemonConsole.css           (Daemon UI styling)
src/components/AgentUsage.tsx              (Agent usage & optimization)
src/components/AgentUsage.css              (Usage UI styling)
src/components/SystemDashboard.tsx         (Tabbed main container)
src/components/SystemDashboard.css         (Tab styling)
src/app/daemon-console/page.tsx            (Main page at /daemon-console)
```

### Updated Files
```
src/components/Sidebar.tsx                 (Added "System Status" nav item)
C:\Users\mattm\.agentic-os\config.json     (Agents configured)
```

---

## UI Theme

Matches Agent OS midnight aubergine aesthetic:
- **Background**: `rgba(20, 8, 24, 0.95)`
- **Accent Gold**: `#d4a574`
- **Accent Lavender**: `#d9a8e0`
- **Success Green**: `#2ec478`
- **Warning Yellow**: `#d4a574`
- **Error Red**: `#dc3545`
- **Text**: `#f5f0eb`

### Responsive
- Desktop: 3-column grid for agents
- Tablet: 2-column grid
- Mobile: 1-column stack

---

## Auto-Refresh Behavior

| Component | Interval | Pause When Hidden |
|-----------|----------|-------------------|
| Daemon Health | 8s | Yes |
| Agent Usage | 12s | Yes |
| Both | Auto-polling | Pause on tab hide |

---

## Configuration & Integration

### Agent Routing
```json
{
  "roomAgents": {
    "hermes": {
      "provider": "ollama",
      "model": "qwen3.6-64k"
    },
    "openclaw": {
      "provider": "ollama",
      "model": "qwen3.6-64k"
    },
    "copilot": {
      "provider": "openai",
      "model": "gpt-4",
      "baseUrl": "http://localhost:4141/v1",
      "apiKey": "dummy"
    }
  }
}
```

### Sidebar Navigation
New top-level nav item: "System Status" (Activity icon)
- Links to `/daemon-console`
- Shows both tabs
- Always accessible from any page

---

## Testing Checklist

- [ ] Start Agent OS with `C:\Users\mattm\agent-os-full-startup.bat`
- [ ] Navigate to `http://localhost:3000/daemon-console`
- [ ] **Daemon Health Tab**:
  - [ ] All daemons show green/online
  - [ ] Latency values display correctly
  - [ ] Modal dropdown available
  - [ ] Auto-refreshes every 8s
  
- [ ] **Agent Usage Tab**:
  - [ ] All three agents (hermes, openclaw, copilot) display
  - [ ] Usage metrics visible (requests, tokens)
  - [ ] Model dropdowns functional
  - [ ] Quota bars show percentage
  - [ ] Recommendations display
  - [ ] Model switching works (POST endpoint)
  - [ ] Config file updates correctly
  
- [ ] **Integration Tests**:
  - [ ] Stop Ollama → Daemon Health shows red alert
  - [ ] Switch hermes to different model → config updates
  - [ ] Restart Agent OS → new model active
  - [ ] Latency & efficiency metrics update realistically
  
- [ ] **UI/UX**:
  - [ ] Theme colors match Agent OS
  - [ ] Responsive on mobile/tablet
  - [ ] Smooth tab transitions
  - [ ] No console errors
  - [ ] Message notifications clear and helpful

---

## What's Next?

**Optional Enhancements:**
1. **Persistent usage history** - Log usage over time
2. **Auto model-switching** - Automatically switch when quota >80%
3. **Webhook alerts** - Notify when critical issues detected
4. **Usage export** - CSV/JSON reports of daily/monthly usage
5. **Cost tracking** - Detailed spending analytics
6. **Performance graphs** - Latency trends over time

---

## How to Use

1. **Open Dashboard**: Click "System Status" in sidebar or visit `/daemon-console`
2. **Monitor Health**: Check Daemon Health tab for all services running
3. **Optimize Usage**: Go to Agent Usage tab to see quotas and recommendations
4. **Switch Models**: Use dropdown to change agent model, then restart Agent OS
5. **Review Efficiency**: Read AI recommendations for optimal performance

---

**System Command Center is ready to deploy!** 🎯
