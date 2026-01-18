"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import type { Conversation } from "@/src/sdk/dustApi";

type DustConversation = NonNullable<Conversation["conversation"]>;
type DustContentMatrix = NonNullable<DustConversation["content"]>;
export type DustChatMessage = DustContentMatrix[number][number];

export type StoredConversation = {
  conversationId: string;
  title?: string;
  messages: DustChatMessage[];
  lastEventId?: string;
  updatedAt: number;
};

type ChatState = {
  conversations: Record<string, StoredConversation>;
  order: string[];
  selectedConversationId: string | null;
};

type ChatActions = {
  hydrate: (state: ChatState) => void;
  upsertConversation: (conversation: StoredConversation) => void;
  selectConversation: (conversationId: string | null) => void;
  addMessage: (conversationId: string, message: DustChatMessage) => void;
  setTitle: (conversationId: string, title: string) => void;
  setLastEventId: (conversationId: string, lastEventId: string) => void;
  resetConversation: (conversationId: string) => void;
  deleteConversation: (conversationId: string) => void;
  clearAll: () => void;
};

type ChatContextValue = ChatState & {
  actions: ChatActions;
  selectedConversation: StoredConversation | null;
  conversationsList: StoredConversation[];
};

const STORAGE_KEY = "chainbridge.chat.v1";
const STORAGE_SELECTED_KEY = "chainbridge.chat.selectedConversationId";

const defaultState: ChatState = {
  conversations: {},
  order: [],
  selectedConversationId: null,
};

type Action =
  | { type: "HYDRATE"; payload: ChatState }
  | { type: "UPSERT_CONVERSATION"; payload: StoredConversation }
  | { type: "SELECT_CONVERSATION"; payload: string | null }
  | { type: "ADD_MESSAGE"; payload: { conversationId: string; message: DustChatMessage } }
  | { type: "SET_TITLE"; payload: { conversationId: string; title: string } }
  | { type: "SET_LAST_EVENT_ID"; payload: { conversationId: string; lastEventId: string } }
  | { type: "RESET_CONVERSATION"; payload: { conversationId: string } }
  | { type: "DELETE_CONVERSATION"; payload: { conversationId: string } }
  | { type: "CLEAR_ALL" };

function upsertOrder(order: string[], conversationId: string) {
  const next = order.filter((id) => id !== conversationId);
  next.unshift(conversationId);
  return next;
}

function reducer(state: ChatState, action: Action): ChatState {
  switch (action.type) {
    case "HYDRATE": {
      return action.payload;
    }
    case "UPSERT_CONVERSATION": {
      const conversation = action.payload;
      return {
        ...state,
        conversations: {
          ...state.conversations,
          [conversation.conversationId]: conversation,
        },
        order: upsertOrder(state.order, conversation.conversationId),
      };
    }
    case "SELECT_CONVERSATION": {
      return {
        ...state,
        selectedConversationId: action.payload,
      };
    }
    case "ADD_MESSAGE": {
      const { conversationId, message } = action.payload;
      const existing = state.conversations[conversationId];
      if (!existing) return state;

      return {
        ...state,
        conversations: {
          ...state.conversations,
          [conversationId]: {
            ...existing,
            messages: [...existing.messages, message],
            updatedAt: Date.now(),
          },
        },
        order: upsertOrder(state.order, conversationId),
      };
    }
    case "SET_TITLE": {
      const { conversationId, title } = action.payload;
      const existing = state.conversations[conversationId];
      if (!existing) return state;
      return {
        ...state,
        conversations: {
          ...state.conversations,
          [conversationId]: {
            ...existing,
            title,
            updatedAt: Date.now(),
          },
        },
      };
    }
    case "SET_LAST_EVENT_ID": {
      const { conversationId, lastEventId } = action.payload;
      const existing = state.conversations[conversationId];
      if (!existing) return state;
      return {
        ...state,
        conversations: {
          ...state.conversations,
          [conversationId]: {
            ...existing,
            lastEventId,
            updatedAt: Date.now(),
          },
        },
      };
    }
    case "RESET_CONVERSATION": {
      const { conversationId } = action.payload;
      const existing = state.conversations[conversationId];
      if (!existing) return state;
      return {
        ...state,
        conversations: {
          ...state.conversations,
          [conversationId]: {
            ...existing,
            messages: [],
            lastEventId: undefined,
            updatedAt: Date.now(),
          },
        },
      };
    }
    case "DELETE_CONVERSATION": {
      const { conversationId } = action.payload;
      const { [conversationId]: _removed, ...rest } = state.conversations;
      const nextOrder = state.order.filter((id) => id !== conversationId);
      const nextSelected =
        state.selectedConversationId === conversationId
          ? nextOrder[0] ?? null
          : state.selectedConversationId;
      return {
        conversations: rest,
        order: nextOrder,
        selectedConversationId: nextSelected,
      };
    }
    case "CLEAR_ALL": {
      return defaultState;
    }
    default:
      return state;
  }
}

function safeReadFromLocalStorage(): ChatState | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ChatState;

    if (
      !parsed ||
      typeof parsed !== "object" ||
      !parsed.conversations ||
      !parsed.order
    ) {
      return null;
    }

    // Also restore the selected cursor from its dedicated key if present.
    const selected = window.localStorage.getItem(STORAGE_SELECTED_KEY);
    if (selected) {
      return {
        ...parsed,
        selectedConversationId: selected,
      };
    }

    return parsed;
  } catch {
    return null;
  }
}

function safeWriteToLocalStorage(state: ChatState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (state.selectedConversationId) {
      window.localStorage.setItem(
        STORAGE_SELECTED_KEY,
        state.selectedConversationId,
      );
    } else {
      window.localStorage.removeItem(STORAGE_SELECTED_KEY);
    }
  } catch {
    // ignore
  }
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, defaultState);

  // Hydrate once on mount
  useEffect(() => {
    const hydrated = safeReadFromLocalStorage();
    if (hydrated) {
      dispatch({ type: "HYDRATE", payload: hydrated });
    }
  }, []);

  // Persist on any change
  useEffect(() => {
    safeWriteToLocalStorage(state);
  }, [state]);

  const actions = useMemo<ChatActions>(() => {
    return {
      hydrate: (next) => dispatch({ type: "HYDRATE", payload: next }),
      upsertConversation: (conversation) =>
        dispatch({ type: "UPSERT_CONVERSATION", payload: conversation }),
      selectConversation: (conversationId) =>
        dispatch({ type: "SELECT_CONVERSATION", payload: conversationId }),
      addMessage: (conversationId, message) =>
        dispatch({
          type: "ADD_MESSAGE",
          payload: { conversationId, message },
        }),
      setTitle: (conversationId, title) =>
        dispatch({ type: "SET_TITLE", payload: { conversationId, title } }),
      setLastEventId: (conversationId, lastEventId) =>
        dispatch({
          type: "SET_LAST_EVENT_ID",
          payload: { conversationId, lastEventId },
        }),
      resetConversation: (conversationId) =>
        dispatch({ type: "RESET_CONVERSATION", payload: { conversationId } }),
      deleteConversation: (conversationId) =>
        dispatch({ type: "DELETE_CONVERSATION", payload: { conversationId } }),
      clearAll: () => dispatch({ type: "CLEAR_ALL" }),
    };
  }, []);

  const conversationsList = useMemo(() => {
    return state.order
      .map((id) => state.conversations[id])
      .filter(Boolean);
  }, [state.conversations, state.order]);

  const selectedConversation = useMemo(() => {
    if (!state.selectedConversationId) return null;
    return state.conversations[state.selectedConversationId] ?? null;
  }, [state.conversations, state.selectedConversationId]);

  const value = useMemo<ChatContextValue>(
    () => ({
      ...state,
      actions,
      conversationsList,
      selectedConversation,
    }),
    [state, actions, conversationsList, selectedConversation],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return ctx;
}

export const createLocalConversationId = () =>
  `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export function createChatMessage(input: {
  sId: string;
  type: "user_message" | "agent_message";
  content: string;
}): DustChatMessage {
  return {
    sId: input.sId,
    type: input.type,
    content: input.content,
  } as DustChatMessage;
}
