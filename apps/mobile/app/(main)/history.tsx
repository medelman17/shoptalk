import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { api } from "@/lib/api";
import type { QueryHistoryItem } from "@shoptalk/shared";

export default function HistoryScreen() {
  const router = useRouter();

  const { data: history, isLoading, refetch } = useQuery({
    queryKey: ["queryHistory"],
    queryFn: async () => {
      const response = await api.get<QueryHistoryItem[]>("/api/query/history");
      return response;
    },
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) {
      return date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: "long" });
    } else {
      return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
      });
    }
  };

  const renderItem = ({ item }: { item: QueryHistoryItem }) => (
    <Pressable
      style={styles.historyItem}
      onPress={() =>
        router.push({
          pathname: "/(main)/query/[id]" as const,
          params: { id: item.id },
        })
      }
    >
      <View style={styles.historyContent}>
        <Text style={styles.queryText} numberOfLines={2}>
          {item.query}
        </Text>
        <Text style={styles.responsePreview} numberOfLines={2}>
          {item.responsePreview}
        </Text>
        <View style={styles.historyMeta}>
          <Text style={styles.metaText}>{formatDate(item.createdAt)}</Text>
          <Text style={styles.metaText}>
            {item.citationCount} source{item.citationCount !== 1 ? "s" : ""}
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#606060" />
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>History</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4a90d9" />
        </View>
      ) : history && history.length > 0 ? (
        <FlatList
          data={history}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onRefresh={refetch}
          refreshing={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbubbles-outline" size={64} color="#3a3a5e" />
          <Text style={styles.emptyTitle}>No questions yet</Text>
          <Text style={styles.emptyText}>
            Your question history will appear here
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a4e",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a4e",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  historyContent: {
    flex: 1,
  },
  queryText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 4,
  },
  responsePreview: {
    fontSize: 14,
    color: "#a0a0a0",
    lineHeight: 20,
    marginBottom: 8,
  },
  historyMeta: {
    flexDirection: "row",
    gap: 16,
  },
  metaText: {
    fontSize: 12,
    color: "#606060",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ffffff",
  },
  emptyText: {
    fontSize: 16,
    color: "#808080",
  },
});
