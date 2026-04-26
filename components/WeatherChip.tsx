import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import {
  fetchCarolinensielWeather,
  weatherCodeToIcon,
} from "@/services/weather";

interface WeatherChipProps {
  background?: string;
  textColor?: string;
}

export function WeatherChip({
  background = "rgba(255,255,255,0.12)",
  textColor = "#fff",
}: WeatherChipProps) {
  const [state, setState] = useState<
    | { kind: "loading" }
    | { kind: "ok"; tempC: number; icon: ReturnType<typeof weatherCodeToIcon> }
    | { kind: "error" }
  >({ kind: "loading" });

  useEffect(() => {
    const ctrl = new AbortController();
    fetchCarolinensielWeather(ctrl.signal)
      .then((w) =>
        setState({
          kind: "ok",
          tempC: w.temperatureC,
          icon: weatherCodeToIcon(w.weatherCode),
        }),
      )
      .catch((err) => {
        if ((err as Error).name === "AbortError") return;
        setState({ kind: "error" });
      });
    return () => ctrl.abort();
  }, []);

  return (
    <View style={[styles.chip, { backgroundColor: background }]}>
      {state.kind === "loading" ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : state.kind === "error" ? (
        <>
          <Feather name="cloud-off" size={14} color={textColor} />
          <Text style={[styles.text, { color: textColor }]}>—</Text>
        </>
      ) : (
        <>
          <Feather
            name={state.icon}
            size={14}
            color={state.icon === "sun" ? "#FBBF24" : textColor}
          />
          <Text style={[styles.text, { color: textColor }]}>
            {state.tempC}°
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    minWidth: 60,
    justifyContent: "center",
  },
  text: { fontFamily: "Inter_600SemiBold", fontSize: 13 },
});
