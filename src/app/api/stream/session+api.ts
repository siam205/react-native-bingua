import { errorResponse, requireClerkUser } from "@/lib/server/auth";
import {
  getStreamApiKey,
  getStreamServerClient,
  TOKEN_TTL_SECONDS,
} from "@/lib/server/stream";

/**
 * Mints a Stream user token for the signed-in Clerk user.
 *
 * The app calls this once to connect and again whenever the SDK's
 * `tokenProvider` needs a fresh token, so the same auth check covers both.
 * The Stream user id comes from the verified Clerk session — the client never
 * names a user id, which is what stops one signed-in user minting a token for
 * another.
 */
export async function GET(request: Request) {
  try {
    const user = await requireClerkUser(request);
    const client = getStreamServerClient();

    const token = client.generateUserToken({
      user_id: user.id,
      validity_in_seconds: TOKEN_TTL_SECONDS,
    });

    return Response.json({
      apiKey: getStreamApiKey(),
      userId: user.id,
      userName: user.name,
      userImage: user.image,
      token,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
