import { Feather } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { ScreenHeader } from "@/components/ScreenHeader";
import { useColors } from "@/hooks/useColors";

const BENEFITS = [
  "Eigene Profilseite für dein Unternehmen",
  "Aktualisierungen von Öffnungszeiten und Angeboten",
  "Live-Statistiken zu Profilaufrufen",
  "Verknüpfung mit deinen Buchungs- und Kontaktkanälen",
];

export default function BusinessScreen() {
  const colors = useColors();
  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Für Unternehmen" />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100, gap: 16 }}>
        <View
          style={[
            styles.heroCard,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
          ]}
        >
          <View style={[styles.iconWrap, { backgroundColor: "rgba(34,211,238,0.18)" }]}>
            <Feather name="briefcase" size={28} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.foreground }]}>
            Business-Dashboard kommt bald
          </Text>
          <Text style={[styles.sub, { color: colors.mutedForeground }]}>
            Wir arbeiten gerade an einem eigenen Bereich für lokale Unternehmen aus Carolinensiel.
          </Text>
        </View>

        <View style={{ gap: 10 }}>
          <Text style={[styles.section, { color: colors.foreground }]}>
            Das wird dich erwarten
          </Text>
          {BENEFITS.map((b) => (
            <View
              key={b}
              style={[
                styles.bullet,
                { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
              ]}
            >
              <Feather name="check-circle" size={16} color={colors.primary} />
              <Text style={[styles.bulletText, { color: colors.foreground }]}>{b}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  heroCard: {
    padding: 24,
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 18, fontFamily: "Inter_700Bold", textAlign: "center" },
  sub: { fontSize: 13, lineHeight: 19, textAlign: "center", maxWidth: 320 },
  section: { fontSize: 16, fontFamily: "Inter_700Bold", marginTop: 4 },
  bullet: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  bulletText: { flex: 1, fontSize: 13, fontFamily: "Inter_500Medium" },
});
