import { Feather } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CategoryPill } from "@/components/CategoryPill";
import { PlaceCard } from "@/components/PlaceCard";
import { PlacesMap } from "@/components/PlacesMap";
import { useColors } from "@/hooks/useColors";
import { PLACES } from "@/services/mockData";
import type { Place, PlaceCategory } from "@/types/models";

const CATEGORIES: { key: PlaceCategory | "all"; label: string }[] = [
  { key: "all", label: "Alle" },
  { key: "restaurant", label: "Restaurants" },
  { key: "cafe", label: "Cafés" },
  { key: "hotel", label: "Hotels" },
  { key: "aktivitaet", label: "Aktivitäten" },
  { key: "natur", label: "Natur" },
  { key: "sehenswuerdigkeit", label: "Sehenswürdigkeiten" },
  { key: "shopping", label: "Shopping" },
];

const RATINGS = [
  { key: 0, label: "Alle" },
  { key: 4.0, label: "4.0+" },
  { key: 4.5, label: "4.5+" },
  { key: 4.8, label: "4.8+" },
];

const PRICE_LEVELS = [
  { key: 1, label: "€" },
  { key: 2, label: "€€" },
  { key: 3, label: "€€€" },
] as const;

export default function KarteScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const [category, setCategory] = useState<PlaceCategory | "all">("all");
  const [selected, setSelected] = useState<Place | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const [minRating, setMinRating] = useState(0);
  const [priceLevels, setPriceLevels] = useState<number[]>([]);
  const [onlyHot, setOnlyHot] = useState(false);
  const [onlyFeatured, setOnlyFeatured] = useState(false);

  const filtered = useMemo(() => {
    return PLACES.filter((p) => {
      const matchCategory = category === "all" || p.category === category;
      const matchRating = p.rating >= minRating;
      const matchPrice =
        priceLevels.length === 0 || priceLevels.includes(p.price_level);
      const matchHot = !onlyHot || p.is_hot;
      const matchFeatured = !onlyFeatured || p.is_featured;

      return matchCategory && matchRating && matchPrice && matchHot && matchFeatured;
    });
  }, [category, minRating, priceLevels, onlyHot, onlyFeatured]);

  const togglePrice = (level: number) => {
    setPriceLevels((current) =>
      current.includes(level)
        ? current.filter((x) => x !== level)
        : [...current, level],
    );
  };

  const resetFilters = () => {
    setCategory("all");
    setMinRating(0);
    setPriceLevels([]);
    setOnlyHot(false);
    setOnlyFeatured(false);
    setSelected(null);
  };

  const openRoute = (p: Place) => {
    const url = Platform.select({
      ios: `maps://?daddr=${p.lat},${p.lng}&dirflg=d`,
      android: `google.navigation:q=${p.lat},${p.lng}`,
      default: `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`,
    }) as string;

    Linking.openURL(url).catch(() => {
      Linking.openURL(
        `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`,
      ).catch(() => {});
    });
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.iconBtn, { backgroundColor: colors.secondary }]}
          hitSlop={10}
        >
          <Feather name="chevron-left" size={20} color={colors.foreground} />
        </Pressable>

        <Text style={[styles.title, { color: colors.foreground }]}>
          Carolinensiel
        </Text>

        <Pressable
          onPress={() => setFilterOpen(true)}
          style={[styles.iconBtn, { backgroundColor: colors.secondary }]}
          hitSlop={10}
        >
          <Feather name="sliders" size={18} color={colors.foreground} />
        </Pressable>
      </View>

      <View style={{ paddingTop: 4 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {CATEGORIES.map((c) => (
            <CategoryPill
              key={c.key}
              label={c.label}
              active={category === c.key}
              onPress={() => {
                setCategory(c.key);
                setSelected(null);
              }}
            />
          ))}
        </ScrollView>
      </View>

      <View style={[styles.mapWrap, { borderColor: colors.border }]}>
        <PlacesMap
          places={filtered}
          selectedId={selected?.id ?? null}
          onMarkerPress={(p) => setSelected(p)}
        />

        <View style={styles.captionBox}>
          <Feather name="map" size={11} color={colors.mutedForeground} />
          <Text style={[styles.caption, { color: colors.mutedForeground }]}>
            Interaktive Karte · {filtered.length} Orte
          </Text>
        </View>
      </View>

      {selected && (
        <View style={styles.previewWrap}>
          <PlaceCard place={selected} variant="wide" />
          <View style={styles.previewActions}>
            <Pressable
              style={[styles.previewBtn, { backgroundColor: colors.secondary }]}
              onPress={() => setSelected(null)}
            >
              <Feather name="x" size={16} color={colors.foreground} />
            </Pressable>

            <Pressable
              style={[styles.previewBtnFlex, { backgroundColor: colors.primary }]}
              onPress={() => openRoute(selected)}
            >
              <Feather name="navigation" size={16} color={colors.primaryForeground} />
              <Text style={[styles.previewBtnText, { color: colors.primaryForeground }]}>
                Route anzeigen
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      <Modal
        visible={filterOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setFilterOpen(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setFilterOpen(false)}>
          <Pressable
            onPress={() => {}}
            style={[
              styles.modalCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.modalHandle} />

            <View style={styles.modalHeader}>
              <View>
                <Text style={[styles.modalTitle, { color: colors.foreground }]}>
                  Filter
                </Text>
                <Text style={[styles.modalSub, { color: colors.mutedForeground }]}>
                  Orte genauer eingrenzen
                </Text>
              </View>

              <Pressable
                onPress={() => setFilterOpen(false)}
                style={[styles.modalClose, { backgroundColor: colors.secondary }]}
              >
                <Feather name="x" size={18} color={colors.foreground} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.groupTitle, { color: colors.foreground }]}>
                Kategorie
              </Text>

              <View style={styles.chipGrid}>
                {CATEGORIES.map((cat) => {
                  const active = category === cat.key;
                  return (
                    <Pressable
                      key={cat.key}
                      onPress={() => setCategory(cat.key)}
                      style={[
                        styles.filterChip,
                        {
                          backgroundColor: active ? colors.primary : colors.secondary,
                          borderColor: active ? colors.primary : colors.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          {
                            color: active
                              ? colors.primaryForeground
                              : colors.foreground,
                          },
                        ]}
                      >
                        {cat.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <Text style={[styles.groupTitle, { color: colors.foreground }]}>
                Mindestbewertung
              </Text>

              <View style={styles.chipGrid}>
                {RATINGS.map((r) => {
                  const active = minRating === r.key;
                  return (
                    <Pressable
                      key={r.key}
                      onPress={() => setMinRating(r.key)}
                      style={[
                        styles.filterChip,
                        {
                          backgroundColor: active ? colors.primary : colors.secondary,
                          borderColor: active ? colors.primary : colors.border,
                        },
                      ]}
                    >
                      <Feather
                        name="star"
                        size={14}
                        color={active ? colors.primaryForeground : "#FBBF24"}
                      />
                      <Text
                        style={[
                          styles.filterChipText,
                          {
                            color: active
                              ? colors.primaryForeground
                              : colors.foreground,
                          },
                        ]}
                      >
                        {r.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <Text style={[styles.groupTitle, { color: colors.foreground }]}>
                Preisniveau
              </Text>

              <View style={styles.chipGrid}>
                {PRICE_LEVELS.map((p) => {
                  const active = priceLevels.includes(p.key);
                  return (
                    <Pressable
                      key={p.key}
                      onPress={() => togglePrice(p.key)}
                      style={[
                        styles.filterChip,
                        {
                          backgroundColor: active ? colors.primary : colors.secondary,
                          borderColor: active ? colors.primary : colors.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          {
                            color: active
                              ? colors.primaryForeground
                              : colors.foreground,
                          },
                        ]}
                      >
                        {p.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <Text style={[styles.groupTitle, { color: colors.foreground }]}>
                Besonderheiten
              </Text>

              <Pressable
                onPress={() => setOnlyHot(!onlyHot)}
                style={[
                  styles.toggleRow,
                  { backgroundColor: colors.secondary, borderColor: colors.border },
                ]}
              >
                <View style={styles.toggleLeft}>
                  <Feather name="trending-up" size={18} color="#F87171" />
                  <Text style={[styles.toggleText, { color: colors.foreground }]}>
                    Nur beliebte Orte
                  </Text>
                </View>
                <Feather
                  name={onlyHot ? "check-circle" : "circle"}
                  size={20}
                  color={onlyHot ? colors.primary : colors.mutedForeground}
                />
              </Pressable>

              <Pressable
                onPress={() => setOnlyFeatured(!onlyFeatured)}
                style={[
                  styles.toggleRow,
                  { backgroundColor: colors.secondary, borderColor: colors.border },
                ]}
              >
                <View style={styles.toggleLeft}>
                  <Feather name="award" size={18} color={colors.primary} />
                  <Text style={[styles.toggleText, { color: colors.foreground }]}>
                    Nur Empfehlungen
                  </Text>
                </View>
                <Feather
                  name={onlyFeatured ? "check-circle" : "circle"}
                  size={20}
                  color={onlyFeatured ? colors.primary : colors.mutedForeground}
                />
              </Pressable>
            </ScrollView>

            <View style={styles.modalActions}>
              <Pressable
                onPress={resetFilters}
                style={[styles.resetBtn, { backgroundColor: colors.secondary }]}
              >
                <Text style={[styles.resetText, { color: colors.foreground }]}>
                  Zurücksetzen
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setSelected(null);
                  setFilterOpen(false);
                }}
                style={[styles.applyBtn, { backgroundColor: colors.primary }]}
              >
                <Text style={[styles.applyText, { color: colors.primaryForeground }]}>
                  {filtered.length} Orte anzeigen
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 10,
    gap: 12,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    fontFamily: "Inter_600SemiBold",
  },
  filterRow: {
    paddingHorizontal: 20,
    gap: 8,
    paddingVertical: 8,
  },
  mapWrap: {
    flex: 1,
    overflow: "hidden",
    margin: 16,
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: "#0A1B2E",
  },
  captionBox: {
    position: "absolute",
    top: 14,
    left: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "rgba(6,17,31,0.85)",
    borderRadius: 999,
  },
  caption: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },
  previewWrap: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 100,
    gap: 8,
  },
  previewActions: {
    flexDirection: "row",
    gap: 8,
  },
  previewBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  previewBtnFlex: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 44,
    borderRadius: 22,
  },
  previewBtnText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },
  modalCard: {
    maxHeight: "82%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 18,
    borderWidth: StyleSheet.hairlineWidth,
  },
  modalHandle: {
    width: 42,
    height: 5,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignSelf: "center",
    marginBottom: 14,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  modalTitle: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.7,
  },
  modalSub: {
    marginTop: 4,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  modalClose: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  groupTitle: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    marginBottom: 10,
    marginTop: 14,
  },
  chipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterChip: {
    minHeight: 42,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  filterChipText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  toggleRow: {
    minHeight: 56,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toggleLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  toggleText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  resetBtn: {
    flex: 0.9,
    height: 52,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  resetText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  applyBtn: {
    flex: 1.4,
    height: 52,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  applyText: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
  },
});