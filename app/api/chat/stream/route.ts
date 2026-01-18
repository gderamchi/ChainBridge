
import { NextRequest, NextResponse } from "next/server";
import { Api } from "@/src/sdk/dustApi";
import type { Message, Conversation } from "@/src/sdk/dustApi";

const { DUST_WORKSPACE_ID, DUST_API_KEY, DUST_AGENT_ID } = process.env;

export async function POST(req: NextRequest) {
  if (!DUST_WORKSPACE_ID || !DUST_API_KEY || !DUST_AGENT_ID) {
    return NextResponse.json(
      { error: "Missing Dust environment variables" },
      { status: 500 }
    );
  }

    const { message, conversationId } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const dustApi = new Api({
      baseURL: "https://dust.tt",
      headers: {
        Authorization: `Bearer ${DUST_API_KEY}`,
      },
    });

    return NextResponse.json({})
    // return NextResponse.json(
    //   { error: error instanceof Error ? error.message : "Internal Server Error" },
    //   { status: 500 }
    // );
}
