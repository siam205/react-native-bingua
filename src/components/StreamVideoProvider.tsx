import { useAuth } from "@clerk/expo";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  StreamVideo,
  StreamVideoClient,
  type TokenProvider,
  type User,
} from "@stream-io/video-react-native-sdk";

import { fetchStreamSession } from "@/lib/stream-session";

/**
 * Connects the signed-in Clerk user to Stream and provides the client to the
 * whole app.
 *
 * Mounted once above the router so the WebSocket survives navigation — tearing
 * `StreamVideo` down mid-session would restart the connection. Signed-out users
 * render through untouched, so onboarding and auth never wait on Stream.
 */
export function StreamVideoProvider({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn, getToken, userId } = useAuth();
  const [client, setClient] = useState<StreamVideoClient>();

  // Clerk hands back a fresh `getToken` on most renders. Keeping it in a ref
  // rather than in the effect's dependencies is what stops connect/disconnect
  // from cycling forever and remounting the whole tree on every pass.
  const getTokenRef = useRef(getToken);
  useEffect(() => {
    getTokenRef.current = getToken;
  }, [getToken]);

  useEffect(() => {
    // No setState here: when the user signs out this effect re-runs, and the
    // previous run's cleanup has already disconnected and cleared the client.
    if (!isLoaded || !isSignedIn) return;

    let cancelled = false;
    let created: StreamVideoClient | undefined;

    (async () => {
      const session = await fetchStreamSession(getTokenRef.current);
      if (cancelled) return;

      const user: User = {
        id: session.userId,
        name: session.userName,
        image: session.userImage,
      };

      // The provider re-hits the same authenticated route, so refreshing a
      // token reuses the same Clerk check that issued the first one.
      const tokenProvider: TokenProvider = async () => {
        const fresh = await fetchStreamSession(getTokenRef.current);
        return fresh.token;
      };

      // getOrCreateInstance, never `new StreamVideoClient(...)` — multiple
      // instances break call state and push.
      created = StreamVideoClient.getOrCreateInstance({
        apiKey: session.apiKey,
        user,
        token: session.token,
        tokenProvider,
      });
      setClient(created);
    })().catch((error) => {
      // A Stream outage must not block the rest of the app; the lesson screen
      // surfaces its own error state when it tries to join without a client.
      console.error("Could not connect to Stream", error);
    });

    return () => {
      cancelled = true;
      created?.disconnectUser().catch((error) => console.error(error));
      setClient(undefined);
    };
    // getToken is deliberately absent — see the ref above.
  }, [isLoaded, isSignedIn, userId]);

  if (!client) {
    return <>{children}</>;
  }

  return <StreamVideo client={client}>{children}</StreamVideo>;
}
