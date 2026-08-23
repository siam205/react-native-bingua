import { errorResponse, HttpError, requireClerkUser } from "@/lib/server/auth";
import {
  getStreamServerClient,
  LESSON_CALL_TYPE,
  lessonCallId,
} from "@/lib/server/stream";
import { getLesson } from "@/data/lessons";
import { getUnit } from "@/data/units";

/**
 * Reserves the Stream call for a lesson and returns its id.
 *
 * Creating the call server-side keeps the lesson metadata trustworthy — the
 * client sends only a lesson id, and the curriculum lookup happens here, so a
 * caller cannot invent a lesson title or language for the session.
 */
export async function POST(request: Request) {
  try {
    const user = await requireClerkUser(request);

    const body = (await request.json().catch(() => null)) as {
      lessonId?: unknown;
    } | null;

    const lessonId = typeof body?.lessonId === "string" ? body.lessonId : undefined;
    if (!lessonId) {
      throw new HttpError(400, "lessonId is required");
    }

    const lesson = getLesson(lessonId);
    if (!lesson) {
      throw new HttpError(404, `Unknown lesson: ${lessonId}`);
    }

    const unit = getUnit(lesson.unitId);
    const callId = lessonCallId(user.id, lesson.id);
    const call = getStreamServerClient().video.call(LESSON_CALL_TYPE, callId);

    await call.getOrCreate({
      // Audio-only session: no camera track is ever published.
      video: false,
      data: {
        created_by_id: user.id,
        video: false,
        members: [{ user_id: user.id, role: "host" }],
        // Read back by the app to label the session, and useful on the
        // dashboard when inspecting a call.
        custom: {
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          unitId: lesson.unitId,
          languageId: unit?.languageId ?? null,
          teacherPersona: lesson.aiTeacher?.persona ?? null,
        },
        // Audio settings only. Sending a partial `video` override fails
        // validation — Stream merges it with a zeroed default and then demands
        // target_resolution >= 240, even though video is off. `video: false`
        // above plus the client's camera.disable() already keep this audio-only.
        settings_override: {
          audio: { mic_default_on: true, default_device: "speaker" },
        },
      },
    });

    return Response.json({
      callType: LESSON_CALL_TYPE,
      callId,
      lessonId: lesson.id,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
