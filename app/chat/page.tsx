"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "../components/Navbar";

// Define Types
type Message = {
  sId: string;
  type: "user_message" | "agent_message" | "content_fragment";
  content: string;
  visibility: "visible" | "deleted";
  created: number;
};

type ConversationData = {
  conversation: {
    sId: string;
    content: Message[][]; // Pages of messages
  };
};

function ChatInterface() {
  const searchParams = useSearchParams();
  const cId = searchParams.get("cId");
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversation history
  const fetchConversation = async () => {
    if (!cId) return;
    try {
      const res = await fetch(`/api/chat/${cId}`);
      if (res.ok) {
        const data: ConversationData = await res.json();
        // Flatten pages
        const allMessages = data.conversation.content.flat();
        // Filter out content fragments if needed, or keeping them for context? 
        // Usually we only want user_message and agent_message
        const visibleMessages = allMessages.filter(
            (m) => m.type === "user_message" || m.type === "agent_message"
        );
        setMessages(visibleMessages);
      }
    } catch (err) {
      console.error("Error fetching conversation", err);
    }
  };

  useEffect(() => {
    if (cId) {
      fetchConversation();
      // Poll every 3 seconds to check for new messages
      const interval = setInterval(fetchConversation, 3000);
      return () => clearInterval(interval);
    }
  }, [cId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !cId) return;
    
    const userMsg = input;
    setInput("");
    setLoading(true);

    // Optimistic update? Maybe not for now to be safe.
    
    try {
      await fetch(`/api/chat/${cId}`, {
        method: "POST",
        body: JSON.stringify({ message: userMsg }),
      });
      // Immediate fetch to show user message
      await fetchConversation();
    } catch (err) {
      console.error("Error sending message", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-dark text-white">
        <Navbar />
        <div className="flex-grow pt-24 pb-32 overflow-y-auto px-4 sm:px-6 md:px-12 layout-container max-w-[1200px]">
            <div className="flex flex-col gap-6">
                {messages.length === 0 && (
                    <div className="text-center text-text-muted mt-20 animate-pulse">
                        Initializing secure channel...
                    </div>
                )}
                
                {messages.map((msg) => (
                    <div
                        key={msg.sId}
                        className={`flex w-full ${
                            msg.type === "user_message" ? "justify-end" : "justify-start"
                        }`}
                    >
                        <div
                            className={`max-w-[80%] md:max-w-[70%] p-4 rounded-sm border ${
                                msg.type === "user_message"
                                    ? "bg-slate-panel border-gold-primary/30 text-white"
                                    : "glass-panel-luxury text-gray-200 border-gold-primary/10"
                            }`}
                        >
                            {msg.type === "agent_message" && (
                                <div className="text-[10px] text-gold-primary uppercase tracking-widest mb-2 font-bold">
                                    ChainBridge Intelligence
                                </div>
                            )}
                            <div className="whitespace-pre-wrap font-light text-sm md:text-base leading-relaxed">
                                {msg.content || "..."}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
        </div>

        {/* Input Area */}
        <div className="fixed bottom-0 left-0 w-full bg-slate-dark/90 backdrop-blur-md border-t border-white/5 p-4 z-40">
            <div className="layout-container max-w-[1200px] mx-auto flex gap-4 items-end">
                <div className="relative flex-grow">
                     <textarea
                        className="w-full bg-slate-panel border border-white/10 focus:border-gold-primary/50 rounded-sm px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none resize-none min-h-[60px]"
                        placeholder="Type your requirements..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={loading}
                    />
                </div>
                <button
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    className="h-[60px] px-8 bg-gold-primary text-slate-900 font-bold uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    <span className="material-symbols-outlined">send</span>
                </button>
            </div>
        </div>
    </div>
  );
}

export default function ChatPage() {
    return (
        <Suspense fallback={<div className="bg-slate-dark h-screen flex items-center justify-center text-gold-primary">Loading Interface...</div>}>
            <ChatInterface />
        </Suspense>
    );
}
