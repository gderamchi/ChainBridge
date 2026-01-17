import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ cId: string }> }
) {
  try {
    const { cId } = await params;
    
    if (!cId) {
      return NextResponse.json(
        { error: "Conversation ID is required" },
        { status: 400 }
      );
    }

    const WORKSPACE_ID = process.env.DUST_WORKSPACE_ID;
    const API_KEY = process.env.DUST_API_KEY;

    const response = await fetch(
      `https://dust.tt/api/v1/w/${WORKSPACE_ID}/assistant/conversations/${cId}`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    if (!response.ok) {
        // Log error
        const err = await response.text();
        console.error("Dust API Error (GET conversation):", err);
        return NextResponse.json({ error: "Failed to fetch conversation" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ cId: string }> }
) {
  try {
    const { cId } = await params;
    const body = await request.json();
    const { message } = body;

    const WORKSPACE_ID = process.env.DUST_WORKSPACE_ID;
    const API_KEY = process.env.DUST_API_KEY;
    const AGENT_ID = process.env.DUST_AGENT_ID;

    // Send User Message
    const response = await fetch(
      `https://dust.tt/api/v1/w/${WORKSPACE_ID}/assistant/conversations/${cId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
        }),
      }
    );

    if (!response.ok) {
        const err = await response.text();
        console.error("Dust API Error (POST message):", err);
        return NextResponse.json({ error: "Failed to send message" }, { status: response.status });
    }
    
    // We assume the Dust API triggers the agent automatically after a user message.
    // If we need to wait for the reply, we might need to poll or handle events.
    // However, the `blocking: true` option is available on conversation creation, but not strictly documented for message creation in my previous search.
    // Let's check the response.
    
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
