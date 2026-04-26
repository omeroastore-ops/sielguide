export interface WeatherResult {
  temperatureC: number;
  weatherCode: number;
}

const CAROLINENSIEL_LAT = 53.6938;
const CAROLINENSIEL_LNG = 7.7958;

const URL = `https://api.open-meteo.com/v1/forecast?latitude=${CAROLINENSIEL_LAT}&longitude=${CAROLINENSIEL_LNG}&current=temperature_2m,weather_code&timezone=Europe%2FBerlin`;

export async function fetchCarolinensielWeather(
  signal?: AbortSignal,
): Promise<WeatherResult> {
  const res = await fetch(URL, { signal });
  if (!res.ok) {
    throw new Error(`Weather request failed with status ${res.status}`);
  }
  const data = (await res.json()) as {
    current?: { temperature_2m?: number; weather_code?: number };
  };
  if (!data.current || typeof data.current.temperature_2m !== "number") {
    throw new Error("Invalid weather response");
  }
  return {
    temperatureC: Math.round(data.current.temperature_2m),
    weatherCode: data.current.weather_code ?? 0,
  };
}

export function weatherCodeToIcon(
  code: number,
): "sun" | "cloud" | "cloud-rain" | "cloud-snow" | "cloud-lightning" {
  if (code === 0) return "sun";
  if (code <= 3) return "cloud";
  if (code >= 71 && code <= 77) return "cloud-snow";
  if (code >= 95) return "cloud-lightning";
  if (code >= 51) return "cloud-rain";
  return "cloud";
}
