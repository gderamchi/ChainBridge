import { DustAPI } from "@dust-tt/client";
import { NextResponse } from "next/server";

const WORKSPACE_ID = process.env.DUST_WORKSPACE_ID!;
const API_KEY = process.env.DUST_API_KEY!;
const AGENT_ID = process.env.DUST_AGENT_ID!;

function getDustClient() {
  return new DustAPI(
    {
      url: "https://dust.tt",
    },
    {
      workspaceId: WORKSPACE_ID,
      apiKey: API_KEY,
    },
    console
  );
}

// Create a new conversation
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, conversationId } = body;

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

    // If no conversationId, create a new conversation
    if (!conversationId) {
      const conversationRes = await dustClient.createConversation({
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
      });

      if (conversationRes.isErr()) {
        console.error("Error creating conversation:", conversationRes.error);
        return NextResponse.json(
          { error: conversationRes.error.message },
          { status: 500 }
        );
      }

      const { conversation, message: userMessage } = conversationRes.value;

      if (!userMessage) {
        return NextResponse.json(
          { error: "No message created" },
          { status: 500 }
        );
      }

      // Stream the response
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            const streamRes = await dustClient.streamAgentAnswerEvents({
              conversation,
              userMessageId: userMessage.sId,
            });

            if (streamRes.isErr()) {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ type: "error", error: streamRes.error.message })}\n\n`
                )
              );
              controller.close();
              return;
            }

            const { eventStream } = streamRes.value;
            let answer = "";

            for await (const event of eventStream) {
              if (!event) continue;

              switch (event.type) {
                case "user_message_error":
                  controller.enqueue(
                    encoder.encode(
                      `data: ${JSON.stringify({ type: "error", error: event.error.message })}\n\n`
                    )
                  );
                  break;
                case "agent_error":
                  controller.enqueue(
                    encoder.encode(
                      `data: ${JSON.stringify({ type: "error", error: event.error.message })}\n\n`
                    )
                  );
                  break;
                case "generation_tokens":
                  if (event.classification === "tokens") {
                    answer = (answer + event.text).trim();
                    controller.enqueue(
                      encoder.encode(
                        `data: ${JSON.stringify({ type: "tokens", text: event.text, fullAnswer: answer })}\n\n`
                      )
                    );
                  }
                  break;
                case "agent_message_success":
                  controller.enqueue(
                    encoder.encode(
                      `data: ${JSON.stringify({ 
                        type: "done", 
                        conversationId: conversation.sId,
                        messageId: event.message.sId,
                        content: event.message.content || answer
                      })}\n\n`
                    )
                  );
                  break;
              }
            }

            controller.close();
          } catch (error) {
            console.error("Streaming error:", error);
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: "error", error: "Streaming failed" })}\n\n`
              )
            );
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    } else {
      // Post to existing conversation
      const messageRes = await dustClient.postUserMessage({
        conversationId,
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
      });

      if (messageRes.isErr()) {
        console.error("Error posting message:", messageRes.error);
        return NextResponse.json(
          { error: messageRes.error.message },
          { status: 500 }
        );
      }

      const userMessage = messageRes.value;

      // Get the conversation for streaming
      const convRes = await dustClient.getConversation({ conversationId });
      if (convRes.isErr()) {
        return NextResponse.json(
          { error: convRes.error.message },
          { status: 500 }
        );
      }

      const conversation = convRes.value;

      // Stream the response
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            const streamRes = await dustClient.streamAgentAnswerEvents({
              conversation,
              userMessageId: userMessage.sId,
            });

            if (streamRes.isErr()) {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ type: "error", error: streamRes.error.message })}\n\n`
                )
              );
              controller.close();
              return;
            }

            const { eventStream } = streamRes.value;
            let answer = "";

            for await (const event of eventStream) {
              if (!event) continue;

              switch (event.type) {
                case "user_message_error":
                  controller.enqueue(
                    encoder.encode(
                      `data: ${JSON.stringify({ type: "error", error: event.error.message })}\n\n`
                    )
                  );
                  break;
                case "agent_error":
                  controller.enqueue(
                    encoder.encode(
                      `data: ${JSON.stringify({ type: "error", error: event.error.message })}\n\n`
                    )
                  );
                  break;
                case "generation_tokens":
                  if (event.classification === "tokens") {
                    answer = (answer + event.text).trim();
                    controller.enqueue(
                      encoder.encode(
                        `data: ${JSON.stringify({ type: "tokens", text: event.text, fullAnswer: answer })}\n\n`
                      )
                    );
                  }
                  break;
                case "agent_message_success":
                  controller.enqueue(
                    encoder.encode(
                      `data: ${JSON.stringify({ 
                        type: "done", 
                        conversationId: conversation.sId,
                        messageId: event.message.sId,
                        content: event.message.content || answer
                      })}\n\n`
                    )
                  );
                  break;
              }
            }

            controller.close();
          } catch (error) {
            console.error("Streaming error:", error);
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: "error", error: "Streaming failed" })}\n\n`
              )
            );
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
