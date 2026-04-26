import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { ScreenHeader } from "@/components/ScreenHeader";
import { useColors } from "@/hooks/useColors";

export default function AIHistoryScreen() {
  const colors = useColors();
  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Verlauf" subtitle="SielGuide AI" />
      <View style={styles.empty}>
        <View style={[styles.iconWrap, { backgroundColor: colors.secondary }]}>
          <Feather name="message-circle" size={28} color={colors.mutedForeground} />
        </View>
        <Text style={[styles.title, { color: colors.foreground }]}>
          Noch kein Verlauf vorhanden.
        </Text>
        <Text style={[styles.sub, { color: colors.mutedForeground }]}>
          Deine Gespräche mit SielGuide AI erscheinen hier.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 12,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  title: { fontSize: 16, fontFamily: "Inter_600SemiBold", textAlign: "center" },
  sub: { fontSize: 13, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 18 },
});
