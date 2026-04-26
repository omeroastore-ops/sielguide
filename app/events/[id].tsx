import { Feather, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Linking from "expo-linking";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { ScreenHeader } from "@/components/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { EVENTS } from "@/services/mockData";

export default function EventDetailScreen() {
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const event = EVENTS.find((e) => e.id === id);

  if (!event) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <ScreenHeader title="Event" />
        <View style={styles.empty}>
          <Feather name="calendar" size={28} color={colors.mutedForeground} />
          <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
            Event nicht gefunden.
          </Text>
        </View>
      </View>
    );
  }

  const openExternal = () => {
    if (event.external_url) {
      Linking.openURL(event.external_url).catch(() => {});
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Event" />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60, gap: 16 }}>
        <View
          style={[
            styles.imageWrap,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
          ]}
        >
          <Image source={event.image} style={styles.image} contentFit="cover" />
        </View>

        <View style={{ gap: 8 }}>
          <View style={[styles.dateChip, { backgroundColor: "rgba(94,234,212,0.18)" }]}>
            <Ionicons name="calendar-outline" size={13} color={colors.accent} />
            <Text style={[styles.dateText, { color: colors.accent }]}>
              {event.date}
            </Text>
          </View>
          <Text style={[styles.title, { color: colors.foreground }]}>
            {event.title}
          </Text>
          <View style={styles.locRow}>
            <Feather name="map-pin" size={13} color={colors.mutedForeground} />
            <Text style={[styles.locText, { color: colors.mutedForeground }]}>
              {event.location}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.descBox,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
          ]}
        >
          <Text style={[styles.descTitle, { color: colors.mutedForeground }]}>
            BESCHREIBUNG
          </Text>
          <Text style={[styles.descText, { color: colors.foreground }]}>
            {event.description}
          </Text>
        </View>

        {event.external_url ? (
          <Pressable
            onPress={openExternal}
            style={({ pressed }) => [
              styles.cta,
              {
                backgroundColor: colors.primary,
                borderRadius: colors.radius,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Feather name="external-link" size={16} color={colors.primaryForeground} />
            <Text style={[styles.ctaText, { color: colors.primaryForeground }]}>
              Mehr Infos öffnen
            </Text>
          </Pressable>
        ) : null}

        <Text style={[styles.disclaimer, { color: colors.mutedForeground }]}>
          Reservierungen und Buchungen erfolgen über externe Anbieter.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  imageWrap: {
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
  },
  image: { width: "100%", height: 220 },
  dateChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  dateText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  title: { fontSize: 24, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  locRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 },
  locText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  descBox: {
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  descTitle: { fontSize: 11, fontFamily: "Inter_700Bold", letterSpacing: 0.8 },
  descText: { fontSize: 14, lineHeight: 21, fontFamily: "Inter_400Regular" },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
  },
  ctaText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10 },
  emptyText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  disclaimer: {
    fontSize: 11,
    textAlign: "center",
    lineHeight: 15,
    marginTop: 8,
  },
});
