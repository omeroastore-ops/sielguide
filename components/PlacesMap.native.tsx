import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

import type { Place } from "@/types/models";

export interface PlacesMapProps {
  places: Place[];
  selectedId?: string | null;
  onMarkerPress?: (place: Place) => void;
}

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

export function PlacesMap({ places, selectedId, onMarkerPress }: PlacesMapProps) {
  const html = useMemo(() => {
    const safePlaces = places.map((p) => ({
      id: p.id,
      name: p.name,
      lat: p.lat,
      lng: p.lng,
      category: p.category,
      rating: p.rating,
      distance: p.distance_m,
      color: PIN_COLORS[p.category] ?? "#22D3EE",
      selected: selectedId === p.id,
    }));

    return `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
  html, body, #map {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    background: #06111F;
  }

  .leaflet-control-attribution {
    background: rgba(6,17,31,0.65) !important;
    color: rgba(255,255,255,0.7) !important;
    font-size: 10px;
  }

  .custom-pin {
    width: 22px;
    height: 22px;
    border-radius: 999px;
    border: 3px solid rgba(255,255,255,0.85);
    box-shadow: 0 6px 16px rgba(0,0,0,0.45);
  }

  .custom-pin.selected {
    width: 28px;
    height: 28px;
    border: 4px solid #fff;
    box-shadow: 0 0 0 8px rgba(34,211,238,0.18), 0 8px 22px rgba(0,0,0,0.55);
  }

  .popup {
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    color: #06111F;
  }

  .popup-title {
    font-weight: 800;
    font-size: 14px;
  }

  .popup-meta {
    font-size: 12px;
    opacity: 0.7;
    margin-top: 3px;
  }
</style>
</head>
<body>
<div id="map"></div>

<script>
  const places = ${JSON.stringify(safePlaces)};

  const map = L.map('map', {
    zoomControl: false,
    attributionControl: true
  }).setView([53.6938, 7.7958], 15);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map);

  places.forEach((p) => {
    const icon = L.divIcon({
      className: '',
      html: '<div class="custom-pin ' + (p.selected ? 'selected' : '') + '" style="background:' + p.color + '"></div>',
      iconSize: p.selected ? [28, 28] : [22, 22],
      iconAnchor: p.selected ? [14, 14] : [11, 11]
    });

    const marker = L.marker([p.lat, p.lng], { icon }).addTo(map);

    marker.bindPopup(
      '<div class="popup">' +
      '<div class="popup-title">' + p.name + '</div>' +
      '<div class="popup-meta">★ ' + p.rating + ' · ' + p.distance + ' m</div>' +
      '</div>'
    );

    marker.on('click', function () {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'marker', id: p.id }));
    });
  });
</script>
</body>
</html>
`;
  }, [places, selectedId]);

  return (
    <View style={StyleSheet.absoluteFill}>
      <WebView
        originWhitelist={["*"]}
        source={{ html }}
        style={styles.webview}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === "marker") {
              const place = places.find((p) => p.id === data.id);
              if (place) onMarkerPress?.(place);
            }
          } catch {}
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    backgroundColor: "#06111F",
  },
});