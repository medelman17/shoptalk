import { View, Text, StyleSheet, Pressable, Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { CLASSIFICATIONS, type Classification } from "@shoptalk/shared";
import { useUserStore } from "@/stores/user";

export default function SettingsScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { user: clerkUser } = useUser();
  const { profile, clearProfile } = useUserStore();

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await signOut();
          clearProfile();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>
                {clerkUser?.primaryEmailAddress?.emailAddress ?? "Not set"}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Phone</Text>
              <Text style={styles.value}>
                {clerkUser?.primaryPhoneNumber?.phoneNumber ?? "Not set"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <View style={styles.card}>
            <Pressable style={styles.row}>
              <Text style={styles.label}>Local Union</Text>
              <View style={styles.valueRow}>
                <Text style={styles.value}>Local {profile?.localNumber}</Text>
                <Ionicons name="chevron-forward" size={16} color="#606060" />
              </View>
            </Pressable>
            <Pressable style={styles.row}>
              <Text style={styles.label}>Classification</Text>
              <View style={styles.valueRow}>
                <Text style={styles.value}>
                  {profile?.classification
                    ? CLASSIFICATIONS[profile.classification as Classification]
                    : "Not set"}
                </Text>
                <Ionicons name="chevron-forward" size={16} color="#606060" />
              </View>
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <View style={styles.card}>
            <Pressable style={styles.row}>
              <Text style={styles.label}>Privacy Policy</Text>
              <Ionicons name="chevron-forward" size={16} color="#606060" />
            </Pressable>
            <Pressable style={styles.row}>
              <Text style={styles.label}>Terms of Service</Text>
              <Ionicons name="chevron-forward" size={16} color="#606060" />
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Version</Text>
              <Text style={styles.value}>1.0.0</Text>
            </View>
          </View>
        </View>

        <Pressable style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>

        <Text style={styles.disclaimer}>
          ShopTalk is not affiliated with UPS, the Teamsters Union, or any Local
          union. Contract information is provided for reference only.
        </Text>
      </ScrollView>
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
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    color: "#808080",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: "#2a2a4e",
    borderRadius: 12,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#3a3a5e",
  },
  label: {
    fontSize: 16,
    color: "#ffffff",
  },
  value: {
    fontSize: 16,
    color: "#a0a0a0",
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  signOutButton: {
    backgroundColor: "#ff6b6b20",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  signOutText: {
    color: "#ff6b6b",
    fontSize: 16,
    fontWeight: "600",
  },
  disclaimer: {
    fontSize: 12,
    color: "#606060",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 32,
  },
});
