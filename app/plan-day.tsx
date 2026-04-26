import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { ScreenHeader } from "@/components/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { PLACES, getPlaceById } from "@/services/mockData";

const TIMEFRAMES = ["2 Stunden", "Halber Tag", "Ganzer Tag"] as const;
const MOODS = ["Entspannt", "Romantisch", "Familie", "Essen", "Natur", "Aktiv"] as const;
const BUDGETS = ["€", "€€", "€€€"] as const;

interface PlanStop {
  time: string;
  label: string;
  placeId: string;
  icon: keyof typeof import("@expo/vector-icons").Feather.glyphMap;
}

function generatePlan(
  timeframe: string,
  mood: string,
  budget: string,
): PlanStop[] {
  const tags: string[] = [];
  if (mood === "Romantisch") tags.push("romantisch");
  if (mood === "Familie") tags.push("familie");
  if (mood === "Natur") tags.push("natur", "outdoor");
  if (mood === "Aktiv") tags.push("outdoor", "fahrrad");
  if (mood === "Essen") tags.push("fisch", "tradition");

  const budgetLevel = budget.length;
  const filterByBudget = (cat: string) =>
    PLACES.filter((p) => p.category === cat && p.price_level <= budgetLevel);

  const pickByMood = (cat: string) => {
    const list = filterByBudget(cat);
    if (tags.length === 0) return list[0];
    const matched = list.find((p) => p.tags.some((t) => tags.includes(t)));
    return matched ?? list[0];
  };

  const breakfast = pickByMood("cafe");
  const walk = pickByMood("sehenswuerdigkeit") ?? pickByMood("natur");
  const lunch = pickByMood("restaurant");
  const activity = pickByMood("aktivitaet");
  const cafe = filterByBudget("cafe")[1] ?? breakfast;
  const sunset = pickByMood("natur") ?? pickByMood("sehenswuerdigkeit");
  const dinner = filterByBudget("restaurant")[1] ?? lunch;

  const all: PlanStop[] = [
    breakfast && { time: "09:00", label: "Frühstück", placeId: breakfast.id, icon: "coffee" as const },
    walk && { time: "10:30", label: "Spaziergang", placeId: walk.id, icon: "map-pin" as const },
    lunch && { time: "12:30", label: "Mittagessen", placeId: lunch.id, icon: "coffee" as const },
    activity && { time: "14:00", label: "Aktivität", placeId: activity.id, icon: "compass" as const },
    cafe && { time: "16:00", label: "Café-Pause", placeId: cafe.id, icon: "coffee" as const },
    sunset && { time: "19:00", label: "Sonnenuntergang", placeId: sunset.id, icon: "sun" as const },
    dinner && { time: "20:30", label: "Abendessen", placeId: dinner.id, icon: "coffee" as const },
  ].filter(Boolean) as PlanStop[];

  if (timeframe === "2 Stunden") return all.slice(0, 3);
  if (timeframe === "Halber Tag") return all.slice(0, 5);
  return all;
}

export default function PlanDayScreen() {
  const colors = useColors();
  const router = useRouter();
  const [timeframe, setTimeframe] = useState<string>(TIMEFRAMES[1]);
  const [mood, setMood] = useState<string>(MOODS[0]);
  const [budget, setBudget] = useState<string>(BUDGETS[1]);
  const [generated, setGenerated] = useState(false);

  const plan = useMemo(
    () => (generated ? generatePlan(timeframe, mood, budget) : []),
    [generated, timeframe, mood, budget],
  );

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Meinen Tag planen" subtitle="Personalisierter Vorschlag" />
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 100, gap: 18 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.intro, { color: colors.mutedForeground }]}>
          Wähle Zeitraum, Stimmung und Budget — wir erstellen einen passenden Plan für deinen Tag in Carolinensiel.
        </Text>

        <Group label="Zeitraum" colors={colors}>
          {TIMEFRAMES.map((t) => (
            <Chip key={t} label={t} active={timeframe === t} onPress={() => setTimeframe(t)} colors={colors} />
          ))}
        </Group>

        <Group label="Stimmung" colors={colors}>
          {MOODS.map((m) => (
            <Chip key={m} label={m} active={mood === m} onPress={() => setMood(m)} colors={colors} />
          ))}
        </Group>

        <Group label="Budget" colors={colors}>
          {BUDGETS.map((b) => (
            <Chip key={b} label={b} active={budget === b} onPress={() => setBudget(b)} colors={colors} />
          ))}
        </Group>

        <Pressable
          onPress={() => setGenerated(true)}
          style={({ pressed }) => [
            styles.generateBtn,
            {
              backgroundColor: colors.primary,
              borderRadius: colors.radius,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Feather name="zap" size={18} color={colors.primaryForeground} />
          <Text style={[styles.generateText, { color: colors.primaryForeground }]}>
            {generated ? "Neu generieren" : "Plan generieren"}
          </Text>
        </Pressable>

        {generated && plan.length > 0 && (
          <View style={{ marginTop: 8, gap: 10 }}>
            <Text style={[styles.section, { color: colors.foreground }]}>Dein Tagesplan</Text>
            {plan.map((stop, idx) => {
              const place = getPlaceById(stop.placeId);
              if (!place) return null;
              return (
                <View key={idx} style={{ flexDirection: "row", gap: 12 }}>
                  <View style={styles.timeColumn}>
                    <Text style={[styles.stopTime, { color: colors.primary }]}>{stop.time}</Text>
                    <View style={[styles.timeIcon, { backgroundColor: colors.secondary }]}>
                      <Feather name={stop.icon} size={14} color={colors.primary} />
                    </View>
                    {idx < plan.length - 1 && (
                      <View style={[styles.line, { backgroundColor: colors.border }]} />
                    )}
                  </View>
                  <Pressable
                    onPress={() => router.push(`/place/${place.id}` as never)}
                    style={({ pressed }) => [
                      styles.stopCard,
                      {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                        borderRadius: colors.radius,
                        opacity: pressed ? 0.85 : 1,
                      },
                    ]}
                  >
                    <Text style={[styles.stopLabel, { color: colors.mutedForeground }]}>
                      {stop.label}
                    </Text>
                    <Text style={[styles.stopName, { color: colors.foreground }]}>
                      {place.name}
                    </Text>
                    <Text
                      style={[styles.stopShort, { color: colors.mutedForeground }]}
                      numberOfLines={2}
                    >
                      {place.short_description}
                    </Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function Group({
  label,
  children,
  colors,
}: {
  label: string;
  children: React.ReactNode;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={{ gap: 10 }}>
      <Text style={[styles.groupLabel, { color: colors.foreground }]}>{label}</Text>
      <View style={styles.chipRow}>{children}</View>
    </View>
  );
}

function Chip({
  label,
  active,
  onPress,
  colors,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chipBtn,
        {
          backgroundColor: active ? colors.primary : colors.card,
          borderColor: active ? colors.primary : colors.border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <Text
        style={[
          styles.chipText,
          { color: active ? colors.primaryForeground : colors.foreground },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  intro: { fontSize: 14, lineHeight: 20 },
  groupLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chipBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  chipText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  generateBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    marginTop: 6,
  },
  generateText: { fontSize: 15, fontFamily: "Inter_700Bold" },
  section: { fontSize: 16, fontFamily: "Inter_700Bold", marginBottom: 4 },

  timeColumn: { width: 60, alignItems: "center" },
  stopTime: { fontSize: 12, fontFamily: "Inter_700Bold" },
  timeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  line: { width: 2, flex: 1, marginTop: 4, minHeight: 24 },
  stopCard: {
    flex: 1,
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 4,
  },
  stopLabel: { fontSize: 11, fontFamily: "Inter_500Medium", textTransform: "uppercase", letterSpacing: 0.5 },
  stopName: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  stopShort: { fontSize: 12, lineHeight: 16 },
});
