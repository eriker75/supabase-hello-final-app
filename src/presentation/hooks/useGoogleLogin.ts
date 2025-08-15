import { supabase } from "@/src/utils/supabase";
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useState } from "react";
import { useAuthUserProfileStore } from "../stores/auth-user-profile.store";
import { useLogout } from "./useLogout";

if (!process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID) {
  throw new Error("Not GOOGLE_CLIENT_ID Found in env variables");
}

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
});

export const useGoogleLogin = () => {
  const setProfile = useAuthUserProfileStore((state) => state.setProfile);
  const resetProfile = useAuthUserProfileStore((state) => state.resetProfile);
  const setLoading = useAuthUserProfileStore((state) => state.setLoading);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useLogout();

  const signIn = async () => {
    console.log("[GoogleLogin] signIn called");
    setIsLoading(true);
    setLoading(true);
    setError(null);

    try {
      console.log("[GoogleLogin] Checking Play Services...");
      await GoogleSignin.hasPlayServices();
      console.log("[GoogleLogin] Play Services available, calling GoogleSignin.signIn()");
      const response = await GoogleSignin.signIn();
      console.log("[GoogleLogin] GoogleSignin.signIn() response:", response);

      if (!isSuccessResponse(response) || !response.data.idToken) {
        console.log("[GoogleLogin] Invalid Google response or missing idToken", response);
        throw new Error("No se pudo obtener el token de Google");
      }

      console.log("[GoogleLogin] Calling supabase.auth.signInWithIdToken with idToken:", response.data.idToken);
      const { data: authData, error: supabaseError } =
        await supabase.auth.signInWithIdToken({
          provider: "google",
          token: response.data.idToken,
        });
      console.log("[GoogleLogin] Supabase signInWithIdToken result:", { authData, supabaseError });

      if (supabaseError || !authData.user) {
        console.log("[GoogleLogin] Supabase error or missing user", supabaseError, authData);
        throw new Error(
          supabaseError?.message || "Error en la autenticación con Supabase"
        );
      }

      console.log("[GoogleLogin] Fetching user from supabase.auth.getUser()");
      const {
        data: { user: userData },
      } = await supabase.auth.getUser();
      console.log("[GoogleLogin] supabase.auth.getUser() result:", userData);

      if (!userData) {
        console.log("[GoogleLogin] No userData found");
        throw new Error("Usuario no encontrado");
      }

      console.log("[GoogleLogin] Fetching profile from Supabase...");
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userData.id)
        .single();
      console.log("[GoogleLogin] Profile fetch result:", { profileData, profileError });

      if (profileError) {
        console.log("[GoogleLogin] Profile error", profileError);
        throw new Error("No se pudo obtener el perfil del usuario");
      }

      // Map Supabase/Google data to AuthUserProfileState
      const userProfile = {
        userId: userData.id,
        profileId: profileData?.id || "",
        birthDate: profileData?.birth_date || "",
        age: profileData?.age || 18,
        gender: profileData?.gender || 0,
        gederInterests: profileData?.interested_in || [],
        minAgePreference: profileData?.min_age_preference || 18,
        maxAgePreference: profileData?.max_age_preference || 98,
        maxDistancePreference: profileData?.max_distance_preference || 200,
        name:
          userData.user_metadata?.full_name ||
          authData?.user.user_metadata?.full_name ||
          "",
        alias: profileData?.alias || "",
        biography: profileData?.bio || "",
        avatar:
          profileData?.avatar || authData?.user.user_metadata?.avatar_url || "",
        address: profileData?.address || "",
        latitude: profileData?.latitude || "",
        longitude: profileData?.longitude || "",
        secondaryImages: profileData?.secondary_images || [],
        isOnline: true,
        isActive: profileData?.status === 1,
        isOnboarded: !!profileData?.is_onboarded,
        lastOnline: profileData?.last_online || "",
        isAuthenticated: true,
        isLoading: false,
        accessToken: authData.session?.access_token || "",
        refreshToken: authData.session?.refresh_token || "",
      };

      console.log("[GoogleLogin] Setting user profile:", userProfile);
      setProfile(userProfile);
      setLoading(false);
      setIsLoading(false);
      console.log("[GoogleLogin] Login flow completed successfully");
      return true;
    } catch (error) {
      console.log("[GoogleLogin] Error in signIn:", error);
      setLoading(false);
      setIsLoading(false);

      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            setError("Inicio de sesión cancelado");
            return false;
          case statusCodes.IN_PROGRESS:
            setError("Proceso de inicio de sesión en progreso");
            return false;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            setError("Google Play Services no está disponible");
            return false;
          default:
            setError("Error en el inicio de sesión con Google");
            return false;
        }
      } else {
        const message =
          error instanceof Error ? error.message : "Error desconocido";
        setError(message);
      }
      resetProfile();
      return false;
    }
  };

  return {
    signIn,
    logout,
    isLoading,
    error,
  };
};
