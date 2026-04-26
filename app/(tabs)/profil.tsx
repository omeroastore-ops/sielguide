import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useColors } from "@/hooks/useColors";

interface MenuRow {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
  destructive?: boolean;
}

export default function ProfilScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const { user, logout } = useAuth();
  const { favorites } = useFavorites();

  const displayName = user?.name ?? "Max Mustermann";

  const handleLogout = async () => {
    if (Platform.OS === "web") {
      await logout();
      return;
    }
    Alert.alert("Abmelden", "Möchtest du dich wirklich abmelden?", [
      { text: "Abbrechen", style: "cancel" },
      { text: "Abmelden", style: "destructive", onPress: () => logout() },
    ]);
  };

  const menu: MenuRow[] = [
    { icon: "heart", label: "Meine Favoriten", onPress: () => router.push("/(tabs)/favoriten" as never) },
    { icon: "star", label: "Meine Bewertungen", onPress: () => router.push("/my-reviews" as never) },
    { icon: "grid", label: "Mein QR-Code", onPress: () => router.push("/qr-code" as never) },
    { icon: "settings", label: "Einstellungen", onPress: () => router.push("/settings" as never) },
    { icon: "file-text", label: "Impressum", onPress: () => router.push("/legal/impressum" as never) },
    { icon: "shield", label: "Datenschutz", onPress: () => router.push("/legal/datenschutz" as never) },
    { icon: "book-open", label: "AGB", onPress: () => router.push("/legal/agb" as never) },
    { icon: "mail", label: "Kontakt & Support", onPress: () => router.push("/legal/kontakt" as never) },
    { icon: "briefcase", label: "Für Unternehmen", onPress: () => router.push("/business" as never) },
  ];

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: topPad + 12, paddingBottom: 120 }}
      >
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Mein Profil</Text>

        {/* Avatar card */}
        <View
          style={[
            styles.profileCard,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
          ]}
        >
          <View style={[styles.avatar, { backgroundColor: "rgba(34,211,238,0.18)" }]}>
            <Feather name="user" size={36} color={colors.primary} />
          </View>
          <Text style={[styles.name, { color: colors.foreground }]}>{displayName}</Text>
          <View style={[styles.levelPill, { backgroundColor: "rgba(94,234,212,0.18)" }]}>
            <Feather name="award" size={11} color={colors.accent} />
            <Text style={[styles.levelText, { color: colors.accent }]}>
              Level 5 · Entdecker
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <Stat label="Punkte" value="250" colors={colors} />
          <Stat label="Favoriten" value={favorites.length.toString()} colors={colors} />
          <Stat label="Bewertungen" value="12" colors={colors} />
          <Stat label="Besucht" value="8" colors={colors} />
        </View>

        {/* Auth CTA if not logged in */}
        {!user && (
          <Pressable
            onPress={() => router.push("/auth/login" as never)}
            style={({ pressed }) => [
              styles.authCta,
              {
                backgroundColor: colors.primary,
                borderRadius: colors.radius,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.authCtaTitle, { color: colors.primaryForeground }]}>
                Anmelden oder registrieren
              </Text>
              <Text style={[styles.authCtaSub, { color: colors.primaryForeground }]}>
                Speichere deine Favoriten und Routen.
              </Text>
            </View>
            <Feather name="arrow-right" size={20} color={colors.primaryForeground} />
          </Pressable>
        )}

        {/* Menu */}
        <View style={[styles.menu, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
          {menu.map((row, idx) => (
            <Pressable
              key={row.label}
              onPress={row.onPress}
              style={({ pressed }) => [
                styles.menuRow,
                {
                  borderBottomColor: colors.border,
                  borderBottomWidth: idx < menu.length - 1 ? StyleSheet.hairlineWidth : 0,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <View style={[styles.menuIcon, { backgroundColor: colors.secondary }]}>
                <Feather name={row.icon} size={16} color={colors.primary} />
              </View>
              <Text
                style={[
                  styles.menuLabel,
                  { color: row.destructive ? colors.destructive : colors.foreground },
                ]}
              >
                {row.label}
              </Text>
              <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
            </Pressable>
          ))}
        </View>

        {/* Destructive actions */}
        <View style={{ marginHorizontal: 20, marginTop: 12, gap: 8 }}>
          <Pressable
            onPress={() => router.push("/legal/konto-loeschen" as never)}
            style={({ pressed }) => [
              styles.destructiveBtn,
              { borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Feather name="trash-2" size={16} color={colors.destructive} />
            <Text style={[styles.destructiveText, { color: colors.destructive }]}>
              Konto löschen
            </Text>
          </Pressable>

          {user && (
            <Pressable
              onPress={handleLogout}
              style={({ pressed }) => [
                styles.destructiveBtn,
                { borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <Feather name="log-out" size={16} color={colors.foreground} />
              <Text style={[styles.destructiveText, { color: colors.foreground }]}>
                Abmelden
              </Text>
            </Pressable>
          )}
        </View>

        <Text style={[styles.version, { color: colors.mutedForeground }]}>
          SielGuide · Version 1.0.0
        </Text>
      </ScrollView>
    </View>
  );
}

function Stat({ label, value, colors }: { label: string; value: string; colors: ReturnType<typeof useColors> }) {
  return (
    <View
      style={[
        styles.stat,
        { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
      ]}
    >
      <Text style={[styles.statValue, { color: colors.foreground }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  headerTitle: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    paddingHorizontal: 20,
    paddingBottom: 16,
    letterSpacing: -0.5,
  },
  profileCard: {
    marginHorizontal: 20,
    padding: 24,
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  name: { fontSize: 19, fontFamily: "Inter_600SemiBold" },
  levelPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  levelText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },

  statsRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 20,
    marginTop: 14,
  },
  stat: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
    gap: 4,
  },
  statValue: { fontSize: 18, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 10, fontFamily: "Inter_500Medium" },

  authCta: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  authCtaTitle: { fontSize: 15, fontFamily: "Inter_700Bold" },
  authCtaSub: { fontSize: 12, fontFamily: "Inter_500Medium", opacity: 0.85, marginTop: 2 },

  menu: {
    marginHorizontal: 20,
    marginTop: 16,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  menuIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  menuLabel: { flex: 1, fontSize: 14, fontFamily: "Inter_500Medium" },

  destructiveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 13,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  destructiveText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },

  version: {
    textAlign: "center",
    fontSize: 11,
    marginTop: 28,
    fontFamily: "Inter_400Regular",
  },
});
