
import { NextRequest, NextResponse } from "next/server";
import { Api } from "@/src/sdk/dustApi";
import type { Message, Conversation } from "@/src/sdk/dustApi";
import { z } from "zod";

const { DUST_WORKSPACE_ID, DUST_API_KEY, DUST_AGENT_ID } = process.env;


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

  const { message, conversationId } = parseResult.data;
  let cid: string | null = conversationId;
  const dustApi = new Api({
    baseURL: "https://dust.tt",
    headers: {
      Authorization: `Bearer ${DUST_API_KEY}`,
    },
  });

  if (!cid) {
    const conversationCreateResponse = await dustApi.api.v1WAssistantConversationsCreate(process.env.DUST_WORKSPACE_ID!, {
      message: {
        content: message,
        mentions: []
      }
    });
    if (conversationCreateResponse.status !== 200 || !conversationCreateResponse.data.conversation?.created) {
      const errorMsg = conversationCreateResponse.statusText || "Internal Server Error";
      return NextResponse.json(
        { error: errorMsg },
        { status: conversationCreateResponse.status || 500 }
      );
    }
  }

  console.log("__RES", parseResult.data);
  return NextResponse.json({});
  // return NextResponse.json(
  //   { error: error instanceof Error ? error.message : "Internal Server Error" },
  //   { status: 500 }
  // );
}
