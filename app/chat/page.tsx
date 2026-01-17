"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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

type HistoryItem = {
  cId: string;
  title: string;
  timestamp: number;
};

function ChatInterface() {
  const searchParams = useSearchParams();
  const cId = searchParams.get("cId");
  const router = useRouter();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("chainbridge_history");
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  // Save conversation to history if new
  useEffect(() => {
    if (cId && messages.length > 0) {
      setHistory((prev) => {
        const exists = prev.find((h) => h.cId === cId);
        if (exists) return prev;

        // Try to find a title from the first user message
        const firstUserMsg = messages.find((m) => m.type === "user_message");
        const title = firstUserMsg ? firstUserMsg.content.slice(0, 30) + "..." : "New Inquiry";

        const newItem = { cId, title, timestamp: Date.now() };
        const newHistory = [newItem, ...prev];
        localStorage.setItem("chainbridge_history", JSON.stringify(newHistory));
        return newHistory;
      });
    }
  }, [cId, messages]);

  // Fetch conversation history
  const fetchConversation = async () => {
    if (!cId) {
        setMessages([]);
        return;
    }
    try {
      const res = await fetch(`/api/chat/${cId}`);
      if (res.ok) {
        const data: ConversationData = await res.json();
        const allMessages = data.conversation.content.flat();
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
    fetchConversation();
    if (cId) {
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

    try {
      await fetch(`/api/chat/${cId}`, {
        method: "POST",
        body: JSON.stringify({ message: userMsg }),
      });
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

  const startNewChat = () => {
      router.push("/");
  };

  return (
    <div className="flex h-screen bg-slate-dark text-white overflow-hidden">
        {/* Sidebar */}
        <div 
            className={`flex-shrink-0 bg-slate-panel border-r border-white/5 transition-all duration-300 flex flex-col ${
                isSidebarOpen ? "w-72" : "w-0 overflow-hidden"
            }`}
        >
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <span className="text-xs font-serif uppercase tracking-widest text-gold-primary">History</span>
                <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-500">
                    <span className="material-symbols-outlined text-sm">close</span>
                </button>
            </div>
            <div className="p-4">
                 <button 
                    onClick={startNewChat}
                    className="w-full py-3 px-4 bg-gold-primary/10 hover:bg-gold-primary/20 border border-gold-primary/30 text-gold-primary text-xs font-bold uppercase tracking-widest rounded-sm flex items-center justify-center gap-2 transition-colors"
                >
                    <span className="material-symbols-outlined text-sm">add</span>
                    New Sourcing
                </button>
            </div>
            <div className="flex-grow overflow-y-auto px-2">
                {history.map((item) => (
                    <Link
                        key={item.cId}
                        href={`/chat?cId=${item.cId}`}
                        className={`block p-3 mb-1 rounded-sm text-sm transition-colors ${
                            cId === item.cId 
                                ? "bg-white/5 text-white border-l-2 border-gold-primary" 
                                : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                        }`}
                    >
                        <div className="truncate font-light">{item.title}</div>
                        <div className="text-[10px] text-gray-600 mt-1">{new Date(item.timestamp).toLocaleDateString()}</div>
                    </Link>
                ))}
                {history.length === 0 && (
                    <div className="text-center text-gray-600 text-xs mt-10 p-4">
                        No recent inquiries.
                    </div>
                )}
            </div>
             <div className="p-4 border-t border-white/5">
                <div className="flex items-center gap-3 opacity-60 hover:opacity-100 cursor-pointer transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-primary to-slate-900 border border-gold-primary/30"></div>
                    <div>
                        <div className="text-xs font-medium text-white">Guest User</div>
                        <div className="text-[10px] text-gray-500">Upgrade to Pro</div>
                    </div>
                </div>
            </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-grow flex flex-col h-full relative">
            {/* Header */}
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-slate-dark/95 backdrop-blur z-20">
                <div className="flex items-center gap-4">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-400 hover:text-gold-primary transition-colors">
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                    <Link href="/" className="text-white font-serif tracking-widest uppercase text-sm">ChainBridge <span className="text-gold-primary">/ Intel</span></Link>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-[10px] uppercase tracking-widest text-green-500">Agent Active</span>
                    </div>
                </div>
            </header>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto px-4 sm:px-6 md:px-12 py-8 scroll-smooth">
                 <div className="max-w-[1000px] mx-auto flex flex-col gap-8 pb-32">
                    {messages.length === 0 && (
                        <div className="text-center text-gray-600 mt-20">
                            <span className="material-symbols-outlined text-4xl mb-4 opacity-50">encrypted</span>
                            <p className="text-sm font-light tracking-wide">Initializing secure channel with manufacturers database...</p>
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
                                className={`max-w-[95%] md:max-w-[85%] rounded-sm p-5 border ${
                                    msg.type === "user_message"
                                        ? "bg-slate-panel border-gold-primary/30 text-white"
                                        : "glass-panel-luxury text-gray-200 border-gold-primary/10 w-full"
                                }`}
                            >
                                {msg.type === "agent_message" && (
                                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/5">
                                        <span className="material-symbols-outlined text-gold-primary text-sm">smart_toy</span>
                                        <div className="text-[10px] text-gold-primary uppercase tracking-widest font-bold">
                                            ChainBridge Intelligence
                                        </div>
                                    </div>
                                )}
                                <div className={`prose prose-invert prose-p:font-light prose-p:leading-relaxed prose-headings:font-serif prose-headings:tracking-wide prose-a:text-gold-primary prose-strong:text-white prose-strong:font-medium max-w-none ${msg.type === "user_message" ? "text-right" : "text-left"}`}>
                                    <ReactMarkdown 
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            table: ({node, ...props}) => <div className="overflow-x-auto my-4"><table className="min-w-full text-left text-sm whitespace-nowrap border-collapse border border-white/10" {...props} /></div>,
                                            thead: ({node, ...props}) => <thead className="bg-white/5 text-gold-primary uppercase text-xs tracking-wider" {...props} />,
                                            th: ({node, ...props}) => <th className="p-3 border-b border-white/10 font-medium" {...props} />,
                                            td: ({node, ...props}) => <td className="p-3 border-b border-white/5 text-gray-300" {...props} />,
                                            a: ({node, ...props}) => <a className="text-gold-primary hover:underline decoration-1 underline-offset-4" target="_blank" rel="noopener noreferrer" {...props} />,
                                            ul: ({node, ...props}) => <ul className="list-disc pl-5 my-2 space-y-1 text-gray-300" {...props} />,
                                            ol: ({node, ...props}) => <ol className="list-decimal pl-5 my-2 space-y-1 text-gray-300" {...props} />,
                                            blockquote: ({node, ...props}) => <blockquote className="border-l-2 border-gold-primary/50 pl-4 italic text-gray-400 my-4" {...props} />,
                                        }}
                                    >
                                        {msg.content || ""}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="absolute bottom-0 left-0 w-full bg-slate-dark/90 backdrop-blur-xl border-t border-white/5 p-4 z-40">
                <div className="max-w-[1000px] mx-auto flex gap-4 items-end">
                    <div className="relative flex-grow group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-gold-primary/20 to-transparent opacity-0 group-focus-within:opacity-100 transition duration-500 blur-sm rounded-sm"></div>
                        <textarea
                            className="relative w-full bg-slate-panel border border-white/10 focus:border-gold-primary/50 rounded-sm px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none resize-none min-h-[60px] shadow-xl"
                            placeholder="Ask follow-up questions or refine requirements..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={loading}
                        />
                    </div>
                    <button
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        className="h-[60px] px-8 bg-gold-primary text-slate-900 font-bold uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-[0_0_15px_rgba(197,160,89,0.2)]"
                    >
                        {loading ? (
                             <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                             <span className="material-symbols-outlined">send</span>
                        )}
                    </button>
                </div>
                <div className="text-center mt-2">
                     <p className="text-[10px] text-gray-600 uppercase tracking-widest">ChainBridge AI Access • Encrypted E2E</p>
                </div>
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