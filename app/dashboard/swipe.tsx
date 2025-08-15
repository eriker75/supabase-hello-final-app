import { Text } from "@/components/ui";
import { useLogout } from "@/src/presentation/hooks/useLogout";
import { TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SwipeScreen = () => {
  const { loading, logout, error } = useLogout();

  const handleLogout = async () => {
    return await logout();
  };

  if (error) {
    console.log(error);
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center bg-white">
        <TouchableOpacity
          onPress={handleLogout}
          disabled={!!loading}
          className="bg-red-500 px-6 py-3 rounded-lg"
        >
          <Text className="text-white">Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SwipeScreen;
