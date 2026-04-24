import { Notif } from "@/components/ui/Toast";
import { useCallback, useState } from "react";
import { PartnerFormData } from "./usePartnerForm";

type LatLng = { lat: number; lng: number };

const DEFAULT_CENTER: LatLng = { lat: 24.7136, lng: 46.6753 };

function parseLocationFromGoogle(results: any[] | undefined): string {
  if (!results?.length) return "";

  const primary = results[0];
  const components = primary?.address_components ?? [];
  const getByType = (type: string) =>
    components.find((c: any) => c.types?.includes(type))?.long_name ?? "";

  const city =
    getByType("locality") ||
    getByType("administrative_area_level_2") ||
    getByType("administrative_area_level_1");
  const district =
    getByType("sublocality") ||
    getByType("sublocality_level_1") ||
    getByType("neighborhood");
  const building =
    getByType("premise") ||
    getByType("subpremise") ||
    getByType("street_number") ||
    getByType("route");

  const parts = [city, district, building].filter(Boolean);
  if (parts.length) return parts.join(" - ");
  return primary?.formatted_address || "";
}

function useMap(
    setForm: React.Dispatch<React.SetStateAction<PartnerFormData>>,
    setNotif: React.Dispatch<React.SetStateAction<Notif>>,
  ) {
    const [mapCenter, setMapCenter] = useState<LatLng>(DEFAULT_CENTER);
    const [mapZoom, setMapZoom] = useState(13);
    const [markerPos, setMarkerPos] = useState<LatLng | null>(null);

    const applyLocation = useCallback((lat: number, lng: number) => {
      const next = { lat: +lat.toFixed(6), lng: +lng.toFixed(6) };
      setMarkerPos(next);
      setMapCenter(next);
      setForm((prev) => ({
        ...prev,
        latitude: String(next.lat),
        longitude: String(next.lng),
      }));
      return next;
    }, [setForm]);

    const reverseGeocode = useCallback(async (lat: number, lng: number) => {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
      if (!apiKey) return;

      try {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&language=ar&key=${apiKey}`;
        const response = await fetch(url);
        if (!response.ok) return;

        const payload = await response.json();
        const locationText = parseLocationFromGoogle(payload?.results);
        if (!locationText) return;

        setForm((prev) => ({ ...prev, location: locationText }));
      } catch {
        // silent fail to keep map interactions fast and resilient
      }
    }, [setForm]);

    const selectFromMap = useCallback((lat: number, lng: number) => {
      const next = applyLocation(lat, lng);
      void reverseGeocode(next.lat, next.lng);
    }, [applyLocation, reverseGeocode]);
  
    const getCurrentLocation = useCallback(() => {
      if (!navigator.geolocation) {
        setNotif({ message: "المتصفح لا يدعم تحديد الموقع", type: "error", isVisible: true });
        return;
      }
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const next = applyLocation(coords.latitude, coords.longitude);
          setMapZoom(15);
          void reverseGeocode(next.lat, next.lng);
        },
        () => setNotif({ message: "فشل في تحديد موقعك 😢", type: "error", isVisible: true })
      );
    }, [applyLocation, reverseGeocode, setNotif]);

    return { mapCenter, mapZoom, markerPos, selectFromMap, getCurrentLocation };
  }

  export default useMap;