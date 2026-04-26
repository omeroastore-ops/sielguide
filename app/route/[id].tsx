import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PlaceCard } from "@/components/PlaceCard";
import { useColors } from "@/hooks/useColors";
import { getPlaceById, getRouteById } from "@/services/mockData";

export default function RouteDetailScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const route = id ? getRouteById(id) : undefined;
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  if (!route) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.foreground }}>Route nicht gefunden.</Text>
      </View>
    );
  }

  const stops = route.stops.map(getPlaceById).filter(Boolean) as ReturnType<
    typeof getPlaceById
  >[];

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.hero}>
          <Image source={route.images[0]} style={styles.heroImg} contentFit="cover" />
          <LinearGradient
            colors={["rgba(6,17,31,0.4)", "transparent", "rgba(6,17,31,0.95)"]}
            locations={[0, 0.4, 1]}
            style={StyleSheet.absoluteFill}
          />
          <View style={[styles.topBar, { paddingTop: topPad + 8 }]}>
            <Pressable
              onPress={() => router.back()}
              style={[styles.iconBtn, { backgroundColor: "rgba(6,17,31,0.6)" }]}
              hitSlop={10}
            >
              <Feather name="chevron-left" size={20} color="#fff" />
            </Pressable>
          </View>
          <View style={styles.heroBottom}>
            <Text style={styles.heroTitle}>{route.title}</Text>
            <View style={styles.metaRow}>
              <View style={[styles.metaPill, { backgroundColor: "rgba(34,211,238,0.25)" }]}>
                <Feather name="clock" size={11} color={colors.primary} />
                <Text style={[styles.metaPillText, { color: colors.primary }]}>{route.duration}</Text>
              </View>
              <View style={[styles.metaPill, { backgroundColor: "rgba(94,234,212,0.25)" }]}>
                <Feather name="trending-up" size={11} color={colors.accent} />
                <Text style={[styles.metaPillText, { color: colors.accent }]}>{route.difficulty}</Text>
              </View>
              <View style={[styles.metaPill, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
                <Feather name="map-pin" size={11} color="#fff" />
                <Text style={[styles.metaPillText, { color: "#fff" }]}>{stops.length} Stopps</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          <Text style={[styles.section, { color: colors.foreground }]}>Über die Route</Text>
          <Text style={[styles.desc, { color: colors.mutedForeground }]}>
            {route.description}
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.startBtn,
              {
                backgroundColor: colors.primary,
                borderRadius: colors.radius,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
            onPress={() => router.push("/(tabs)/karte" as never)}
          >
            <Feather name="navigation" size={18} color={colors.primaryForeground} />
            <Text style={[styles.startBtnText, { color: colors.primaryForeground }]}>
              Route starten
            </Text>
          </Pressable>

          <Text style={[styles.section, { color: colors.foreground, marginTop: 24 }]}>
            Stopps auf dem Weg
          </Text>

          <View style={{ gap: 14 }}>
            {stops.map((stop, idx) =>
              stop ? (
                <View key={stop.id} style={styles.stopRow}>
                  <View style={styles.stopIndicator}>
                    <View style={[styles.stopNumber, { backgroundColor: colors.primary }]}>
                      <Text style={[styles.stopNumberText, { color: colors.primaryForeground }]}>
                        {idx + 1}
                      </Text>
                    </View>
                    {idx < stops.length - 1 && (
                      <View style={[styles.stopLine, { backgroundColor: colors.border }]} />
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <PlaceCard place={stop} variant="wide" />
                  </View>
                </View>
              ) : null,
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  hero: { width: "100%", height: 320 },
  heroImg: { width: "100%", height: "100%" },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    flexDirection: "row",
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  heroBottom: { position: "absolute", left: 20, right: 20, bottom: 20, gap: 10 },
  heroTitle: { color: "#fff", fontSize: 28, fontFamily: "Inter_700Bold" },
  metaRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  metaPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  metaPillText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },

  body: { padding: 20, gap: 14 },
  section: { fontSize: 16, fontFamily: "Inter_700Bold" },
  desc: { fontSize: 14, lineHeight: 21 },

  startBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
    marginTop: 12,
  },
  startBtnText: { fontSize: 15, fontFamily: "Inter_700Bold" },

  stopRow: { flexDirection: "row", gap: 12 },
  stopIndicator: { alignItems: "center", paddingTop: 6 },
  stopNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  stopNumberText: { fontSize: 12, fontFamily: "Inter_700Bold" },
  stopLine: { width: 2, flex: 1, marginTop: 4, marginBottom: -10 },
});
