import { Avatar, AvatarBadge, AvatarImage } from "@/components/ui";
import { Text } from "@/components/ui/text";
import { useGetUserProfileByIdService } from "@/src/presentation/services/UserProfileService";
import { currentUserProfileStore } from "@/src/presentation/stores/current-user-profile.store";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const PROFILE_IMAGE = require("@/assets/images/profile-bg.jpg");
const AVATAR_PLACEHOLDER = require("@/assets/images/avatar-placeholder.png");

/**
 * Returns an excerpt of the given text, up to maxLength chars, ending at a word boundary.
 * Adds "…" if text is trimmed.
 */
function getExcerpt(text: string, maxLength: number = 140): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  const trimmed = text.slice(0, maxLength);
  const lastSpace = trimmed.lastIndexOf(" ");
  return (lastSpace > 0 ? trimmed.slice(0, lastSpace) : trimmed).trim() + "…";
}

export default function UserProfileByIdScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  // Get current profile from store for fast initial render
  const userProfile = currentUserProfileStore();

  // Fetch and update profile for visited user on mount
  const { isLoading, error } = useGetUserProfileByIdService(id as string);

  const images =
    userProfile?.secondaryImages && userProfile.secondaryImages.length > 0
      ? userProfile.secondaryImages
      : [PROFILE_IMAGE];

  const handlePrevImage = () => {
    const newIndex =
      currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1;
    setCurrentImageIndex(newIndex);
    scrollViewRef.current?.scrollTo({ x: newIndex * width, animated: true });
  };

  const handleNextImage = () => {
    const newIndex =
      currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0;
    setCurrentImageIndex(newIndex);
    scrollViewRef.current?.scrollTo({ x: newIndex * width, animated: true });
  };

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffset / width);
    setCurrentImageIndex(currentIndex);
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Text>Cargando perfil...</Text>
      </View>
    );
  }

  if (error || !userProfile || !userProfile.profileId) {
    return (
      <View style={styles.centered}>
        <Text>Error al cargar el perfil.</Text>
      </View>
    );
  }

  // For debugging
  console.log("PROFILE", { userProfile });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Top curved image carousel */}
        <View style={styles.topImageContainer}>
          {/* Page indicators */}
          {images.length > 1 && (
            <View style={styles.pageIndicators}>
              {images.map((_: any, index: React.Key | null | undefined) => (
                <View
                  key={index}
                  style={[
                    styles.pageIndicator,
                    index === currentImageIndex && styles.activePageIndicator,
                  ]}
                />
              ))}
            </View>
          )}

          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.imageCarousel}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {images.map((img: string | number, idx: number) => (
              <ImageBackground
                key={idx}
                source={typeof img === "string" ? { uri: img } : img}
                style={styles.topImage}
                imageStyle={styles.topImageRadius}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <TouchableOpacity
                style={[styles.navButton, styles.leftNavButton]}
                onPress={handlePrevImage}
              >
                <Ionicons name="chevron-back" size={24} color="white" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.navButton, styles.rightNavButton]}
                onPress={handleNextImage}
              >
                <Ionicons name="chevron-forward" size={24} color="white" />
              </TouchableOpacity>
            </>
          )}

          {/* Avatar overlapping */}
          <View style={styles.avatarWrapper}>
            <Avatar size="xl">
              <AvatarImage
                source={
                  userProfile.avatar
                    ? { uri: userProfile.avatar }
                    : AVATAR_PLACEHOLDER
                }
              />
              <AvatarBadge />
            </Avatar>
          </View>
        </View>

        {/* Profile info */}
        <View style={styles.infoContainer}>
          <View style={styles.nameRow}>
            <Text style={styles.nameText}>
              {userProfile.alias || "Usuario"}
              {userProfile.age ? `, ${userProfile.age}` : ""}
            </Text>
            {/* <Text style={styles.editLink}>Editar</Text> */}
          </View>
          <Text style={styles.genderText}>
            {userProfile.gender === 1 ? "Hombre" : "Mujer"}
            {userProfile.gederInterests && userProfile.gederInterests.length > 0
              ? `, busca ${userProfile.gederInterests.join(", ")}`
              : ""}
          </Text>
          <Text style={styles.descriptionText}>
            {userProfile.biography
              ? getExcerpt(userProfile.biography, 200)
              : "Este usuario aún no ha escrito una descripción."}
          </Text>
        </View>

        {/* Action button at bottom */}
        <View style={styles.actionButtonWrapper}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>
              ¡Hola, {userProfile.alias || "Usuario"}! 👋
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const AVATAR_SIZE = 110;
const AVATAR_OVERLAP = 55;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  topImageContainer: {
    width: "100%",
    height: 350,
    backgroundColor: "#eee",
    borderBottomLeftRadius: 180,
    borderBottomRightRadius: 180,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "flex-end",
    position: "relative",
  },
  pageIndicators: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    gap: 8,
  },
  pageIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  activePageIndicator: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    width: 24,
  },
  imageCarousel: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1,
  },
  topImage: {
    width: width,
    height: 350,
  },
  topImageRadius: {
    borderBottomLeftRadius: 180,
    borderBottomRightRadius: 180,
  },
  navButton: {
    position: "absolute",
    top: "50%",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5,
    marginTop: -20,
  },
  leftNavButton: {
    left: 20,
  },
  rightNavButton: {
    right: 20,
  },
  avatarWrapper: {
    position: "absolute",
    bottom: -AVATAR_OVERLAP,
    left: width / 2 - AVATAR_SIZE / 2,
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5,
  },
  infoContainer: {
    marginTop: AVATAR_OVERLAP + 20,
    alignItems: "center",
    paddingHorizontal: 24,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  nameText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
    fontFamily: "Poppins-Bold",
  },
  editLink: {
    fontSize: 14,
    color: "#4fc3f7",
    fontWeight: "600",
    marginLeft: 8,
    textDecorationLine: "underline",
    fontFamily: "Poppins-SemiBold",
    alignSelf: "flex-end",
  },
  genderText: {
    fontSize: 14,
    color: "#888",
    marginBottom: 16,
    fontFamily: "Poppins-Regular",
  },
  descriptionText: {
    fontSize: 16,
    color: "#444",
    textAlign: "center",
    marginTop: 8,
    fontFamily: "Poppins-Regular",
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  actionButtonWrapper: {
    marginTop: 40,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 24,
  },
  actionButton: {
    backgroundColor: "#5BC6EA",
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
    width: "100%",
    maxWidth: 320,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Poppins-SemiBold",
  },
});
