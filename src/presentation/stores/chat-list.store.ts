import { create, StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { zustandAsyncStorage } from "../../utils/zustandAsyncStorage";

export interface ChatOfState {
  chatId: string;
  chatImage?: string;
  chatDescription?: string;
  chatParticipants: string[];
  chatIsActive: boolean;
  chatLastMessageId: string;
  chatLastMessageContent: string;
  chatLastMessageStatus: string;
  chatLastMessageIsByMe: boolean;
  unreadedCount: number;
  chatType: string;
  chatLastMessageCreatedAt: string; // ISO string for sorting
}

export interface ChatListState {
  chats: ChatOfState[];
  loadingChats: boolean;
  page: number;
  perPage: number;
  total: number;
  hasMore: boolean;
}

export interface ChatListAction {
  setChats: (
    chats: ChatOfState[],
    page?: number,
    perPage?: number,
    total?: number,
    hasMore?: boolean
  ) => void;
  appendChats: (
    chats: ChatOfState[],
    page: number,
    perPage: number,
    total: number,
    hasMore: boolean
  ) => void;
  addChat: (chat: ChatOfState) => void;
  removeChat: (chatId: string) => void;
  setLoadingChats: (loading: boolean) => void;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  setTotal: (total: number) => void;
  setHasMore: (hasMore: boolean) => void;
  updateChatLastMessage: (
    chatId: string,
    lastMessage: {
      chatLastMessageId: string;
      chatLastMessageContent: string;
      chatLastMessageStatus: string;
      chatLastMessageIsByMe: boolean;
      chatLastMessageCreatedAt: string;
    }
  ) => void;
}

export type ChatListStore = ChatListState & ChatListAction;

const initialState: ChatListState = {
  chats: [],
  loadingChats: false,
  page: 1,
  perPage: 20,
  total: 0,
  hasMore: false,
};

function sortChatsDesc(chats: ChatOfState[]): ChatOfState[] {
  return [...chats].sort(
    (a, b) => new Date(b.chatLastMessageCreatedAt).getTime() - new Date(a.chatLastMessageCreatedAt).getTime()
  );
}

const chatListStoreCreator: StateCreator<
  ChatListStore,
  [["zustand/immer", never]],
  [["zustand/persist", unknown]]
> = (set) => ({
  ...initialState,
  setChats: (
    chats: ChatOfState[],
    page = 1,
    perPage = 20,
    total = 0,
    hasMore = false
  ) =>
    set((state) => {
      state.chats = sortChatsDesc(chats);
      state.page = page;
      state.perPage = perPage;
      state.total = total;
      state.hasMore = hasMore;
    }),
  appendChats: (
    chats: ChatOfState[],
    page: number,
    perPage: number,
    total: number,
    hasMore: boolean
  ) =>
    set((state) => {
      if (page === 1) {
        state.chats = sortChatsDesc(chats);
      } else {
        state.chats = sortChatsDesc([...state.chats, ...chats]);
      }
      state.page = page;
      state.perPage = perPage;
      state.total = total;
      state.hasMore = hasMore;
    }),
  addChat: (chat: ChatOfState) =>
    set((state) => {
      state.chats = sortChatsDesc([chat, ...state.chats]);
    }),
  removeChat: (chatId: string) =>
    set((state) => {
      state.chats = state.chats.filter((c) => c.chatId !== chatId);
    }),
  setLoadingChats: (loading: boolean) =>
    set((state) => {
      state.loadingChats = loading;
    }),
  setPage: (page: number) =>
    set((state) => {
      state.page = page;
    }),
  setPerPage: (perPage: number) =>
    set((state) => {
      state.perPage = perPage;
    }),
  setTotal: (total: number) =>
    set((state) => {
      state.total = total;
    }),
  setHasMore: (hasMore: boolean) =>
    set((state) => {
      state.hasMore = hasMore;
    }),
  updateChatLastMessage: (
    chatId,
    lastMessage
  ) =>
    set((state) => {
      const idx = state.chats.findIndex((c) => c.chatId === chatId);
      if (idx !== -1) {
        const updatedChat = {
          ...state.chats[idx],
          chatLastMessageId: lastMessage.chatLastMessageId,
          chatLastMessageContent: lastMessage.chatLastMessageContent,
          chatLastMessageStatus: lastMessage.chatLastMessageStatus,
          chatLastMessageIsByMe: lastMessage.chatLastMessageIsByMe,
          chatLastMessageCreatedAt: lastMessage.chatLastMessageCreatedAt,
        };
        // Remove the chat from its current position
        state.chats.splice(idx, 1);
        // Insert it at the beginning
        state.chats.unshift(updatedChat);
      }
    }),
});

export const chatListStore = create<ChatListStore>()(
  persist(immer(chatListStoreCreator), {
    name: "chat-list-store",
    storage: zustandAsyncStorage,
    partialize: (state) => ({
      chats: state.chats,
      loadingChats: state.loadingChats,
      page: state.page,
      perPage: state.perPage,
      total: state.total,
      hasMore: state.hasMore,
    }),
  })
);
