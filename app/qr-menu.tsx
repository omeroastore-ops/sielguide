import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { ScreenHeader } from "@/components/ScreenHeader";
import { useColors } from "@/hooks/useColors";

const STEPS = [
  "Scanne den QR-Code am Tisch",
  "Menü ansehen",
  "Bestellung aufgeben (optional)",
];

export default function QRMenuScreen() {
  const colors = useColors();

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScreenHeader title="QR Menü" />
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.intro, { color: colors.mutedForeground }]}>
          Scanne den QR-Code am Tisch, um die Speisekarte zu öffnen.
        </Text>

        {/* QR scanner frame */}
        <View
          style={[
            styles.qrFrame,
            { borderColor: colors.border, backgroundColor: colors.card, borderRadius: colors.radius },
          ]}
        >
          {/* corner brackets */}
          <View style={[styles.corner, styles.cornerTL, { borderColor: colors.primary }]} />
          <View style={[styles.corner, styles.cornerTR, { borderColor: colors.primary }]} />
          <View style={[styles.corner, styles.cornerBL, { borderColor: colors.primary }]} />
          <View style={[styles.corner, styles.cornerBR, { borderColor: colors.primary }]} />
          <Feather name="maximize" size={48} color={colors.mutedForeground} />
          <Text style={[styles.qrPlaceholder, { color: colors.mutedForeground }]}>
            Kamera-Scanner
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.scanBtn,
            {
              backgroundColor: colors.primary,
              borderRadius: colors.radius,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Feather name="camera" size={18} color={colors.primaryForeground} />
          <Text style={[styles.scanText, { color: colors.primaryForeground }]}>
            QR-Code scannen
          </Text>
        </Pressable>

        <Text style={[styles.section, { color: colors.foreground }]}>So funktioniert's</Text>
        <View style={{ gap: 10 }}>
          {STEPS.map((s, i) => (
            <View
              key={s}
              style={[
                styles.step,
                { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
              ]}
            >
              <View style={[styles.stepNum, { backgroundColor: colors.primary }]}>
                <Text style={[styles.stepNumText, { color: colors.primaryForeground }]}>
                  {i + 1}
                </Text>
              </View>
              <Text style={[styles.stepText, { color: colors.foreground }]}>{s}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.note, { color: colors.mutedForeground }]}>
          Hinweis: Bestellungen und Zahlungen erfolgen über externe Anbieter im jeweiligen Restaurant.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  intro: { fontSize: 14, lineHeight: 20, textAlign: "center", marginBottom: 24 },
  qrFrame: {
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 20,
    overflow: "hidden",
    gap: 12,
  },
  corner: {
    position: "absolute",
    width: 40,
    height: 40,
    borderWidth: 3,
  },
  cornerTL: { top: 16, left: 16, borderRightWidth: 0, borderBottomWidth: 0 },
  cornerTR: { top: 16, right: 16, borderLeftWidth: 0, borderBottomWidth: 0 },
  cornerBL: { bottom: 16, left: 16, borderRightWidth: 0, borderTopWidth: 0 },
  cornerBR: { bottom: 16, right: 16, borderLeftWidth: 0, borderTopWidth: 0 },
  qrPlaceholder: { fontSize: 13, fontFamily: "Inter_500Medium" },

  scanBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    marginBottom: 28,
  },
  scanText: { fontSize: 15, fontFamily: "Inter_700Bold" },

  section: { fontSize: 16, fontFamily: "Inter_700Bold", marginBottom: 12 },
  step: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumText: { fontSize: 13, fontFamily: "Inter_700Bold" },
  stepText: { flex: 1, fontSize: 14, fontFamily: "Inter_500Medium" },

  note: {
    fontSize: 11,
    textAlign: "center",
    lineHeight: 15,
    marginTop: 24,
    paddingHorizontal: 8,
  },
});
