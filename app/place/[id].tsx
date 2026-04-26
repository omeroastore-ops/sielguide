import { Feather, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HotBadge } from "@/components/HotBadge";
import { LegalDisclaimer } from "@/components/LegalDisclaimer";
import { RatingStars } from "@/components/RatingStars";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useColors } from "@/hooks/useColors";
import { getPlaceById } from "@/services/mockData";

const DAYS: { key: keyof import("@/types/models").OpeningHours; label: string }[] = [
  { key: "mo", label: "Montag" },
  { key: "di", label: "Dienstag" },
  { key: "mi", label: "Mittwoch" },
  { key: "do", label: "Donnerstag" },
  { key: "fr", label: "Freitag" },
  { key: "sa", label: "Samstag" },
  { key: "so", label: "Sonntag" },
];

export default function PlaceDetailScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const place = id ? getPlaceById(id) : undefined;
  const { isFavorite, toggleFavorite } = useFavorites();
  const { width } = useWindowDimensions();
  const [imgIndex, setImgIndex] = useState(0);
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  if (!place) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.foreground }}>Ort nicht gefunden.</Text>
      </View>
    );
  }

  const fav = isFavorite(place.id);
  const open = (url?: string) => {
    if (!url) return;
    if (url.startsWith("tel:") || url.startsWith("mailto:")) {
      Linking.openURL(url).catch(() => {});
      return;
    }
    WebBrowser.openBrowserAsync(url).catch(() => {});
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* Hero gallery */}
        <View style={[styles.gallery, { height: width * 0.85 }]}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) =>
              setImgIndex(Math.round(e.nativeEvent.contentOffset.x / width))
            }
          >
            {place.images.map((img, i) => (
              <Image
                key={i}
                source={img}
                style={{ width, height: width * 0.85 }}
                contentFit="cover"
              />
            ))}
          </ScrollView>
          <LinearGradient
            colors={["rgba(6,17,31,0.55)", "transparent", "rgba(6,17,31,0.85)"]}
            locations={[0, 0.4, 1]}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />

          <View style={[styles.heroTopBar, { paddingTop: topPad + 8 }]}>
            <Pressable
              onPress={() => router.back()}
              style={[styles.iconBtn, { backgroundColor: "rgba(6,17,31,0.6)" }]}
              hitSlop={10}
            >
              <Feather name="chevron-left" size={20} color="#fff" />
            </Pressable>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Pressable
                onPress={() => toggleFavorite(place.id)}
                style={[styles.iconBtn, { backgroundColor: "rgba(6,17,31,0.6)" }]}
                hitSlop={10}
              >
                <Ionicons
                  name={fav ? "heart" : "heart-outline"}
                  size={20}
                  color={fav ? "#F87171" : "#fff"}
                />
              </Pressable>
              <Pressable
                style={[styles.iconBtn, { backgroundColor: "rgba(6,17,31,0.6)" }]}
                hitSlop={10}
                onPress={() => {}}
              >
                <Feather name="share-2" size={18} color="#fff" />
              </Pressable>
            </View>
          </View>

          {/* Page indicator */}
          <View style={styles.indicator}>
            {place.images.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      i === imgIndex ? "#fff" : "rgba(255,255,255,0.4)",
                    width: i === imgIndex ? 24 : 6,
                  },
                ]}
              />
            ))}
          </View>
        </View>

        {/* Info */}
        <View style={styles.body}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, { color: colors.foreground }]}>
                {place.name}
              </Text>
              <View style={styles.metaLine}>
                <RatingStars rating={place.rating} count={place.reviews_count} />
                <Text style={[styles.dotSep, { color: colors.mutedForeground }]}>·</Text>
                <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                  {place.type}
                </Text>
              </View>
            </View>
            {place.is_hot && <HotBadge />}
          </View>

          {/* Quick stats */}
          <View style={styles.quickStats}>
            <Stat icon="map-pin" label="Entfernung" value={`${place.distance_m} m`} colors={colors} />
            <Stat icon="dollar-sign" label="Preis" value={"€".repeat(place.price_level)} colors={colors} />
            <Stat icon="clock" label="Heute" value="08:00 - 22:00" colors={colors} short />
          </View>

          {/* Description */}
          <Text style={[styles.section, { color: colors.foreground }]}>Über diesen Ort</Text>
          <Text style={[styles.body2, { color: colors.mutedForeground }]}>{place.description}</Text>

          {/* Tags */}
          {place.tags.length > 0 && (
            <View style={styles.tagRow}>
              {place.tags.map((t) => (
                <View key={t} style={[styles.tag, { backgroundColor: colors.secondary }]}>
                  <Text style={[styles.tagText, { color: colors.foreground }]}>#{t}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Reservation CTA */}
          {place.external_booking_url && (
            <Pressable
              onPress={() => open(place.external_booking_url)}
              style={({ pressed }) => [
                styles.bookingBtn,
                {
                  backgroundColor: colors.primary,
                  borderRadius: colors.radius,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Feather name="external-link" size={18} color={colors.primaryForeground} />
              <Text style={[styles.bookingText, { color: colors.primaryForeground }]}>
                Bei externem Anbieter buchen
              </Text>
            </Pressable>
          )}

          {/* Action grid */}
          <View style={styles.actionGrid}>
            <ActionTile icon="phone" label="Anrufen" onPress={() => open(place.phone ? `tel:${place.phone}` : undefined)} disabled={!place.phone} colors={colors} />
            <ActionTile icon="mail" label="E-Mail" onPress={() => open(place.email ? `mailto:${place.email}` : undefined)} disabled={!place.email} colors={colors} />
            <ActionTile icon="globe" label="Website" onPress={() => open(place.website_url)} disabled={!place.website_url} colors={colors} />
            <ActionTile icon="navigation" label="Route" onPress={() => router.push("/(tabs)/karte" as never)} colors={colors} />
          </View>

          {/* Opening hours */}
          <Text style={[styles.section, { color: colors.foreground }]}>Öffnungszeiten</Text>
          <View
            style={[
              styles.hoursCard,
              { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
            ]}
          >
            {DAYS.map((d, i) => (
              <View
                key={d.key}
                style={[
                  styles.hourRow,
                  i < DAYS.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: StyleSheet.hairlineWidth },
                ]}
              >
                <Text style={[styles.hourDay, { color: colors.foreground }]}>{d.label}</Text>
                <Text style={[styles.hourTime, { color: colors.mutedForeground }]}>
                  {place.opening_hours[d.key] ?? "—"}
                </Text>
              </View>
            ))}
          </View>

          {/* Address */}
          <Text style={[styles.section, { color: colors.foreground }]}>Adresse</Text>
          <View
            style={[
              styles.addressCard,
              { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
            ]}
          >
            <Feather name="map-pin" size={18} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.addressText, { color: colors.foreground }]}>
                {place.address}
              </Text>
              <Text style={[styles.addressCity, { color: colors.mutedForeground }]}>
                {place.city}
              </Text>
            </View>
          </View>

          {/* Disclaimer */}
          <View style={{ marginTop: 20 }}>
            <LegalDisclaimer />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function Stat({
  icon,
  label,
  value,
  colors,
  short,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
  colors: ReturnType<typeof useColors>;
  short?: boolean;
}) {
  return (
    <View
      style={[
        styles.statItem,
        { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
      ]}
    >
      <Feather name={icon} size={14} color={colors.primary} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{label}</Text>
        <Text style={[styles.statValue, { color: colors.foreground }]} numberOfLines={1}>
          {value}
        </Text>
      </View>
    </View>
  );
}

function ActionTile({
  icon,
  label,
  onPress,
  disabled,
  colors,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.actionTile,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: colors.radius,
          opacity: disabled ? 0.4 : pressed ? 0.85 : 1,
        },
      ]}
    >
      <View style={[styles.actionIcon, { backgroundColor: "rgba(34,211,238,0.15)" }]}>
        <Feather name={icon} size={18} color={colors.primary} />
      </View>
      <Text style={[styles.actionLabel, { color: colors.foreground }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  gallery: { width: "100%", overflow: "hidden" },
  heroTopBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  indicator: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  dot: { height: 6, borderRadius: 3 },

  body: { padding: 20, gap: 16 },
  titleRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  title: { fontSize: 24, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  metaLine: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 },
  dotSep: { fontSize: 12 },
  metaText: { fontSize: 13, fontFamily: "Inter_500Medium" },

  quickStats: { flexDirection: "row", gap: 8 },
  statItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  statLabel: { fontSize: 10, fontFamily: "Inter_500Medium" },
  statValue: { fontSize: 13, fontFamily: "Inter_600SemiBold", marginTop: 2 },

  section: { fontSize: 16, fontFamily: "Inter_700Bold", marginTop: 4 },
  body2: { fontSize: 14, lineHeight: 21, fontFamily: "Inter_400Regular" },

  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  tag: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  tagText: { fontSize: 11, fontFamily: "Inter_500Medium" },

  bookingBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    marginTop: 4,
  },
  bookingText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },

  actionGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  actionTile: {
    flexBasis: "23%",
    flexGrow: 1,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: "center",
    gap: 6,
    borderWidth: StyleSheet.hairlineWidth,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: { fontSize: 11, fontFamily: "Inter_500Medium", textAlign: "center" },

  hoursCard: { padding: 14, borderWidth: StyleSheet.hairlineWidth },
  hourRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 9,
  },
  hourDay: { fontSize: 13, fontFamily: "Inter_500Medium" },
  hourTime: { fontSize: 13, fontFamily: "Inter_400Regular" },

  addressCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  addressText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  addressCity: { fontSize: 12, marginTop: 2 },
});
