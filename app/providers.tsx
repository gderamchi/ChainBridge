"use client";

import React from "react";
import { ChatProvider } from "@/app/contexts/chat-context";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <ChatProvider>{children}</ChatProvider>;
}
