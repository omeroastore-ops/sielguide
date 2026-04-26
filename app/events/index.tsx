import { Feather, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { ScreenHeader } from "@/components/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { EVENTS } from "@/services/mockData";
import type { EventItem } from "@/types/models";

export default function EventsScreen() {
  const colors = useColors();
  const router = useRouter();

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Events" subtitle="Carolinensiel" />
      <FlatList
        data={EVENTS}
        keyExtractor={(e) => e.id}
        contentContainerStyle={{ padding: 20, paddingBottom: 60, gap: 12 }}
        renderItem={({ item }) => (
          <EventRow
            event={item}
            colors={colors}
            onPress={() => router.push(`/events/${item.id}` as never)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="calendar" size={28} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Aktuell keine Events.
            </Text>
          </View>
        }
        ListFooterComponent={
          <Text style={[styles.disclaimer, { color: colors.mutedForeground }]}>
            Diese App ist kein offizielles Angebot der Stadt Carolinensiel.
          </Text>
        }
      />
    </View>
  );
}

function EventRow({
  event,
  colors,
  onPress,
}: {
  event: EventItem;
  colors: ReturnType<typeof useColors>;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: colors.radius,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <Image source={event.image} style={styles.image} contentFit="cover" />
      <View style={styles.content}>
        <View style={[styles.dateChip, { backgroundColor: "rgba(94,234,212,0.18)" }]}>
          <Ionicons name="calendar-outline" size={12} color={colors.accent} />
          <Text style={[styles.dateText, { color: colors.accent }]} numberOfLines={1}>
            {event.date}
          </Text>
        </View>
        <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={2}>
          {event.title}
        </Text>
        <View style={styles.locRow}>
          <Feather name="map-pin" size={11} color={colors.mutedForeground} />
          <Text
            style={[styles.locText, { color: colors.mutedForeground }]}
            numberOfLines={1}
          >
            {event.location}
          </Text>
        </View>
      </View>
      <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 10,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  image: { width: 72, height: 72, borderRadius: 14 },
  content: { flex: 1, gap: 6 },
  dateChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  dateText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  title: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  locRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  locText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  empty: { alignItems: "center", padding: 40, gap: 10 },
  emptyText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  disclaimer: {
    fontSize: 11,
    textAlign: "center",
    lineHeight: 15,
    marginTop: 24,
    paddingHorizontal: 12,
  },
});
