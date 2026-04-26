import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { ScreenHeader } from "@/components/ScreenHeader";
import { useAuth } from "@/contexts/AuthContext";
import { useColors } from "@/hooks/useColors";

export default function KontoLoeschenScreen() {
  const colors = useColors();
  const router = useRouter();
  const { logout } = useAuth();
  const [confirmed, setConfirmed] = useState(false);

  const onDelete = async () => {
    await logout();
    setConfirmed(true);
    setTimeout(() => router.replace("/(tabs)" as never), 1500);
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Konto löschen" />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100, gap: 16 }}>
        <View style={[styles.iconWrap, { backgroundColor: "rgba(248,113,113,0.18)" }]}>
          <Feather name="alert-triangle" size={28} color={colors.destructive} />
        </View>
        <Text style={[styles.title, { color: colors.foreground }]}>
          Konto endgültig löschen?
        </Text>
        <Text style={[styles.body, { color: colors.mutedForeground }]}>
          Wenn du dein Konto löschst, werden alle deine Favoriten, Bewertungen und gespeicherten Routen unwiderruflich entfernt. Dieser Vorgang kann nicht rückgängig gemacht werden.
        </Text>

        <View style={[styles.note, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
          <Feather name="info" size={14} color={colors.mutedForeground} />
          <Text style={[styles.noteText, { color: colors.mutedForeground }]}>
            Du erhältst innerhalb von 30 Tagen eine Bestätigung per E-Mail, sobald deine Daten endgültig gelöscht wurden.
          </Text>
        </View>

        {confirmed ? (
          <View style={[styles.confirm, { backgroundColor: "rgba(34,211,238,0.18)", borderRadius: colors.radius }]}>
            <Feather name="check-circle" size={18} color={colors.primary} />
            <Text style={[styles.confirmText, { color: colors.primary }]}>
              Dein Konto wurde gelöscht.
            </Text>
          </View>
        ) : (
          <>
            <Pressable
              onPress={onDelete}
              style={({ pressed }) => [
                styles.deleteBtn,
                {
                  backgroundColor: colors.destructive,
                  borderRadius: colors.radius,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Feather name="trash-2" size={18} color="#fff" />
              <Text style={styles.deleteText}>Konto endgültig löschen</Text>
            </Pressable>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [
                styles.cancelBtn,
                { borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <Text style={[styles.cancelText, { color: colors.foreground }]}>Abbrechen</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  title: { fontSize: 20, fontFamily: "Inter_700Bold", textAlign: "center" },
  body: { fontSize: 13, lineHeight: 20, textAlign: "center", paddingHorizontal: 8 },
  note: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  noteText: { flex: 1, fontSize: 11, lineHeight: 15 },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    marginTop: 8,
  },
  deleteText: { color: "#fff", fontSize: 15, fontFamily: "Inter_700Bold" },
  cancelBtn: {
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  cancelText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  confirm: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    marginTop: 8,
  },
  confirmText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
});
