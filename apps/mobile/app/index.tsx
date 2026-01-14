import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { useUserStore } from "@/stores/user";
import { View, ActivityIndicator, StyleSheet } from "react-native";

export default function Index() {
  const { isLoaded, isSignedIn } = useAuth();
  const { profile } = useUserStore();

  if (!isLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4a90d9" />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)/welcome" />;
  }

  if (!profile) {
    return <Redirect href="/(onboarding)/local" />;
  }

  return <Redirect href="/(main)" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
  },
});
