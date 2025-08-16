import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { SafeAreaView, ScrollView } from "react-native";
import CustomInputTextarea from "../components/forms/CustomInputTextarea";
import { Button, ButtonText } from "../components/ui/button";
import { Text } from "../components/ui/text";
import { VStack } from "../components/ui/vstack";

// Import API controllers
import { ChatController } from "../src/infraestructure/api/ChatController";
import { InteractionController } from "../src/infraestructure/api/InteractionController";
import { OnboardingController } from "../src/infraestructure/api/OnboardingController";
import { UserProfileController } from "../src/infraestructure/api/UserProfileController";

const chatController = new ChatController();
const interactionController = new InteractionController();
const onboardingController = new OnboardingController();
const userProfileController = new UserProfileController();

type QuerySectionProps = {
  label: string;
  controllerMethod: (input: any) => Promise<any>;
  defaultInput: string;
  placeholder?: string;
};

function QuerySection({
  label,
  controllerMethod,
  defaultInput,
  placeholder,
}: QuerySectionProps) {
  const [input, setInput] = useState(defaultInput);
  const [result, setResult] = useState("");

  const handleApiCall = async () => {
    try {
      const parsedInput = input.trim() ? JSON.parse(input) : {};
      const res = await controllerMethod(parsedInput);
      const formatted = JSON.stringify(res, null, 2);
      setResult(formatted);
      // Log to console as well
      console.log(`[${label} response]:\n`, formatted);
    } catch (err: any) {
      setResult("Error: " + (err?.message || String(err)));
      // Log error to console as well
      console.error(`[${label} error]:\n`, err);
    }
  };

  return (
    <VStack space="sm" className="p-3 bg-white rounded-lg shadow">
      <Text bold>{label}</Text>
      <CustomInputTextarea
        label="Request (JSON)"
        value={input}
        setValue={setInput}
        placeholder={placeholder || defaultInput}
      />
      <Button onPress={handleApiCall}>
        <ButtonText>Probar {label}</ButtonText>
      </Button>
      <Text size="sm" className="mt-2">
        {result}
      </Text>
    </VStack>
  );
}

// Demo data for each method
const demo = {
  userId: "demo-user-id-123",
  chatId: "demo-chat-id-456",
  messageId: "demo-message-id-789",
  email: "demo@example.com",
  password: "password123",
  alias: "demoAlias",
  gender: 1,
  content: "Hola mundo!",
  targetUserId: "demo-target-user-321",
  latitude: 10.5,
  longitude: -66.9,
  address: "Demo Address",
  reason: "spam",
  details: "Demo report details",
  page: 1,
  perPage: 10,
  limit: 10,
  offset: 0,
  minAge: 18,
  maxAge: 30,
  maxDistance: 100,
  isLiked: true,
  role: "member",
  secondaryImages: ["https://demo.com/img1.jpg"],
  profileId: "demo-profile-id-999",
};

const chatQueries = [
  {
    label: "ChatController.createChat",
    method: (input: any) => chatController.createChat(input),
    defaultInput: JSON.stringify(
      { name: "Demo Chat", creator_id: demo.userId },
      null,
      2
    ),
  },
  {
    label: "ChatController.listChats",
    method: (input: any) => chatController.listChats(input),
    defaultInput: JSON.stringify(
      { user_id: demo.userId, page: 1, perPage: 10 },
      null,
      2
    ),
  },
  {
    label: "ChatController.getChat",
    method: (input: any) => chatController.getChat(input),
    defaultInput: JSON.stringify(
      { id: demo.chatId, user_id: demo.userId },
      null,
      2
    ),
  },
  {
    label: "ChatController.updateChat",
    method: (input: any) => chatController.updateChat(input),
    defaultInput: JSON.stringify(
      { id: demo.chatId, name: "Nuevo nombre" },
      null,
      2
    ),
  },
  {
    label: "ChatController.deleteChat",
    method: (input: any) => chatController.deleteChat(input),
    defaultInput: JSON.stringify({ id: demo.chatId }, null, 2),
  },
  {
    label: "ChatController.listMessages",
    method: (input: any) => chatController.listMessages(input),
    defaultInput: JSON.stringify(
      { chat_id: demo.chatId, page: 1, perPage: 10, user_id: demo.userId },
      null,
      2
    ),
  },
  {
    label: "ChatController.getMessage",
    method: (input: any) => chatController.getMessage(input),
    defaultInput: JSON.stringify(
      {
        chat_id: demo.chatId,
        message_id: demo.messageId,
        user_id: demo.userId,
      },
      null,
      2
    ),
  },
  {
    label: "ChatController.postMessage",
    method: (input: any) => chatController.postMessage(input),
    defaultInput: JSON.stringify(
      { chat_id: demo.chatId, sender_id: demo.userId, content: demo.content },
      null,
      2
    ),
  },
  {
    label: "ChatController.patchMessage",
    method: (input: any) => chatController.patchMessage(input),
    defaultInput: JSON.stringify(
      { chat_id: demo.chatId, message_id: demo.messageId, content: "Editado" },
      null,
      2
    ),
  },
  {
    label: "ChatController.deleteMessage",
    method: (input: any) => chatController.deleteMessage(input),
    defaultInput: JSON.stringify(
      { chat_id: demo.chatId, message_id: demo.messageId },
      null,
      2
    ),
  },
  {
    label: "ChatController.unreadMessageCount",
    method: (input: any) => chatController.unreadMessageCount(input),
    defaultInput: JSON.stringify(
      { chat_id: demo.chatId, user_id: demo.userId },
      null,
      2
    ),
  },
  {
    label: "ChatController.addParticipant",
    method: (input: any) =>
      chatController.addParticipant(input.chatId, input.participant),
    defaultInput: JSON.stringify(
      {
        chatId: demo.chatId,
        participant: { userId: demo.targetUserId, role: demo.role },
      },
      null,
      2
    ),
  },
  {
    label: "ChatController.removeParticipant",
    method: (input: any) =>
      chatController.removeParticipant(input.chatId, input.userId),
    defaultInput: JSON.stringify(
      { chatId: demo.chatId, userId: demo.targetUserId },
      null,
      2
    ),
  },
  {
    label: "ChatController.getParticipants",
    method: (input: any) => chatController.getParticipants(input.chatId),
    defaultInput: JSON.stringify({ chatId: demo.chatId }, null, 2),
  },
  {
    label: "ChatController.markMessageAsRead",
    method: (input: any) =>
      chatController.markMessageAsRead(
        input.chatId,
        input.messageId,
        input.userId
      ),
    defaultInput: JSON.stringify(
      { chatId: demo.chatId, messageId: demo.messageId, userId: demo.userId },
      null,
      2
    ),
  },
  {
    label: "ChatController.archiveChat",
    method: (input: any) => chatController.archiveChat(input.chatId),
    defaultInput: JSON.stringify({ chatId: demo.chatId }, null, 2),
  },
  {
    label: "ChatController.muteChat",
    method: (input: any) => chatController.muteChat(input.chatId, input.userId),
    defaultInput: JSON.stringify(
      { chatId: demo.chatId, userId: demo.userId },
      null,
      2
    ),
  },
  {
    label: "ChatController.unmuteChat",
    method: (input: any) =>
      chatController.unmuteChat(input.chatId, input.userId),
    defaultInput: JSON.stringify(
      { chatId: demo.chatId, userId: demo.userId },
      null,
      2
    ),
  },
  {
    label: "ChatController.createWithParticipants",
    method: (input: any) =>
      chatController.createWithParticipants(input.chatReq, input.participants),
    defaultInput: JSON.stringify(
      {
        chatReq: { name: "Demo Chat", creator_id: demo.userId },
        participants: [
          { userId: demo.userId, role: "admin" },
          { userId: demo.targetUserId, role: "member" },
        ],
      },
      null,
      2
    ),
  },
];

const interactionQueries = [
  {
    label: "InteractionController.listMatches",
    method: (input: any) => interactionController.listMatches(input),
    defaultInput: JSON.stringify(
      { user_id: demo.userId, maxDistance: demo.maxDistance },
      null,
      2
    ),
  },
  {
    label: "InteractionController.createSwipe",
    method: (input: any) => interactionController.createSwipe(input),
    defaultInput: JSON.stringify(
      {
        user_id: demo.userId,
        target_user_id: demo.targetUserId,
        is_liked: true,
      },
      null,
      2
    ),
  },
  {
    label: "InteractionController.listSwipes",
    method: (input: any) => interactionController.listSwipes(input),
    defaultInput: JSON.stringify(
      {
        user_id: demo.userId,
        target_user_id: demo.targetUserId,
        is_liked: true,
      },
      null,
      2
    ),
  },
];

const onboardingQueries = [
  {
    label: "OnboardingController.onboardUser",
    method: (input: any) => onboardingController.onboardUser(input),
    defaultInput: JSON.stringify(
      {
        user_id: demo.userId,
        alias: demo.alias,
        gender: demo.gender,
        avatar: "https://demo.com/avatar.jpg",
        biography: "Demo bio",
        birth_date: "2000-01-01",
        is_onboarded: true,
        is_verified: true,
        is_active: true,
        latitude: demo.latitude,
        longitude: demo.longitude,
        address: demo.address,
        secondary_images: demo.secondaryImages,
        min_age: demo.minAge,
        max_age: demo.maxAge,
        max_distance: demo.maxDistance,
        genders: [1, 2],
      },
      null,
      2
    ),
  },
];

const userProfileQueries = [
  {
    label: "UserProfileController.createUser",
    method: (input: any) => userProfileController.createUser(input),
    defaultInput: JSON.stringify(
      {
        email: demo.email,
        password: demo.password,
        alias: demo.alias,
        gender: demo.gender,
        avatar: "https://demo.com/avatar.jpg",
        biography: "Demo bio",
        birth_date: "2000-01-01",
        is_onboarded: true,
        is_verified: true,
        is_active: true,
        latitude: demo.latitude,
        longitude: demo.longitude,
        address: demo.address,
        secondary_images: demo.secondaryImages,
        min_age: demo.minAge,
        max_age: demo.maxAge,
        max_distance: demo.maxDistance,
        genders: [1, 2],
      },
      null,
      2
    ),
  },
  {
    label: "UserProfileController.listUsers",
    method: (input: any) => userProfileController.listUsers(input),
    defaultInput: JSON.stringify(
      { limit: demo.limit, offset: demo.offset },
      null,
      2
    ),
  },
  {
    label: "UserProfileController.getUser",
    method: (input: any) => userProfileController.getUser(input),
    defaultInput: JSON.stringify({ id: demo.userId }, null, 2),
  },
  {
    label: "UserProfileController.getMeUser",
    method: (input: any) => userProfileController.getMeUser(input),
    defaultInput: JSON.stringify(
      { email: demo.email, password: demo.password },
      null,
      2
    ),
  },
  {
    label: "UserProfileController.updateUser",
    method: (input: any) => userProfileController.updateUser(input),
    defaultInput: JSON.stringify(
      { id: demo.userId, alias: "NuevoAlias" },
      null,
      2
    ),
  },
  {
    label: "UserProfileController.deleteUser",
    method: (input: any) => userProfileController.deleteUser(input),
    defaultInput: JSON.stringify({ id: demo.userId }, null, 2),
  },
  {
    label: "UserProfileController.createProfile",
    method: (input: any) => userProfileController.createProfile(input),
    defaultInput: JSON.stringify(
      {
        user_id: demo.userId,
        alias: demo.alias,
        gender: demo.gender,
        avatar: "https://demo.com/avatar.jpg",
        biography: "Demo bio",
        birth_date: "2000-01-01",
        is_onboarded: true,
        is_verified: true,
        is_active: true,
        latitude: demo.latitude,
        longitude: demo.longitude,
        address: demo.address,
        secondary_images: demo.secondaryImages,
        min_age: demo.minAge,
        max_age: demo.maxAge,
        max_distance: demo.maxDistance,
        genders: [1, 2],
      },
      null,
      2
    ),
  },
  {
    label: "UserProfileController.listProfiles",
    method: (input: any) => userProfileController.listProfiles(input),
    defaultInput: JSON.stringify(
      { limit: demo.limit, offset: demo.offset },
      null,
      2
    ),
  },
  {
    label: "UserProfileController.getProfile",
    method: (input: any) => userProfileController.getProfile(input),
    defaultInput: JSON.stringify({ id: demo.profileId }, null, 2),
  },
  {
    label: "UserProfileController.updateProfile",
    method: (input: any) => userProfileController.updateProfile(input),
    defaultInput: JSON.stringify(
      { id: demo.profileId, alias: "NuevoAlias" },
      null,
      2
    ),
  },
  {
    label: "UserProfileController.deleteProfile",
    method: (input: any) => userProfileController.deleteProfile(input),
    defaultInput: JSON.stringify(
      { id: demo.profileId, user_id: demo.userId },
      null,
      2
    ),
  },
  {
    label: "UserProfileController.findByEmail",
    method: (input: any) => userProfileController.findByEmail(input.email),
    defaultInput: JSON.stringify({ email: demo.email }, null, 2),
  },
  {
    label: "UserProfileController.findByAlias",
    method: (input: any) => userProfileController.findByAlias(input.alias),
    defaultInput: JSON.stringify({ alias: demo.alias }, null, 2),
  },
  {
    label: "UserProfileController.getPreferences",
    method: (input: any) => userProfileController.getPreferences(input.userId),
    defaultInput: JSON.stringify({ userId: demo.userId }, null, 2),
  },
  {
    label: "UserProfileController.setPreferences",
    method: (input: any) =>
      userProfileController.setPreferences(input.userId, input.preferences),
    defaultInput: JSON.stringify(
      {
        userId: demo.userId,
        preferences: {
          min_age: demo.minAge,
          max_age: demo.maxAge,
          max_distance: demo.maxDistance,
          genders: [1, 2],
        },
      },
      null,
      2
    ),
  },
  {
    label: "UserProfileController.updateLocation",
    method: (input: any) =>
      userProfileController.updateLocation(
        input.userId,
        input.latitude,
        input.longitude,
        input.address
      ),
    defaultInput: JSON.stringify(
      {
        userId: demo.userId,
        latitude: demo.latitude,
        longitude: demo.longitude,
        address: demo.address,
      },
      null,
      2
    ),
  },
  {
    label: "UserProfileController.blockUser",
    method: (input: any) =>
      userProfileController.blockUser(input.blockerId, input.blockedId),
    defaultInput: JSON.stringify(
      { blockerId: demo.userId, blockedId: demo.targetUserId },
      null,
      2
    ),
  },
  {
    label: "UserProfileController.reportUser",
    method: (input: any) =>
      userProfileController.reportUser(
        input.reporterId,
        input.reportedId,
        input.reason,
        input.details
      ),
    defaultInput: JSON.stringify(
      {
        reporterId: demo.userId,
        reportedId: demo.targetUserId,
        reason: demo.reason,
        details: demo.details,
      },
      null,
      2
    ),
  },
  {
    label: "UserProfileController.setOnline",
    method: (input: any) => userProfileController.setOnline(input.userId),
    defaultInput: JSON.stringify({ userId: demo.userId }, null, 2),
  },
  {
    label: "UserProfileController.setOffline",
    method: (input: any) => userProfileController.setOffline(input.userId),
    defaultInput: JSON.stringify({ userId: demo.userId }, null, 2),
  },
  {
    label: "UserProfileController.listNearbyProfiles",
    method: (input: any) =>
      userProfileController.listNearbyProfiles(input.userId, input.maxDistance),
    defaultInput: JSON.stringify(
      { userId: demo.userId, maxDistance: demo.maxDistance },
      null,
      2
    ),
  },
  {
    label: "UserProfileController.listNearbySwipeableProfiles",
    method: (input: any) =>
      userProfileController.listNearbySwipeableProfiles(
        input.userId,
        input.maxDistance,
        input.limit
      ),
    defaultInput: JSON.stringify(
      { userId: demo.userId, maxDistance: demo.maxDistance, limit: demo.limit },
      null,
      2
    ),
  },
  {
    label: "UserProfileController.listNearbyMatches",
    method: (input: any) =>
      userProfileController.listNearbyMatches(input.userId, input.maxDistance),
    defaultInput: JSON.stringify(
      { userId: demo.userId, maxDistance: demo.maxDistance },
      null,
      2
    ),
  },
  {
    label: "UserProfileController.updateMyLocation",
    method: (input: any) =>
      userProfileController.updateMyLocation(
        input.userId,
        input.latitude,
        input.longitude
      ),
    defaultInput: JSON.stringify(
      {
        userId: demo.userId,
        latitude: demo.latitude,
        longitude: demo.longitude,
      },
      null,
      2
    ),
  },
];

export default function Queries() {
  return (
    <SafeAreaView className="flex-1 bg-[#7CDAF9] px-2">
      <StatusBar style="dark" />
      <ScrollView>
        <VStack space="md" className="py-4 mt-8">
          <Text size="lg" bold>
            API Queries Testing View
          </Text>
          <Text size="sm" className="mb-2">
            Cada sección tiene un ejemplo de consulta con datos demo. Puedes
            modificar los valores y probar cada método.
          </Text>
          {chatQueries.map((q, i) => (
            <QuerySection
              key={q.label + i}
              label={q.label}
              controllerMethod={q.method}
              defaultInput={q.defaultInput}
            />
          ))}
          {interactionQueries.map((q, i) => (
            <QuerySection
              key={q.label + i}
              label={q.label}
              controllerMethod={q.method}
              defaultInput={q.defaultInput}
            />
          ))}
          {onboardingQueries.map((q, i) => (
            <QuerySection
              key={q.label + i}
              label={q.label}
              controllerMethod={q.method}
              defaultInput={q.defaultInput}
            />
          ))}
          {userProfileQueries.map((q, i) => (
            <QuerySection
              key={q.label + i}
              label={q.label}
              controllerMethod={q.method}
              defaultInput={q.defaultInput}
            />
          ))}
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
