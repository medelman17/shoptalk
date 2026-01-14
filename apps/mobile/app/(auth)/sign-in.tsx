import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useSignIn } from "@clerk/clerk-expo";
import { SafeAreaView } from "react-native-safe-area-context";

type SignInMethod = "email" | "phone";

export default function SignInScreen() {
  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();

  const [method, setMethod] = useState<SignInMethod>("phone");
  const [identifier, setIdentifier] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    if (!isLoaded || !identifier.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const { supportedFirstFactors } = await signIn.create({
        identifier: identifier.trim(),
      });

      // Find the magic link strategy
      const magicLinkFactor = supportedFirstFactors?.find(
        (factor) =>
          factor.strategy === "email_link" || factor.strategy === "phone_code"
      );

      if (magicLinkFactor?.strategy === "email_link") {
        // Send magic link email
        await signIn.prepareFirstFactor({
          strategy: "email_link",
          emailAddressId: (magicLinkFactor as { emailAddressId: string }).emailAddressId,
          redirectUrl: "shoptalk://sign-in-callback",
        });

        router.push({
          pathname: "/(auth)/verify",
          params: { method: "email", identifier },
        });
      } else {
        // For phone, we'll use OTP as fallback since magic links via SMS are limited
        const phoneFactor = supportedFirstFactors?.find(
          (factor) => factor.strategy === "phone_code"
        );

        if (phoneFactor) {
          await signIn.prepareFirstFactor({
            strategy: "phone_code",
            phoneNumberId: (phoneFactor as { phoneNumberId: string }).phoneNumberId,
          });

          router.push({
            pathname: "/(auth)/verify",
            params: { method: "phone", identifier },
          });
        }
      }
    } catch (err: unknown) {
      const clerkError = err as { errors?: Array<{ message: string }> };
      setError(clerkError.errors?.[0]?.message ?? "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backText}>Back</Text>
          </Pressable>

          <View style={styles.header}>
            <Text style={styles.title}>Sign In</Text>
            <Text style={styles.subtitle}>
              Enter your {method === "email" ? "email" : "phone number"} to receive a sign-in link
            </Text>
          </View>

          <View style={styles.methodToggle}>
            <Pressable
              style={[
                styles.methodButton,
                method === "phone" && styles.methodButtonActive,
              ]}
              onPress={() => setMethod("phone")}
            >
              <Text
                style={[
                  styles.methodText,
                  method === "phone" && styles.methodTextActive,
                ]}
              >
                Phone
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.methodButton,
                method === "email" && styles.methodButtonActive,
              ]}
              onPress={() => setMethod("email")}
            >
              <Text
                style={[
                  styles.methodText,
                  method === "email" && styles.methodTextActive,
                ]}
              >
                Email
              </Text>
            </Pressable>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={
                method === "email" ? "email@example.com" : "(555) 123-4567"
              }
              placeholderTextColor="#606060"
              value={identifier}
              onChangeText={setIdentifier}
              keyboardType={method === "email" ? "email-address" : "phone-pad"}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSignIn}
            disabled={isLoading || !identifier.trim()}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Continue</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  backButton: {
    marginBottom: 24,
  },
  backText: {
    color: "#4a90d9",
    fontSize: 16,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#a0a0a0",
    lineHeight: 24,
  },
  methodToggle: {
    flexDirection: "row",
    backgroundColor: "#2a2a4e",
    borderRadius: 8,
    padding: 4,
    marginBottom: 24,
  },
  methodButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 6,
  },
  methodButtonActive: {
    backgroundColor: "#4a90d9",
  },
  methodText: {
    color: "#a0a0a0",
    fontSize: 16,
    fontWeight: "500",
  },
  methodTextActive: {
    color: "#ffffff",
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#2a2a4e",
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: "#ffffff",
  },
  error: {
    color: "#ff6b6b",
    fontSize: 14,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#4a90d9",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
});
