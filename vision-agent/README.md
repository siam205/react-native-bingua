# Bingua Vision Agent

The AI language teacher. A voice-only [Vision Agents](https://visionagents.ai)
service that joins the same Stream call the Expo app creates for a lesson.

It is a **separate process from the app** — it holds a live WebRTC connection
for the length of a call, which an Expo API route cannot do.

## What it does

- Joins a lesson call as `bingua-teacher` ("Rio")
- Listens to the learner and replies with speech, using **OpenAI Realtime**
- **Always speaks English**, and teaches the target language through English
- Publishes **no video** — `send_video=False` on the Realtime LLM

The target language is read from the call id. The app creates calls as
`lesson-{lessonId}-{userId}`, so `lesson-es-a1-u1-l3-user-abc` tells the agent
the session is Spanish lesson `es-a1-u1-l3`.

## Setup

Credentials load from two files, nearest last so the local one wins:

| File | Holds |
|---|---|
| `../.env` | `STREAM_API_KEY`, `STREAM_API_SECRET` — shared with the Expo app |
| `./.env` | `OPENAI_API_KEY` — this service only |

Keeping the Stream keys in the app's `.env` avoids a second copy drifting out
of sync. `./.env` is gitignored.

Install (from this directory):

```bash
python -m venv .venv
.venv/Scripts/python -m pip install -e .      # Windows
.venv/bin/python     -m pip install -e .      # macOS / Linux
```

## Running

Console mode — creates a call and opens a browser demo to talk to the agent:

```bash
.venv/Scripts/python agent.py run
```

Join a specific lesson call the app already created:

```bash
.venv/Scripts/python agent.py run --call-id lesson-es-a1-u1-l3-user-abc
```

HTTP server, so the app can start sessions on demand:

```bash
.venv/Scripts/python agent.py serve --host 0.0.0.0 --port 8300
```

## Notes

- `create_agent()` must work with no arguments — the launcher calls it during
  warmup before any call exists. Anything call-specific happens in `join_call`.
- Realtime models handle turn-taking internally, so no STT, TTS or turn
  detector is configured. Adding them would be ignored (and warned about).
- Realtime models do not support function calling. If the teacher ever needs
  tools, it has to move to a custom STT + LLM + TTS pipeline.
