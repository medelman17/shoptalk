import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery, useMutation } from "@tanstack/react-query";
import { CLASSIFICATIONS, type Classification } from "@shoptalk/shared";
import { api } from "@/lib/api";
import { useOnboardingStore } from "@/stores/onboarding";
import { useUserStore } from "@/stores/user";

interface LocalWithDocuments {
  localNumber: number;
  name: string;
  region: string;
  state: string;
  documents: Array<{
    id: string;
    title: string;
    type: string;
  }>;
}

export default function ConfirmScreen() {
  const router = useRouter();
  const { localNumber, classification } = useOnboardingStore();
  const { fetchProfile } = useUserStore();
  const [error, setError] = useState("");

  const { data: localDetails, isLoading } = useQuery({
    queryKey: ["local", localNumber],
    queryFn: async () => {
      const response = await api.get<LocalWithDocuments>(
        `/api/locals/${localNumber}`
      );
      return response;
    },
    enabled: !!localNumber,
  });

  const createProfileMutation = useMutation({
    mutationFn: async () => {
      await api.post("/api/user/profile", {
        localNumber,
        classification,
      });
    },
    onSuccess: async () => {
      await fetchProfile();
      router.replace("/(main)");
    },
    onError: (err: Error) => {
      setError(err.message || "Failed to create profile");
    },
  });

  const handleComplete = () => {
    setError("");
    createProfileMutation.mutate();
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4a90d9" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.step}>Step 3 of 3</Text>
          <Text style={styles.title}>Confirm your setup</Text>
          <Text style={styles.subtitle}>
            Here's what we'll use to find your contract language
          </Text>
        </View>

        <ScrollView style={styles.details} showsVerticalScrollIndicator={false}>
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Local Union</Text>
            <Text style={styles.detailValue}>
              Local {localNumber}
              {localDetails?.name ? ` - ${localDetails.name}` : ""}
            </Text>
            <Text style={styles.detailSubvalue}>
              {localDetails?.region} Region
            </Text>
          </View>

          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Classification</Text>
            <Text style={styles.detailValue}>
              {CLASSIFICATIONS[classification as Classification]}
            </Text>
          </View>

          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Your Contract Documents</Text>
            {localDetails?.documents.map((doc) => (
              <View key={doc.id} style={styles.documentItem}>
                <Text style={styles.documentTitle}>{doc.title}</Text>
                <Text style={styles.documentType}>{doc.type}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable
          style={[
            styles.button,
            createProfileMutation.isPending && styles.buttonDisabled,
          ]}
          onPress={handleComplete}
          disabled={createProfileMutation.isPending}
        >
          {createProfileMutation.isPending ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Let's Go</Text>
          )}
        </Pressable>

        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          disabled={createProfileMutation.isPending}
        >
          <Text style={styles.backText}>Go Back</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginBottom: 24,
  },
  step: {
    color: "#4a90d9",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#a0a0a0",
    lineHeight: 24,
  },
  details: {
    flex: 1,
  },
  detailCard: {
    backgroundColor: "#2a2a4e",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: "#808080",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
  },
  detailSubvalue: {
    fontSize: 14,
    color: "#a0a0a0",
    marginTop: 4,
  },
  documentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#3a3a5e",
  },
  documentTitle: {
    fontSize: 14,
    color: "#ffffff",
    flex: 1,
  },
  documentType: {
    fontSize: 12,
    color: "#4a90d9",
    textTransform: "capitalize",
  },
  error: {
    color: "#ff6b6b",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#4a90d9",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  backButton: {
    marginTop: 12,
    alignItems: "center",
  },
  backText: {
    color: "#4a90d9",
    fontSize: 16,
  },
});
