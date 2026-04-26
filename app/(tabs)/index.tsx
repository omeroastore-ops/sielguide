import { Feather, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CategoryPill } from "@/components/CategoryPill";
import { OfferCard } from "@/components/OfferCard";
import { PlaceCard } from "@/components/PlaceCard";
import { QuickActionTile } from "@/components/QuickActionTile";
import { RouteCard } from "@/components/RouteCard";
import { SectionHeader } from "@/components/SectionHeader";
import { WeatherChip } from "@/components/WeatherChip";
import { useColors } from "@/hooks/useColors";
import {
  EVENTS,
  IMAGES,
  OFFERS,
  ROUTES,
  getFeaturedPlaces,
  getHotPlaces,
} from "@/services/mockData";

const HERO_HEIGHT = 460;

const QUICK_ACTIONS = [
  { icon: "coffee" as const, label: "Wo kann ich essen?", category: "restaurant" },
  { icon: "coffee" as const, label: "Cafés & Kaffee", category: "cafe" },
  { icon: "compass" as const, label: "Aktivitäten", category: "aktivitaet" },
  { icon: "home" as const, label: "Hotels", category: "hotel" },
  { icon: "heart" as const, label: "Romantische Orte", category: "romantisch" },
];

const CATEGORY_TILES: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  category: string;
}[] = [
  { icon: "coffee", label: "Restaurants", category: "restaurant" },
  { icon: "coffee", label: "Cafés", category: "cafe" },
  { icon: "camera", label: "Sehenswürdigkeiten", category: "sehenswuerdigkeit" },
  { icon: "compass", label: "Aktivitäten", category: "aktivitaet" },
  { icon: "calendar", label: "Events", category: "event" },
  { icon: "anchor", label: "Strand & Natur", category: "natur" },
];

export default function StartScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const hot = useMemo(() => getHotPlaces(), []);
  const featured = useMemo(() => getFeaturedPlaces().slice(0, 6), []);

  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });

  const heroImageStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(scrollY.value, [-200, 0, 300], [-100, 0, 80]) },
      { scale: interpolate(scrollY.value, [-200, 0], [1.3, 1], "clamp") },
    ],
  }));

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={onScroll}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {/* HERO */}
        <View style={[styles.hero, { height: HERO_HEIGHT }]}>
          <Animated.View style={[StyleSheet.absoluteFill, heroImageStyle]}>
            <Image
              source={IMAGES.hero}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
            />
          </Animated.View>
          <LinearGradient
            colors={["rgba(6,17,31,0.4)", "rgba(6,17,31,0.55)", "#06111F"]}
            locations={[0, 0.55, 1]}
            style={StyleSheet.absoluteFill}
          />

          <View style={[styles.heroTopBar, { paddingTop: topPad + 8 }]}>
            <Pressable
              onPress={() => router.push("/menu" as never)}
              style={[styles.iconChip, { backgroundColor: "rgba(255,255,255,0.12)" }]}
              hitSlop={10}
            >
              <Feather name="menu" size={20} color="#fff" />
            </Pressable>
            <WeatherChip />
            <Pressable
              onPress={() => router.push("/notifications" as never)}
              style={[styles.iconChip, { backgroundColor: "rgba(255,255,255,0.12)" }]}
              hitSlop={10}
            >
              <Feather name="bell" size={20} color="#fff" />
            </Pressable>
          </View>

          <View style={styles.heroBottom}>
            <Animated.View entering={FadeInDown.duration(600)}>
              <Text style={styles.heroTitle}>SielGuide</Text>
              <Text style={styles.heroSubtitle}>
                Dein persönlicher Guide für Carolinensiel
              </Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(150).duration(600)}>
              <Pressable
                onPress={() => router.push("/(tabs)/entdecken" as never)}
                style={[
                  styles.searchBar,
                  { borderColor: "rgba(255,255,255,0.2)" },
                ]}
              >
                <Feather name="search" size={18} color="rgba(255,255,255,0.7)" />
                <Text style={styles.searchPlaceholder}>
                  Suche nach Restaurants, Cafés, Hotels…
                </Text>
              </Pressable>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(280).duration(600)}>
              <Pressable
                onPress={() => router.push("/ai" as never)}
                style={[
                  styles.aiCard,
                  { borderColor: "rgba(34,211,238,0.35)" },
                ]}
              >
                <Image source={IMAGES.hero} style={styles.aiAvatarBg} contentFit="cover" />
                <View style={styles.aiAvatarWrap}>
                  <Image
                    source={require("@/assets/images/ai-avatar.png")}
                    style={styles.aiAvatar}
                    contentFit="cover"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.aiTitle}>Frag SielGuide AI</Text>
                  <Text style={styles.aiSubtitle}>
                    Dein persönlicher Concierge
                  </Text>
                </View>
                <Feather name="arrow-right" size={20} color={colors.primary} />
              </Pressable>
            </Animated.View>
          </View>
        </View>

        {/* QUICK ACTIONS */}
        <View style={styles.section}>
          <SectionHeader title="Schnelle Aktionen" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hScroll}
          >
            {QUICK_ACTIONS.map((qa) => (
              <QuickActionTile
                key={qa.label}
                icon={qa.icon}
                label={qa.label}
                onPress={() =>
                  router.push(`/(tabs)/entdecken?category=${qa.category}` as never)
                }
              />
            ))}
          </ScrollView>
        </View>

        {/* HOT */}
        <View style={styles.section}>
          <SectionHeader
            title="Heute beliebt"
            icon={<Feather name="trending-up" size={18} color="#F87171" />}
            action="Alle anzeigen"
            onAction={() => router.push("/(tabs)/entdecken" as never)}
          />
          <FlatList
            data={hot}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hScroll}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
            renderItem={({ item }) => <PlaceCard place={item} variant="compact" />}
          />
        </View>

        {/* CATEGORIES GRID */}
        <View style={styles.section}>
          <SectionHeader
            title="Entdecken"
            action="Alle anzeigen"
            onAction={() => router.push("/(tabs)/entdecken" as never)}
          />
          <View style={styles.tilesGrid}>
            {CATEGORY_TILES.map((t) => (
              <Pressable
                key={t.label}
                onPress={() =>
                  router.push(`/(tabs)/entdecken?category=${t.category}` as never)
                }
                style={({ pressed }) => [
                  styles.gridTile,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    borderRadius: colors.radius,
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}
              >
                <View
                  style={[
                    styles.gridIconWrap,
                    { backgroundColor: "rgba(34,211,238,0.15)" },
                  ]}
                >
                  <Feather name={t.icon} size={20} color={colors.primary} />
                </View>
                <Text style={[styles.gridLabel, { color: colors.foreground }]}>
                  {t.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* HERO PLACES */}
        <View style={styles.section}>
          <SectionHeader
            title="Empfohlen für dich"
            action="Alle anzeigen"
            onAction={() => router.push("/(tabs)/entdecken" as never)}
          />
          <FlatList
            data={featured}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hScroll}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
            renderItem={({ item }) => <PlaceCard place={item} variant="hero" />}
          />
        </View>

        {/* ROUTES */}
        <View style={styles.section}>
          <SectionHeader
            title="Empfohlene Routen"
            action="Alle anzeigen"
            onAction={() => router.push("/plan-day" as never)}
          />
          <FlatList
            data={ROUTES.slice(0, 4)}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hScroll}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
            renderItem={({ item }) => <RouteCard route={item} />}
          />
        </View>

        {/* OFFERS */}
        <View style={styles.section}>
          <SectionHeader title="Angebote in der Nähe" />
          <FlatList
            data={OFFERS}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hScroll}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
            renderItem={({ item }) => <OfferCard offer={item} />}
          />
        </View>

        {/* PLAN DAY */}
        <Pressable
          onPress={() => router.push("/plan-day" as never)}
          style={({ pressed }) => [
            styles.planCard,
            {
              backgroundColor: colors.primary,
              borderRadius: colors.radius,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text style={[styles.planTitle, { color: colors.primaryForeground }]}>
              Meinen Tag planen
            </Text>
            <Text style={[styles.planSub, { color: colors.primaryForeground }]}>
              Lass dir eine perfekte Tour vorschlagen
            </Text>
          </View>
          <View style={[styles.planIcon, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
            <Feather name="map" size={20} color={colors.primaryForeground} />
          </View>
        </Pressable>

        {/* EVENTS PEEK */}
        <View style={styles.section}>
          <SectionHeader
            title="Aktuelle Events"
            action="Alle anzeigen"
            onAction={() => router.push("/events" as never)}
          />
          <View style={{ paddingHorizontal: 20, gap: 10 }}>
            {EVENTS.map((ev) => (
              <Pressable
                key={ev.id}
                onPress={() => router.push(`/events/${ev.id}` as never)}
                style={({ pressed }) => [
                  styles.eventRow,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    borderRadius: colors.radius,
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}
              >
                <View style={[styles.eventIcon, { backgroundColor: "rgba(94,234,212,0.18)" }]}>
                  <Ionicons name="calendar-outline" size={18} color={colors.accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.eventTitle, { color: colors.foreground }]} numberOfLines={1}>
                    {ev.title}
                  </Text>
                  <Text style={[styles.eventDate, { color: colors.mutedForeground }]} numberOfLines={1}>
                    {ev.date}
                  </Text>
                </View>
                <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
              </Pressable>
            ))}
          </View>
        </View>

        <Text style={[styles.footer, { color: colors.mutedForeground }]}>
          Diese App ist kein offizielles Angebot der Stadt Carolinensiel.
        </Text>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  hero: { width: "100%", overflow: "hidden" },
  heroTopBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  iconChip: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  weatherChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  weatherText: { color: "#fff", fontFamily: "Inter_600SemiBold", fontSize: 13 },

  heroBottom: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 20,
    gap: 14,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 42,
    fontFamily: "Inter_700Bold",
    letterSpacing: -1,
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    marginTop: 4,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: "rgba(15,30,51,0.7)",
    borderWidth: StyleSheet.hairlineWidth,
  },
  searchPlaceholder: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    flex: 1,
  },
  aiCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 22,
    backgroundColor: "rgba(15,30,51,0.85)",
    borderWidth: 1,
    overflow: "hidden",
  },
  aiAvatarBg: { ...StyleSheet.absoluteFillObject, opacity: 0.18 },
  aiAvatarWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(34,211,238,0.18)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  aiAvatar: { width: 48, height: 48 },
  aiTitle: { color: "#fff", fontSize: 15, fontFamily: "Inter_600SemiBold" },
  aiSubtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },

  section: { marginTop: 28 },
  hScroll: { paddingHorizontal: 20, gap: 12 },

  tilesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 14,
    gap: 10,
  },
  gridTile: {
    flexBasis: "31%",
    flexGrow: 1,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: "center",
    gap: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
  gridIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  gridLabel: { fontSize: 12, fontFamily: "Inter_500Medium", textAlign: "center" },

  planCard: {
    marginHorizontal: 20,
    marginTop: 28,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  planTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  planSub: { fontSize: 12, fontFamily: "Inter_500Medium", marginTop: 4, opacity: 0.85 },
  planIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },

  eventRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  eventIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  eventTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  eventDate: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },

  footer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    fontSize: 11,
    textAlign: "center",
    lineHeight: 15,
  },
});
