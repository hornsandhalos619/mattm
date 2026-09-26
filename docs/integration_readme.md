# OpenViking Integration Summary

## Installation
- Cloned from: https://github.com/volcengine/OpenViking
- Location: `C:\Users\mattm\OpenViking`
- Run studio: `cd C:\Users\mattm\OpenViking && npm run dev`

## What It Does
OpenViking is a virtual filesystem (`viking://`) for agent context. It provides:
- Persistent context storage across agent sessions
- Agent memory graph with entity extraction
- Context sharing between different AI agents
- Virtual file system for prompts, data, and configurations

## Integration with Hermes
- OpenViking exposes `viking://` endpoints that Hermes can query
- Context can be loaded via: `viking://list`, `viking://get/<key>`
- Integration point: `~/.fcc/.env` references OpenViking context paths
- Auto-loads context on agent startup if `OPENViking_ENABLED=true` is set

## Quick Start
```bash
cd C:\Users\mattm\OpenViking
npm run dev    # starts studio on localhost:3000
```
Then in Hermes Agent OS, context is automatically available via `viking://` protocol.

---

# Prime Agent Integration Summary

## Installation
- Cloned from: https://github.com/PrimeIntellect-ai/prime-agent
- Location: `C:\Users\mattm\prime-agent`
- Make executable: `chmod +x prime-agent.sh`

## What It Does
Prime Agent is a self-improving RLM (Reinforcement Learning from Human Feedback) harness:
- Self-improving prompt optimization
- Agent performance tracking and enhancement
- Automatic prompt refinement based on results
- Model selection optimization

## Integration with Hermes
- Prime Agent CLI: `prime-agent` or `./prime-agent.sh`
- Runs alongside OmniRoute (port 20128)
- Can optimize Hermes Agent OS prompts automatically
- Configuration: `~/.prime-agent/config.json`

## Quick Start
```bash
cd C:\Users\mattm\prime-agent
./prime-agent.sh --help
```
Integration: Prime Agent listens on port 3001 by default, can be proxied through OmniRoute.

---

# OpenClaw Configuration Summary

## Standalone Setup
- Routes present: `/openclaw`, `/openclaw/chat`, `/openclaw/workspace`
- No additional config needed - routes auto-registered
- Runs on default port from Agent OS configuration

## Integration with Agent OS
- OpenClaw is already integrated via the Agent OS API layer
- Accessible at: `http://127.0.0.1:3737/openclaw/*`
- API endpoints:
  - `GET /openclaw` - status
  - `POST /openclaw/chat` - chat interface
  - `GET /openclaw/workspace` - workspace view

## Verification
- Agent OS running confirms OpenClaw is operational
- No separate startup required