import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

export function LegalDisclaimer({ short }: { short?: boolean }) {
  const colors = useColors();
  return (
    <View
      style={[
        styles.box,
        { borderColor: colors.border, backgroundColor: colors.secondary },
      ]}
    >
      <Feather name="info" size={14} color={colors.mutedForeground} />
      <Text style={[styles.text, { color: colors.mutedForeground }]}>
        {short
          ? "Reservierungen und Buchungen erfolgen über externe Anbieter."
          : "Diese App ist kein offizielles Angebot der Stadt Carolinensiel. Reservierungen und Buchungen erfolgen über externe Anbieter. Für Inhalte und Leistungen externer Anbieter übernehmen wir keine Haftung."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  text: { flex: 1, fontSize: 11, lineHeight: 15, fontFamily: "Inter_400Regular" },
});
