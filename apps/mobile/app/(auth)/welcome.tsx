import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>ShopTalk</Text>
          <Text style={styles.subtitle}>UPS Teamster Contract Assistant</Text>
        </View>

        <View style={styles.features}>
          <Text style={styles.featureText}>
            Find contract language instantly
          </Text>
          <Text style={styles.featureText}>
            Get cited answers from the Master Agreement and your supplement
          </Text>
          <Text style={styles.featureText}>
            View source documents with one tap
          </Text>
        </View>

        <View style={styles.footer}>
          <Pressable
            style={styles.button}
            onPress={() => router.push("/(auth)/sign-in")}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </Pressable>

          <Text style={styles.disclaimer}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
  },
  header: {
    marginTop: 60,
    alignItems: "center",
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#a0a0a0",
    textAlign: "center",
  },
  features: {
    gap: 16,
  },
  featureText: {
    fontSize: 16,
    color: "#e0e0e0",
    textAlign: "center",
    lineHeight: 24,
  },
  footer: {
    gap: 16,
  },
  button: {
    backgroundColor: "#4a90d9",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  disclaimer: {
    fontSize: 12,
    color: "#808080",
    textAlign: "center",
    lineHeight: 18,
  },
});
