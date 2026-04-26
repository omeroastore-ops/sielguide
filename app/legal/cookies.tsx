import { Feather } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";

import { ScreenHeader } from "@/components/ScreenHeader";
import { useSettings } from "@/contexts/SettingsContext";
import { useColors } from "@/hooks/useColors";

export default function CookiesScreen() {
  const colors = useColors();
  const { settings, updateSetting } = useSettings();

  const items = [
    {
      key: "cookiesEssential" as const,
      label: "Essenzielle Cookies",
      desc: "Notwendig für den Betrieb der App. Können nicht deaktiviert werden.",
      locked: true,
    },
    {
      key: "cookiesExternal" as const,
      label: "Externe Inhalte",
      desc: "Erlaubt Karten, Buchungs-Iframes und Inhalte externer Anbieter.",
    },
    {
      key: "cookiesAnalytics" as const,
      label: "Analyse",
      desc: "Hilft uns, die App durch anonyme Nutzungsstatistiken zu verbessern.",
    },
  ];

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Cookie-Einstellungen" />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100, gap: 14 }}>
        <Text style={[styles.intro, { color: colors.mutedForeground }]}>
          Du kannst hier festlegen, welche optionalen Cookies und Tracking-Dienste in der App verwendet werden dürfen.
        </Text>

        {items.map((it) => (
          <View
            key={it.key}
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
            ]}
          >
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.title, { color: colors.foreground }]}>{it.label}</Text>
                <Text style={[styles.desc, { color: colors.mutedForeground }]}>{it.desc}</Text>
              </View>
              <Switch
                value={settings[it.key]}
                onValueChange={(v) => !it.locked && updateSetting(it.key, v)}
                disabled={it.locked}
                trackColor={{ true: colors.primary, false: colors.muted }}
                thumbColor="#fff"
              />
            </View>
          </View>
        ))}

        <View
          style={[
            styles.note,
            { borderColor: colors.border, backgroundColor: colors.secondary, borderRadius: colors.radius },
          ]}
        >
          <Feather name="info" size={14} color={colors.mutedForeground} />
          <Text style={[styles.noteText, { color: colors.mutedForeground }]}>
            Deine Auswahl wird lokal auf deinem Gerät gespeichert. Du kannst sie jederzeit ändern.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  intro: { fontSize: 13, lineHeight: 19 },
  card: { padding: 14, borderWidth: StyleSheet.hairlineWidth },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  title: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  desc: { fontSize: 12, lineHeight: 16, marginTop: 4 },
  note: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  noteText: { flex: 1, fontSize: 11, lineHeight: 15 },
});
