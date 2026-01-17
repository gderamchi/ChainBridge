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
    <div className="max-w-[85%] rounded-sm p-5 glass-panel-luxury border-gold-primary/10 relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-0.5 h-full bg-gold-primary/50"></div>
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/5">
        <span className="material-symbols-outlined text-gold-primary text-sm animate-pulse">smart_toy</span>
        <div className="text-[10px] text-gold-primary uppercase tracking-widest font-bold font-sans">
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
  
  // Track the last message ID to prevent unnecessary scrolling
  const lastMessageIdRef = useRef<string | null>(null);

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

  // Smart Scroll
  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.sId !== lastMessageIdRef.current) {
        lastMessageIdRef.current = lastMsg.sId;
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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

        const visibleMessages: Message[] = allMessages
          .filter((m: RawMessage) => (m.type === "user_message" || m.type === "agent_message") && m.visibility !== "deleted")
          .map((m: RawMessage) => ({
            sId: m.sId,
            type: m.type as "user_message" | "agent_message",
            content: m.content,
            created: m.created
          }));
          
        // Only update state if length changed to avoid re-renders (simple check)
        // A better check would be deep comparison, but length + last ID is usually enough for chat
        setMessages((prev) => {
            if (prev.length !== visibleMessages.length) return visibleMessages;
            if (prev.length > 0 && visibleMessages.length > 0) {
                if (prev[prev.length-1].sId !== visibleMessages[visibleMessages.length-1].sId) return visibleMessages;
            }
            return prev; // Return same reference to prevent effect triggering
        });
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
    
    // Add optimistic message and force scroll
    setMessages((prev) => [...prev, optimisticMsg]);
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 10);

    try {
      await fetch(`/api/chat/${cId}`, {
        method: "POST",
        body: JSON.stringify({ message: userMsgContent }),
      });
      // We rely on polling to fetch the agent response.
      // We don't manually fetch immediately to avoid race conditions with the server indexing.
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

  const lastMsg = messages[messages.length - 1];
  // Show thinking if loading (sending) OR if the last message in our view is from the user
  const showThinking = loading || (lastMsg?.type === "user_message");

  return (
    <div className="flex h-screen bg-slate-dark text-white overflow-hidden font-sans relative">
        {/* Background Effects (Landing Page Style) */}
        <div className="absolute inset-0 bg-slate-dark z-[-2]"></div>
        <div className="bridge-beam opacity-30 pointer-events-none"></div>
        <div className="bridge-beam opacity-30 pointer-events-none" style={{ left: "30%", transform: "rotate(25deg)" }}></div>
        <div className="bridge-beam-2 opacity-20 pointer-events-none"></div>

        {/* Sidebar */}
        <div 
            className={`flex-shrink-0 bg-slate-panel/80 backdrop-blur-xl border-r border-gold-primary/10 transition-all duration-300 flex flex-col z-30 ${
                isSidebarOpen ? "w-80" : "w-0 overflow-hidden"
            }`}
        >
            <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                     <div className="h-6 w-6 relative flex items-center justify-center">
                        <div className="absolute inset-0 border-t border-b border-gold-primary/40 transform -skew-x-12"></div>
                        <div className="absolute h-[1px] w-full bg-gold-primary top-1/2 -translate-y-1/2"></div>
                    </div>
                    <span className="text-sm font-serif uppercase tracking-[0.2em] text-white">ChainBridge</span>
                </div>
            </div>
            
            <div className="p-4 shrink-0">
                 <button 
                    onClick={() => router.push("/")}
                    className="w-full py-3 px-4 bg-gradient-to-r from-gold-primary to-gold-dim hover:to-gold-light text-slate-900 text-xs font-bold uppercase tracking-widest rounded-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_0_15px_rgba(197,160,89,0.1)] hover:shadow-[0_0_20px_rgba(197,160,89,0.3)] hover:text-white"
                >
                    <span className="material-symbols-outlined text-sm">add</span>
                    New Sourcing
                </button>
            </div>

            <div className="flex-grow overflow-y-auto px-2 py-2 min-h-0">
                <div className="px-4 pb-2 text-[10px] uppercase tracking-widest text-gold-dim font-bold">History</div>
                {history.map((item) => (
                    <Link
                        key={item.cId}
                        href={`/chat?cId=${item.cId}`}
                        className={`group flex flex-col p-3 mb-1 rounded-sm transition-all duration-200 border-l-2 relative overflow-hidden ${
                            cId === item.cId 
                                ? "bg-white/5 border-gold-primary" 
                                : "border-transparent hover:bg-white/5 hover:border-white/20"
                        }`}
                    >
                        <span className={`text-sm font-light truncate relative z-10 ${cId === item.cId ? "text-white" : "text-gray-400 group-hover:text-gray-200"}`}>
                            {item.title}
                        </span>
                        <span className="text-[10px] text-gray-600 mt-1 relative z-10">{new Date(item.timestamp).toLocaleDateString()}</span>
                        {cId === item.cId && <div className="absolute inset-0 bg-gold-primary/5 z-0"></div>}
                    </Link>
                ))}
            </div>

            <div className="p-4 border-t border-white/5 bg-slate-900/50 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-primary to-slate-900 border border-gold-primary/30 flex items-center justify-center shadow-lg">
                        <span className="text-xs font-serif italic text-white">G</span>
                    </div>
                    <div className="flex-grow">
                        <div className="text-xs font-medium text-white tracking-wide">Guest User</div>
                        <div className="text-[10px] text-gold-primary/80 uppercase tracking-wider">Enterprise</div>
                    </div>
                    <span className="material-symbols-outlined text-gray-600 text-sm hover:text-gold-primary cursor-pointer transition-colors">settings</span>
                </div>
            </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow flex flex-col h-full relative min-w-0 z-10">
            {/* Header */}
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-slate-dark/80 backdrop-blur-md z-20 shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-400 hover:text-gold-primary transition-colors">
                        <span className="material-symbols-outlined">menu_open</span>
                    </button>
                    <div className="h-4 w-[1px] bg-white/10"></div>
                    <span className="text-xs text-gray-400 uppercase tracking-widest font-light">Intelligence Hub <span className="text-gold-primary/50 mx-1">/</span> Sourcing Agent</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-slate-900/50 border border-gold-primary/10 shadow-inner">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                    <span className="text-[10px] uppercase tracking-widest text-green-500 font-bold">Online</span>
                </div>
            </header>

            {/* Chat Area */}
            <div className="flex-grow overflow-y-auto px-4 sm:px-6 md:px-12 py-8 scroll-smooth min-h-0">
                 <div className="max-w-4xl mx-auto flex flex-col gap-8 pb-32">
                    {/* Welcome State */}
                    {messages.length === 0 && !loading && (
                        <div className="flex flex-col items-center justify-center py-20 opacity-60 animate-in fade-in duration-1000">
                             <div className="w-20 h-20 rounded-full border border-gold-primary/20 flex items-center justify-center mb-8 relative">
                                <div className="absolute inset-0 bg-gold-primary/5 rounded-full animate-ping [animation-duration:3s]"></div>
                                <span className="material-symbols-outlined text-4xl text-gold-primary relative z-10">manage_search</span>
                             </div>
                             <h2 className="text-2xl font-serif text-white mb-2">ChainBridge Intelligence</h2>
                             <p className="text-sm tracking-widest uppercase text-gray-500">Secure Channel Established</p>
                        </div>
                    )}
                    
                    {/* Messages */}
                    {messages.map((msg, idx) => (
                        <div
                            key={msg.sId || idx}
                            className={`flex w-full animate-in fade-in slide-in-from-bottom-4 duration-500 ${
                                msg.type === "user_message" ? "justify-end" : "justify-start"
                            }`}
                        >
                            <div
                                className={`max-w-[85%] rounded-sm p-6 shadow-2xl relative overflow-hidden group transition-all duration-300 ${
                                    msg.type === "user_message"
                                        ? "bg-gradient-to-br from-slate-800 to-slate-900 border border-gold-primary/30 text-white"
                                        : "glass-panel-luxury text-gray-200 border border-gold-primary/10 hover:border-gold-primary/20"
                                }`}
                            >
                                {/* Decorative line for user messages */}
                                {msg.type === "user_message" && <div className="absolute top-0 right-0 w-0.5 h-full bg-gold-primary/30"></div>}
                                
                                {/* Decorative line for agent messages */}
                                {msg.type === "agent_message" && <div className="absolute top-0 left-0 w-0.5 h-full bg-gold-primary/50"></div>}

                                {msg.type === "agent_message" && (
                                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/5">
                                        <span className="material-symbols-outlined text-gold-primary text-sm">smart_toy</span>
                                        <div className="text-[10px] text-gold-primary uppercase tracking-widest font-bold font-sans">
                                            ChainBridge Intelligence
                                        </div>
                                    </div>
                                )}
                                
                                <div className="prose prose-invert prose-sm max-w-none break-words min-w-0 font-light">
                                     <ReactMarkdown 
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            // Table styling
                                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                            table: ({node, ...props}) => (
                                                <div className="overflow-x-auto my-6 border border-gold-primary/10 rounded-sm shadow-inner bg-black/20">
                                                    <table className="min-w-full text-left text-sm border-collapse" {...props} />
                                                </div>
                                            ),
                                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                            thead: ({node, ...props}) => <thead className="bg-white/5 text-gold-primary uppercase text-[10px] tracking-widest font-bold" {...props} />,
                                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                            th: ({node, ...props}) => <th className="p-4 border-b border-white/10 font-medium whitespace-nowrap" {...props} />,
                                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                            td: ({node, ...props}) => <td className="p-4 border-b border-white/5 text-gray-300 min-w-[150px]" {...props} />,
                                            // Typography overrides
                                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                            a: ({node, ...props}) => <a className="text-gold-primary hover:text-white underline decoration-gold-primary/50 underline-offset-4 transition-colors" target="_blank" rel="noopener noreferrer" {...props} />,
                                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                            p: ({node, ...props}) => <p className="mb-4 last:mb-0 leading-relaxed text-gray-300" {...props} />,
                                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                            ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-300 marker:text-gold-primary" {...props} />,
                                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                            ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4 space-y-2 text-gray-300 marker:text-gold-primary" {...props} />,
                                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                            h1: ({node, ...props}) => <h1 className="text-2xl font-serif text-white mb-6 border-b border-gold-primary/20 pb-3" {...props} />,
                                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                            h2: ({node, ...props}) => <h2 className="text-xl font-serif text-white mt-8 mb-4 flex items-center gap-2" {...props} />,
                                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                            h3: ({node, ...props}) => <h3 className="text-sm font-bold text-gold-light mt-6 mb-2 uppercase tracking-wide border-l-2 border-gold-primary/50 pl-3" {...props} />,
                                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                            blockquote: ({node, ...props}) => <blockquote className="border-l-2 border-gold-primary/50 pl-4 italic text-gray-400 my-6 bg-gradient-to-r from-white/5 to-transparent py-3 pr-2 rounded-r-sm" {...props} />,
                                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                            strong: ({node, ...props}) => <strong className="font-semibold text-white" {...props} />,
                                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                            hr: ({node, ...props}) => <hr className="border-gold-primary/20 my-8" {...props} />,
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
            <div className="shrink-0 w-full bg-slate-dark/90 backdrop-blur-xl border-t border-white/5 p-4 sm:p-6 z-40 relative">
                 <div className="max-w-4xl mx-auto flex gap-4 items-end">
                    <div className="relative flex-grow group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-gold-primary/40 to-transparent opacity-0 group-focus-within:opacity-100 transition duration-700 blur-sm rounded-sm"></div>
                        <textarea
                            className="relative w-full bg-slate-panel border border-white/10 focus:border-gold-primary/50 rounded-sm px-4 py-4 text-white placeholder:text-gray-600 focus:outline-none resize-none min-h-[60px] shadow-xl text-base leading-relaxed font-light"
                            placeholder="Type your requirements..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={loading && !showThinking}
                        />
                    </div>
                    <button
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        className="h-[60px] px-8 bg-gold-primary text-slate-900 font-bold uppercase tracking-widest hover:bg-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-[0_0_20px_rgba(197,160,89,0.2)] rounded-sm hover:translate-y-[-1px] active:translate-y-[1px] group"
                    >
                         <span className="material-symbols-outlined group-hover:scale-110 transition-transform">send</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
}

export default function ChatPage() {
    return (
        <Suspense fallback={<div className="bg-slate-dark h-screen flex items-center justify-center text-gold-primary animate-pulse font-serif tracking-widest">Initializing Secure Hub...</div>}>
            <ChatInterface />
        </Suspense>
    );
}