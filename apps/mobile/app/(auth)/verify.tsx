import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSignIn } from "@clerk/clerk-expo";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VerifyScreen() {
  const router = useRouter();
  const { method, identifier } = useLocalSearchParams<{
    method: string;
    identifier: string;
  }>();
  const { signIn, setActive, isLoaded } = useSignIn();

  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isEmail = method === "email";

  // For email magic link, we poll for completion
  useEffect(() => {
    if (!isEmail || !isLoaded) return;

    const interval = setInterval(async () => {
      try {
        const result = await signIn?.reload();
        if (result?.status === "complete") {
          await setActive?.({ session: result.createdSessionId });
          router.replace("/(onboarding)/local");
        }
      } catch {
        // Continue polling
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isEmail, isLoaded, signIn, setActive, router]);

  const handleVerify = async () => {
    if (!isLoaded || !code.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const result = await signIn?.attemptFirstFactor({
        strategy: "phone_code",
        code: code.trim(),
      });

      if (result?.status === "complete") {
        await setActive?.({ session: result.createdSessionId });
        router.replace("/(onboarding)/local");
      }
    } catch (err: unknown) {
      const clerkError = err as { errors?: Array<{ message: string }> };
      setError(clerkError.errors?.[0]?.message ?? "Invalid code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!isLoaded) return;

    setIsLoading(true);
    setError("");

    try {
      if (isEmail) {
        const emailFactor = signIn?.supportedFirstFactors?.find(
          (f) => f.strategy === "email_link"
        );
        if (emailFactor) {
          await signIn?.prepareFirstFactor({
            strategy: "email_link",
            emailAddressId: (emailFactor as { emailAddressId: string }).emailAddressId,
            redirectUrl: "shoptalk://sign-in-callback",
          });
        }
      } else {
        const phoneFactor = signIn?.supportedFirstFactors?.find(
          (f) => f.strategy === "phone_code"
        );
        if (phoneFactor) {
          await signIn?.prepareFirstFactor({
            strategy: "phone_code",
            phoneNumberId: (phoneFactor as { phoneNumberId: string }).phoneNumberId,
          });
        }
      }
    } catch (err: unknown) {
      const clerkError = err as { errors?: Array<{ message: string }> };
      setError(clerkError.errors?.[0]?.message ?? "Failed to resend");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <View style={styles.header}>
          <Text style={styles.title}>
            {isEmail ? "Check your email" : "Enter code"}
          </Text>
          <Text style={styles.subtitle}>
            {isEmail
              ? `We sent a sign-in link to ${identifier}`
              : `We sent a verification code to ${identifier}`}
          </Text>
        </View>

        {isEmail ? (
          <View style={styles.waitingContainer}>
            <ActivityIndicator size="large" color="#4a90d9" />
            <Text style={styles.waitingText}>
              Waiting for you to click the link...
            </Text>
          </View>
        ) : (
          <View style={styles.codeContainer}>
            <TextInput
              style={styles.codeInput}
              placeholder="Enter 6-digit code"
              placeholderTextColor="#606060"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              maxLength={6}
              autoFocus
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Pressable
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleVerify}
              disabled={isLoading || code.length !== 6}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>Verify</Text>
              )}
            </Pressable>
          </View>
        )}

        <Pressable
          style={styles.resendButton}
          onPress={handleResend}
          disabled={isLoading}
        >
          <Text style={styles.resendText}>
            Didn't receive it? Send again
          </Text>
        </Pressable>
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
  waitingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
  },
  waitingText: {
    color: "#a0a0a0",
    fontSize: 16,
  },
  codeContainer: {
    gap: 16,
  },
  codeInput: {
    backgroundColor: "#2a2a4e",
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    color: "#ffffff",
    textAlign: "center",
    letterSpacing: 8,
  },
  error: {
    color: "#ff6b6b",
    fontSize: 14,
    textAlign: "center",
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
  resendButton: {
    marginTop: 24,
    alignItems: "center",
  },
  resendText: {
    color: "#4a90d9",
    fontSize: 14,
  },
});
