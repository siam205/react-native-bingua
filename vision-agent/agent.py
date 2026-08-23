"""Bingua AI language teacher — a voice-only Vision Agent.

The agent joins the same Stream call the Expo app creates for a lesson and
plays the teacher. It is deliberately audio only: no camera is published and
no video is consumed.

Run locally:
    .venv/Scripts/python agent.py run          (Windows)
    .venv/bin/python agent.py run              (macOS / Linux)

Serve over HTTP so the app can start sessions:
    .venv/Scripts/python agent.py serve --host 0.0.0.0 --port 8300

Credentials load from ../.env (STREAM_API_KEY, STREAM_API_SECRET, shared with
the Expo app) and ./.env (GEMINI_API_KEY). The local file wins on conflict.
"""

from __future__ import annotations

import logging
import os
import re
from pathlib import Path

from dotenv import load_dotenv
from vision_agents.core import Agent, User
from vision_agents.core.agents import AgentLauncher
from vision_agents.core.runner import Runner
from vision_agents.plugins import gemini, getstream

# Credentials load from two places, nearest last so it wins:
#   ../.env          shared with the Expo app (STREAM_API_KEY / STREAM_API_SECRET)
#   ./.env           service-local overrides and secrets (OPENAI_API_KEY)
# Keeping the Stream keys in one file avoids a second copy drifting out of sync.
SERVICE_DIR = Path(__file__).resolve().parent
REPO_ROOT = SERVICE_DIR.parent
load_dotenv(REPO_ROOT / ".env")
load_dotenv(SERVICE_DIR / ".env", override=True)

logger = logging.getLogger("bingua.agent")

REQUIRED_ENV = ("STREAM_API_KEY", "STREAM_API_SECRET", "GEMINI_API_KEY")

# How long the teacher waits for the learner before greeting, and how long it
# stays in an empty room before shutting down. The SDK defaults (10s / 60s)
# assume both sides start together; a person tapping through the app needs
# much longer than that.
PARTICIPANT_WAIT_SECONDS = 600.0
IDLE_TIMEOUT_SECONDS = 1800.0

# Mirrors src/data/languages.ts. Only the display name is needed here — the
# curriculum itself stays in the app.
LANGUAGE_NAMES = {
    "es": "Spanish",
    "fr": "French",
    "ja": "Japanese",
    "ko": "Korean",
    "de": "German",
    "zh": "Mandarin Chinese",
}

# The app builds call ids as `lesson-{lessonId}-{userId}`, and lesson ids look
# like `es-a1-u1-l3`, so the target language is recoverable from the call id
# without another round trip to Stream.
LESSON_CALL_RE = re.compile(r"^lesson-(?P<lesson>([a-z]{2})-[a-z0-9]+-u\d+-l\d+)-")

BASE_INSTRUCTIONS = """
You are Rio, a warm and patient language teacher for the Bingua app.

Language policy — this is the most important rule:
- ALWAYS speak English. English is the language you teach *in*.
- You teach the learner a different target language, but you explain,
  instruct, correct and encourage in English.
- Only say words and phrases in the target language when you are modelling
  them for the learner to repeat, or reading back what they said. Immediately
  give the English meaning after any target-language phrase.
- Never switch to conducting the lesson in the target language, even if the
  learner asks in that language.

How to teach:
- Keep every turn short — one or two sentences. This is a spoken conversation.
- Speak slowly and clearly. Leave room for the learner to answer.
- Model a phrase, ask the learner to say it back, then give specific praise or
  a gentle correction. Never correct more than one thing at a time.
- If the learner is silent or stuck, offer the phrase again and its meaning.
- Never use emoji, markdown, bullet points or special characters — everything
  you say is spoken aloud.

Keep the learner talking. They should speak more than you do.
""".strip()


def _missing_env() -> list[str]:
    return [name for name in REQUIRED_ENV if not os.getenv(name)]


def lesson_context(call_id: str) -> str | None:
    """Turns a lesson call id into a line of instruction for the teacher."""
    match = LESSON_CALL_RE.match(call_id)
    if not match:
        return None

    lesson_id = match.group("lesson")
    language = LANGUAGE_NAMES.get(lesson_id[:2])
    if not language:
        return None

    return (
        f"This session teaches {language} (lesson {lesson_id}). "
        f"Speak English throughout and teach {language} through English."
    )


def create_agent(**kwargs) -> Agent:
    """Builds the teacher.

    The launcher calls this with no arguments during warmup and again per
    session, so it must not depend on call-specific state — anything
    lesson-specific is applied in `join_call` once the call id is known.
    """
    missing = _missing_env()
    if missing:
        raise RuntimeError(
            f"Missing required environment variables: {', '.join(missing)}. "
            f"Add them to {SERVICE_DIR / '.env'} or {REPO_ROOT / '.env'}"
        )

    return Agent(
        edge=getstream.Edge(),
        agent_user=User(id="bingua-teacher", name="Rio"),
        instructions=BASE_INSTRUCTIONS,
        # Gemini Live. Its default config is already response_modalities=[AUDIO],
        # and the app's calls publish no video track, so the session is voice
        # only without extra configuration.
        llm=gemini.Realtime(),
    )


async def join_call(agent: Agent, call_type: str, call_id: str) -> None:
    """Joins the lesson call and stays until everyone leaves."""
    context = lesson_context(call_id)
    if context:
        logger.info("Joining lesson call %s/%s — %s", call_type, call_id, context)
    else:
        logger.info("Joining call %s/%s (no lesson metadata in the id)", call_type, call_id)

    call = await agent.create_call(call_type, call_id)

    # `join` is an async context manager; leaving the block ends the session.
    # The default 10s wait is far too short when a person has to open the app
    # and tap through to the lesson, so the agent waits for them.
    async with agent.join(call, participant_wait_timeout=PARTICIPANT_WAIT_SECONDS):
        opener = (
            f"{context} Greet the learner in English, say which language you will "
            "practise together, and ask them to say hello."
            if context
            else "Greet the learner in English and ask what they would like to practise."
        )
        await agent.simple_response(opener)
        await agent.finish()


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    Runner(
        AgentLauncher(
            create_agent=create_agent,
            join_call=join_call,
            agent_idle_timeout=IDLE_TIMEOUT_SECONDS,
        )
    ).cli()
