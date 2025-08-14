import { ChatEntity } from "@/src/domain/entities/Chat.entity";
import { ChatMessageEntity } from "@/src/domain/entities/ChatMessage.entity";
import { ChatDatasourceImpl } from "@/src/infraestructure/datasources/ChatDatasourceImpl";
import { useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { ParticipantEntity } from "../../domain/entities/Participant.entity";

// Singleton datasource instance for hooks
const datasource = new ChatDatasourceImpl();

// Queries
export function useFindById(id: string): UseQueryResult<ChatEntity | null> {
  return useQuery({
    queryKey: ["chat", "findById", id],
    queryFn: () => datasource.findById(id),
    enabled: !!id,
  });
}

export function useFindAll(): UseQueryResult<ChatEntity[]> {
  return useQuery({
    queryKey: ["chat", "findAll"],
    queryFn: () => datasource.findAll(),
  });
}

export function useFindByParticipant(userId: string): UseQueryResult<ChatEntity[]> {
  return useQuery({
    queryKey: ["chat", "findByParticipant", userId],
    queryFn: () => datasource.findByParticipant(userId),
    enabled: !!userId,
  });
}

export function useFindByType(type: string): UseQueryResult<ChatEntity[]> {
  return useQuery({
    queryKey: ["chat", "findByType", type],
    queryFn: () => datasource.findByType(type),
    enabled: !!type,
  });
}

export function useFindActiveChats(userId: string): UseQueryResult<ChatEntity[]> {
  return useQuery({
    queryKey: ["chat", "findActiveChats", userId],
    queryFn: () => datasource.findActiveChats(userId),
    enabled: !!userId,
  });
}

export function useFindArchivedChats(userId: string): UseQueryResult<ChatEntity[]> {
  return useQuery({
    queryKey: ["chat", "findArchivedChats", userId],
    queryFn: () => datasource.findArchivedChats(userId),
    enabled: !!userId,
  });
}

export function useFindMutedChats(userId: string): UseQueryResult<ChatEntity[]> {
  return useQuery({
    queryKey: ["chat", "findMutedChats", userId],
    queryFn: () => datasource.findMutedChats(userId),
    enabled: !!userId,
  });
}

export function useFindChatsWithUnreadMessages(userId: string): UseQueryResult<ChatEntity[]> {
  return useQuery({
    queryKey: ["chat", "findChatsWithUnreadMessages", userId],
    queryFn: () => datasource.findChatsWithUnreadMessages(userId),
    enabled: !!userId,
  });
}

export function useGetParticipants(chatId: string): UseQueryResult<ParticipantEntity[]> {
  return useQuery({
    queryKey: ["chat", "getParticipants", chatId],
    queryFn: () => datasource.getParticipants(chatId),
    enabled: !!chatId,
  });
}

export function useGetMessages(chatId: string): UseQueryResult<ChatMessageEntity[]> {
  return useQuery({
    queryKey: ["chat", "getMessages", chatId],
    queryFn: () => datasource.getMessages(chatId),
    enabled: !!chatId,
  });
}

// Mutations
export function useSave(): UseMutationResult<void, unknown, ChatEntity> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (entity: ChatEntity) => datasource.save(entity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat"] });
    },
  });
}

export function useUpdate(): UseMutationResult<void, unknown, ChatEntity> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (entity: ChatEntity) => datasource.update(entity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat"] });
    },
  });
}

export function useDelete(): UseMutationResult<void, unknown, string> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => datasource.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat"] });
    },
  });
}

export function useCreateWithParticipants(): UseMutationResult<ChatEntity, unknown, { chat: ChatEntity; participants: ParticipantEntity[] }> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ chat, participants }) => datasource.createWithParticipants(chat, participants),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat"] });
    },
  });
}

export function useAddParticipant(): UseMutationResult<void, unknown, { chatId: string; participant: ParticipantEntity }> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ chatId, participant }) => datasource.addParticipant(chatId, participant),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat"] });
    },
  });
}

export function useRemoveParticipant(): UseMutationResult<void, unknown, { chatId: string; userId: string }> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ chatId, userId }) => datasource.removeParticipant(chatId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat"] });
    },
  });
}

export function useSendMessage(): UseMutationResult<ChatMessageEntity, unknown, { chatId: string; message: ChatMessageEntity }> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ chatId, message }) => datasource.sendMessage(chatId, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat"] });
    },
  });
}

export function useMarkMessageAsRead(): UseMutationResult<void, unknown, { chatId: string; messageId: string; userId: string }> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ chatId, messageId, userId }) => datasource.markMessageAsRead(chatId, messageId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat"] });
    },
  });
}

export function useArchiveChat(): UseMutationResult<void, unknown, string> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (chatId: string) => datasource.archiveChat(chatId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat"] });
    },
  });
}

export function useMuteChat(): UseMutationResult<void, unknown, { chatId: string; userId: string }> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ chatId, userId }) => datasource.muteChat(chatId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat"] });
    },
  });
}

export function useUnmuteChat(): UseMutationResult<void, unknown, { chatId: string; userId: string }> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ chatId, userId }) => datasource.unmuteChat(chatId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat"] });
    },
  });
}
