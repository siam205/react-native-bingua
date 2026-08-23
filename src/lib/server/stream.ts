import { StreamClient } from "@stream-io/node-sdk";

import { HttpError } from "@/lib/server/auth";

/**
 * Server-only Stream client. The API secret is read here and never leaves the
 * server bundle — the app only ever receives the API key and a short-lived
 * user token.
 */

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

/** Stream tokens are refreshed by the SDK, so they stay short-lived. */
export const TOKEN_TTL_SECONDS = 60 * 60 * 4;

/**
 * The call type used for lesson sessions.
 *
 * `default`, not `audio_room`: audio rooms start backstage and only hosts may
 * join until someone calls goLive(), which made the AI teacher fail with
 * "not allowed to perform action JoinBackstage". A lesson is a two-party
 * conversation, so the plain call type is the right model. It stays audio only
 * through `video: false` on the request and camera.disable() on the client.
 */
export const LESSON_CALL_TYPE = "default";

let cached: StreamClient | undefined;

export function getStreamServerClient(): StreamClient {
  if (!apiKey || !apiSecret) {
    throw new HttpError(
      500,
      "STREAM_API_KEY and STREAM_API_SECRET must be set on the server",
    );
  }

  cached ??= new StreamClient(apiKey, apiSecret);
  return cached;
}

export function getStreamApiKey(): string {
  if (!apiKey) {
    throw new HttpError(500, "STREAM_API_KEY is not configured on the server");
  }
  return apiKey;
}

/**
 * One call per user per lesson, so re-entering a lesson rejoins the same room
 * rather than stacking up new ones.
 */
export function lessonCallId(userId: string, lessonId: string): string {
  return `lesson-${lessonId}-${userId}`.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 64);
}
