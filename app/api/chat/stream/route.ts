
import { NextRequest, NextResponse } from "next/server";
import { Api } from "@/src/sdk/dustApi";
import type { Message, Conversation } from "@/src/sdk/dustApi";
import { z } from "zod";
import type { AxiosError } from "axios";

const { DUST_WORKSPACE_ID, DUST_API_KEY, DUST_AGENT_ID } = process.env;

function sseData(data: unknown) {
  return `data: ${JSON.stringify(data)}\n\n`;
}

function sseHeaders() {
  return {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
  };
}


export async function POST(req: NextRequest) {
  if (!DUST_WORKSPACE_ID || !DUST_API_KEY || !DUST_AGENT_ID) {
    return NextResponse.json(
      { error: "Missing Dust environment variables" },
      { status: 500 }
    );
  }

  const schema = z.object({
    message: z.string(),
    conversationId: z.string().nullable(),
    lastEventId: z.string().optional(),
  });

  let body;
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const parseResult = schema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      { error: "Invalid input", details: z.treeifyError(parseResult.error) },
      { status: 400 }
    );
  }

  const { message, conversationId, lastEventId } = parseResult.data;
  let cid: string | null = conversationId;
  let createdNewConversation = false;

  const dustApi = new Api({
    baseURL: "https://dust.tt",
    headers: {
      Authorization: `Bearer ${DUST_API_KEY}`,
    },
  });

  try {
    if (!cid) {
      const conversationCreateResponse =
        await dustApi.api.v1WAssistantConversationsCreate(DUST_WORKSPACE_ID, {
          message: {
            content: message,
            context: {
              username: "user",
              timezone: "UTC",
            },
            mentions: [
              {
                configurationId: DUST_AGENT_ID,
              },
            ],
          } satisfies Message,
          blocking: false,
        });

      cid = conversationCreateResponse.data?.conversation?.sId ?? null;
      createdNewConversation = true;

      if (!cid) {
        return NextResponse.json(
          { error: "Dust did not return a conversationId" },
          { status: 502 },
        );
      }
    } else {
      // Existing conversation: create a new message (include mentions to trigger the agent)
      await dustApi.api.v1WAssistantConversationsMessagesCreate(
        DUST_WORKSPACE_ID,
        cid,
        {
          content: message,
          context: {
            username: "user",
            timezone: "UTC",
          },
          mentions: [
            {
              configurationId: DUST_AGENT_ID,
            },
          ],
        } satisfies Message,
      );
    }
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "isAxiosError" in error &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (error as any).isAxiosError
    ) {
      const axiosError = error as AxiosError;
      console.error(
        "Axios error:",
        axiosError.message,
        axiosError.response?.data,
      );
      return NextResponse.json(
        { error: axiosError.message, details: axiosError.response?.data },
        { status: axiosError.response?.status || 500 },
      );
    }
    console.error("Unknown error:", error);
    return NextResponse.json({ error: "Unknown error occurred" }, { status: 500 });
  }

  // Stream conversation events from Dust and proxy them to the browser.
  const eventsUrl = new URL(
    `https://dust.tt/api/v1/w/${DUST_WORKSPACE_ID}/assistant/conversations/${cid}/events`,
  );
  if (lastEventId) {
    eventsUrl.searchParams.set("lastEventId", lastEventId);
  }

  const dustEventsResponse = await fetch(eventsUrl.toString(), {
    headers: {
      Authorization: `Bearer ${DUST_API_KEY}`,
      Accept: "text/event-stream",
    },
  });

  if (!dustEventsResponse.ok || !dustEventsResponse.body) {
    const details = await dustEventsResponse.text().catch(() => undefined);
    return NextResponse.json(
      { error: "Failed to connect to Dust events stream", details },
      { status: 502 },
    );
  }

  const encoder = new TextEncoder();
  const initial = createdNewConversation
    ? encoder.encode(sseData({ type: "conversation_id", conversationId: cid }))
    : null;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      if (initial) controller.enqueue(initial);

      const reader = dustEventsResponse.body!.getReader();
      const pump = (): void => {
        reader
          .read()
          .then(({ done, value }) => {
            if (done) {
              controller.close();
              return;
            }
            if (value) controller.enqueue(value);
            pump();
          })
          .catch((err) => {
            controller.error(err);
          });
      };
      pump();
    },
    cancel() {
      // Best-effort: browser disconnected.
      dustEventsResponse.body?.cancel().catch(() => undefined);
    },
  });

  return new NextResponse(stream, {
    status: 200,
    headers: sseHeaders(),
  });
  // return NextResponse.json(
  //   { error: error instanceof Error ? error.message : "Internal Server Error" },
  //   { status: 500 }
  // );
}
