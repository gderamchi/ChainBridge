"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import {
  createChatMessage,
  createLocalConversationId,
  useChat,
} from "@/app/contexts/chat-context";

export default function AIChat() {
  const {
    conversations,
    selectedConversationId,
    selectedConversation,
    actions,
  } = useChat();

  const conversationId = selectedConversationId;
  const messages = useMemo(
    () => selectedConversation?.messages ?? [],
    [selectedConversation],
  );

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  // Ensure there's always a selected conversation slot to write to.
  useEffect(() => {
    if (conversationId) return;
    if (Object.keys(conversations).length > 0) return;

    const localId = createLocalConversationId();
    actions.upsertConversation({
      conversationId: localId,
      messages: [],
      updatedAt: Date.now(),
    });
    actions.selectConversation(localId);
  }, [actions, conversationId, conversations]);

  const ensureSelectedConversation = () => {
    if (conversationId) return conversationId;
    const localId = createLocalConversationId();
    actions.upsertConversation({
      conversationId: localId,
      messages: [],
      updatedAt: Date.now(),
    });
    actions.selectConversation(localId);
    return localId;
  };

  const resolveDustConversationId = () => {
    if (!conversationId) return null;
    if (conversationId.startsWith("local-")) return null;
    return conversationId;
  };

  const handleSSE = async (response: Response, localConversationId: string) => {
    const reader = response.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();
    let buffer = "";
    let currentContent = "";
    let currentEventId: string | null = null;
    let mappedConversationId = localConversationId;

    const flushEvent = (rawData: string) => {
      const trimmed = rawData.trim();
      if (!trimmed) return;

      let payload: any;
      try {
        payload = JSON.parse(trimmed);
      } catch {
        return;
      }

      // Track lastEventId (either SSE id or embedded id).
      const lastEventId =
        typeof payload?.id === "string" ? payload.id : currentEventId;
      if (lastEventId && !mappedConversationId.startsWith("local-")) {
        actions.setLastEventId(mappedConversationId, lastEventId);
      }

      // Custom event injected by our API route.
      if (payload?.type === "conversation_id" && payload?.conversationId) {
        const dustId = String(payload.conversationId);

        // Migrate local conversation state to the Dust conversationId.
        const existing = conversations[localConversationId];
        actions.upsertConversation({
          conversationId: dustId,
          title: existing?.title,
          messages: existing?.messages ?? [],
          updatedAt: Date.now(),
        });
        actions.deleteConversation(localConversationId);
        actions.selectConversation(dustId);
        mappedConversationId = dustId;
        return;
      }

      // Dust SSE events (see https://docs.dust.tt/reference/events.md)
      switch (payload?.type) {
        case "conversation_title": {
          if (mappedConversationId.startsWith("local-")) break;
          if (typeof payload?.title === "string") {
            actions.setTitle(mappedConversationId, payload.title);
          }
          break;
        }
        case "generation_tokens": {
          if (typeof payload?.text === "string") {
            currentContent += payload.text;
            setStreamingContent(currentContent);
          }
          break;
        }
        case "agent_message_success": {
          const content =
            typeof payload?.message?.content === "string"
              ? payload.message.content
              : currentContent;

          const messageId =
            typeof payload?.messageId === "string"
              ? payload.messageId
              : `msg-${Date.now()}`;

          if (!mappedConversationId.startsWith("local-")) {
            actions.addMessage(
              mappedConversationId,
              createChatMessage({
                sId: messageId,
                type: "agent_message",
                content,
              }),
            );
          }
          setStreamingContent("");
          currentContent = "";
          break;
        }
        case "agent_error": {
          const err = payload?.error?.message || "Unknown error";
          if (!mappedConversationId.startsWith("local-")) {
            actions.addMessage(
              mappedConversationId,
              createChatMessage({
                sId: `error-${Date.now()}`,
                type: "agent_message",
                content: `Error: ${err}`,
              }),
            );
          }
          setStreamingContent("");
          currentContent = "";
          break;
        }
      }
    };

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      buffer += chunk;

      // SSE frames are separated by a blank line.
      const parts = buffer.split("\n\n");
      buffer = parts.pop() ?? "";

      for (const part of parts) {
        const lines = part.split("\n");
        currentEventId = null;
        let dataLines: string[] = [];

        for (const line of lines) {
          const trimmedLine = line.trimEnd();
          if (trimmedLine.startsWith("id:")) {
            currentEventId = trimmedLine.slice(3).trim();
            continue;
          }
          if (trimmedLine.startsWith("data:")) {
            dataLines.push(trimmedLine.slice(5).trimStart());
            continue;
          }
        }

        const data = dataLines.join("\n");
        flushEvent(data);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const activeConversationId = ensureSelectedConversation();
    const dustConversationId = resolveDustConversationId();

    const userMessage = createChatMessage({
      sId: `temp-${Date.now()}`,
      type: "user_message",
      content: input.trim(),
    });

    // For local conversation placeholder, we still append in-place.
    actions.addMessage(activeConversationId, userMessage);
    setInput("");
    setIsLoading(true);
    setStreamingContent("");

    try {
      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          conversationId: dustConversationId,
          lastEventId:
            dustConversationId
              ? conversations[dustConversationId]?.lastEventId
              : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      await handleSSE(response, activeConversationId);
    } catch (error) {
      console.error("Error sending message:", error);
      actions.addMessage(
        ensureSelectedConversation(),
        createChatMessage({
          sId: `error-${Date.now()}`,
          type: "agent_message",
          content: "Sorry, there was an error processing your request.",
        }),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    const localId = createLocalConversationId();
    actions.upsertConversation({
      conversationId: localId,
      messages: [],
      updatedAt: Date.now(),
    });
    actions.selectConversation(localId);
    setStreamingContent("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">AI Assistant</h2>
        <button
          onClick={handleNewChat}
          className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
        >
          New Chat
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !streamingContent && (
          <div className="text-center text-gray-500 mt-8">
            <p>Start a conversation by typing a message below.</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.sId}
            className={`flex ${message.type === "user_message" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.type === "user_message"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              {message.type === "agent_message" ? (
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              ) : (
                <p>{message.content}</p>
              )}
            </div>
          </div>
        ))}

        {/* Streaming message */}
        {streamingContent && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-lg bg-gray-100 text-gray-900">
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown>{streamingContent}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {isLoading && !streamingContent && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-lg bg-gray-100 text-gray-900">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}