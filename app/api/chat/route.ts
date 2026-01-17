import { NextResponse } from "next/server";

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

    const WORKSPACE_ID = process.env.DUST_WORKSPACE_ID;
    const API_KEY = process.env.DUST_API_KEY;
    const AGENT_ID = process.env.DUST_AGENT_ID;

    if (!WORKSPACE_ID || !API_KEY || !AGENT_ID) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://dust.tt/api/v1/w/${WORKSPACE_ID}/assistant/conversations`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: {
            content: message,
            mentions: [
              {
                configurationId: AGENT_ID,
              },
            ],
            context: {
              timezone: "America/Los_Angeles",
              username: "Guest",
              fullName: "Guest User",
              email: "guest@example.com",
              profilePictureUrl: "",
            },
          },
          blocking: true,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Dust API Error:", errorData);
      return NextResponse.json(
        { error: "Failed to communicate with AI agent" },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Extract the text content from the agent's message
    // The structure typically involves conversation -> content -> [array of messages]
    // We need to find the message from the agent.
    const agentMessage = data.conversation.content.find(
      (msg: any) => msg.agentConfigurationId === AGENT_ID
    );

    const answer = agentMessage ? agentMessage.content : "No response from agent.";

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
