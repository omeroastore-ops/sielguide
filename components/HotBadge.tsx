import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export function HotBadge({ small }: { small?: boolean }) {
  return (
    <View style={[styles.badge, small && styles.badgeSmall]}>
      <Feather name="trending-up" size={small ? 10 : 12} color="#fff" />
      <Text style={[styles.text, small && styles.textSmall]}>HOT</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F87171",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  badgeSmall: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    gap: 3,
  },
  text: {
    color: "#fff",
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.5,
  },
  textSmall: { fontSize: 9 },
});
