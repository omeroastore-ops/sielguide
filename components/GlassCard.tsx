import { BlurView } from "expo-blur";
import React from "react";
import { Platform, StyleSheet, View, ViewProps } from "react-native";

import { useColors } from "@/hooks/useColors";

interface GlassCardProps extends ViewProps {
  intensity?: number;
  borderless?: boolean;
}

export function GlassCard({
  children,
  style,
  intensity = 30,
  borderless,
  ...rest
}: GlassCardProps) {
  const colors = useColors();
  const isWeb = Platform.OS === "web";

  return (
    <View
      {...rest}
      style={[
        styles.container,
        {
          borderRadius: colors.radius,
          backgroundColor: isWeb
            ? "rgba(15, 30, 51, 0.85)"
            : "rgba(15, 30, 51, 0.55)",
          borderColor: borderless ? "transparent" : colors.border,
          borderWidth: borderless ? 0 : StyleSheet.hairlineWidth,
        },
        style,
      ]}
    >
      {!isWeb && (
        <BlurView
          intensity={intensity}
          tint="dark"
          style={[
            StyleSheet.absoluteFill,
            { borderRadius: colors.radius, overflow: "hidden" },
          ]}
        />
      )}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  content: {
    flex: 0,
  },
});
