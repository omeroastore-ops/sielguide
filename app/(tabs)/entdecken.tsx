import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EmptyState } from "@/components/EmptyState";
import { PlaceCard } from "@/components/PlaceCard";
import { SectionHeader } from "@/components/SectionHeader";
import { useColors } from "@/hooks/useColors";
import { PLACES, getFeaturedPlaces } from "@/services/mockData";

const FILTERS = [
  { key: "all", label: "Alle" },
  { key: "restaurant", label: "Restaurants" },
  { key: "cafe", label: "Cafés" },
  { key: "hotel", label: "Hotels" },
  { key: "aktivitaet", label: "Aktivitäten" },
  { key: "event", label: "Events" },
  { key: "natur", label: "Strand & Natur" },
  { key: "sehenswuerdigkeit", label: "Sehenswürdigkeiten" },
  { key: "tag:familie", label: "Familienfreundlich" },
  { key: "tag:romantisch", label: "Romantische Orte" },
  { key: "tag:indoor", label: "Bei Regen" },
  { key: "open:today", label: "Heute geöffnet" },
  { key: "near", label: "In der Nähe" },
];

const RATINGS = [
  { key: 0, label: "Alle" },
  { key: 4.0, label: "4.0+" },
  { key: 4.5, label: "4.5+" },
  { key: 4.8, label: "4.8+" },
];

const PRICES = [
  { key: 1, label: "€" },
  { key: 2, label: "€€" },
  { key: 3, label: "€€€" },
];

export default function EntdeckenScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ category?: string }>();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const initialFilter = params.category
    ? params.category === "romantisch"
      ? "tag:romantisch"
      : params.category
    : "all";

  const [filter, setFilter] = useState<string>(initialFilter);
  const [query, setQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  const [minRating, setMinRating] = useState(0);
  const [priceLevels, setPriceLevels] = useState<number[]>([]);
  const [onlyHot, setOnlyHot] = useState(false);
  const [onlyFeatured, setOnlyFeatured] = useState(false);

  const featured = useMemo(() => getFeaturedPlaces(), []);

  const togglePrice = (price: number) => {
    setPriceLevels((old) =>
      old.includes(price) ? old.filter((p) => p !== price) : [...old, price],
    );
  };

  const resetFilters = () => {
    setFilter("all");
    setQuery("");
    setMinRating(0);
    setPriceLevels([]);
    setOnlyHot(false);
    setOnlyFeatured(false);
  };

  const filtered = useMemo(() => {
    let list = PLACES;

    if (filter.startsWith("tag:")) {
      const tag = filter.split(":")[1];
      list = list.filter((p) => p.tags.includes(tag!));
    } else if (filter === "near") {
      list = [...list].sort((a, b) => a.distance_m - b.distance_m);
    } else if (filter === "open:today") {
      list = list.filter((p) =>
        Object.values(p.opening_hours).some(
          (v) => v && !v.toLowerCase().includes("geschlossen"),
        ),
      );
    } else if (filter !== "all") {
      list = list.filter((p) => p.category === filter);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }

    list = list.filter((p) => p.rating >= minRating);

    if (priceLevels.length > 0) {
      list = list.filter((p) => priceLevels.includes(p.price_level));
    }

    if (onlyHot) list = list.filter((p) => p.is_hot);
    if (onlyFeatured) list = list.filter((p) => p.is_featured);

    return list;
  }, [filter, query, minRating, priceLevels, onlyHot, onlyFeatured]);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.foreground }]}>
            Entdecken
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Empfehlungen rund um Carolinensiel
          </Text>
        </View>

        <Pressable
          onPress={() => setFilterOpen(true)}
          style={[styles.filterButton, { backgroundColor: colors.secondary }]}
          hitSlop={12}
        >
          <Feather name="sliders" size={19} color={colors.foreground} />
        </Pressable>
      </View>

      <View
        style={[
          styles.searchBar,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Feather name="search" size={18} color={colors.mutedForeground} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Suche nach Restaurants, Cafés, Hotels..."
          placeholderTextColor={colors.mutedForeground}
          style={[styles.searchInput, { color: colors.foreground }]}
          returnKeyType="search"
        />
      </View>

      <View style={styles.filterOuter}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
          alwaysBounceVertical={false}
          directionalLockEnabled
          bounces={false}
        >
          {FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <Pressable
                key={f.key}
                onPress={() => setFilter(f.key)}
                style={[
                  styles.topChip,
                  {
                    backgroundColor: active ? colors.primary : colors.secondary,
                    borderColor: active ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  numberOfLines={1}
                  style={[
                    styles.topChipText,
                    {
                      color: active
                        ? colors.primaryForeground
                        : colors.foreground,
                    },
                  ]}
                >
                  {f.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 110,
          gap: 12,
        }}
        ListHeaderComponent={
          filter === "all" && !query ? (
            <View style={{ paddingBottom: 16 }}>
              <SectionHeader title="Empfohlene Erlebnisse" />
              <FlatList
                data={featured.slice(0, 6)}
                keyExtractor={(it) => `f-${it.id}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
                contentContainerStyle={{ paddingBottom: 8 }}
                renderItem={({ item }) => <PlaceCard place={item} variant="hero" />}
              />
              <View style={{ height: 18 }} />
              <SectionHeader title="Alle Orte" />
            </View>
          ) : null
        }
        renderItem={({ item }) => <PlaceCard place={item} variant="wide" />}
        ListEmptyComponent={
          <EmptyState
            icon="search"
            title="Keine Treffer"
            message="Versuche es mit einem anderen Filter oder Suchbegriff."
          />
        }
      />

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
                  Suche genauer eingrenzen
                </Text>
              </View>

              <Pressable
                onPress={() => setFilterOpen(false)}
                style={[styles.closeBtn, { backgroundColor: colors.secondary }]}
              >
                <Feather name="x" size={19} color={colors.foreground} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.groupTitle, { color: colors.foreground }]}>
                Kategorie
              </Text>
              <View style={styles.chipGrid}>
                {FILTERS.slice(0, 8).map((f) => {
                  const active = filter === f.key;
                  return (
                    <Pressable
                      key={f.key}
                      onPress={() => setFilter(f.key)}
                      style={[
                        styles.modalChip,
                        {
                          backgroundColor: active ? colors.primary : colors.secondary,
                          borderColor: active ? colors.primary : colors.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.modalChipText,
                          {
                            color: active
                              ? colors.primaryForeground
                              : colors.foreground,
                          },
                        ]}
                      >
                        {f.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <Text style={[styles.groupTitle, { color: colors.foreground }]}>
                Bewertung
              </Text>
              <View style={styles.chipGrid}>
                {RATINGS.map((r) => {
                  const active = minRating === r.key;
                  return (
                    <Pressable
                      key={r.key}
                      onPress={() => setMinRating(r.key)}
                      style={[
                        styles.modalChip,
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
                          styles.modalChipText,
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
                Preis
              </Text>
              <View style={styles.chipGrid}>
                {PRICES.map((p) => {
                  const active = priceLevels.includes(p.key);
                  return (
                    <Pressable
                      key={p.key}
                      onPress={() => togglePrice(p.key)}
                      style={[
                        styles.modalChip,
                        {
                          backgroundColor: active ? colors.primary : colors.secondary,
                          borderColor: active ? colors.primary : colors.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.modalChipText,
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

            <View style={styles.actions}>
              <Pressable
                onPress={resetFilters}
                style={[styles.resetBtn, { backgroundColor: colors.secondary }]}
              >
                <Text style={[styles.resetText, { color: colors.foreground }]}>
                  Zurücksetzen
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setFilterOpen(false)}
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
    paddingHorizontal: 20,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  title: {
    fontSize: 34,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    marginTop: 4,
  },
  filterButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 20,
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    padding: 0,
  },

  filterOuter: {
    height: 62,
    marginTop: 4,
    overflow: "hidden",
  },
  filterRow: {
    paddingHorizontal: 20,
    gap: 8,
    height: 62,
    alignItems: "center",
  },
  topChip: {
    height: 42,
    minWidth: 76,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
  },
  topChipText: {
    fontSize: 13,
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
    marginBottom: 18,
  },
  modalTitle: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
  },
  modalSub: {
    marginTop: 4,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  closeBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },

  groupTitle: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    marginTop: 14,
    marginBottom: 10,
  },
  chipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  modalChip: {
    minHeight: 42,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  modalChipText: {
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

  actions: {
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