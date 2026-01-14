import { View, Text, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import Pdf from "react-native-pdf";
import { api } from "@/lib/api";

interface DocumentPdfResponse {
  url: string;
  pageNumber: number;
  pageCount: number | null;
}

export default function DocumentScreen() {
  const router = useRouter();
  const { id, page } = useLocalSearchParams<{ id: string; page?: string }>();
  const initialPage = page ? parseInt(page) : 1;

  const { data, isLoading, error } = useQuery({
    queryKey: ["documentPdf", id, page],
    queryFn: async () => {
      const response = await api.get<DocumentPdfResponse>(
        `/api/documents/${id}/pdf${page ? `?page=${page}` : ""}`
      );
      return response;
    },
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4a90d9" />
          <Text style={styles.loadingText}>Loading document...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !data) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </Pressable>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load document</Text>
          <Pressable style={styles.retryButton} onPress={() => router.back()}>
            <Text style={styles.retryText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </Pressable>
        <Text style={styles.pageInfo}>
          Page {initialPage}
          {data.pageCount ? ` of ${data.pageCount}` : ""}
        </Text>
      </View>

      <Pdf
        source={{ uri: data.url }}
        page={initialPage}
        style={styles.pdf}
        enablePaging
        horizontal
        onError={(error) => {
          console.log("PDF error:", error);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a4e",
  },
  backButton: {
    marginRight: 16,
  },
  pageInfo: {
    fontSize: 16,
    color: "#ffffff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    color: "#a0a0a0",
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 16,
  },
  retryButton: {
    backgroundColor: "#4a90d9",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  pdf: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
});
