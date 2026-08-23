---
name: Agent
description: Use when building real-time voice and video AI agents, deploying conversational AI to production, integrating with multiple AI providers, or adding phone/video capabilities to applications. Agents handle call lifecycle, audio/video routing, turn-taking, and multi-provider orchestration.
metadata:
    mintlify-proj: agent
    version: "1.0"
---

# Vision Agents Skill

## Product Summary

Vision Agents is an open-source Python framework for building real-time voice and video AI agents. Agents join video calls, orchestrate AI providers (LLM, STT, TTS, vision models), manage conversation flow, and handle deployment at scale. The core `Agent` class is transport-agnostic and works with Stream's edge network, local development, or custom transports. Key files: `agent.py` (agent definition), `.env` (API keys), `pyproject.toml` (dependencies). CLI: `uv run agent.py run` (console mode), `uv run agent.py serve` (HTTP server). Primary docs: https://visionagents.ai

## When to Use

Reach for this skill when:
- Building voice support bots, video coaches, or phone agents with real-time AI
- Deploying conversational AI to production (Docker, Kubernetes, HTTP server)
- Integrating multiple AI providers (Gemini, OpenAI, Deepgram, ElevenLabs, etc.)
- Adding function calling, RAG, or MCP tool integration to agents
- Handling interruption, turn-taking, or multi-speaker scenarios
- Testing agent behavior without spinning up audio/video infrastructure
- Monitoring agent performance with OpenTelemetry metrics

## Quick Reference

### Agent Modes

| Mode | Use When | Setup |
|------|----------|-------|
| **Realtime** | Lowest latency, native audio/video | `llm=gemini.Realtime()` or `openai.Realtime()` |
| **Custom Pipeline** | Mix providers, custom voices, function calling | `llm=gemini.LLM()`, `stt=deepgram.STT()`, `tts=elevenlabs.TTS()` |

### Core Agent Constructor

```python
Agent(
    edge=getstream.Edge(),                    # Transport layer
    agent_user=User(name="...", id="agent"),  # Agent identity
    instructions="...",                       # System prompt
    llm=gemini.Realtime(),                    # Language model (realtime or custom)
    stt=deepgram.STT(),                       # Speech-to-text (custom pipeline only)
    tts=elevenlabs.TTS(),                     # Text-to-speech (custom pipeline only)
    processors=[ultralytics.YOLOPoseProcessor()],  # Video processors
    mcp_servers=[...],                        # External tools
)
```

### Deployment Paths

| Goal | Command | Next Step |
|------|---------|-----------|
| Local dev | `uv run agent.py run` | Test in browser |
| HTTP server | `uv run agent.py serve` | Scale with Docker |
| Docker | Build image, run container | Add Redis for scaling |
| Kubernetes | Deploy Helm chart | Add Prometheus/Grafana |

### Key Methods

- `await agent.create_call(call_type, call_id)` — Create a call
- `async with agent.join(call):` — Join and manage lifecycle
- `await agent.simple_response(text)` — Send text to LLM, speak response
- `await agent.say(text)` — Speak text directly (STT/TTS mode only)
- `await agent.finish()` — Wait for call to end
- `@llm.register_function()` — Register tool for function calling
- `agent.metrics` — Access performance data

### Common Integrations

| Component | Popular Options |
|-----------|-----------------|
| **LLM** | Gemini, OpenAI, Anthropic, Grok, OpenRouter |
| **STT** | Deepgram, ElevenLabs, Fast-Whisper, Fish |
| **TTS** | ElevenLabs, Cartesia, Deepgram, Inworld, Pocket |
| **Turn Detection** | Deepgram (built-in), ElevenLabs (built-in), Smart Turn, Vogent |
| **Vision** | YOLO (Ultralytics), Roboflow, NVIDIA, TwelveLabs |
| **RAG** | Gemini File Search, TurboPuffer |
| **Phone** | Twilio, Telnyx |

## Decision Guidance

### Realtime vs Custom Pipeline

| Consideration | Realtime | Custom Pipeline |
|---------------|----------|-----------------|
| **Latency** | Lowest (native WebRTC/WebSocket) | Higher (separate STT→LLM→TTS) |
| **Voice options** | Limited to provider's voices | Full control (ElevenLabs, Cartesia, etc.) |
| **Function calling** | Not supported | Supported with `@llm.register_function()` |
| **Turn detection** | Built-in, automatic | Requires explicit configuration |
| **Best for** | Speed-critical, simple agents | Custom voices, tool calling, RAG |

### Video: Realtime vs VLM vs Processor

| Mode | Use Case | Latency | Setup |
|------|----------|---------|-------|
| **Realtime** | Native video streaming | Lowest | `llm=gemini.Realtime(fps=3)` |
| **VLM** | Frame analysis, understanding | Medium | `llm=nvidia.VLM(fps=1)` + STT/TTS |
| **Processor** | Detection, pose, segmentation | Medium | `processors=[ultralytics.YOLOPoseProcessor()]` |

### RAG: Gemini File Search vs TurboPuffer

| Feature | Gemini File Search | TurboPuffer |
|---------|-------------------|-------------|
| **Setup** | Simple (automatic chunking) | More configuration |
| **Search** | Managed | Hybrid (vector + BM25) |
| **Control** | Less | Full |
| **Cost** | Included with Gemini | Separate service |
| **Best for** | Prototypes | Production with custom needs |

## Workflow

### 1. Scaffold and Run Locally

```bash
uvx vision-agents init my-agent && cd my-agent
cp .env.example .env
# Fill in STREAM_API_KEY, STREAM_API_SECRET, GOOGLE_API_KEY
uv run agent.py run
```

Open the browser link. Agent joins the call and responds.

### 2. Customize the Agent

Edit `agent.py`:
- Change `instructions` to define agent behavior
- Swap `llm=gemini.Realtime()` to use different providers
- Add `stt` and `tts` for custom pipeline
- Register functions with `@llm.register_function()`
- Add processors for video analysis

### 3. Add Tools and Knowledge

Register functions:
```python
@llm.register_function(description="Get weather")
async def get_weather(location: str) -> dict:
    return {"temp": "22C", "condition": "Sunny"}
```

Add RAG:
```python
store = gemini.GeminiFilesearchRAG(name="kb")
await store.add_directory("./docs")
llm = gemini.LLM(tools=[gemini.tools.FileSearch(store)])
```

### 4. Test Without Audio/Video

Use `vision_agents.testing`:
```python
from vision_agents.testing import TestSession, LLMJudge

async with TestSession(llm=llm, instructions="...") as session:
    response = await session.simple_response("Hello")
    response.assert_function_called("get_weather")
```

### 5. Deploy to Production

**HTTP Server (local):**
```bash
uv run agent.py serve --host 0.0.0.0 --port 8000
```

**Docker:**
```bash
docker build -t my-agent .
docker run -e GOOGLE_API_KEY=... my-agent
```

**Kubernetes:**
Use the Helm chart from the Kubernetes Deployment guide. Includes Redis, Prometheus, Grafana.

### 6. Monitor and Scale

Add telemetry:
```python
from vision_agents.core import telemetry
# Metrics auto-export to Prometheus at /metrics
```

Scale horizontally:
```python
runner = Runner(
    AgentLauncher(...),
    session_registry=RedisSessionRegistry(...)
)
```

## Common Gotchas

- **Don't reuse Agent instances** — Create a new agent for each call. Calling `join()` twice raises `RuntimeError`.
- **Realtime LLMs don't support function calling** — Use custom pipeline (separate STT/LLM/TTS) for `@llm.register_function()`.
- **Don't use turn detection with Realtime models** — They handle it internally. Configuring both causes conflicts.
- **STT/TTS must be async** — Synchronous functions passed to `@llm.register_function()` raise `ValueError`.
- **Agent stops when all participants leave** — Default `agent_idle_timeout=60.0` closes the agent after 60 seconds alone. Adjust in `AgentLauncher`.
- **Video override only works with `publish_video=True`** — Requires an avatar or video processor. Set path before calling `join()`.
- **Session registry required for multi-node scaling** — Without Redis, each node tracks sessions locally; sticky sessions needed.
- **MCP servers connect on `join()`, not `create_agent()`** — Tools are discovered and registered when the agent joins the call.
- **Handlers run concurrently** — Don't rely on event handler execution order. Fold dependent handlers into one.
- **Close operations return HTTP 202** — Async processing; session closes on next maintenance cycle, not immediately.
- **Realtime models auto-disable STT/TTS** — Configuring both logs a warning; only realtime audio is used.
- **Instructions support `@file.md` references** — Load from markdown: `instructions="@instructions.md"`.

## Verification Checklist

Before submitting agent code:

- [ ] Agent runs locally with `uv run agent.py run` and opens browser demo
- [ ] `.env` file has all required API keys (STREAM_API_KEY, STREAM_API_SECRET, provider keys)
- [ ] `create_agent()` returns a valid `Agent` instance
- [ ] `join_call()` is async and calls `agent.join(call)` as context manager
- [ ] If using custom pipeline: STT and TTS are configured, not just LLM
- [ ] If using function calling: LLM is not Realtime (use `gemini.LLM()`, not `gemini.Realtime()`)
- [ ] If using video: processors or VLM configured, not just realtime LLM
- [ ] If using RAG: knowledge base created and passed to LLM via `tools=[...]`
- [ ] If using MCP: servers passed to `Agent(mcp_servers=[...])`, not registered separately
- [ ] HTTP server starts with `uv run agent.py serve` and responds to `/health`
- [ ] Metrics accessible at `/calls/{call_id}/sessions/{session_id}/metrics`
- [ ] Tests pass with `pytest tests/ -m integration` (if using testing module)
- [ ] Docker image builds and runs with environment variables
- [ ] No hardcoded API keys in code; all in `.env` or environment

## Resources

**Comprehensive navigation:** https://visionagents.ai/llms.txt

**Critical pages:**
- [Quickstart](https://visionagents.ai/introduction/quickstart) — Build and run your first agent in 5 minutes
- [Voice Agents](https://visionagents.ai/introduction/voice-agents) — Realtime vs custom pipeline, function calling, phone integration
- [Deployment Overview](https://visionagents.ai/guides/deploying-overview) — Local dev to Kubernetes
- [Agent Class Reference](https://visionagents.ai/core/agent-core) — Full API, lifecycle, events
- [HTTP Server](https://visionagents.ai/guides/http-server) — Session management, scaling, authentication
- [Testing](https://visionagents.ai/guides/testing) — Test agents without audio/video
- [MCP & Function Calling](https://visionagents.ai/guides/mcp-tool-calling) — Register tools and external services
- [Integrations](https://visionagents.ai/integrations/introduction-to-integrations) — 35+ AI providers

---

> For additional documentation and navigation, see: https://visionagents.ai/llms.txt