import { useEffect } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import { ClerkProvider, ClerkLoaded, useAuth, useUser } from "@clerk/clerk-expo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PostHogProvider } from "posthog-react-native";
import * as SecureStore from "expo-secure-store";
import { useUserStore } from "@/stores/user";

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
const POSTHOG_API_KEY = process.env.EXPO_PUBLIC_POSTHOG_API_KEY!;

const queryClient = new QueryClient();

// Secure token cache for Clerk
const tokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {
      // Handle error silently
    }
  },
};

function AuthGate() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const segments = useSegments();
  const router = useRouter();
  const { profile, fetchProfile } = useUserStore();

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inOnboardingGroup = segments[0] === "(onboarding)";

    if (!isSignedIn && !inAuthGroup) {
      // Not signed in, redirect to auth
      router.replace("/(auth)/welcome");
    } else if (isSignedIn && inAuthGroup) {
      // Signed in but in auth group, check if profile exists
      fetchProfile().then(() => {
        if (!profile) {
          router.replace("/(onboarding)/local");
        } else {
          router.replace("/(main)");
        }
      });
    } else if (isSignedIn && !profile && !inOnboardingGroup) {
      // Signed in but no profile, redirect to onboarding
      router.replace("/(onboarding)/local");
    }
  }, [isLoaded, isSignedIn, segments, profile]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
      <ClerkLoaded>
        <QueryClientProvider client={queryClient}>
          <PostHogProvider
            apiKey={POSTHOG_API_KEY}
            options={{
              host: "https://us.i.posthog.com",
            }}
          >
            <AuthGate />
          </PostHogProvider>
        </QueryClientProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
