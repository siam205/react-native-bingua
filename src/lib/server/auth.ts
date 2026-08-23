import { verifyToken } from "@clerk/backend";

/**
 * Server-only helpers for the Expo API routes.
 *
 * Nothing in this folder may be imported from a screen or component — it reads
 * secrets that must never reach the bundle.
 */

const clerkSecretKey = process.env.CLERK_SECRET_KEY;

export type AuthedUser = {
  id: string;
  name?: string;
  image?: string;
};

/** Thrown for anything the caller should see as a 4xx rather than a 500. */
export class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

/**
 * Resolves the Clerk user from the request's `Authorization: Bearer <token>`
 * header.
 *
 * The Stream user id is derived here, from a verified session — it is never
 * read from the query string or body. Accepting a client-supplied user id
 * would let any signed-in user mint a Stream token for somebody else.
 */
export async function requireClerkUser(request: Request): Promise<AuthedUser> {
  if (!clerkSecretKey) {
    throw new HttpError(500, "CLERK_SECRET_KEY is not configured on the server");
  }

  const header = request.headers.get("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice(7).trim() : undefined;

  if (!token) {
    throw new HttpError(401, "Missing bearer token");
  }

  try {
    const claims = await verifyToken(token, { secretKey: clerkSecretKey });

    if (!claims.sub) {
      throw new HttpError(401, "Token has no subject");
    }

    // Clerk puts the display name and avatar in custom claims only when the
    // JWT template asks for them, so both stay optional.
    const name = typeof claims.name === "string" ? claims.name : undefined;
    const image = typeof claims.picture === "string" ? claims.picture : undefined;

    return { id: claims.sub, name, image };
  } catch (error) {
    if (error instanceof HttpError) throw error;
    throw new HttpError(401, "Invalid or expired session token");
  }
}

/** Turns a thrown error into the Response the route should return. */
export function errorResponse(error: unknown): Response {
  if (error instanceof HttpError) {
    return Response.json({ error: error.message }, { status: error.status });
  }

  console.error("Unexpected API route error", error);
  return Response.json({ error: "Internal server error" }, { status: 500 });
}
