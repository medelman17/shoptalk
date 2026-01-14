import { useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { CLASSIFICATION_LIST, type Classification } from "@shoptalk/shared";
import { useOnboardingStore } from "@/stores/onboarding";

export default function ClassificationScreen() {
  const router = useRouter();
  const { setClassification } = useOnboardingStore();
  const [selected, setSelected] = useState<Classification | null>(null);

  const handleContinue = () => {
    if (selected) {
      setClassification(selected);
      router.push("/(onboarding)/confirm");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.step}>Step 2 of 3</Text>
          <Text style={styles.title}>What's your classification?</Text>
          <Text style={styles.subtitle}>
            This helps us show you the most relevant contract language
          </Text>
        </View>

        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {CLASSIFICATION_LIST.map((item) => (
            <Pressable
              key={item.value}
              style={[
                styles.classificationItem,
                selected === item.value && styles.classificationItemSelected,
              ]}
              onPress={() => setSelected(item.value)}
            >
              <Text style={styles.classificationText}>{item.label}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <Pressable
          style={[styles.button, !selected && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={!selected}
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
  list: {
    flex: 1,
  },
  classificationItem: {
    backgroundColor: "#2a2a4e",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  classificationItemSelected: {
    borderColor: "#4a90d9",
  },
  classificationText: {
    fontSize: 16,
    color: "#ffffff",
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
