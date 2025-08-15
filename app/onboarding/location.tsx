import { OnboardingScreenLayout } from "@/components/layouts/OnboardingScreenLayout";
import { LocationPermissionStatuses } from "@/src/definitions/enums/LocationPermissionStatuses.enum";
import { useOnboardUserService } from "@/src/infraestructure/services/OnboardingService";
import { useAuthUserProfileStore } from "@/src/presentation/stores/auth-user-profile.store";
import { useOnboardingStore } from "@/src/presentation/stores/onboarding.store";
import { requestLocationPermission } from "@/src/utils/location";
import { getSignedUrlForKey, uploadFile } from "@/src/utils/supabaseS3Storage";
import * as Location from "expo-location";
import { router } from "expo-router";
import { Alert, Dimensions, Image, Text, View } from "react-native";

const LocationImg = require("@/assets/images/location-img.png");

const AllowLocationScreen = () => {
  const screenHeight = Dimensions.get("window").height;
  const onboardingStore = useOnboardingStore();
  const setSelectedLocation = useOnboardingStore((s) => s.setSelectedLocation);
  const userEmail = useAuthUserProfileStore(
    (s: any) => s.email || s.userId || ""
  );
  const { mutate, isPending } = useOnboardUserService();

  const selectMyCurrentLocationAndContinue = async () => {
    try {
      // 1. Solicitar permisos de ubicación
      const permissionStatus = await requestLocationPermission();
      if (permissionStatus !== LocationPermissionStatuses.GRANTED) {
        Alert.alert(
          "Permisos requeridos",
          "Debes habilitar los permisos de ubicación para continuar"
        );
        return;
      }

      // 2. Obtener ubicación actual
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setSelectedLocation("Ubicación actual", { latitude, longitude });

      // 3. Subir imágenes a S3 y obtener URLs firmadas
      let mainPictureUrl = onboardingStore.mainPicture;
      if (mainPictureUrl && !mainPictureUrl.startsWith("https://")) {
        // Asumimos que es un URI local, subir a S3
        const mainPicBuffer = await fetch(mainPictureUrl).then((res) =>
          res.arrayBuffer()
        );
        const mainPicKey = `users/${Date.now()}-main.jpg`;
        await uploadFile(Buffer.from(mainPicBuffer), mainPicKey, "image/jpeg");
        mainPictureUrl = await getSignedUrlForKey(mainPicKey, 24 * 3600);
      }

      const secondaryImagesUrls: string[] = [];
      for (const [i, img] of onboardingStore.secondaryImages.entries()) {
        if (img && !img.startsWith("https://")) {
          const imgBuffer = await fetch(img).then((res) => res.arrayBuffer());
          const imgKey = `users/${Date.now()}-secondary-${i}.jpg`;
          await uploadFile(Buffer.from(imgBuffer), imgKey, "image/jpeg");
          const url = await getSignedUrlForKey(imgKey, 24 * 3600);
          secondaryImagesUrls.push(url);
        } else if (img) {
          secondaryImagesUrls.push(img);
        }
      }

      // 4. Actualizar el store con las URLs de S3
      onboardingStore.setMainPicture(mainPictureUrl);
      onboardingStore.setSecondaryImages(secondaryImagesUrls);

      // 5. Llamar al servicio de onboarding para guardar los datos
      mutate({
        ...onboardingStore,
        latitude,
        longitude,
        avatar: mainPictureUrl,
        secondary_images: secondaryImagesUrls,
        address: "Ubicación actual",
        is_onboarded: true,
        email: userEmail,
        password: "", // Not needed for social login, but required by type
      });

      // 6. Redirigir al dashboard
      router.push("/dashboard/swipe");
    } catch (error) {
      console.error("Error en ubicación/onboarding:", error);
      Alert.alert(
        "Error",
        "Ocurrió un problema al obtener tu ubicación o guardar tu información. Por favor intenta nuevamente."
      );
    }
  };

  return (
    <OnboardingScreenLayout
      showProgress
      progressValue={100}
      showBackButton
      isStepValidated={true}
      footerButtonText={isPending ? "Guardando..." : "Activar ubicación"}
      onFooterButtonPress={selectMyCurrentLocationAndContinue}
    >
      <View className="flex-1 pb-10 gap-10 items-center">
        <Text className="font-poppins font-bold text-3xl text-center">
          Necesitamos tu ubicación
        </Text>
        <Text className="font-poppins font-normal text-xl text-center">
          Queremos mostrarte gente real, cerca de ti.{"\n"}Para eso es
          importante tu ubicación, tu privacidad está segura
        </Text>
        <Image
          source={LocationImg}
          style={{
            width: "100%",
            height: screenHeight * 0.5,
            maxHeight: 400,
          }}
          resizeMode="contain"
        />
      </View>
    </OnboardingScreenLayout>
  );
};

export default AllowLocationScreen;
