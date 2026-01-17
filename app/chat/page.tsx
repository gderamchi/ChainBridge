"use client";

import { useEffect, useState, useRef, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// --- Types ---
type Message = {
  sId: string;
  type: "user_message" | "agent_message";
  content: string;
  created: number;
};

type HistoryItem = {
  cId: string;
  title: string;
  timestamp: number;
};

// --- Components ---

const ThinkingBubble = () => (
  <div className="flex w-full justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
    <div className="max-w-[85%] rounded-lg p-5 glass-panel-luxury border-gold-primary/10">
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/5">
        <span className="material-symbols-outlined text-gold-primary text-sm animate-pulse">smart_toy</span>
        <div className="text-[10px] text-gold-primary uppercase tracking-widest font-bold">
          ChainBridge Intelligence
        </div>
      </div>
      <div className="flex gap-1.5 items-center h-6 px-2">
        <div className="w-1.5 h-1.5 bg-gold-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-1.5 h-1.5 bg-gold-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-1.5 h-1.5 bg-gold-primary/60 rounded-full animate-bounce"></div>
      </div>
    </div>
  </div>
);

// --- Main Interface ---

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

  // Load history
  useEffect(() => {
    const saved = localStorage.getItem("chainbridge_history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Update history
  useEffect(() => {
    if (cId && messages.length > 0) {
      setHistory((prev) => {
        const exists = prev.find((h) => h.cId === cId);
        if (exists) return prev;
        
        const firstUserMsg = messages.find((m) => m.type === "user_message");
        const title = firstUserMsg ? firstUserMsg.content.slice(0, 30) + (firstUserMsg.content.length > 30 ? "..." : "") : "New Inquiry";
        
        const newItem = { cId, title, timestamp: Date.now() };
        const newHistory = [newItem, ...prev];
        localStorage.setItem("chainbridge_history", JSON.stringify(newHistory));
        return newHistory;
      });
    }
  }, [cId, messages]);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Fetch conversation
  const fetchConversation = useCallback(async () => {
    if (!cId) {
        setMessages([]);
        return;
    }
    try {
      const res = await fetch(`/api/chat/${cId}`);
      if (res.ok) {
        const data = await res.json();
        const allMessages = data.conversation.content.flat();
        
        interface RawMessage {
            sId: string;
            type: string;
            content: string;
            created: number;
            visibility?: string;
        }

        // Map to our simpler Message type and filter
        const visibleMessages: Message[] = allMessages
          .filter((m: RawMessage) => (m.type === "user_message" || m.type === "agent_message") && m.visibility !== "deleted")
          .map((m: RawMessage) => ({
            sId: m.sId,
            type: m.type as "user_message" | "agent_message",
            content: m.content,
            created: m.created
          }));
          
        setMessages(visibleMessages);
      }
    } catch (err) {
      console.error("Error fetching conversation", err);
    }
  }, [cId]);

  // Initial fetch and polling
  useEffect(() => {
    fetchConversation();
    if (cId) {
      const interval = setInterval(fetchConversation, 3000);
      return () => clearInterval(interval);
    }
  }, [cId, fetchConversation]);

  const handleSend = async () => {
    if (!input.trim() || !cId) return;
    
    const userMsgContent = input;
    setInput("");
    setLoading(true);

    // Optimistic Update
    const optimisticMsg: Message = {
        sId: "temp-" + Date.now(),
        type: "user_message",
        content: userMsgContent,
        created: Date.now()
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      await fetch(`/api/chat/${cId}`, {
        method: "POST",
        body: JSON.stringify({ message: userMsgContent }),
      });
      // Allow a brief delay for server processing before re-fetching
      setTimeout(fetchConversation, 1000);
    } catch (err) {
      console.error("Error sending message", err);
      // Revert optimistic update on error (simplified for now)
    } finally {
        setTimeout(() => setLoading(false), 2000); 
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Determine if we should show the thinking bubble
  const lastMsg = messages[messages.length - 1];
  const showThinking = loading || (lastMsg?.type === "user_message");

  return (
    <div className="flex h-screen bg-slate-dark text-white overflow-hidden font-sans">
        {/* Sidebar */}
        <div 
            className={`flex-shrink-0 bg-slate-panel border-r border-white/5 transition-all duration-300 flex flex-col z-30 ${
                isSidebarOpen ? "w-80" : "w-0 overflow-hidden"
            }`}
        >
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                     <div className="h-6 w-6 relative flex items-center justify-center">
                        <div className="absolute inset-0 border-t border-b border-gold-primary/40 transform -skew-x-12"></div>
                        <div className="absolute h-[1px] w-full bg-gold-primary top-1/2 -translate-y-1/2"></div>
                    </div>
                    <span className="text-sm font-serif uppercase tracking-[0.2em] text-white">ChainBridge</span>
                </div>
            </div>
            
            <div className="p-4">
                 <button 
                    onClick={() => router.push("/")}
                    className="w-full py-3 px-4 bg-gold-primary hover:bg-white text-slate-900 text-xs font-bold uppercase tracking-widest rounded-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_0_15px_rgba(197,160,89,0.1)] hover:shadow-[0_0_20px_rgba(197,160,89,0.3)]"
                >
                    <span className="material-symbols-outlined text-sm">add</span>
                    New Sourcing
                </button>
            </div>

            <div className="flex-grow overflow-y-auto px-2 py-2">
                <div className="px-4 pb-2 text-[10px] uppercase tracking-widest text-gray-500 font-medium">Recent Inquiries</div>
                {history.map((item) => (
                    <Link
                        key={item.cId}
                        href={`/chat?cId=${item.cId}`}
                        className={`group flex flex-col p-3 mb-1 rounded-sm transition-all duration-200 border-l-2 ${
                            cId === item.cId 
                                ? "bg-white/5 border-gold-primary" 
                                : "border-transparent hover:bg-white/5 hover:border-white/20"
                        }`}
                    >
                        <span className={`text-sm font-light truncate ${cId === item.cId ? "text-white" : "text-gray-400 group-hover:text-gray-200"}`}>
                            {item.title}
                        </span>
                        <span className="text-[10px] text-gray-600 mt-1">{new Date(item.timestamp).toLocaleDateString()}</span>
                    </Link>
                ))}
            </div>

            <div className="p-4 border-t border-white/5 bg-slate-900/50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-primary to-slate-900 border border-gold-primary/30 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">G</span>
                    </div>
                    <div className="flex-grow">
                        <div className="text-xs font-medium text-white">Guest User</div>
                        <div className="text-[10px] text-gray-500">Enterprise Plan</div>
                    </div>
                    <span className="material-symbols-outlined text-gray-600 text-sm">settings</span>
                </div>
            </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow flex flex-col h-full relative w-full">
            {/* Header */}
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-slate-dark/95 backdrop-blur z-20 shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-400 hover:text-gold-primary transition-colors">
                        <span className="material-symbols-outlined">menu_open</span>
                    </button>
                    <div className="h-4 w-[1px] bg-white/10"></div>
                    <span className="text-xs text-gray-400 uppercase tracking-widest">Intelligence Hub</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-white/5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[10px] uppercase tracking-widest text-green-500 font-medium">System Online</span>
                </div>
            </header>

            {/* Chat Area */}
            <div className="flex-grow overflow-y-auto px-4 sm:px-6 md:px-12 py-8 scroll-smooth w-full">
                 <div className="max-w-4xl mx-auto flex flex-col gap-6 pb-32">
                    {/* Welcome State */}
                    {messages.length === 0 && !loading && (
                        <div className="flex flex-col items-center justify-center py-20 opacity-50">
                             <div className="w-16 h-16 rounded-full border border-gold-primary/20 flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-3xl text-gold-primary">manage_search</span>
                             </div>
                             <p className="text-sm tracking-widest uppercase text-gray-500">Secure Channel Established</p>
                        </div>
                    )}
                    
                    {/* Messages */}
                    {messages.map((msg, idx) => (
                        <div
                            key={msg.sId || idx}
                            className={`flex w-full animate-in fade-in slide-in-from-bottom-2 duration-500 ${
                                msg.type === "user_message" ? "justify-end" : "justify-start"
                            }`}
                        >
                            <div
                                className={`max-w-[85%] rounded-lg p-5 shadow-lg relative ${
                                    msg.type === "user_message"
                                        ? "bg-slate-panel border border-gold-primary/20 text-white"
                                        : "glass-panel-luxury text-gray-200 border border-gold-primary/10"
                                }`}
                            >
                                {msg.type === "agent_message" && (
                                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5">
                                        <span className="material-symbols-outlined text-gold-primary text-sm">smart_toy</span>
                                        <div className="text-[10px] text-gold-primary uppercase tracking-widest font-bold">
                                            ChainBridge Intelligence
                                        </div>
                                    </div>
                                )}
                                
                                <div className="prose prose-invert prose-sm max-w-none break-words min-w-0">
                                     <ReactMarkdown 
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            // Table styling
                                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                            table: ({node, ...props}) => (
                                                <div className="overflow-x-auto my-4 border border-white/10 rounded-sm">
                                                    <table className="min-w-full text-left text-sm border-collapse bg-slate-900/50" {...props} />
                                                </div>
                                            ),
                                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                            thead: ({node, ...props}) => <thead className="bg-white/5 text-gold-primary uppercase text-xs tracking-wider" {...props} />,
                                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                            th: ({node, ...props}) => <th className="p-3 border-b border-white/10 font-medium whitespace-nowrap" {...props} />,
                                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                            td: ({node, ...props}) => <td className="p-3 border-b border-white/5 text-gray-300 min-w-[150px]" {...props} />,
                                            // Typography overrides
                                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                            a: ({node, ...props}) => <a className="text-gold-primary hover:text-white underline decoration-gold-primary/50 underline-offset-4 transition-colors" target="_blank" rel="noopener noreferrer" {...props} />,
                                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                            p: ({node, ...props}) => <p className="mb-4 last:mb-0 leading-relaxed font-light text-gray-300" {...props} />,
                                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                            ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-300 marker:text-gold-primary" {...props} />,
                                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                            ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4 space-y-2 text-gray-300 marker:text-gold-primary" {...props} />,
                                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                            h1: ({node, ...props}) => <h1 className="text-xl font-serif text-white mb-4 border-b border-gold-primary/20 pb-2" {...props} />,
                                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                            h2: ({node, ...props}) => <h2 className="text-lg font-serif text-white mt-6 mb-3" {...props} />,
                                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                            h3: ({node, ...props}) => <h3 className="text-base font-bold text-gold-light mt-4 mb-2 uppercase tracking-wide" {...props} />,
                                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                            blockquote: ({node, ...props}) => <blockquote className="border-l-2 border-gold-primary/50 pl-4 italic text-gray-400 my-4 bg-white/5 py-2 pr-2 rounded-r-sm" {...props} />,
                                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                            strong: ({node, ...props}) => <strong className="font-semibold text-white" {...props} />,
                                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                            hr: ({node, ...props}) => <hr className="border-white/10 my-6" {...props} />,
                                        }}
                                    >
                                        {msg.content}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {/* Typing Indicator */}
                    {showThinking && <ThinkingBubble />}
                    
                    <div ref={messagesEndRef} className="h-4" />
                </div>
            </div>

            {/* Input Area */}
            <div className="shrink-0 w-full bg-slate-dark/95 backdrop-blur-xl border-t border-white/5 p-4 sm:p-6 z-40 relative">
                 <div className="max-w-4xl mx-auto flex gap-4 items-end">
                    <div className="relative flex-grow group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-gold-primary/30 to-transparent opacity-0 group-focus-within:opacity-100 transition duration-700 blur-sm rounded-sm"></div>
                        <textarea
                            className="relative w-full bg-slate-panel border border-white/10 focus:border-gold-primary/50 rounded-sm px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none resize-none min-h-[56px] shadow-lg text-sm md:text-base leading-relaxed"
                            placeholder="Type your requirements..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={loading && !showThinking} // Allow typing while "thinking" visually, but maybe block send
                        />
                    </div>
                    <button
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        className="h-[56px] px-8 bg-gold-primary text-slate-900 font-bold uppercase tracking-widest hover:bg-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-[0_0_15px_rgba(197,160,89,0.1)] rounded-sm hover:translate-y-[-1px] active:translate-y-[1px]"
                    >
                         <span className="material-symbols-outlined">send</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
}

export default function ChatPage() {
    return (
        <Suspense fallback={<div className="bg-slate-dark h-screen flex items-center justify-center text-gold-primary animate-pulse">Initializing Interface...</div>}>
            <ChatInterface />
        </Suspense>
    );
}
