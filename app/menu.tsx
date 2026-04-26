import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { ScreenHeader } from "@/components/ScreenHeader";
import { useColors } from "@/hooks/useColors";

interface Item {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  href: string;
}

const ITEMS: Item[] = [
  { icon: "home", label: "Start", href: "/(tabs)/" },
  { icon: "map", label: "Karte", href: "/(tabs)/karte" },
  { icon: "compass", label: "Entdecken", href: "/(tabs)/entdecken" },
  { icon: "heart", label: "Favoriten", href: "/(tabs)/favoriten" },
  { icon: "calendar", label: "Events", href: "/events" },
  { icon: "message-circle", label: "SielGuide AI", href: "/ai" },
  { icon: "map", label: "Tag planen", href: "/plan-day" },
  { icon: "user", label: "Profil", href: "/(tabs)/profil" },
  { icon: "settings", label: "Einstellungen", href: "/settings" },
  { icon: "briefcase", label: "Für Unternehmen", href: "/business" },
];

export default function MenuScreen() {
  const colors = useColors();
  const router = useRouter();

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Menü" />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60, gap: 8 }}>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
          ]}
        >
          {ITEMS.map((item, idx) => (
            <Pressable
              key={item.label}
              onPress={() => {
                router.dismissAll?.();
                router.push(item.href as never);
              }}
              style={({ pressed }) => [
                styles.row,
                {
                  borderBottomColor: colors.border,
                  borderBottomWidth: idx < ITEMS.length - 1 ? StyleSheet.hairlineWidth : 0,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <View style={[styles.iconWrap, { backgroundColor: colors.secondary }]}>
                <Feather name={item.icon} size={16} color={colors.primary} />
              </View>
              <Text style={[styles.label, { color: colors.foreground }]}>{item.label}</Text>
              <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
            </Pressable>
          ))}
        </View>

        <Text style={[styles.disclaimer, { color: colors.mutedForeground }]}>
          Diese App ist kein offizielles Angebot der Stadt Carolinensiel.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  card: { overflow: "hidden", borderWidth: StyleSheet.hairlineWidth },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  label: { flex: 1, fontSize: 14, fontFamily: "Inter_500Medium" },
  disclaimer: {
    fontSize: 11,
    textAlign: "center",
    lineHeight: 15,
    marginTop: 20,
    paddingHorizontal: 12,
  },
});
