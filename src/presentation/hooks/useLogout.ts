import { useCallback, useState } from "react";
import { supabase } from "../../utils/supabase";
import { useAuthUserProfileStore } from "../stores/auth-user-profile.store";

/**
 * Custom hook to log out the user using Supabase and clear the auth-user-profile store.
 * Returns a logout function, loading state, and error state.
 */
export function useLogout() {
  const resetProfile = useAuthUserProfileStore((s) => s.resetProfile);
  const setLoading = useAuthUserProfileStore((s) => s.setLoading);
  const [error, setError] = useState<null | string>(null);
  const [loading, setLocalLoading] = useState(false);

  const logout = useCallback(async () => {
    setError(null);
    setLoading(true);
    setLocalLoading(true);
    try {

      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        setError(signOutError.message);
        setLoading(false);
        setLocalLoading(false);
        return;
      }
      resetProfile();
    } catch (err: any) {
      setError(err?.message || "Unknown error");
    } finally {
      setLoading(false);
      setLocalLoading(false);
    }
  }, [resetProfile, setLoading]);

  return { logout, loading, error };
}
