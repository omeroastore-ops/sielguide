import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

import { ScreenHeader } from "@/components/ScreenHeader";
import { useAuth } from "@/contexts/AuthContext";
import { useColors } from "@/hooks/useColors";

export default function QRCodeScreen() {
  const colors = useColors();
  const { user } = useAuth();

  const value =
    user?.id ?? user?.email ?? "guest:carolinensiel:sielguide";
  const displayName = user?.name ?? "Gast";

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Mein QR-Code" />
      <View style={styles.content}>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
          ]}
        >
          <View style={styles.qrBox}>
            <QRCode
              value={value}
              size={220}
              color="#06111F"
              backgroundColor="#FFFFFF"
            />
          </View>
          <Text style={[styles.name, { color: colors.foreground }]}>
            {displayName}
          </Text>
          <Text style={[styles.sub, { color: colors.mutedForeground }]}>
            Zeige diesen Code, um deine Punkte oder Vorteile zu sammeln.
          </Text>
        </View>

        <View
          style={[
            styles.infoRow,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
          ]}
        >
          <Feather name="info" size={14} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
            Der Code wird offline generiert und enthält nur deine ID.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: 20, gap: 16 },
  card: {
    alignItems: "center",
    padding: 24,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  qrBox: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
  },
  name: { fontSize: 17, fontFamily: "Inter_600SemiBold", marginTop: 8 },
  sub: { fontSize: 12, fontFamily: "Inter_400Regular", textAlign: "center" },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  infoText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 16 },
});
