import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

export function RatingStars({
  rating,
  count,
  size = 13,
}: {
  rating: number;
  count?: number;
  size?: number;
}) {
  const colors = useColors();
  return (
    <View style={styles.row}>
      <Ionicons name="star" size={size} color="#FBBF24" />
      <Text style={[styles.rating, { fontSize: size, color: colors.foreground }]}>
        {rating.toFixed(1)}
      </Text>
      {count !== undefined && (
        <Text style={[styles.count, { fontSize: size - 1, color: colors.mutedForeground }]}>
          ({count})
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 4 },
  rating: { fontFamily: "Inter_600SemiBold" },
  count: { fontFamily: "Inter_400Regular" },
});
