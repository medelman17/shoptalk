import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useOnboardingStore } from "@/stores/onboarding";

interface Local {
  localNumber: number;
  name: string;
  city: string | null;
  state: string;
  region: string;
}

export default function LocalScreen() {
  const router = useRouter();
  const { setLocalNumber } = useOnboardingStore();
  const [search, setSearch] = useState("");
  const [selectedLocal, setSelectedLocal] = useState<Local | null>(null);

  const { data: locals, isLoading } = useQuery({
    queryKey: ["locals", search],
    queryFn: async () => {
      const response = await api.get<Local[]>(
        `/api/locals${search ? `?search=${encodeURIComponent(search)}` : ""}`
      );
      return response;
    },
    enabled: search.length >= 1,
  });

  const handleContinue = () => {
    if (selectedLocal) {
      setLocalNumber(selectedLocal.localNumber);
      router.push("/(onboarding)/classification");
    }
  };

  const renderLocal = ({ item }: { item: Local }) => (
    <Pressable
      style={[
        styles.localItem,
        selectedLocal?.localNumber === item.localNumber &&
          styles.localItemSelected,
      ]}
      onPress={() => setSelectedLocal(item)}
    >
      <Text style={styles.localNumber}>Local {item.localNumber}</Text>
      <Text style={styles.localDetails}>
        {item.city ? `${item.city}, ` : ""}{item.state} - {item.region}
      </Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.step}>Step 1 of 3</Text>
          <Text style={styles.title}>What's your Local?</Text>
          <Text style={styles.subtitle}>
            Enter your Local union number to get your applicable contract documents
          </Text>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by Local number, city, or state"
            placeholderTextColor="#606060"
            value={search}
            onChangeText={(text) => {
              setSearch(text);
              setSelectedLocal(null);
            }}
            keyboardType="default"
            autoCapitalize="none"
          />
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#4a90d9" />
          </View>
        ) : locals && locals.length > 0 ? (
          <FlatList
            data={locals}
            renderItem={renderLocal}
            keyExtractor={(item) => item.localNumber.toString()}
            style={styles.list}
            showsVerticalScrollIndicator={false}
          />
        ) : search.length >= 1 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No locals found</Text>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Start typing to search for your Local
            </Text>
          </View>
        )}

        <Pressable
          style={[styles.button, !selectedLocal && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={!selectedLocal}
        >
          <Text style={styles.buttonText}>Continue</Text>
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
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: "#2a2a4e",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
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
  localItem: {
    backgroundColor: "#2a2a4e",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  localItemSelected: {
    borderColor: "#4a90d9",
  },
  localNumber: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 4,
  },
  localDetails: {
    fontSize: 14,
    color: "#a0a0a0",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#606060",
    fontSize: 16,
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
});
