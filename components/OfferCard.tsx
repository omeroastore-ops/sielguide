import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";
import { getPlaceById } from "@/services/mockData";
import type { Offer } from "@/types/models";

export function OfferCard({ offer }: { offer: Offer }) {
  const colors = useColors();
  const router = useRouter();
  const place = getPlaceById(offer.place_id);
  if (!place) return null;

  return (
    <Pressable
      onPress={() => router.push(`/place/${place.id}` as never)}
      style={({ pressed }) => [
        styles.card,
        {
          borderRadius: colors.radius,
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <Image source={place.images[0]} style={styles.image} contentFit="cover" />
      <View style={styles.content}>
        <View style={[styles.badge, { backgroundColor: colors.primary }]}>
          <Feather name="tag" size={10} color={colors.primaryForeground} />
          <Text style={[styles.badgeText, { color: colors.primaryForeground }]}>
            ANGEBOT
          </Text>
        </View>
        <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={2}>
          {offer.title}
        </Text>
        <Text style={[styles.place, { color: colors.mutedForeground }]} numberOfLines={1}>
          bei {place.name}
        </Text>
        <Text style={[styles.until, { color: colors.mutedForeground }]}>
          gültig bis {offer.valid_until}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 240,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
  },
  image: { width: "100%", height: 110 },
  content: { padding: 12, gap: 4 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    alignSelf: "flex-start",
    marginBottom: 4,
  },
  badgeText: { fontSize: 10, fontFamily: "Inter_700Bold", letterSpacing: 0.5 },
  title: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  place: { fontSize: 12, fontFamily: "Inter_500Medium" },
  until: { fontSize: 11, fontFamily: "Inter_400Regular" },
});
