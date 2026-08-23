/**
 * Client-side helpers for talking to the Stream API routes.
 *
 * The app never sees the Stream API secret and never sends a Stream user id —
 * it forwards the Clerk session token and the server decides who the caller is.
 */

export type StreamSession = {
  apiKey: string;
  userId: string;
  userName?: string;
  userImage?: string;
  token: string;
};

export type LessonCall = {
  callType: string;
  callId: string;
  lessonId: string;
};

/** Clerk's `getToken` from `useAuth()`. */
export type GetToken = () => Promise<string | null>;

async function authedFetch(getToken: GetToken, path: string, init?: RequestInit) {
  const token = await getToken();
  if (!token) {
    throw new Error("Not signed in");
  }

  const response = await fetch(path, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const detail = await response
      .json()
      .then((body: { error?: string }) => body.error)
      .catch(() => undefined);
    throw new Error(detail ?? `Request failed (${response.status})`);
  }

  return response;
}

export async function fetchStreamSession(getToken: GetToken): Promise<StreamSession> {
  const response = await authedFetch(getToken, "/api/stream/session");
  return response.json();
}

/** Asks the server to reserve the call for this lesson and return its id. */
export async function createLessonCall(
  getToken: GetToken,
  lessonId: string,
): Promise<LessonCall> {
  const response = await authedFetch(getToken, "/api/stream/call", {
    method: "POST",
    body: JSON.stringify({ lessonId }),
  });
  return response.json();
}
