import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { ScreenHeader } from "@/components/ScreenHeader";
import { useSettings, type Language } from "@/contexts/SettingsContext";
import { useColors } from "@/hooks/useColors";

const OPTIONS: { code: Language; label: string; native: string }[] = [
  { code: "de", label: "Deutsch", native: "Deutsch (Standard)" },
  { code: "en", label: "Englisch", native: "English" },
];

export default function LanguageScreen() {
  const colors = useColors();
  const router = useRouter();
  const { settings, updateSetting } = useSettings();

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Sprache" />
      <ScrollView contentContainerStyle={{ padding: 20, gap: 14 }}>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
          ]}
        >
          {OPTIONS.map((opt, idx) => {
            const active = settings.language === opt.code;
            return (
              <Pressable
                key={opt.code}
                onPress={() => {
                  updateSetting("language", opt.code);
                  setTimeout(() => router.back(), 150);
                }}
                style={({ pressed }) => [
                  styles.row,
                  {
                    borderBottomColor: colors.border,
                    borderBottomWidth: idx < OPTIONS.length - 1 ? StyleSheet.hairlineWidth : 0,
                    opacity: pressed ? 0.75 : 1,
                  },
                ]}
              >
                <View style={[styles.flag, { backgroundColor: colors.secondary }]}>
                  <Text style={[styles.flagText, { color: colors.foreground }]}>
                    {opt.code.toUpperCase()}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.label, { color: colors.foreground }]}>{opt.label}</Text>
                  <Text style={[styles.native, { color: colors.mutedForeground }]}>
                    {opt.native}
                  </Text>
                </View>
                {active ? (
                  <Feather name="check" size={20} color={colors.primary} />
                ) : (
                  <Feather name="circle" size={18} color={colors.mutedForeground} />
                )}
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.note, { color: colors.mutedForeground }]}>
          Vollständige Übersetzung erscheint in einem späteren Update.
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
  flag: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  flagText: { fontSize: 12, fontFamily: "Inter_700Bold" },
  label: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  native: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  note: { fontSize: 12, textAlign: "center", lineHeight: 16, paddingHorizontal: 12 },
});
