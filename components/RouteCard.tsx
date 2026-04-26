import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";
import type { Route } from "@/types/models";

export function RouteCard({ route, wide }: { route: Route; wide?: boolean }) {
  const colors = useColors();
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/route/${route.id}` as never)}
      style={({ pressed }) => [
        styles.card,
        wide && styles.wide,
        {
          borderRadius: colors.radius,
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <Image source={route.images[0]} style={styles.image} contentFit="cover" />
      <LinearGradient
        colors={["transparent", "rgba(6,17,31,0.95)"]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.content}>
        <View style={styles.metaRow}>
          <View style={[styles.diffPill, { backgroundColor: "rgba(34,211,238,0.25)" }]}>
            <Feather name="trending-up" size={10} color={colors.primary} />
            <Text style={[styles.diffText, { color: colors.primary }]}>
              {route.difficulty}
            </Text>
          </View>
          <Text style={styles.duration}>· {route.duration}</Text>
        </View>
        <Text style={styles.title} numberOfLines={1}>
          {route.title}
        </Text>
        <Text style={styles.desc} numberOfLines={2}>
          {route.description}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 280,
    height: 170,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
  },
  wide: { width: "100%" },
  image: { width: "100%", height: "100%" },
  content: { position: "absolute", bottom: 14, left: 14, right: 14 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 },
  diffPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  diffText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  duration: { fontSize: 11, color: "rgba(255,255,255,0.85)", fontFamily: "Inter_500Medium" },
  title: { fontSize: 17, color: "#fff", fontFamily: "Inter_700Bold", marginBottom: 4 },
  desc: { fontSize: 12, color: "rgba(255,255,255,0.85)", lineHeight: 16 },
});
