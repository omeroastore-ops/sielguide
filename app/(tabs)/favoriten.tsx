import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { FlatList, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EmptyState } from "@/components/EmptyState";
import { PlaceCard } from "@/components/PlaceCard";
import { RouteCard } from "@/components/RouteCard";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useColors } from "@/hooks/useColors";
import { PLACES, ROUTES } from "@/services/mockData";

const TABS = [
  { key: "orte", label: "Orte" },
  { key: "routen", label: "Routen" },
  { key: "erlebnisse", label: "Erlebnisse" },
];

export default function FavoritenScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const { favorites } = useFavorites();
  const [tab, setTab] = useState("orte");

  const favPlaces = useMemo(
    () => PLACES.filter((p) => favorites.includes(p.id)),
    [favorites],
  );

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Favoriten</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Deine gespeicherten Orte und Routen
        </Text>
      </View>

      <View style={styles.tabsRow}>
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <Pressable
              key={t.key}
              onPress={() => setTab(t.key)}
              style={[
                styles.tab,
                {
                  backgroundColor: active ? colors.primary : colors.card,
                  borderColor: active ? colors.primary : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: active ? colors.primaryForeground : colors.foreground },
                ]}
              >
                {t.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {tab === "orte" && (
        <FlatList
          data={favPlaces}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 20, paddingBottom: 110, gap: 12 }}
          renderItem={({ item }) => <PlaceCard place={item} variant="wide" />}
          ListEmptyComponent={
            <EmptyState
              icon="heart"
              title="Noch keine Favoriten"
              message="Speichere Orte mit dem Herz-Symbol, um sie hier wiederzufinden."
              actionLabel="Orte entdecken"
              onAction={() => router.push("/(tabs)/entdecken" as never)}
            />
          }
        />
      )}

      {tab === "routen" && (
        <FlatList
          data={ROUTES.slice(0, 4)}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 20, paddingBottom: 110, gap: 12 }}
          renderItem={({ item }) => <RouteCard route={item} wide />}
          ListEmptyComponent={
            <EmptyState
              icon="map"
              title="Keine Routen gespeichert"
              message="Markiere Routen, um sie schnell wiederzufinden."
            />
          }
        />
      )}

      {tab === "erlebnisse" && (
        <View style={{ flex: 1 }}>
          <EmptyState
            icon="star"
            title="Noch keine Erlebnisse"
            message="Erlebnisse aus dem Tagesplaner erscheinen hier."
            actionLabel="Tag planen"
            onAction={() => router.push("/plan-day" as never)}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 8 },
  title: { fontSize: 28, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  subtitle: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 4 },
  tabsRow: { flexDirection: "row", paddingHorizontal: 20, paddingTop: 16, gap: 8 },
  tab: {
    flex: 1,
    paddingVertical: 11,
    alignItems: "center",
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  tabText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
});
