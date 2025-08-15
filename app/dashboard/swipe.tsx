import { Avatar, AvatarImage, Text } from "@/components/ui";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Key, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import Reanimated, {
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const GENDER_TEXT: Record<number, string> = {
  0: "Mujer",
  1: "Hombre",
  2: "Otro",
};

const AnimatedMaterialIcons = Reanimated.createAnimatedComponent(MaterialIcons);

const ReanimatedIcon = ({
  name,
  size,
  animatedColor,
  baseColor,
  activeColor,
}: {
  name: string;
  size: number;
  animatedColor: any;
  baseColor: string;
  activeColor: string;
}) => {
  const animatedProps = useAnimatedProps(() => {
    return {
      color: interpolateColor(
        animatedColor.value,
        [0, 1],
        [baseColor, activeColor]
      ),
    };
  });

  return (
    <AnimatedMaterialIcons
      name={name as any}
      size={size}
      animatedProps={animatedProps}
      color={baseColor}
    />
  );
};

import {
  useCanSwipe,
  useFetchSwipeableProfiles,
  useSwipeableProfilesState,
  useSwipeProfile,
} from "@/src/presentation/services/SwipeableProfilesService";

// TODO: Reemplazar por el userId real y maxDistance real del usuario autenticado
const userId = "demo-user-id";
const maxDistance = 200;

const SwipeScreen = () => {
  // Estado y hooks del servicio real
  useFetchSwipeableProfiles(userId, maxDistance);
  const { nearbySwipeableProfiles, hasMore } = useSwipeableProfilesState();
  const { swipe, isLoading: isSwiping } = useSwipeProfile(userId);
  const canSwipe = useCanSwipe();

  // Reanimated values for Like/Pass button animation
  const likeAnim = useSharedValue(0);
  const passAnim = useSharedValue(0);

  const [photoIndex, setPhotoIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const router = useRouter();

  // Perfil actual (primero de la cola)
  const currentProfile =
    nearbySwipeableProfiles && nearbySwipeableProfiles.length > 0
      ? nearbySwipeableProfiles[0]
      : undefined;

  // Imágenes del perfil actual
  const images =
    currentProfile && Array.isArray(currentProfile.secondaryImages) && currentProfile.secondaryImages.length > 0
      ? currentProfile.secondaryImages
      : [currentProfile?.avatar].filter(Boolean);

  // Handle scroll events to update photo index
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setPhotoIndex(currentIndex);
  };

  // Animaciones para like/pass
  const triggerLike = () => {
    if (!canSwipe || isSwiping) return;
    likeAnim.value = withTiming(1, { duration: 150 }, (finished) => {
      if (finished) {
        likeAnim.value = withTiming(0, { duration: 150 }, (finished2) => {
          if (finished2) {
            runOnJS(() => handleSwipe(true))();
          }
        });
      }
    });
  };

  const triggerPass = () => {
    if (!canSwipe || isSwiping) return;
    passAnim.value = withTiming(1, { duration: 150 }, (finished) => {
      if (finished) {
        passAnim.value = withTiming(0, { duration: 150 }, (finished2) => {
          if (finished2) {
            runOnJS(() => handleSwipe(false))();
          }
        });
      }
    });
  };

  // Swipe real: like/pass y avanza la cola
  const handleSwipe = async (isLiked: boolean) => {
    if (!currentProfile) return;
    await swipe(currentProfile.userId, isLiked, null); // null: el backend debe cargar el siguiente
    setPhotoIndex(0);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, animated: false });
    }
  };

  // Truncate bio for excerpt
  const bioExcerpt =
    (currentProfile?.biography || "").length > 60
      ? currentProfile?.biography?.slice(0, 60) + "..."
      : currentProfile?.biography;

  // Tailwind classes for overlay
  const gradientOverlayStyle = {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="absolute inset-0 z-[1]">
        {/* Image ScrollView - Main scrollable content */}
        {images.length > 0 ? (
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            className="absolute inset-0 z-[1]"
            contentContainerStyle={{}}
          >
            {images.map((imgSrc: any, index: number) => (
              <View key={index} className="relative" style={{ width, height }}>
                <Image
                  source={imgSrc}
                  style={{ width, height }}
                  className=""
                  resizeMode="cover"
                />
                {/* Overlay per image */}
                <View style={gradientOverlayStyle} pointerEvents="none" />
              </View>
            ))}
          </ScrollView>
        ) : (
          <View className="relative" style={{ width, height }}>
            <Image
              source={require("@/assets/images/avatar-placeholder.png")}
              style={{ width, height }}
              className=""
              resizeMode="cover"
            />
            <View style={gradientOverlayStyle} pointerEvents="none" />
          </View>
        )}

        {/* Top bar */}
        <View
          className="absolute left-0 w-full flex-row items-center justify-between px-[18px] pt-[30px] z-[10]"
          style={{ top: 0, height: 90 }}
          pointerEvents="box-none"
        >
          <View style={{ width: 38, height: 38 }} />
          <Text className="text-white text-[28px] font-semibold text-center flex-1 mx-[10px]">
            Hola
          </Text>
          <Pressable
            onPress={() => router.push("/dashboard/profile")}
            className="w-[38px] h-[38px] rounded-full overflow-hidden border-2 border-white items-center justify-center"
          >
            <Avatar size="sm" className="w-full h-full">
              <AvatarImage source={{ uri: "" }} />
            </Avatar>
          </Pressable>
        </View>

        {/* Dots indicator */}
        {images.length > 1 && (
          <View
            className="absolute left-0 right-0 flex-row justify-center items-center z-[5] px-5"
            style={{ top: 120 }}
            pointerEvents="none"
          >
            {images.map((_: any, i: Key | null | undefined) => (
              <View
                key={i}
                className={`w-2 h-2 rounded-full mx-1 ${
                  i === photoIndex
                    ? "bg-white opacity-100"
                    : "bg-white opacity-40"
                }`}
              />
            ))}
          </View>
        )}

        {/* User info overlay */}
        <View
          className="absolute w-full items-center px-6 z-[5]"
          style={{ bottom: 110 }}
          pointerEvents="none"
        >
          <Text
            className="text-white text-[24px] font-bold text-center mb-1"
            style={{
              textShadowColor: "rgba(0,0,0,0.7)",
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 3,
            }}
          >
            {currentProfile?.alias}
          </Text>
          <Text
            className="text-white text-[16px] font-normal text-center mb-2 opacity-90"
            style={{
              textShadowColor: "rgba(0,0,0,0.7)",
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 3,
            }}
          >
            {typeof currentProfile?.gender === "number"
              ? GENDER_TEXT[currentProfile.gender]
              : ""}
          </Text>
          {bioExcerpt && (
            <Text
              className="text-white text-[16px] font-normal text-center leading-[22px]"
              style={{
                textShadowColor: "rgba(0,0,0,0.7)",
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 3,
              }}
            >
              &quot;{bioExcerpt}&quot;
            </Text>
          )}
        </View>
      </View>

      {/* Bottom action buttons */}
      <View
        className="absolute left-0 w-full flex-row justify-between items-end px-8 z-[10]"
        style={{ bottom: 30 }}
        pointerEvents="box-none"
      >
        {/* Pass (X) */}
        <Reanimated.View
          className="items-center justify-center mx-2"
          style={[
            {
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: "rgba(255,255,255,0.18)",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
            },
            useAnimatedStyle(() => ({
              transform: [
                {
                  scale: interpolate(passAnim.value, [0, 1], [1, 1.1]),
                },
              ],
            })),
          ]}
        >
          <Pressable
            onPress={triggerPass}
            className="w-16 h-16 items-center justify-center"
            accessibilityLabel="Pasar"
          >
            <ReanimatedIcon
              name="close"
              size={36}
              animatedColor={passAnim}
              baseColor="#fff"
              activeColor="#5BC6EA"
            />
          </Pressable>
        </Reanimated.View>

        {/* View profile */}
        {currentProfile && (
          <Pressable
            onPress={() =>
              router.push(`/dashboard/profile/${currentProfile.profileId}`)
            }
            className="items-center justify-center bg-transparent px-2 py-0.5 min-w-[80px]"
          >
            <MaterialIcons name="keyboard-arrow-up" size={28} color="#fff" />
            <Text
              className="text-white text-[16px] font-semibold text-center mt-[-2px]"
              style={{
                textShadowColor: "rgba(0,0,0,0.7)",
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 2,
              }}
            >
              Ver perfil
            </Text>
          </Pressable>
        )}

        {/* Like (Heart) */}
        <Reanimated.View
          className="items-center justify-center mx-2"
          style={[
            {
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: "rgba(255,255,255,0.18)",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
            },
            useAnimatedStyle(() => ({
              transform: [
                {
                  scale: interpolate(likeAnim.value, [0, 1], [1, 1.1]),
                },
              ],
            })),
          ]}
        >
          <Pressable
            onPress={triggerLike}
            className="w-16 h-16 items-center justify-center"
            accessibilityLabel="Me gusta"
          >
            <ReanimatedIcon
              name="favorite"
              size={32}
              animatedColor={likeAnim}
              baseColor="#fff"
              activeColor="#5BC6EA"
            />
          </Pressable>
        </Reanimated.View>
      </View>
    </SafeAreaView>
  );
};

export default SwipeScreen;
