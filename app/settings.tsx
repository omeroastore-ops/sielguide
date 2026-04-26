import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

import { ScreenHeader } from "@/components/ScreenHeader";
import { useSettings } from "@/contexts/SettingsContext";
import { useColors } from "@/hooks/useColors";

export default function SettingsScreen() {
  const colors = useColors();
  const router = useRouter();
  const { settings, updateSetting } = useSettings();

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Einstellungen" />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100, gap: 18 }}>
        <Section title="Allgemein" colors={colors}>
          <Row
            icon="globe"
            label="Sprache"
            value={settings.language === "de" ? "Deutsch" : "Englisch"}
            colors={colors}
            onPress={() => router.push("/language" as never)}
          />
          <Row
            icon="bell"
            label="Benachrichtigungen"
            colors={colors}
            switchValue={settings.notifications}
            onSwitch={(v) => updateSetting("notifications", v)}
          />
          <Row
            icon="map-pin"
            label="Standortdienste"
            colors={colors}
            switchValue={settings.location}
            onSwitch={(v) => updateSetting("location", v)}
            isLast
          />
        </Section>

        <Section title="Datenschutz" colors={colors}>
          <Row
            icon="shield"
            label="Datenschutzerklärung"
            colors={colors}
            onPress={() => router.push("/legal/datenschutz" as never)}
          />
          <Row
            icon="cookie"
            label="Cookie-Einstellungen"
            colors={colors}
            onPress={() => router.push("/legal/cookies" as never)}
            isLast
          />
        </Section>

        <Section title="Rechtliches" colors={colors}>
          <Row
            icon="file-text"
            label="Impressum"
            colors={colors}
            onPress={() => router.push("/legal/impressum" as never)}
          />
          <Row
            icon="book-open"
            label="AGB"
            colors={colors}
            onPress={() => router.push("/legal/agb" as never)}
          />
          <Row
            icon="mail"
            label="Kontakt"
            colors={colors}
            onPress={() => router.push("/legal/kontakt" as never)}
            isLast
          />
        </Section>

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
      </ScrollView>
    </View>
  );
}

function Section({
  title,
  children,
  colors,
}: {
  title: string;
  children: React.ReactNode;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={{ gap: 10 }}>
      <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
        {title.toUpperCase()}
      </Text>
      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

interface RowProps {
  icon: keyof typeof Feather.glyphMap | "cookie";
  label: string;
  value?: string;
  switchValue?: boolean;
  onSwitch?: (v: boolean) => void;
  onPress?: () => void;
  disabled?: boolean;
  isLast?: boolean;
  colors: ReturnType<typeof useColors>;
}

function Row({
  icon,
  label,
  value,
  switchValue,
  onSwitch,
  onPress,
  disabled,
  isLast,
  colors,
}: RowProps) {
  const safeIcon: keyof typeof Feather.glyphMap = icon === "cookie" ? "circle" : icon;
  const Container = onPress ? Pressable : View;
  return (
    <Container
      onPress={onPress}
      style={[
        styles.row,
        !isLast && { borderBottomColor: colors.border, borderBottomWidth: StyleSheet.hairlineWidth },
      ]}
    >
      <View style={[styles.rowIcon, { backgroundColor: colors.secondary }]}>
        <Feather name={safeIcon} size={15} color={colors.primary} />
      </View>
      <Text
        style={[
          styles.rowLabel,
          { color: disabled ? colors.mutedForeground : colors.foreground },
        ]}
      >
        {label}
      </Text>
      {switchValue !== undefined ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitch}
          trackColor={{ true: colors.primary, false: colors.muted }}
          thumbColor="#fff"
        />
      ) : value ? (
        <Text style={[styles.rowValue, { color: colors.mutedForeground }]}>{value}</Text>
      ) : (
        <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  sectionTitle: { fontSize: 11, fontFamily: "Inter_700Bold", letterSpacing: 0.8 },
  card: { overflow: "hidden", borderWidth: StyleSheet.hairlineWidth },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  rowIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: { flex: 1, fontSize: 14, fontFamily: "Inter_500Medium" },
  rowValue: { fontSize: 13, fontFamily: "Inter_500Medium" },
  destructiveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: 8,
  },
  destructiveText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
});
