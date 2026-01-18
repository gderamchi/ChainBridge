import { DustAPI } from "@dust-tt/client";
import { NextResponse } from "next/server";

const WORKSPACE_ID = process.env.DUST_WORKSPACE_ID!;
const API_KEY = process.env.DUST_API_KEY!;
const AGENT_ID = process.env.DUST_AGENT_ID!;

function getDustClient() {
  return new DustAPI(
    { url: "https://dust.tt" },
    { workspaceId: WORKSPACE_ID, apiKey: API_KEY },
    console
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (!WORKSPACE_ID || !API_KEY || !AGENT_ID) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const dustClient = getDustClient();

    const result = await dustClient.createConversation({
      title: message.substring(0, 50) + (message.length > 50 ? "..." : ""),
      visibility: "unlisted",
      message: {
        content: message,
        mentions: [{ configurationId: AGENT_ID }],
        context: {
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
          username: "Guest",
          fullName: "Guest User",
          email: "guest@chainbridge.ai",
          origin: "api",
        },
      },
      blocking: true,
    });

    if (result.isErr()) {
      console.error("Dust API Error:", result.error);
      return NextResponse.json(
        { error: "Failed to communicate with AI agent" },
        { status: 500 }
      );
    }

    const { conversation } = result.value;

    // Find the agent message in the conversation content
    const contentPage = conversation.content[conversation.content.length - 1];
    const agentMessage = contentPage.find(
      (msg) => msg.type === "agent_message"
    );

    const answer = agentMessage?.content || "No response from agent.";

    return NextResponse.json({ answer, conversationId: conversation.sId });
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
