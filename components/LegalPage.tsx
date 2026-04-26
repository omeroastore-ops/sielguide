import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { ScreenHeader } from "@/components/ScreenHeader";
import { useColors } from "@/hooks/useColors";

export interface LegalSection {
  heading?: string;
  body: string;
}

export function LegalPage({
  title,
  intro,
  sections,
}: {
  title: string;
  intro?: string;
  sections: LegalSection[];
}) {
  const colors = useColors();
  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScreenHeader title={title} />
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
        {intro && (
          <Text style={[styles.intro, { color: colors.mutedForeground }]}>{intro}</Text>
        )}
        {sections.map((s, i) => (
          <View key={i} style={{ marginTop: 18 }}>
            {s.heading && (
              <Text style={[styles.heading, { color: colors.foreground }]}>
                {s.heading}
              </Text>
            )}
            <Text style={[styles.body, { color: colors.mutedForeground }]}>{s.body}</Text>
          </View>
        ))}
        <Text style={[styles.placeholder, { color: colors.mutedForeground }]}>
          (Platzhaltertext — bitte vor Veröffentlichung durch die endgültige Rechtsfassung ersetzen.)
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  title: { fontSize: 24, fontFamily: "Inter_700Bold", marginBottom: 6, letterSpacing: -0.5 },
  intro: { fontSize: 13, lineHeight: 20, fontFamily: "Inter_400Regular" },
  heading: { fontSize: 15, fontFamily: "Inter_700Bold", marginBottom: 6 },
  body: { fontSize: 13, lineHeight: 20, fontFamily: "Inter_400Regular" },
  placeholder: {
    fontSize: 11,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 32,
  },
});
