import type { Place } from "@/types/models";

export interface PlacesMapProps {
  places: Place[];
  selectedId?: string | null;
  onMarkerPress?: (place: Place) => void;
}

export function PlacesMap(props: PlacesMapProps): JSX.Element;
