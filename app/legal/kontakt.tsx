import { Feather } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { ScreenHeader } from "@/components/ScreenHeader";
import { useColors } from "@/hooks/useColors";

export default function KontaktScreen() {
  const colors = useColors();

  const channels = [
    {
      icon: "mail" as const,
      label: "E-Mail",
      value: "kontakt@sielguide-app.example",
      action: () => Linking.openURL("mailto:kontakt@sielguide-app.example").catch(() => {}),
    },
    {
      icon: "phone" as const,
      label: "Telefon",
      value: "+49 4464 000000",
      action: () => Linking.openURL("tel:+494464000000").catch(() => {}),
    },
    {
      icon: "globe" as const,
      label: "Webseite",
      value: "sielguide-app.example",
      action: () => WebBrowser.openBrowserAsync("https://sielguide-app.example").catch(() => {}),
    },
  ];

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Kontakt & Support" />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100, gap: 14 }}>
        <Text style={[styles.intro, { color: colors.mutedForeground }]}>
          Du hast eine Frage, einen Vorschlag oder möchtest dich melden? Wir sind für dich da.
        </Text>
        {channels.map((c) => (
          <Pressable
            key={c.label}
            onPress={c.action}
            style={({ pressed }) => [
              styles.row,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: colors.radius,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <View style={[styles.icon, { backgroundColor: "rgba(34,211,238,0.18)" }]}>
              <Feather name={c.icon} size={18} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>{c.label}</Text>
              <Text style={[styles.value, { color: colors.foreground }]}>{c.value}</Text>
            </View>
            <Feather name="external-link" size={16} color={colors.mutedForeground} />
          </Pressable>
        ))}

        <Text style={[styles.note, { color: colors.mutedForeground }]}>
          Hinweis: Anfragen zu Reservierungen oder Bestellungen richte bitte direkt an den jeweiligen Anbieter.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  intro: { fontSize: 14, lineHeight: 20 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  icon: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  label: { fontSize: 11, fontFamily: "Inter_500Medium", textTransform: "uppercase", letterSpacing: 0.5 },
  value: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginTop: 2 },
  note: { fontSize: 11, marginTop: 16, lineHeight: 15, textAlign: "center" },
});
