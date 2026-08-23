import { useAuth } from "@clerk/expo";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Call,
  CallingState,
  useStreamVideoClient,
} from "@stream-io/video-react-native-sdk";

import { createLessonCall } from "@/lib/stream-session";

/**
 * Every state the audio lesson UI can be in.
 *
 * `idle` is the pre-join state: the screen renders fully, the learner just has
 * not started the session yet.
 */
export type LessonCallStatus =
  | "idle"
  | "loading"
  | "connecting"
  | "joined"
  | "ended"
  | "error";

type UseLessonCall = {
  status: LessonCallStatus;
  call: Call | undefined;
  error: string | undefined;
  start: () => Promise<void>;
  end: () => Promise<void>;
};

/**
 * Owns the Stream call for one lesson: reserving it server-side, joining as
 * audio-only, and leaving cleanly.
 *
 * The call is created exactly once here — this hook is the single owner of the
 * `(type, id)` pair, and everything inside `<StreamCall>` reads it via
 * `useCall()` rather than calling `client.call(...)` again.
 */
export function useLessonCall(lessonId: string | undefined): UseLessonCall {
  const client = useStreamVideoClient();
  const { getToken } = useAuth();

  const [call, setCall] = useState<Call>();
  const [status, setStatus] = useState<LessonCallStatus>("idle");
  const [error, setError] = useState<string>();

  // Mirrors `call` so the unmount effect can leave without depending on it.
  // Written from the handlers only — never during render.
  const callRef = useRef<Call | undefined>(undefined);

  const start = useCallback(async () => {
    if (!lessonId) return;

    if (!client) {
      setStatus("error");
      setError("Not connected to Stream yet. Check your connection and try again.");
      return;
    }

    try {
      setError(undefined);
      setStatus("loading");

      // The server reserves the call and owns the lesson metadata.
      const { callType, callId } = await createLessonCall(getToken, lessonId);

      setStatus("connecting");

      // `reuseInstance` is required: this (type, id) may already exist in the
      // SDK's managed state, and a duplicate leaks SFU connections.
      const nextCall = client.call(callType, callId, { reuseInstance: true });
      callRef.current = nextCall;
      setCall(nextCall);

      // Audio only — disable the camera before joining so no video track is
      // ever published, then join.
      await nextCall.camera.disable();
      await nextCall.join({ create: true });
      await nextCall.microphone.enable();

      setStatus("joined");
    } catch (caught) {
      console.error("Could not start the lesson call", caught);
      setStatus("error");
      setError(caught instanceof Error ? caught.message : "Could not start the session");
    }
  }, [client, getToken, lessonId]);

  const end = useCallback(async () => {
    const active = callRef.current;
    setStatus("ended");

    if (active && active.state.callingState !== CallingState.LEFT) {
      await active.leave().catch((caught) => console.error(caught));
    }
    callRef.current = undefined;
    setCall(undefined);
  }, []);

  // Leave on unmount so a backgrounded screen never keeps publishing audio.
  // Guarded, because a manual hangup may already have left the call.
  useEffect(() => {
    return () => {
      const active = callRef.current;
      if (active && active.state.callingState !== CallingState.LEFT) {
        active.leave().catch((caught) => console.error(caught));
      }
    };
  }, []);

  return { status, call, error, start, end };
}
