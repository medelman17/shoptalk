import { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { api } from "@/lib/api";
import type { QueryResponse, Citation } from "@shoptalk/shared";

export default function QueryScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<QueryResponse | null>(null);

  const queryMutation = useMutation({
    mutationFn: async (queryText: string) => {
      const result = await api.post<QueryResponse>("/api/query", {
        query: queryText,
      });
      return result;
    },
    onSuccess: (data) => {
      setResponse(data);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    },
  });

  const handleSubmit = () => {
    if (!query.trim() || queryMutation.isPending) return;
    queryMutation.mutate(query.trim());
  };

  const handleCitationPress = (citation: Citation) => {
    router.push({
      pathname: "/document/[id]",
      params: {
        id: citation.documentId,
        page: citation.pageNumber.toString(),
      },
    });
  };

  const handleNewQuery = () => {
    setQuery("");
    setResponse(null);
    queryMutation.reset();
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
        keyboardVerticalOffset={0}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Ask about your contract</Text>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {!response && !queryMutation.isPending && (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>
                Ask any question about your contract, like:
              </Text>
              <Text style={styles.exampleQuery}>
                "What are the penalties for supervisors working?"
              </Text>
              <Text style={styles.exampleQuery}>
                "How much notice is required for schedule changes?"
              </Text>
              <Text style={styles.exampleQuery}>
                "What are the overtime rules for package car drivers?"
              </Text>
            </View>
          )}

          {queryMutation.isPending && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4a90d9" />
              <Text style={styles.loadingText}>Searching contract...</Text>
            </View>
          )}

          {response && (
            <View style={styles.responseContainer}>
              <View style={styles.queryBubble}>
                <Text style={styles.queryText}>{response.query}</Text>
              </View>

              <View style={styles.responseBubble}>
                <Text style={styles.responseText}>{response.response}</Text>

                {response.citations.length > 0 && (
                  <View style={styles.citationsContainer}>
                    <Text style={styles.citationsLabel}>Sources:</Text>
                    {response.citations.map((citation, index) => (
                      <Pressable
                        key={index}
                        style={styles.citationItem}
                        onPress={() => handleCitationPress(citation)}
                      >
                        <Ionicons
                          name="document-text-outline"
                          size={16}
                          color="#4a90d9"
                        />
                        <View style={styles.citationText}>
                          <Text style={styles.citationTitle}>
                            {citation.documentTitle}
                          </Text>
                          <Text style={styles.citationDetails}>
                            {[citation.article, citation.section]
                              .filter(Boolean)
                              .join(", ")}{" "}
                            - Page {citation.pageNumber}
                          </Text>
                        </View>
                        <Ionicons
                          name="chevron-forward"
                          size={16}
                          color="#606060"
                        />
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>

              <Pressable style={styles.newQueryButton} onPress={handleNewQuery}>
                <Ionicons name="add-circle-outline" size={20} color="#4a90d9" />
                <Text style={styles.newQueryText}>Ask another question</Text>
              </Pressable>
            </View>
          )}

          {queryMutation.isError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                Something went wrong. Please try again.
              </Text>
              <Pressable style={styles.retryButton} onPress={handleSubmit}>
                <Text style={styles.retryText}>Retry</Text>
              </Pressable>
            </View>
          )}
        </ScrollView>

        {!response && (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Ask about your contract..."
              placeholderTextColor="#606060"
              value={query}
              onChangeText={setQuery}
              multiline
              maxLength={1000}
              editable={!queryMutation.isPending}
              onSubmitEditing={handleSubmit}
              blurOnSubmit={false}
            />
            <Pressable
              style={[
                styles.submitButton,
                (!query.trim() || queryMutation.isPending) &&
                  styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!query.trim() || queryMutation.isPending}
            >
              <Ionicons name="send" size={20} color="#ffffff" />
            </Pressable>
          </View>
        )}
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    flexGrow: 1,
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  placeholderText: {
    color: "#a0a0a0",
    fontSize: 16,
    textAlign: "center",
  },
  exampleQuery: {
    color: "#4a90d9",
    fontSize: 14,
    textAlign: "center",
    fontStyle: "italic",
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
  responseContainer: {
    gap: 16,
  },
  queryBubble: {
    backgroundColor: "#4a90d9",
    borderRadius: 16,
    borderBottomRightRadius: 4,
    padding: 16,
    alignSelf: "flex-end",
    maxWidth: "85%",
  },
  queryText: {
    color: "#ffffff",
    fontSize: 16,
  },
  responseBubble: {
    backgroundColor: "#2a2a4e",
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    padding: 16,
    alignSelf: "flex-start",
    maxWidth: "95%",
  },
  responseText: {
    color: "#e0e0e0",
    fontSize: 16,
    lineHeight: 24,
  },
  citationsContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#3a3a5e",
  },
  citationsLabel: {
    color: "#808080",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  citationItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#3a3a5e",
  },
  citationText: {
    flex: 1,
  },
  citationTitle: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
  },
  citationDetails: {
    color: "#808080",
    fontSize: 12,
    marginTop: 2,
  },
  newQueryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
  },
  newQueryText: {
    color: "#4a90d9",
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
    textAlign: "center",
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#2a2a4e",
  },
  input: {
    flex: 1,
    backgroundColor: "#2a2a4e",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#ffffff",
    maxHeight: 120,
  },
  submitButton: {
    backgroundColor: "#4a90d9",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
});
