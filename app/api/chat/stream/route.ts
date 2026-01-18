import type { DustAPI } from "@dust-tt/client";
import { NextResponse } from "next/server";

const WORKSPACE_ID = process.env.DUST_WORKSPACE_ID!;
const API_KEY = process.env.DUST_API_KEY!;
const AGENT_ID = process.env.DUST_AGENT_ID!;
const DUST_API_URL = "https://dust.tt";

// Infer types from the SDK
type Conversation = Parameters<DustAPI["streamAgentAnswerEvents"]>[0]["conversation"];
type CreateConversationParams = Parameters<DustAPI["createConversation"]>[0];
type PostUserMessageParams = Parameters<DustAPI["postUserMessage"]>[0];

// API response types
interface CreateConversationResponse {
  conversation: Conversation;
  message: { sId: string } | null;
}

interface PostMessageResponse {
  sId: string;
}

interface GetConversationResponse {
  conversation: Conversation;
}

// Helper for API requests
async function dustFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${DUST_API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `API request failed: ${response.status}`);
  }

  return response.json();
}

// Helper to find the agent message ID from a conversation
async function findAgentMessageId(
  conversationId: string,
  userMessageId: string
): Promise<string | null> {
  const { conversation } = await dustFetch<GetConversationResponse>(
    `/api/v1/w/${WORKSPACE_ID}/assistant/conversations/${conversationId}`
  );

  // Find the agent message that is a reply to our user message
  for (const versions of conversation.content) {
    const message = versions[versions.length - 1];
    if (
      message &&
      message.type === "agent_message" &&
      message.parentMessageId === userMessageId
    ) {
      return message.sId;
    }
  }
  return null;
}

// Create SSE stream from message-level events endpoint
function createStreamResponse(
  conversationId: string,
  userMessageId: string
): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // First, find the agent message ID
        const agentMessageId = await findAgentMessageId(conversationId, userMessageId);
        
        if (!agentMessageId) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "error", error: "No agent message found" })}\n\n`
            )
          );
          controller.close();
          return;
        }

        // Use message-level events endpoint (like the SDK does)
        const eventSourceUrl = `${DUST_API_URL}/api/v1/w/${WORKSPACE_ID}/assistant/conversations/${conversationId}/messages/${agentMessageId}/events`;
        
        const response = await fetch(eventSourceUrl, {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            Accept: "text/event-stream",
          },
        });

        if (!response.ok) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "error", error: `Failed to connect to event stream: ${response.status}` })}\n\n`
            )
          );
          controller.close();
          return;
        }

        const reader = response.body?.getReader();
        if (!reader) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "error", error: "No response body" })}\n\n`
            )
          );
          controller.close();
          return;
        }

        const decoder = new TextDecoder();
        let buffer = "";
        let answer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "done" || data === "[DONE]") continue;

              try {
                // Events are wrapped in { eventId, data } format
                const eventWrapper = JSON.parse(data);
                const event = eventWrapper.data || eventWrapper;
                
                switch (event.type) {
                  case "user_message_error":
                    controller.enqueue(
                      encoder.encode(
                        `data: ${JSON.stringify({ type: "error", error: event.error?.message || "User message error" })}\n\n`
                      )
                    );
                    break;
                  case "agent_error":
                    controller.enqueue(
                      encoder.encode(
                        `data: ${JSON.stringify({ type: "error", error: event.error?.message || "Agent error" })}\n\n`
                      )
                    );
                    controller.close();
                    return;
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
                          conversationId,
                          messageId: event.message?.sId || agentMessageId,
                          content: event.message?.content || answer
                        })}\n\n`
                      )
                    );
                    controller.close();
                    return;
                  case "end-of-stream":
                    // Terminal event from Dust
                    controller.close();
                    return;
                }
              } catch {
                // Skip invalid JSON
              }
            }
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

    // If no conversationId, create a new conversation
    if (conversationId == null) {
      console.log("__CONV_CREATED__");
      
      const createPayload: CreateConversationParams = {
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
      };

      const result = await dustFetch<CreateConversationResponse>(
        `/api/v1/w/${WORKSPACE_ID}/assistant/conversations`,
        {
          method: "POST",
          body: JSON.stringify(createPayload),
        }
      );

      if (!result.message) {
        return NextResponse.json(
          { error: "No message created" },
          { status: 500 }
        );
      }

      return createStreamResponse(result.conversation.sId, result.message.sId);
    } else {
      // Post to existing conversation
      console.log("__MSG_POST__");
      
      const messagePayload: PostUserMessageParams["message"] = {
        content: message,
        mentions: [{ configurationId: AGENT_ID }],
        context: {
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
          username: "Guest",
          fullName: "Guest User",
          email: "guest@chainbridge.ai",
          origin: "api",
        },
      };

      const messageResult = await dustFetch<PostMessageResponse>(
        `/api/v1/w/${WORKSPACE_ID}/assistant/conversations/${conversationId}/messages`,
        {
          method: "POST",
          body: JSON.stringify(messagePayload),
        }
      );

      return createStreamResponse(conversationId, messageResult.sId);
    }
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
