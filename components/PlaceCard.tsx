import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { HotBadge } from "@/components/HotBadge";
import { RatingStars } from "@/components/RatingStars";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useColors } from "@/hooks/useColors";
import type { Place } from "@/types/models";

const CATEGORY_LABEL: Record<string, string> = {
  restaurant: "Restaurant",
  cafe: "Café",
  hotel: "Hotel",
  aktivitaet: "Aktivität",
  event: "Event",
  natur: "Natur",
  sehenswuerdigkeit: "Sehenswürdigkeit",
  shopping: "Shopping",
  familie: "Familie",
  romantisch: "Romantisch",
};

function priceLabel(level: 1 | 2 | 3) {
  return "€".repeat(level);
}

interface PlaceCardProps {
  place: Place;
  variant?: "hero" | "compact" | "wide";
  reason?: string;
  onPress?: () => void;
}

export function PlaceCard({ place, variant = "compact", reason, onPress }: PlaceCardProps) {
  const colors = useColors();
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(place.id);

  const handlePress = () => {
    if (onPress) onPress();
    else router.push(`/place/${place.id}` as never);
  };

  if (variant === "hero") {
    return (
      <Pressable onPress={handlePress} style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}>
        <View
          style={[
            styles.heroCard,
            { borderRadius: colors.radius, backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Image source={place.images[0]} style={styles.heroImage} contentFit="cover" />
          <LinearGradient
            colors={["transparent", "rgba(6,17,31,0.85)"]}
            style={StyleSheet.absoluteFill}
          />
          {place.is_hot && (
            <View style={styles.heroBadge}>
              <HotBadge />
            </View>
          )}
          <Pressable
            onPress={() => toggleFavorite(place.id)}
            style={styles.favButton}
            hitSlop={10}
          >
            <Ionicons
              name={fav ? "heart" : "heart-outline"}
              size={20}
              color={fav ? "#F87171" : "#fff"}
            />
          </Pressable>
          <View style={styles.heroInfo}>
            <Text style={[styles.heroName, { color: "#fff" }]} numberOfLines={1}>
              {place.name}
            </Text>
            <View style={styles.heroMeta}>
              <RatingStars rating={place.rating} count={place.reviews_count} size={12} />
              <Text style={[styles.dot, { color: "rgba(255,255,255,0.5)" }]}>·</Text>
              <Text style={[styles.metaText, { color: "rgba(255,255,255,0.85)" }]}>
                {place.distance_m} m
              </Text>
              <Text style={[styles.dot, { color: "rgba(255,255,255,0.5)" }]}>·</Text>
              <Text style={[styles.metaText, { color: "rgba(255,255,255,0.85)" }]}>
                {CATEGORY_LABEL[place.category] ?? place.type}
              </Text>
            </View>
            {reason && (
              <Text style={[styles.reason, { color: "rgba(255,255,255,0.85)" }]} numberOfLines={2}>
                {reason}
              </Text>
            )}
          </View>
        </View>
      </Pressable>
    );
  }

  if (variant === "wide") {
    return (
      <Pressable onPress={handlePress} style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}>
        <View
          style={[
            styles.wideCard,
            { borderRadius: colors.radius, backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Image source={place.images[0]} style={styles.wideImage} contentFit="cover" />
          <View style={styles.wideContent}>
            <View style={styles.rowBetween}>
              <Text
                style={[styles.wideName, { color: colors.foreground }]}
                numberOfLines={1}
              >
                {place.name}
              </Text>
              <Pressable onPress={() => toggleFavorite(place.id)} hitSlop={10}>
                <Ionicons
                  name={fav ? "heart" : "heart-outline"}
                  size={18}
                  color={fav ? "#F87171" : colors.mutedForeground}
                />
              </Pressable>
            </View>
            <View style={styles.wideMeta}>
              <RatingStars rating={place.rating} count={place.reviews_count} size={12} />
              <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                · {place.distance_m} m
              </Text>
            </View>
            <Text
              style={[styles.wideShort, { color: colors.mutedForeground }]}
              numberOfLines={2}
            >
              {reason ?? place.short_description}
            </Text>
            <View style={styles.wideFooter}>
              <View style={[styles.tagPill, { backgroundColor: colors.secondary }]}>
                <Text style={[styles.tagText, { color: colors.foreground }]}>
                  {CATEGORY_LABEL[place.category] ?? place.type}
                </Text>
              </View>
              <Text style={[styles.priceText, { color: colors.primary }]}>
                {priceLabel(place.price_level)}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={handlePress} style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}>
      <View
        style={[
          styles.compactCard,
          { borderRadius: colors.radius, backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <View>
          <Image source={place.images[0]} style={styles.compactImage} contentFit="cover" />
          {place.is_hot && (
            <View style={styles.compactBadge}>
              <HotBadge small />
            </View>
          )}
          <Pressable
            onPress={() => toggleFavorite(place.id)}
            style={styles.compactFav}
            hitSlop={10}
          >
            <Ionicons
              name={fav ? "heart" : "heart-outline"}
              size={16}
              color={fav ? "#F87171" : "#fff"}
            />
          </Pressable>
        </View>
        <View style={styles.compactInfo}>
          <Text
            style={[styles.compactName, { color: colors.foreground }]}
            numberOfLines={1}
          >
            {place.name}
          </Text>
          <View style={styles.rowGap}>
            <RatingStars rating={place.rating} count={place.reviews_count} size={11} />
          </View>
          <Text style={[styles.compactSub, { color: colors.mutedForeground }]} numberOfLines={1}>
            {place.distance_m} m · {CATEGORY_LABEL[place.category] ?? place.type}
          </Text>
          <Text style={[styles.compactReason, { color: colors.mutedForeground }]} numberOfLines={1}>
            <Feather name="map-pin" size={9} color={colors.mutedForeground} />{"  "}
            {priceLabel(place.price_level)} · {place.tags[0] ?? "Empfehlung"}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    width: 240,
    height: 280,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
  },
  heroImage: { width: "100%", height: "100%" },
  heroBadge: { position: "absolute", top: 12, left: 12 },
  favButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(6,17,31,0.55)",
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  heroInfo: { position: "absolute", bottom: 14, left: 14, right: 14 },
  heroName: { fontSize: 18, fontFamily: "Inter_700Bold", marginBottom: 6 },
  heroMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  dot: { fontSize: 10 },
  metaText: { fontSize: 11, fontFamily: "Inter_500Medium" },
  reason: { fontSize: 11, marginTop: 6, lineHeight: 14 },

  wideCard: {
    flexDirection: "row",
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    height: 110,
  },
  wideImage: { width: 110, height: "100%" },
  wideContent: { flex: 1, padding: 12, justifyContent: "space-between" },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  wideName: { flex: 1, fontSize: 15, fontFamily: "Inter_600SemiBold" },
  wideMeta: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  wideShort: { fontSize: 12, lineHeight: 15 },
  wideFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  tagPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  tagText: { fontSize: 11, fontFamily: "Inter_500Medium" },
  priceText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },

  compactCard: {
    width: 180,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
  },
  compactImage: { width: "100%", height: 110 },
  compactBadge: { position: "absolute", top: 8, left: 8 },
  compactFav: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(6,17,31,0.55)",
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  compactInfo: { padding: 10, gap: 4 },
  compactName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  rowGap: { flexDirection: "row", alignItems: "center", gap: 4 },
  compactSub: { fontSize: 11, fontFamily: "Inter_400Regular" },
  compactReason: { fontSize: 11, fontFamily: "Inter_400Regular" },
});
