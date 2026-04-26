import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { Place } from "@/types/models";

const CENTER_LAT = 53.6938;
const CENTER_LNG = 7.7958;
const BBOX_DELTA = 0.025;

const PIN_COLORS: Record<string, string> = {
  restaurant: "#F87171",
  cafe: "#FBBF24",
  hotel: "#22D3EE",
  aktivitaet: "#5EEAD4",
  natur: "#34D399",
  sehenswuerdigkeit: "#A78BFA",
  event: "#F472B6",
  shopping: "#60A5FA",
  familie: "#FCD34D",
  romantisch: "#FB7185",
};

export interface PlacesMapProps {
  places: Place[];
  selectedId?: string | null;
  onMarkerPress?: (place: Place) => void;
}

export function PlacesMap({ places, selectedId, onMarkerPress }: PlacesMapProps) {
  const leafletHtml = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/><style>html,body,#m{margin:0;padding:0;height:100%;background:#0A1B2E;}.leaflet-container{background:#0A1B2E;}</style></head><body><div id="m"></div><script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script><script>var map=L.map('m',{zoomControl:false,attributionControl:true}).setView([${CENTER_LAT},${CENTER_LNG}],14);L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',{maxZoom:19,subdomains:'abcd',attribution:'&copy; OSM &copy; CARTO'}).addTo(map);</script></body></html>`;
  const iframeSrc = `data:text/html;charset=utf-8,${encodeURIComponent(leafletHtml)}`;

  // Project lat/lng to screen percentage based on bbox
  const pins = useMemo(
    () =>
      places.map((p) => {
        const x =
          ((p.lng - (CENTER_LNG - BBOX_DELTA)) / (BBOX_DELTA * 2)) * 100;
        const y =
          (1 - (p.lat - (CENTER_LAT - BBOX_DELTA)) / (BBOX_DELTA * 2)) * 100;
        return { place: p, x: Math.max(2, Math.min(98, x)), y: Math.max(2, Math.min(98, y)) };
      }),
    [places],
  );

  const iframeHtml = `<iframe src="${iframeSrc}" style="width:100%;height:100%;border:0;display:block;background:#0A1B2E" title="Carolinensiel Karte" loading="eager"></iframe>`;

  return (
    <View style={StyleSheet.absoluteFill}>
      <div
        style={{ position: "absolute", inset: 0 } as React.CSSProperties}
        dangerouslySetInnerHTML={{ __html: iframeHtml }}
      />
      {/* Marker overlay */}
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        {pins.map(({ place, x, y }) => {
          const isActive = selectedId === place.id;
          return (
            <Pressable
              key={place.id}
              onPress={() => onMarkerPress?.(place)}
              hitSlop={8}
              style={[styles.pinWrap, { left: `${x}%`, top: `${y}%` }]}
            >
              <View
                style={[
                  styles.pinDot,
                  {
                    backgroundColor: PIN_COLORS[place.category] ?? "#22D3EE",
                    borderColor: isActive ? "#fff" : "rgba(255,255,255,0.7)",
                    transform: [{ scale: isActive ? 1.3 : 1 }],
                  },
                ]}
              />
              {isActive && (
                <View style={styles.pinLabel}>
                  <Text style={styles.pinLabelText} numberOfLines={1}>
                    {place.name}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pinWrap: {
    position: "absolute",
    transform: [{ translateX: -10 }, { translateY: -10 }],
    alignItems: "center",
  },
  pinDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 3,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  pinLabel: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: "rgba(6,17,31,0.92)",
    borderRadius: 6,
    maxWidth: 140,
  },
  pinLabelText: {
    color: "#fff",
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },
});
